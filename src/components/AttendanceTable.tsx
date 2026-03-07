import { AttendanceRecord } from '../types';

interface AttendanceTableProps {
  logs: AttendanceRecord[];
}

export function AttendanceTable({ logs }: AttendanceTableProps) {
  return (
    <div className="bg-white dark:bg-slate-800/50 rounded-xl border border-primary/10 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-primary/5 bg-slate-50/50 dark:bg-slate-800/30">
        <h3 className="font-bold text-slate-700 dark:text-slate-300">Daily Attendance Log</h3>
      </div>
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-4 md:px-6 py-4 font-semibold">Date</th>
              <th className="px-4 md:px-6 py-4 font-semibold">Attendance Status</th>
              <th className="px-4 md:px-6 py-4 font-semibold text-right">Daily Pay</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary/5">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 md:px-6 py-8 text-center text-slate-500">No attendance records found.</td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-primary/5 transition-colors">
                  <td className="px-4 md:px-6 py-4 text-sm">{log.date}</td>
                  <td className="px-4 md:px-6 py-4">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${
                      log.status === 'Present' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                      log.status === 'Half day' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' :
                      'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                    }`}>
                      <span className={`size-2 rounded-full ${
                        log.status === 'Present' ? 'bg-green-500' :
                        log.status === 'Half day' ? 'bg-orange-500' :
                        'bg-red-500'
                      }`}></span>
                      {log.status}
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-4 text-sm font-semibold text-right text-slate-700 dark:text-slate-200">
                    ₹{log.pay.toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
