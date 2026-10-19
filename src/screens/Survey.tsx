import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';

const QUESTIONS = [
  '¿Qué tan motivado te sientes con tu carrera?',
  '¿Cómo describirías tu situación económica actual?',
  '¿Tienes dificultades para entender las materias?',
  '¿Cómo te has sentido emocionalmente esta semana?',
  '¿Tienes tiempo suficiente para estudiar?',
  '¿Sientes apoyo de tu familia o entorno cercano?',
];

const EMOJIS = ['😫', '😔', '😐', '🙂', '🤩'];
const LABELS = ['Nada', 'Poco', 'Neutro', 'Bien', 'Muy'];

interface SurveyProps {
  onComplete: (answers: number[]) => void;
  lastSurveyDate: string | null;
}

export default function Survey({ onComplete, lastSurveyDate }: SurveyProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);

  const canRespondAgain = !lastSurveyDate || 
    (Date.now() - new Date(lastSurveyDate).getTime()) > 7 * 24 * 60 * 60 * 1000;

  if (!canRespondAgain) {
    const next = new Date(new Date(lastSurveyDate!).getTime() + 7 * 24 * 60 * 60 * 1000);
    return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-20">
        <span className="text-5xl">✅</span>
        <h2 className="text-2xl font-black text-on-surface">Ya respondiste esta semana</h2>
        <p className="text-on-surface-variant text-sm font-medium">Podrás responder de nuevo el {next.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })}.</p>
      </div>
    );
  }

  const progress = ((step) / QUESTIONS.length) * 100;

  const handleNext = () => {
    if (selected === null) return;
    const newAnswers = [...answers, selected];
    if (step === QUESTIONS.length - 1) {
      onComplete(newAnswers);
    } else {
      setAnswers(newAnswers);
      setStep(step + 1);
      setSelected(null);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col min-h-full pb-4">
      <div className="w-full mb-10 pt-4">
        <h2 className="font-black text-on-surface text-3xl mb-4 tracking-tight leading-tight">¿Cómo estás últimamente?</h2>
        <p className="text-on-surface-variant font-semibold text-sm leading-relaxed max-w-[280px]">Tus respuestas son confidenciales y nos ayudan a apoyarte mejor.</p>
      </div>

      <div className="w-full mb-12">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-primary/70">Pregunta {step + 1} de {QUESTIONS.length}</span>
          <span className="text-[10px] font-black text-primary tracking-widest">{Math.round(progress)}%</span>
        </div>
        <div className="h-2.5 w-full bg-surface-container-low rounded-full overflow-hidden">
          <motion.div animate={{ width: `${progress}%` }} className="h-full bg-primary rounded-full shadow-sm" />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
          className="w-full bg-surface-container-lowest p-10 rounded-lg shadow-sm mb-12 flex flex-col items-center text-center border border-on-surface/5">
          <h3 className="text-xl font-black text-on-surface leading-snug tracking-tight">{QUESTIONS[step]}</h3>
        </motion.div>
      </AnimatePresence>

      <div className="w-full flex justify-between items-end gap-1 mb-16">
        {EMOJIS.map((emoji, i) => (
          <div key={i} className="flex flex-col items-center gap-4 flex-1">
            <button onClick={() => setSelected(i + 1)}
              className={`w-14 h-14 rounded-full transition-all flex items-center justify-center text-3xl active:scale-90 ${
                selected === i + 1
                  ? 'bg-primary-container/60 shadow-lg border-2 border-primary/20 scale-110'
                  : 'bg-surface-container-low hover:bg-surface-container-highest grayscale hover:grayscale-0'
              }`}>
              {emoji}
            </button>
            <span className={`text-[9px] font-black uppercase tracking-widest ${selected === i + 1 ? 'text-primary' : 'text-on-surface-variant/40'}`}>
              {LABELS[i]}
            </span>
          </div>
        ))}
      </div>

      <button onClick={handleNext} disabled={selected === null}
        className="w-full py-5 bg-primary text-on-primary text-lg font-black rounded-xl shadow-xl shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed">
        {step === QUESTIONS.length - 1 ? 'Ver resultado' : 'Siguiente'}
        <ArrowRight className="w-6 h-6 border-2 border-white/20 rounded-full p-0.5" />
      </button>
    </motion.div>
  );
}
