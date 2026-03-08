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
                <tr 
                  key={log.id} 
                  className="hover:bg-primary/5 transition-colors cursor-pointer"
                  onDoubleClick={() => handleRowClick(log)}
                  title="Double click to edit"
                >
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
      
      {editingLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-sm shadow-xl border border-primary/10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Edit Attendance</h3>
              <button onClick={() => setEditingLog(null)} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Date</label>
                <input 
                  type="date" 
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Status</label>
                <select 
                  value={editStatus} 
                  onChange={(e) => setEditStatus(e.target.value as AttendanceStatus)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 dark:text-white"
                >
                  <option value="Present">Present</option>
                  <option value="Half day">Half day</option>
                  <option value="Absent">Absent</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Pay Amount (₹)</label>
                <input 
                  type="number" 
                  value={editPay}
                  onChange={(e) => setEditPay(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 dark:text-white"
                  required
                />
              </div>
              <div className="pt-2 flex gap-3">
                <button type="button" onClick={handleDelete} className="flex-1 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg font-bold hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors flex items-center justify-center gap-2">
                  <Trash2 size={18} />
                  Delete
                </button>
                <button type="submit" className="flex-[2] py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors">
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
