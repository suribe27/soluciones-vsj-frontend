import { motion } from 'motion/react';
import { ArrowRight, MessageSquare } from 'lucide-react';

interface ResultsProps {
  score: number;
  notasScore: number;
  surveyScore: number;
}

function getRiskLabel(score: number) {
  if (score >= 80) return { label: '🟢 Bajo Riesgo', classes: 'bg-green-50 text-green-700 border-green-200', dot: 'bg-green-500' };
  if (score >= 60) return { label: '🟡 Riesgo Medio', classes: 'bg-yellow-50 text-yellow-700 border-yellow-200', dot: 'bg-yellow-500' };
  if (score >= 40) return { label: '🟠 Riesgo Alto', classes: 'bg-orange-50 text-orange-700 border-orange-200', dot: 'bg-orange-500' };
  return { label: '🔴 Riesgo Crítico', classes: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500' };
}

function getRecommendation(score: number): string {
  if (score >= 80) return '¡Vas muy bien! Mantén tu ritmo. Recuerda que puedes consultar tutorías si lo necesitas.';
  if (score >= 60) return 'Te recomendamos asistir a tutoría académica y hablar con tu consejero esta semana.';
  if (score >= 40) return 'Es importante que te comuniques con bienestar universitario lo antes posible.';
  if (score === 0) return 'Registra tus notas y completa la encuesta para ver tu resultado.';
  return 'Un asesor se pondrá en contacto contigo. No estás solo, hay apoyo disponible.';
}

export default function Results({ score, notasScore, surveyScore }: ResultsProps) {
  const risk = getRiskLabel(score);
  const circumference = 528;
  const offset = score > 0 ? circumference * (1 - score / 100) : circumference;

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10">
      <section className="space-y-1 pl-2">
        <h2 className="text-3xl font-black tracking-tight text-on-surface">Tu resultado</h2>
        <p className="text-on-surface-variant font-semibold text-sm opacity-80 leading-relaxed">Análisis basado en tu actividad reciente.</p>
      </section>

      <div className="relative group">
        <div className="absolute -inset-2 bg-gradient-to-tr from-primary-container/40 to-surface-variant/40 rounded-[2.5rem] blur-xl opacity-30 group-hover:opacity-50 transition duration-1000" />
        <div className="relative bg-surface-container-lowest rounded-lg p-10 flex flex-col items-center text-center space-y-8 shadow-sm border border-on-surface/5">
          <div className="relative">
            <svg className="w-48 h-48 transform -rotate-90">
              <circle className="text-surface-container-low" cx="96" cy="96" fill="transparent" r="84" stroke="currentColor" strokeWidth="16" />
              <motion.circle
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                cx="96" cy="96" fill="transparent" r="84"
                stroke={score >= 80 ? '#2d9e6b' : score >= 60 ? '#e8a020' : score >= 40 ? '#C8102E' : '#8b0000'}
                strokeWidth="15"
                strokeDasharray={circumference} strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-6xl font-black text-primary tracking-tighter">
                {score}<span className="text-2xl text-on-surface-variant/30 font-black">/100</span>
              </span>
            </div>
          </div>

          <div className={`inline-flex items-center px-8 py-2.5 font-black rounded-full text-[11px] uppercase tracking-widest shadow-sm border ${risk.classes}`}>
            <span className={`w-2.5 h-2.5 rounded-full ${risk.dot} mr-3 animate-pulse`} />
            {risk.label}
          </div>

          <div className="grid grid-cols-2 w-full gap-5">
            <div className="bg-surface-container-low/50 p-6 rounded-lg flex flex-col items-center border border-on-surface/5">
              <span className="text-[9px] uppercase tracking-[0.15em] text-on-surface-variant font-black mb-1.5 opacity-60">Notas</span>
              <span className="text-2xl font-black text-on-surface tracking-tighter">{notasScore} <span className="text-sm opacity-50">pts</span></span>
            </div>
            <div className="bg-surface-container-low/50 p-6 rounded-lg flex flex-col items-center border border-on-surface/5">
              <span className="text-[9px] uppercase tracking-[0.15em] text-on-surface-variant font-black mb-1.5 opacity-60">Bienestar</span>
              <span className="text-2xl font-black text-on-surface tracking-tighter">{surveyScore} <span className="text-sm opacity-50">pts</span></span>
            </div>
          </div>
        </div>
      </div>

      <section className="bg-primary-container/20 rounded-lg p-8 flex gap-6 items-start border border-primary-container/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary-container/10 blur-xl rounded-full -mr-12 -mt-12" />
        <div className="w-14 h-14 bg-primary-container rounded-2xl flex-shrink-0 flex items-center justify-center shadow-sm">
          <MessageSquare className="w-7 h-7 text-primary" />
        </div>
        <div className="space-y-1.5 py-1">
          <h3 className="font-black text-on-primary-container text-xs uppercase tracking-widest">Recomendación</h3>
          <p className="text-on-surface-variant font-semibold text-sm leading-relaxed">{getRecommendation(score)}</p>
        </div>
      </section>

      <div className="space-y-4">
      <a href="https://bienestaruniversitario.udemedellin.edu.co/#gsc.tab=0" target="_blank" rel="noopener noreferrer"
        className="w-full bg-primary text-on-primary font-black py-5 rounded-xl shadow-xl shadow-primary/10 active:scale-95 transition-all flex items-center justify-center gap-3">
        <span className="text-lg">Contactar bienestar</span>
        <ArrowRight className="w-6 h-6 border-2 border-white/20 rounded-full p-0.5" />
      </a>
      </div>
    </motion.div>
  );
}
