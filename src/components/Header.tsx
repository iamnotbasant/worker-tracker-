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
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border-light dark:border-border-dark bg-white/95 dark:bg-surface-dark backdrop-blur-md px-4 md:px-10 py-4 transition-colors duration-300 shadow-sm">
      <div className="flex items-center gap-2 md:gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold shadow-md">
            <HardHat size={20} />
          </div>
          <span className="text-sm md:text-base font-bold text-slate-900 dark:text-white hidden sm:inline">Worker Tracker</span>
        </div>
      </div>

      <div className="flex items-center gap-1 md:gap-3 mx-auto">
        <button 
          onClick={() => onViewChange('dashboard')}
          className={`flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 rounded-xl transition-all duration-200 font-medium text-sm ${currentView === 'dashboard' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-slate-600 dark:text-slate-300 hover:bg-surface-light dark:hover:bg-surface-dark border border-border-light dark:border-border-dark'}`}
        >
          <LayoutDashboard size={18} />
          <span className="hidden md:inline">Dashboard</span>
        </button>
        <button 
          onClick={() => onViewChange('worker')}
          className={`flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 rounded-xl transition-all duration-200 font-medium text-sm ${currentView === 'worker' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-slate-600 dark:text-slate-300 hover:bg-surface-light dark:hover:bg-surface-dark border border-border-light dark:border-border-dark'}`}
        >
          <Users size={18} />
          <span className="hidden md:inline">Worker</span>
        </button>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <button 
          onClick={toggleTheme}
          className="flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full bg-surface-light dark:bg-surface-dark text-slate-600 dark:text-slate-300 hover:bg-border-light dark:hover:bg-border-dark border border-border-light dark:border-border-dark transition-all duration-200"
          title="Toggle Theme"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
}
