import { LayoutDashboard, Users, CalendarCheck, Wallet } from 'lucide-react';

interface NavigationProps {
  currentView: 'dashboard' | 'worker';
  onViewChange: (view: 'dashboard' | 'worker') => void;
}

export function Navigation({ currentView, onViewChange }: NavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 md:relative md:border-t-0 md:bg-transparent z-50">
      <div className="flex items-center justify-around md:justify-start md:gap-6 overflow-x-auto py-2 md:py-4 px-4 max-w-5xl mx-auto no-scrollbar">
        <div 
          onClick={() => onViewChange('dashboard')}
          className={`flex flex-col md:flex-row items-center gap-1 md:gap-2 px-2 md:px-4 py-2 rounded-lg transition-colors cursor-pointer ${currentView === 'dashboard' ? 'text-primary font-bold md:bg-primary/10' : 'text-slate-500 dark:text-slate-400 hover:text-primary font-medium'}`}
        >
          <LayoutDashboard size={20} className={currentView === 'dashboard' ? 'fill-primary/20' : ''} />
          <span className="text-[10px] md:text-sm">Dashboard</span>
        </div>
        <div 
          onClick={() => onViewChange('worker')}
          className={`flex flex-col md:flex-row items-center gap-1 md:gap-2 px-2 md:px-4 py-2 rounded-lg transition-colors cursor-pointer ${currentView === 'worker' ? 'text-primary font-bold md:bg-primary/10' : 'text-slate-500 dark:text-slate-400 hover:text-primary font-medium'}`}
        >
          <Users size={20} className={currentView === 'worker' ? 'fill-primary/20' : ''} />
          <span className="text-[10px] md:text-sm">Worker</span>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-1 md:gap-2 px-2 md:px-3 py-2 text-slate-500 dark:text-slate-400 hover:text-primary transition-colors cursor-pointer">
          <CalendarCheck size={20} />
          <span className="text-[10px] md:text-sm font-medium">Reports</span>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-1 md:gap-2 px-2 md:px-3 py-2 text-slate-500 dark:text-slate-400 hover:text-primary transition-colors cursor-pointer">
          <Wallet size={20} />
          <span className="text-[10px] md:text-sm font-medium">Settings</span>
        </div>
      </div>
    </div>
  );
}
