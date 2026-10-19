import { motion } from 'motion/react';
import { Settings, LogOut, Shield, Bell } from 'lucide-react';

interface ProfileProps {
  onLogout: () => void;
}

export default function Profile({ onLogout }: ProfileProps) {
  const options = [
    { label: 'Notificaciones', icon: Bell },
    { label: 'Privacidad', icon: Shield },
    { label: 'Ajustes', icon: Settings },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10"
    >
      <section className="flex flex-col items-center text-center space-y-6 pt-6">
        <div className="relative">
          <div className="absolute -inset-4 bg-primary-container/20 blur-2xl rounded-full" />
          <div className="w-32 h-32 rounded-[2.5rem] bg-surface-container-highest flex items-center justify-center overflow-hidden border-4 border-white shadow-xl relative z-10">
            <img
              alt="Avatar"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwFXy33SPl_aWJBIWULbP4XkRs13jOAeuVwYqCkU25wwHHSjVEkKaR5ohdGhvdFNqinUcsSWGaYisW5H5KOOCZTs5_4K_xnXZi0N-FfVU16u3WJp1uyh4pfTr_2VEVxoKavcowV5OX2HlfWitq0QJz7s27uAGMbk2-A-0C3yMlAfWo58s_N1q8Z647E0rryrHx27UK97QiSQbKxlW0X3fkBCJHDVtI-_J-WAdf7N7aOcRV8mfPDAJ6K6pl4wDv5w7XIIGRcOHdoDTG"
            />
          </div>
        </div>
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-on-surface tracking-tight leading-none">Carlos Daniel</h2>
          <p className="text-primary font-black uppercase text-[10px] tracking-[0.2em] opacity-60">Ingeniería de Sistemas</p>
        </div>
      </section>

      <div className="bg-surface-container-lowest rounded-[2rem] p-4 shadow-sm border border-on-surface/5">
        {options.map((option, idx) => {
          const Icon = option.icon;
          return (
            <button
              key={option.label}
              className={`w-full flex items-center justify-between p-6 hover:bg-surface-container-low transition-colors rounded-xl group ${idx !== options.length - 1 ? 'border-b border-on-surface/5' : ''}`}
            >
              <div className="flex items-center gap-5">
                <div className="bg-surface-container-low p-3 rounded-2xl group-hover:bg-primary-container transition-colors shadow-sm">
                  <Icon className="w-5 h-5 text-on-surface-variant" />
                </div>
                <span className="font-bold text-on-surface">{option.label}</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Settings className="w-4 h-4 text-on-surface-variant rotate-90" />
              </div>
            </button>
          );
        })}
      </div>

      <button onClick={onLogout} className="w-full py-5 text-error-container font-black hover:bg-error-container/5 rounded-xl transition-colors flex items-center justify-center gap-3">
        <LogOut className="w-5 h-5" />
        Cerrar Sesión
      </button>
    </motion.div>
  );
}
