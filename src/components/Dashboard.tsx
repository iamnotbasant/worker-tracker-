import { User, Check, Plus, X, Search, CheckCircle2, XCircle, Users, Banknote, UserPlus, CalendarDays, CheckSquare, RotateCcw, Save } from 'lucide-react';
import { Worker, AttendanceStatus, WorkerRole } from '../types';
import { useState } from 'react';

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
  const [newLocation, setNewLocation] = useState('Site Alpha');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName && newRate && !isNaN(Number(newRate))) {
      onAddWorker({
        name: newName,
        role: newRole,
        dailyRate: Number(newRate),
        location: newLocation
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
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div className="space-y-1">
          <p className="text-primary font-bold uppercase tracking-wider text-xs">Daily Attendance</p>
          <h1 className="text-3xl md:text-4xl font-black dark:text-white">{today}</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowAddModal(true)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 md:py-2 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity">
            <UserPlus size={18} />
            Add Worker
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
        <div className="flex flex-col gap-1 rounded-2xl p-4 md:p-5 bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-primary/10 shadow-sm">
          <Users className="text-primary mb-1 md:mb-2" size={24} />
          <p className="text-slate-500 dark:text-slate-400 text-[11px] md:text-xs font-bold uppercase tracking-wider">Total Workers</p>
          <p className="text-2xl md:text-3xl font-black">{workers.length}</p>
        </div>
        <div className="flex flex-col gap-1 rounded-2xl p-4 md:p-5 bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-primary/10 shadow-sm">
          <CheckCircle2 className="text-green-500 mb-1 md:mb-2" size={24} />
          <p className="text-slate-500 dark:text-slate-400 text-[11px] md:text-xs font-bold uppercase tracking-wider">Present Today</p>
          <p className="text-2xl md:text-3xl font-black text-green-500">{presentCount}</p>
        </div>
        <div className="flex flex-col gap-1 rounded-2xl p-4 md:p-5 bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-primary/10 shadow-sm">
          <XCircle className="text-red-500 mb-1 md:mb-2" size={24} />
          <p className="text-slate-500 dark:text-slate-400 text-[11px] md:text-xs font-bold uppercase tracking-wider">Absent Today</p>
          <p className="text-2xl md:text-3xl font-black text-red-500">{absentCount}</p>
        </div>
        <div className="flex flex-col gap-1 rounded-2xl p-4 md:p-5 bg-primary text-white shadow-lg shadow-primary/20 col-span-2 lg:col-span-1">
          <Banknote className="mb-1 md:mb-2" size={24} />
          <p className="text-white/80 text-[11px] md:text-xs font-bold uppercase tracking-wider">Labour Cost</p>
          <p className="text-2xl md:text-3xl font-black">₹{totalCost.toLocaleString()}</p>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="flex items-center gap-3 mb-8">
        <button 
          onClick={() => onMarkAll('Present')}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-green-500/30 text-green-600 dark:text-green-500 font-bold hover:bg-green-500/10 transition-colors text-sm md:text-base"
        >
          <CheckSquare size={20} />
          Mark All
        </button>
        <button 
          onClick={onResetAll}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-red-500/30 text-red-600 dark:text-red-500 font-bold hover:bg-red-500/10 transition-colors text-sm md:text-base"
        >
          <RotateCcw size={20} />
          Reset All
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            className="w-full bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-primary/20 rounded-2xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all dark:text-white text-base shadow-sm" 
            placeholder="Search worker name or ID..." 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {['All', 'Mistri', 'Labour', 'Helper'].map(filter => (
            <button 
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`whitespace-nowrap px-5 py-3 rounded-xl font-bold text-sm border transition-colors ${
                activeFilter === filter 
                  ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white' 
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Worker List */}
      <div className="space-y-3 bg-slate-50 dark:bg-slate-900/50 p-2 md:p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
        {filteredWorkers.map(worker => (
          <div key={worker.id} className={`bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-primary/10 rounded-xl p-3 md:p-4 shadow-sm transition-opacity ${worker.currentStatus ? '' : 'opacity-70'}`}>
            <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
              <div 
                className="flex items-center gap-3 flex-1 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => onWorkerClick(worker)}
              >
                <div className="h-12 w-12 md:h-14 md:w-14 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                  <User size={24} className="md:w-7 md:h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-base md:text-lg dark:text-white leading-tight">{worker.name}</h3>
                  <div className="flex gap-2 mt-1 items-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                      worker.role === 'Mistri' ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400' :
                      worker.role === 'Labour' ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400' :
                      'bg-purple-500/20 text-purple-600 dark:text-purple-400'
                    }`}>
                      {worker.role}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 text-xs md:text-sm font-medium">₹{worker.dailyRate} / Day</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 md:w-80">
                <button 
                  onClick={() => onUpdateStatus(worker.id, 'Present')}
                  className={`flex flex-col items-center justify-center gap-1 py-2 md:py-3 rounded-lg border transition-all ${
                    worker.currentStatus === 'Present' 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : 'bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-primary/10 hover:border-green-500 dark:hover:border-green-500'
                  }`}
                >
                  <Check size={18} className="md:w-5 md:h-5" />
                  <span className="text-[10px] font-bold uppercase">Present</span>
                </button>
                <button 
                  onClick={() => onUpdateStatus(worker.id, 'Half day')}
                  className={`flex flex-col items-center justify-center gap-1 py-2 md:py-3 rounded-lg border transition-all ${
                    worker.currentStatus === 'Half day' 
                      ? 'bg-yellow-500 border-yellow-500 text-black' 
                      : 'bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-primary/10 hover:border-yellow-500 dark:hover:border-yellow-500'
                  }`}
                >
                  <Plus size={18} className="md:w-5 md:h-5" />
                  <span className="text-[10px] font-bold uppercase">Half Day</span>
                </button>
                <button 
                  onClick={() => onUpdateStatus(worker.id, 'Absent')}
                  className={`flex flex-col items-center justify-center gap-1 py-2 md:py-3 rounded-lg border transition-all ${
                    worker.currentStatus === 'Absent' 
                      ? 'bg-red-500 border-red-500 text-white' 
                      : 'bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-primary/10 hover:border-red-500 dark:hover:border-red-500'
                  }`}
                >
                  <X size={18} className="md:w-5 md:h-5" />
                  <span className="text-[10px] font-bold uppercase">Absent</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sticky Bottom FAB for Mobile */}
      <div className="fixed bottom-20 right-4 md:hidden z-40">
        <button onClick={() => setShowAddModal(true)} className="h-14 w-14 rounded-full bg-primary text-white shadow-lg shadow-primary/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform">
          <UserPlus size={24} />
        </button>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-sm shadow-xl border border-primary/10">
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
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Location</label>
                <input type="text" value={newLocation} onChange={(e) => setNewLocation(e.target.value)} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 dark:text-white" required />
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
