import { AttendanceRecord, PaymentRecord } from '../types';

interface SummaryProps {
  attendanceLog: AttendanceRecord[];
  payments: PaymentRecord[];
}

export function Summary({ attendanceLog, payments }: SummaryProps) {
  const totalEarned = attendanceLog.reduce((sum, log) => sum + log.pay, 0);
  const activeDays = attendanceLog.filter(log => log.status === 'Present' || log.status === 'Half day').length;
  
  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const remainingBalance = totalEarned - totalPaid;

  return (
    <div className="grid grid-cols-3 gap-3 md:gap-6">
      <div className="bg-white dark:bg-slate-800/50 p-3 md:p-6 rounded-xl border border-primary/10 shadow-sm flex flex-col justify-center">
        <p className="text-slate-500 dark:text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1">Total Earned</p>
        <h4 className="text-lg md:text-2xl font-bold text-slate-900 dark:text-white">₹{totalEarned.toFixed(0)}</h4>
        <p className="text-[9px] md:text-[10px] text-green-500 font-medium mt-1 hidden md:block">From {activeDays} active days</p>
      </div>
      <div className="bg-white dark:bg-slate-800/50 p-3 md:p-6 rounded-xl border border-primary/10 shadow-sm flex flex-col justify-center">
        <p className="text-slate-500 dark:text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1">Payments Made</p>
        <h4 className="text-lg md:text-2xl font-bold text-red-500">₹{totalPaid.toFixed(0)}</h4>
        <p className="text-[9px] md:text-[10px] text-slate-400 font-medium mt-1 hidden md:block">{payments.length} transactions recorded</p>
      </div>
      <div className="bg-primary p-3 md:p-6 rounded-xl shadow-lg shadow-primary/20 text-white flex flex-col justify-center">
        <p className="text-white/80 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1">Remaining Balance</p>
        <h4 className="text-xl md:text-3xl font-black">₹{remainingBalance.toFixed(0)}</h4>
        <p className="text-white/60 text-[9px] md:text-[10px] font-medium mt-1 hidden md:block">Net payable as of today</p>
      </div>
    </div>
  );
}
