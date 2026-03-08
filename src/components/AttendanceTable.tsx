import React, { useState } from 'react';
import { AttendanceRecord, AttendanceStatus } from '../types';
import { X, Trash2 } from 'lucide-react';

interface AttendanceTableProps {
  logs: AttendanceRecord[];
  onEdit: (recordId: string, updates: Partial<AttendanceRecord>) => void;
  onDelete: (recordId: string) => void;
}

export function AttendanceTable({ logs, onEdit, onDelete }: AttendanceTableProps) {
  const [editingLog, setEditingLog] = useState<AttendanceRecord | null>(null);
  const [editStatus, setEditStatus] = useState<AttendanceStatus>('Present');
  const [editPay, setEditPay] = useState('');
  const [editDate, setEditDate] = useState('');

  const handleRowClick = (log: AttendanceRecord) => {
    setEditingLog(log);
    setEditStatus(log.status);
    setEditPay(log.pay.toString());
    // Convert "Oct 27, 2023" to "2023-10-27" for input type="date"
    const date = new Date(log.date);
    if (!isNaN(date.getTime())) {
      setEditDate(date.toISOString().split('T')[0]);
    } else {
      setEditDate('');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLog && editPay && !isNaN(Number(editPay))) {
      const formattedDate = new Date(editDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      onEdit(editingLog.id, {
        status: editStatus,
        pay: Number(editPay),
        date: formattedDate
      });
      setEditingLog(null);
    }
  };

  const handleDelete = () => {
    if (editingLog && window.confirm('Are you sure you want to delete this attendance record?')) {
      onDelete(editingLog.id);
      setEditingLog(null);
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark shadow-sm overflow-hidden hover:shadow-md transition-all duration-200">
      <div className="p-5 md:p-6 border-b border-border-light dark:border-border-dark bg-slate-50/60 dark:bg-slate-900/20">
        <h3 className="font-bold text-slate-900 dark:text-white text-lg">Attendance Log</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track and manage daily attendance records</p>
      </div>
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-slate-50 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400 text-xs uppercase tracking-widest border-b border-border-light dark:border-border-dark">
            <tr>
              <th className="px-5 md:px-6 py-4 font-semibold">Date</th>
              <th className="px-5 md:px-6 py-4 font-semibold">Status</th>
              <th className="px-5 md:px-6 py-4 font-semibold text-right">Daily Pay</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light dark:divide-border-dark">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-5 md:px-6 py-12 text-center text-slate-400 dark:text-slate-500">
                  <p className="font-medium">No attendance records yet</p>
                  <p className="text-sm mt-1">Start tracking attendance to see records here</p>
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr 
                  key={log.id} 
                  className="hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-200 cursor-pointer"
                  onDoubleClick={() => handleRowClick(log)}
                  title="Double click to edit"
                >
                  <td className="px-5 md:px-6 py-4 text-sm font-medium text-slate-700 dark:text-slate-300">{log.date}</td>
                  <td className="px-5 md:px-6 py-4">
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${
                      log.status === 'Present' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                      log.status === 'Half day' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' :
                      'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                    }`}>
                      <span className={`size-2 rounded-full ${
                        log.status === 'Present' ? 'bg-green-500' :
                        log.status === 'Half day' ? 'bg-amber-500' :
                        'bg-red-500'
                      }`}></span>
                      {log.status}
                    </div>
                  </td>
                  <td className="px-5 md:px-6 py-4 text-sm font-bold text-right text-slate-900 dark:text-white">
                    ₹{log.pay.toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {editingLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-border-light dark:border-border-dark">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Edit Attendance</h3>
              <button onClick={() => setEditingLog(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-900 dark:text-white">Date</label>
                <input 
                  type="date" 
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="w-full px-4 py-2.5 border border-border-light dark:border-border-dark rounded-xl bg-white dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary dark:text-white transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-900 dark:text-white">Status</label>
                <select 
                  value={editStatus} 
                  onChange={(e) => setEditStatus(e.target.value as AttendanceStatus)}
                  className="w-full px-4 py-2.5 border border-border-light dark:border-border-dark rounded-xl bg-white dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary dark:text-white transition-all"
                >
                  <option value="Present">Present</option>
                  <option value="Half day">Half day</option>
                  <option value="Absent">Absent</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-900 dark:text-white">Pay Amount (₹)</label>
                <input 
                  type="number" 
                  value={editPay}
                  onChange={(e) => setEditPay(e.target.value)}
                  className="w-full px-4 py-2.5 border border-border-light dark:border-border-dark rounded-xl bg-white dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary dark:text-white transition-all"
                  required
                />
              </div>
              <div className="pt-3 flex gap-3">
                <button type="button" onClick={handleDelete} className="flex-1 py-2.5 bg-red-100 dark:bg-red-900/25 text-red-700 dark:text-red-400 rounded-xl font-semibold border border-red-200 dark:border-red-900/50 hover:bg-red-200 dark:hover:bg-red-900/35 transition-all duration-200 flex items-center justify-center gap-2">
                  <Trash2 size={18} />
                  Delete
                </button>
                <button type="submit" className="flex-[2] py-2.5 bg-primary text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-200 active:scale-95">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
