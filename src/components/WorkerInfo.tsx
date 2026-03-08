import React, { useState, useEffect } from 'react';
import { User, Plus, X, Banknote, Calendar, Edit2, Trash2 } from 'lucide-react';
import { Worker, WorkerRole } from '../types';

interface WorkerInfoProps {
  worker: Worker;
  onMarkAttendance: (status: 'Present' | 'Half day' | 'Absent', date: string) => void;
  onAddPayment: (description: string, amount: number, date: string) => void;
  onEditWorker: (workerId: string, updates: Partial<Worker>) => void;
  onDeleteWorker: (workerId: string) => void;
}

export function WorkerInfo({ worker, onMarkAttendance, onAddPayment, onEditWorker, onDeleteWorker }: WorkerInfoProps) {
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentDescription, setPaymentDescription] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');

  const [editName, setEditName] = useState(worker.name);
  const [editRole, setEditRole] = useState<WorkerRole>(worker.role);
  const [editRate, setEditRate] = useState(worker.dailyRate.toString());

  useEffect(() => {
    setEditName(worker.name);
    setEditRole(worker.role);
    setEditRate(worker.dailyRate.toString());
  }, [worker]);

  const handleMark = (status: 'Present' | 'Half day' | 'Absent') => {
    // Format date to match existing format 'Oct 27, 2023'
    const formattedDate = new Date(attendanceDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    onMarkAttendance(status, formattedDate);
    setShowAttendanceModal(false);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentAmount && !isNaN(Number(paymentAmount))) {
      const formattedDate = new Date(paymentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      onAddPayment(paymentDescription || 'Payment', Number(paymentAmount), formattedDate);
      setPaymentDescription('');
      setPaymentAmount('');
      setShowPaymentModal(false);
    }
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editName && editRate && !isNaN(Number(editRate))) {
      onEditWorker(worker.id, {
        name: editName,
        role: editRole,
        dailyRate: Number(editRate)
      });
      setShowEditModal(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${worker.name}? All their attendance and payment records will be kept but the worker will be removed.`)) {
      onDeleteWorker(worker.id);
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-surface-dark p-5 md:p-6 rounded-2xl border border-border-light dark:border-border-dark shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-5 md:gap-6 hover:shadow-md transition-all duration-200">
        <div className="flex items-center gap-4 md:gap-5 w-full md:w-auto">
          <div className="size-14 md:size-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0 shadow-sm">
            <User size={28} className="md:w-8 md:h-8" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-bold dark:text-white">
                {worker.name}
              </h1>
              <button onClick={() => setShowEditModal(true)} className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Edit Worker">
                <Edit2 size={18} />
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              {worker.role && (
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                  worker.role === 'Mistri' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                  worker.role === 'Labour' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                  'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                }`}>
                  {worker.role}
                </span>
              )}
              <span className="text-slate-600 dark:text-slate-400 text-xs md:text-sm font-semibold flex items-center gap-1">
                <span className="text-primary font-bold">₹{worker.dailyRate}</span>/Day
              </span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
          <button 
            onClick={() => setShowPaymentModal(true)}
            className="bg-surface-light dark:bg-slate-900 text-slate-700 dark:text-slate-200 px-4 md:px-5 py-2.5 md:py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 active:scale-95 border border-border-light dark:border-border-dark"
          >
            <Banknote size={18} />
            <span className="hidden md:inline">Payment</span>
          </button>
          <button 
            onClick={() => setShowAttendanceModal(true)}
            className="bg-primary text-white px-4 md:px-5 py-2.5 md:py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/25 hover:shadow-lg hover:shadow-primary/35 transition-all duration-200 active:scale-95"
          >
            <Plus size={18} />
            <span className="hidden md:inline">Attendance</span>
          </button>
        </div>
      </div>

      {showAttendanceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-border-light dark:border-border-dark">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Mark Attendance</h3>
              <button onClick={() => setShowAttendanceModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-5">
              <label className="block text-sm font-semibold mb-2 text-slate-900 dark:text-white">Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="date" 
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 border border-border-light dark:border-border-dark rounded-xl bg-white dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary dark:text-white transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <button onClick={() => handleMark('Present')} className="w-full py-3 px-4 bg-green-100 dark:bg-green-900/25 text-green-700 dark:text-green-400 rounded-xl font-semibold flex items-center justify-center gap-2 border border-green-200 dark:border-green-900/50 hover:bg-green-200 dark:hover:bg-green-900/35 transition-all duration-200">
                <span className="size-2.5 bg-green-500 rounded-full"></span>
                Present (Full Day)
              </button>
              <button onClick={() => handleMark('Half day')} className="w-full py-3 px-4 bg-amber-100 dark:bg-amber-900/25 text-amber-700 dark:text-amber-400 rounded-xl font-semibold flex items-center justify-center gap-2 border border-amber-200 dark:border-amber-900/50 hover:bg-amber-200 dark:hover:bg-amber-900/35 transition-all duration-200">
                <span className="size-2.5 bg-amber-500 rounded-full"></span>
                Half Day
              </button>
              <button onClick={() => handleMark('Absent')} className="w-full py-3 px-4 bg-red-100 dark:bg-red-900/25 text-red-700 dark:text-red-400 rounded-xl font-semibold flex items-center justify-center gap-2 border border-red-200 dark:border-red-900/50 hover:bg-red-200 dark:hover:bg-red-900/35 transition-all duration-200">
                <span className="size-2.5 bg-red-500 rounded-full"></span>
                Absent
              </button>
            </div>
          </div>
        </div>
      )}

      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-border-light dark:border-border-dark">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Add Payment</h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handlePaymentSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-900 dark:text-white">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="date" 
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 border border-border-light dark:border-border-dark rounded-xl bg-white dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary dark:text-white transition-all"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-900 dark:text-white">Description (Optional)</label>
                <input 
                  type="text" 
                  value={paymentDescription}
                  onChange={(e) => setPaymentDescription(e.target.value)}
                  placeholder="e.g., Weekly Advance"
                  className="w-full px-4 py-2.5 border border-border-light dark:border-border-dark rounded-xl bg-white dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary dark:text-white transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-900 dark:text-white">Amount (₹)</label>
                <input 
                  type="number" 
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="0.00"
                  min="1"
                  step="0.01"
                  className="w-full px-4 py-2.5 border border-border-light dark:border-border-dark rounded-xl bg-white dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary dark:text-white transition-all"
                  required
                />
              </div>
              <button type="submit" className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-200 active:scale-95">
                Save Payment
              </button>
            </form>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-border-light dark:border-border-dark">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Edit Worker</h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-900 dark:text-white">Full Name</label>
                <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full px-4 py-2.5 border border-border-light dark:border-border-dark rounded-xl bg-white dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary dark:text-white transition-all" required />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-900 dark:text-white">Role</label>
                <select value={editRole} onChange={(e) => setEditRole(e.target.value as WorkerRole)} className="w-full px-4 py-2.5 border border-border-light dark:border-border-dark rounded-xl bg-white dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary dark:text-white transition-all">
                  <option value="Mistri">Mistri</option>
                  <option value="Labour">Labour</option>
                  <option value="Helper">Helper</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-900 dark:text-white">Daily Rate (₹)</label>
                <input type="number" value={editRate} onChange={(e) => setEditRate(e.target.value)} min="1" step="1" className="w-full px-4 py-2.5 border border-border-light dark:border-border-dark rounded-xl bg-white dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary dark:text-white transition-all" required />
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
    </>
  );
}
