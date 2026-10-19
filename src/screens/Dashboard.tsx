import { motion } from 'motion/react';
import { Edit3, CheckCircle2, Lightbulb } from 'lucide-react';
import Gauge from '../components/Gauge';
import { Screen } from '../types';

interface DashboardProps {
  setScreen: (screen: Screen) => void;
  score: number;
  recommendation: string;
}

export default function Dashboard({ setScreen, score, recommendation }: DashboardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
      <section className="space-y-1 pl-2">
        <p className="text-on-surface-variant font-bold tracking-widest uppercase text-[10px]">Tu Sanctuary Académico</p>
        <h2 className="text-3xl font-extrabold text-on-surface tracking-tight leading-none">Hola, Carlos 👋</h2>
        <p className="text-on-surface/60 text-sm font-medium">Hoy es un buen día para avanzar en tus metas.</p>
      </section>

      <section className="relative px-2">
        <div className="bg-surface-container-lowest rounded-lg p-8 text-center space-y-6 relative overflow-hidden shadow-sm">
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-primary-container/20 blur-3xl rounded-full" />
          <h3 className="text-on-surface-variant font-bold text-xs uppercase tracking-widest relative z-10">Tu Nivel de Estabilidad</h3>
          <Gauge score={score} />
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4">
        <button onClick={() => setScreen('subjects')} className="bg-primary text-on-primary p-6 rounded-lg flex flex-col justify-between aspect-square text-left transition-transform active:scale-95 shadow-lg shadow-primary/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110" />
          <Edit3 className="w-8 h-8 opacity-80" />
          <div>
            <h4 className="font-bold text-sm leading-tight">Registrar Notas</h4>
            <p className="text-[10px] opacity-70 mt-1 uppercase tracking-wide">Sube tus promedios</p>
          </div>
        </button>

        <button onClick={() => setScreen('survey')} className="bg-surface-container-highest p-6 rounded-lg flex flex-col justify-between aspect-square text-left transition-transform active:scale-95 group">
          <CheckCircle2 className="w-8 h-8 text-primary opacity-80" />
          <div>
            <h4 className="font-bold text-sm text-on-surface leading-tight">Hacer Encuesta</h4>
            <p className="text-[10px] text-on-surface-variant mt-1 uppercase tracking-wide">Evalúa tu semana</p>
          </div>
        </button>
      </section>

      <section>
        <button onClick={() => setScreen('results')} className="w-full bg-surface-container-low p-5 rounded-lg border border-on-surface/5 flex items-start gap-4 text-left transition-colors hover:bg-surface-container-highest/50 active:scale-[0.98]">
          <div className="bg-surface-container-highest p-3 rounded-xl shadow-sm">
            <Lightbulb className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 space-y-1">
            <h4 className="text-[10px] font-extrabold text-primary uppercase tracking-widest">Última Recomendación</h4>
            <p className="text-sm text-on-surface font-semibold leading-snug">{recommendation}</p>
          </div>
        </button>
      </section>
    </motion.div>
  );
}
