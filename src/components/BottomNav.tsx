import { Home, BarChart2, ClipboardList, User } from 'lucide-react';
import { Screen } from '../types';

interface BottomNavProps {
  currentScreen: Screen;
  setScreen: (screen: Screen) => void;
}

export default function BottomNav({ currentScreen, setScreen }: BottomNavProps) {
  const items = [
    { id: 'home' as const, label: 'Inicio', icon: Home },
    { id: 'subjects' as const, label: 'Notas', icon: BarChart2 },
    { id: 'survey' as const, label: 'Encuesta', icon: ClipboardList },
    { id: 'profile' as const, label: 'Perfil', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-2 pt-3 glass-nav rounded-t-[3rem] shadow-[0_-4px_20px_rgba(0,51,66,0.05)] border-t border-on-surface/5">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = currentScreen === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => setScreen(item.id)}
            className={`flex flex-col items-center justify-center transition-all duration-300 active:scale-95 px-5 py-2 rounded-full ${
              isActive 
                ? 'bg-primary-container text-on-surface shadow-sm' 
                : 'text-on-surface/60 hover:bg-on-surface/5'
            }`}
          >
            <Icon className={`w-6 h-6 ${isActive ? 'fill-current' : ''}`} />
            <span className="text-[10px] font-bold uppercase tracking-wider mt-1">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
