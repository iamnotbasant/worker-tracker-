import React, { useState, useEffect } from 'react';
import { User, MapPin, Plus, X, Banknote, Calendar, Edit2, Trash2 } from 'lucide-react';
import { Worker, WorkerRole } from '../types';

interface WorkerInfoProps {
  worker: Worker;
  onMarkAttendance: (status: 'Present' | 'Half day' | 'Absent', date: string) => void;
  onAddPayment: (description: string, amount: number, date: string) => void;
  onUpdateDailyRate: (workerId: string, newRate: number) => void;
  onEditWorker: (workerId: string, updates: Partial<Worker>) => void;
  onDeleteWorker: (workerId: string) => void;
}

export function WorkerInfo({ worker, onMarkAttendance, onAddPayment, onUpdateDailyRate, onEditWorker, onDeleteWorker }: WorkerInfoProps) {
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showEditRateModal, setShowEditRateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentDescription, setPaymentDescription] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');

  const [newRate, setNewRate] = useState(worker.dailyRate.toString());
  
  const [editName, setEditName] = useState(worker.name);
  const [editRole, setEditRole] = useState<WorkerRole>(worker.role);
  const [editLocation, setEditLocation] = useState(worker.location);

  useEffect(() => {
    setEditName(worker.name);
    setEditRole(worker.role);
    setEditLocation(worker.location);
    setNewRate(worker.dailyRate.toString());
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

  const handleEditRateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rate = Number(newRate);
    if (!isNaN(rate) && rate > 0) {
      if (window.confirm(`Are you sure you want to update the daily rate to ₹${rate}?`)) {
        onUpdateDailyRate(worker.id, rate);
        setShowEditRateModal(false);
      }
    } else {
      alert("Please enter a valid amount.");
    }
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editName) {
      onEditWorker(worker.id, {
        name: editName,
        role: editRole,
        location: editLocation
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
      <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl border border-primary/10 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="size-14 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0">
            <User size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              {worker.name}
              <button onClick={() => setShowEditModal(true)} className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Edit Worker">
                <Edit2 size={16} />
              </button>
              <button onClick={handleDelete} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors" title="Delete Worker">
                <Trash2 size={16} />
              </button>
            </h1>
            <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-1">
              <p className="text-slate-500 dark:text-slate-400 flex items-center gap-1 text-sm">
                <MapPin size={14} />
                {worker.location}
              </p>
              {worker.role && (
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                  worker.role === 'Mistri' ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400' :
                  worker.role === 'Labour' ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400' :
                  'bg-purple-500/20 text-purple-600 dark:text-purple-400'
                }`}>
                  {worker.role}
                </span>
              )}
              <span className="text-slate-500 dark:text-slate-400 text-sm font-medium flex items-center gap-1">
                ₹{worker.dailyRate} / Day
                <button onClick={() => setShowEditRateModal(true)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors text-primary" title="Edit Daily Rate">
                  <Edit2 size={12} />
                </button>
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <button 
            onClick={() => setShowPaymentModal(true)}
            className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <Banknote size={18} />
            Add Payment
          </button>
          <button 
            onClick={() => setShowAttendanceModal(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors"
          >
            <Plus size={18} />
            Mark Attendance
          </button>
        </div>
      </div>

      {showAttendanceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-sm shadow-xl border border-primary/10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Mark Attendance</h3>
              <button onClick={() => setShowAttendanceModal(false)} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="date" 
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 dark:text-white"
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <button onClick={() => handleMark('Present')} className="w-full py-3 px-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors">
                <span className="size-2 bg-green-500 rounded-full"></span>
                Present (Full Day)
              </button>
              <button onClick={() => handleMark('Half day')} className="w-full py-3 px-4 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors">
                <span className="size-2 bg-orange-500 rounded-full"></span>
                Half Day
              </button>
              <button onClick={() => handleMark('Absent')} className="w-full py-3 px-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
                <span className="size-2 bg-red-500 rounded-full"></span>
                Absent
              </button>
            </div>
          </div>
        </div>
      )}

      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-sm shadow-xl border border-primary/10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Add Payment</h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="date" 
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 dark:text-white"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Description (Optional)</label>
                <input 
                  type="text" 
                  value={paymentDescription}
                  onChange={(e) => setPaymentDescription(e.target.value)}
                  placeholder="e.g., Weekly Advance"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Amount (₹)</label>
                <input 
                  type="number" 
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="0.00"
                  min="1"
                  step="0.01"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 dark:text-white"
                  required
                />
              </div>
              <button type="submit" className="w-full py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors">
                Save Payment
              </button>
            </form>
          </div>
        </div>
      )}

      {showEditRateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-sm shadow-xl border border-primary/10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Edit Daily Rate</h3>
              <button onClick={() => setShowEditRateModal(false)} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleEditRateSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">New Daily Rate (₹)</label>
                <input 
                  type="number" 
                  value={newRate}
                  onChange={(e) => setNewRate(e.target.value)}
                  placeholder="0.00"
                  min="1"
                  step="0.01"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 dark:text-white"
                  required
                />
              </div>
              <button type="submit" className="w-full py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors">
                Update Rate
              </button>
            </form>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-sm shadow-xl border border-primary/10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Edit Worker</h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Full Name</label>
                <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 dark:text-white" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Role</label>
                <select value={editRole} onChange={(e) => setEditRole(e.target.value as WorkerRole)} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 dark:text-white">
                  <option value="Mistri">Mistri</option>
                  <option value="Labour">Labour</option>
                  <option value="Helper">Helper</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Location</label>
                <input type="text" value={editLocation} onChange={(e) => setEditLocation(e.target.value)} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 dark:text-white" required />
              </div>
              <button type="submit" className="w-full py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
