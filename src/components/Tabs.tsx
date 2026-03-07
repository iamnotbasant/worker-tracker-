interface TabsProps {
  activeTab: 'attendance' | 'payments';
  onTabChange: (tab: 'attendance' | 'payments') => void;
}

export function Tabs({ activeTab, onTabChange }: TabsProps) {
  return (
    <div className="border-b border-primary/10 flex gap-4 md:gap-8 px-2 overflow-x-auto no-scrollbar">
      <button 
        onClick={() => onTabChange('attendance')}
        className={`pb-3 px-2 font-bold text-sm transition-colors whitespace-nowrap ${activeTab === 'attendance' ? 'border-b-2 border-primary text-primary' : 'text-slate-500 hover:text-primary'}`}
      >
        Attendance & Earnings
      </button>
      <button 
        onClick={() => onTabChange('payments')}
        className={`pb-3 px-2 font-bold text-sm transition-colors whitespace-nowrap ${activeTab === 'payments' ? 'border-b-2 border-primary text-primary' : 'text-slate-500 hover:text-primary'}`}
      >
        Payment History
      </button>
    </div>
  );
}
