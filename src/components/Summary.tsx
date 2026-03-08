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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      <div className="bg-white dark:bg-surface-dark p-5 md:p-6 rounded-2xl border border-border-light dark:border-border-dark shadow-sm flex flex-col justify-center hover:shadow-md transition-all duration-200">
        <p className="text-slate-500 dark:text-slate-400 text-[11px] md:text-xs font-bold uppercase tracking-widest mb-2">Total Earned</p>
        <div className="flex items-baseline gap-2">
          <h4 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">₹{totalEarned.toFixed(0)}</h4>
        </div>
        <p className="text-[10px] md:text-[11px] text-green-600 dark:text-green-400 font-semibold mt-2">From {activeDays} active days</p>
      </div>
      <div className="bg-white dark:bg-surface-dark p-5 md:p-6 rounded-2xl border border-border-light dark:border-border-dark shadow-sm flex flex-col justify-center hover:shadow-md transition-all duration-200">
        <p className="text-slate-500 dark:text-slate-400 text-[11px] md:text-xs font-bold uppercase tracking-widest mb-2">Payments Made</p>
        <div className="flex items-baseline gap-2">
          <h4 className="text-2xl md:text-3xl font-black text-red-600 dark:text-red-400">₹{totalPaid.toFixed(0)}</h4>
        </div>
        <p className="text-[10px] md:text-[11px] text-slate-500 dark:text-slate-400 font-semibold mt-2">{payments.length} transactions</p>
      </div>
      <div className="bg-gradient-to-br from-primary to-primary-dark p-5 md:p-6 rounded-2xl shadow-lg shadow-primary/25 text-white flex flex-col justify-center hover:shadow-xl transition-all duration-200">
        <p className="text-white/80 text-[11px] md:text-xs font-bold uppercase tracking-widest mb-2">Remaining Balance</p>
        <h4 className="text-2xl md:text-3xl font-black">₹{remainingBalance.toFixed(0)}</h4>
        <p className="text-white/70 text-[10px] md:text-[11px] font-semibold mt-2">Net payable amount</p>
      </div>
    </div>
  );
}
