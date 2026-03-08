import React, { useState } from 'react';
import { User, Check, Plus, X, Search, CheckCircle2, XCircle, Users, UserPlus, CalendarDays, CheckSquare, RotateCcw } from 'lucide-react';
import { Worker, AttendanceStatus, WorkerRole } from '../types';

interface DashboardProps {
  workers: Worker[];
  onUpdateStatus: (workerId: string, status: AttendanceStatus | null) => void;
  onMarkAll: (status: AttendanceStatus) => void;
  onResetAll: () => void;
  onWorkerClick: (worker: Worker) => void;
  onAddWorker: (worker: Omit<Worker, 'id' | 'currentStatus'>) => void;
}

export function Dashboard({ workers, onUpdateStatus, onMarkAll, onResetAll, onWorkerClick, onAddWorker }: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('All');
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<WorkerRole>('Labour');
  const [newRate, setNewRate] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName && newRate && !isNaN(Number(newRate))) {
      onAddWorker({
        name: newName,
        role: newRole,
        dailyRate: Number(newRate)
      });
      setShowAddModal(false);
      setNewName('');
      setNewRate('');
      setNewRole('Labour');
    }
  };

  const filteredWorkers = workers.filter(w => {
    const matchesSearch = w.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || w.role === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const presentCount = workers.filter(w => w.currentStatus === 'Present').length;
  const absentCount = workers.filter(w => w.currentStatus === 'Absent').length;
  const totalCost = workers.reduce((sum, w) => {
    if (w.currentStatus === 'Present') return sum + w.dailyRate;
    if (w.currentStatus === 'Half day') return sum + (w.dailyRate / 2);
    return sum;
  }, 0);

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <CalendarDays className="text-primary" size={20} />
            </div>
            <p className="text-primary font-bold uppercase tracking-wider text-[10px] md:text-xs">Attendance Tracking</p>
          </div>
          <h1 className="text-3xl md:text-4xl font-black dark:text-white tracking-tight">{today}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage your team's daily attendance and records</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowAddModal(true)} className="hidden md:flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/25 hover:shadow-lg hover:shadow-primary/35 transition-all duration-200 active:scale-95">
            <UserPlus size={18} />
            Add Worker
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
            <input 
              className="w-full bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white text-sm md:text-base shadow-sm group-hover:border-primary/30 dark:group-hover:border-primary/30" 
              placeholder="Search worker by name..." 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
            {['All', 'Mistri', 'Labour', 'Helper'].map(filter => (
              <button 
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`whitespace-nowrap px-4 py-2.5 rounded-xl font-semibold text-xs md:text-sm border transition-all duration-200 active:scale-95 ${
                  activeFilter === filter 
                    ? 'bg-primary text-white border-primary shadow-md shadow-primary/20' 
                    : 'bg-white dark:bg-surface-dark text-slate-600 dark:text-slate-300 border-border-light dark:border-border-dark hover:border-primary/50 dark:hover:border-primary/50'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <button 
          onClick={() => onMarkAll('Present')}
          className="flex items-center justify-center gap-2 py-4 px-4 rounded-xl border border-green-200 dark:border-green-900/30 bg-green-50 dark:bg-green-900/15 text-green-700 dark:text-green-400 font-semibold hover:bg-green-100 dark:hover:bg-green-900/25 transition-all duration-200 text-xs md:text-sm active:scale-[0.98] shadow-sm"
        >
          <CheckSquare size={18} />
          <span>Mark All Present</span>
        </button>
        <button 
          onClick={onResetAll}
          className="flex items-center justify-center gap-2 py-4 px-4 rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/15 text-red-700 dark:text-red-400 font-semibold hover:bg-red-100 dark:hover:bg-red-900/25 transition-all duration-200 text-xs md:text-sm active:scale-[0.98] shadow-sm"
        >
          <RotateCcw size={18} />
          <span>Reset All</span>
        </button>
      </div>

      {/* Worker List */}
      <div className="space-y-4">
        {filteredWorkers.map(worker => (
          <div key={worker.id} className={`bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl p-4 md:p-5 shadow-sm hover:shadow-md transition-all duration-200 ${worker.currentStatus ? '' : 'opacity-85'}`}>
            <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
              <div 
                className="flex items-center gap-3 flex-1 cursor-pointer active:opacity-70 transition-opacity"
                onClick={() => onWorkerClick(worker)}
              >
                <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center text-slate-400 shrink-0 border border-slate-200 dark:border-slate-600">
                  <User size={20} className="md:w-6 md:h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm md:text-lg dark:text-white leading-tight">{worker.name}</h3>
                  <div className="flex gap-2 mt-0.5 items-center">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wide ${
                      worker.role === 'Mistri' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                      worker.role === 'Labour' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                      'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                    }`}>
                      {worker.role}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">₹{worker.dailyRate}/Day</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 md:w-80 pt-3 md:pt-0 border-t md:border-t-0 border-border-light dark:border-border-dark">
                <button 
                  onClick={() => onUpdateStatus(worker.id, 'Present')}
                  className={`flex flex-col items-center justify-center gap-1.5 py-3 md:py-3 rounded-lg border-2 font-semibold transition-all duration-200 active:scale-95 ${
                    worker.currentStatus === 'Present' 
                      ? 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-500/25' 
                      : 'bg-white dark:bg-surface-dark border-green-200 dark:border-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/15'
                  }`}
                >
                  <Check size={18} className="md:w-5 md:h-5" />
                  <span className="text-[9px] font-black uppercase tracking-wider">Present</span>
                </button>
                <button 
                  onClick={() => onUpdateStatus(worker.id, 'Half day')}
                  className={`flex flex-col items-center justify-center gap-1.5 py-3 md:py-3 rounded-lg border-2 font-semibold transition-all duration-200 active:scale-95 ${
                    worker.currentStatus === 'Half day' 
                      ? 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/25' 
                      : 'bg-white dark:bg-surface-dark border-amber-200 dark:border-amber-900/30 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/15'
                  }`}
                >
                  <Plus size={18} className="md:w-5 md:h-5 rotate-45" />
                  <span className="text-[9px] font-black uppercase tracking-wider">Half</span>
                </button>
                <button 
                  onClick={() => onUpdateStatus(worker.id, 'Absent')}
                  className={`flex flex-col items-center justify-center gap-1.5 py-3 md:py-3 rounded-lg border-2 font-semibold transition-all duration-200 active:scale-95 ${
                    worker.currentStatus === 'Absent' 
                      ? 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/25' 
                      : 'bg-white dark:bg-surface-dark border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/15'
                  }`}
                >
                  <X size={18} className="md:w-5 md:h-5" />
                  <span className="text-[9px] font-black uppercase tracking-wider">Absent</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sticky Bottom FAB for Mobile */}
      <div className="fixed bottom-24 right-5 md:hidden z-40">
        <button onClick={() => setShowAddModal(true)} className="h-14 w-14 rounded-full bg-primary text-white shadow-lg shadow-primary/35 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform duration-200">
          <UserPlus size={24} />
        </button>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-border-light dark:border-border-dark">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Add New Worker</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Full Name</label>
                <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 dark:text-white" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Role</label>
                <select value={newRole} onChange={(e) => setNewRole(e.target.value as WorkerRole)} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 dark:text-white">
                  <option value="Mistri">Mistri</option>
                  <option value="Labour">Labour</option>
                  <option value="Helper">Helper</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Daily Rate (₹)</label>
                <input type="number" value={newRate} onChange={(e) => setNewRate(e.target.value)} min="1" step="1" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 dark:text-white" required />
              </div>
              <button type="submit" className="w-full py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors">
                Add Worker
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
