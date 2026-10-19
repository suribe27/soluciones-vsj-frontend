import { Menu } from 'lucide-react';

export default function TopBar() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 h-16 glass-nav border-b border-on-surface/5">
      <div className="flex items-center gap-3">
        <button className="p-1 hover:bg-on-surface/5 rounded-full transition-colors active:scale-90">
          <Menu className="w-6 h-6 text-primary" />
        </button>
        <h1 className="font-bold text-lg tracking-tight text-primary">Soluciones VSJ</h1>
      </div>
      <div className="flex items-center">
        <div className="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
          <img 
            alt="User Profile" 
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwFXy33SPl_aWJBIWULbP4XkRs13jOAeuVwYqCkU25wwHHSjVEkKaR5ohdGhvdFNqinUcsSWGaYisW5H5KOOCZTs5_4K_xnXZi0N-FfVU16u3WJp1uyh4pfTr_2VEVxoKavcowV5OX2HlfWitq0QJz7s27uAGMbk2-A-0C3yMlAfWo58s_N1q8Z647E0rryrHx27UK97QiSQbKxlW0X3fkBCJHDVtI-_J-WAdf7N7aOcRV8mfPDAJ6K6pl4wDv5w7XIIGRcOHdoDTG"
          />
        </div>
      </div>
    </header>
  );
}
