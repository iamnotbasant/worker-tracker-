import { Sun, Moon, HardHat, LayoutDashboard, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

interface HeaderProps {
  currentView: 'dashboard' | 'worker';
  onViewChange: (view: 'dashboard' | 'worker') => void;
}

export function Header({ currentView, onViewChange }: HeaderProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Ensure white theme is default as requested
    document.documentElement.classList.remove('dark');
    setIsDark(false);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200 dark:border-primary/10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 md:px-10 py-3 transition-colors duration-300">
      <div className="flex items-center gap-2 md:gap-3">
        <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-lg bg-primary text-white">
          <HardHat size={16} className="md:w-5 md:h-5" />
        </div>
        <div className="hidden sm:block">
          <h2 className="text-slate-900 dark:text-slate-100 text-base md:text-lg font-bold leading-tight">Site Alpha</h2>
          <p className="text-[10px] md:text-xs text-slate-500 dark:text-primary/70 font-medium whitespace-nowrap">Mumbai Sector 4</p>
        </div>
      </div>

      <div className="flex items-center gap-1 md:gap-2 mx-auto">
        <button 
          onClick={() => onViewChange('dashboard')}
          className={`flex items-center gap-1 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-lg transition-colors ${currentView === 'dashboard' ? 'bg-primary/10 text-primary font-bold' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        >
          <LayoutDashboard size={16} className="md:w-[18px] md:h-[18px]" />
          <span className="text-xs md:text-sm">Dashboard</span>
        </button>
        <button 
          onClick={() => onViewChange('worker')}
          className={`flex items-center gap-1 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-lg transition-colors ${currentView === 'worker' ? 'bg-primary/10 text-primary font-bold' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        >
          <Users size={16} className="md:w-[18px] md:h-[18px]" />
          <span className="text-xs md:text-sm">Worker</span>
        </button>
      </div>

      <div className="flex items-center gap-1 md:gap-2">
        <button 
          onClick={toggleTheme}
          className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          title="Toggle Theme"
        >
          {isDark ? <Sun size={16} className="md:w-[18px] md:h-[18px]" /> : <Moon size={16} className="md:w-[18px] md:h-[18px]" />}
        </button>
      </div>
    </header>
  );
}
