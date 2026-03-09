/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { WorkerInfo } from './components/WorkerInfo';
import { Tabs } from './components/Tabs';
import { AttendanceTable } from './components/AttendanceTable';
import { PaymentsTable } from './components/PaymentsTable';
import { Summary } from './components/Summary';
import { Dashboard } from './components/Dashboard';
import { AttendanceRecord, PaymentRecord, Worker, AttendanceStatus } from './types';
import * as storage from './lib/storage';

export default function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'worker'>('dashboard');
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'attendance' | 'payments'>('attendance');
  
  const [workers, setWorkers] = useState<Worker[]>(() => {
    const saved = storage.getWorkers();
    return saved.map(w => ({ ...w, currentStatus: null }));
  });

  const [attendanceLog, setAttendanceLog] = useState<Record<string, AttendanceRecord[]>>(() => {
    return storage.getAttendanceLog();
  });

  const [payments, setPayments] = useState<Record<string, PaymentRecord[]>>(() => {
    return storage.getPayments();
  });

  // Save workers whenever they change
  useEffect(() => {
    storage.saveWorkers(workers);
  }, [workers]);

  // Save attendance log whenever it changes
  useEffect(() => {
    console.log("[v0] Saving attendance log to localStorage:", attendanceLog);
    storage.saveAttendanceLog(attendanceLog);
  }, [attendanceLog]);

  // Save payments whenever they change
  useEffect(() => {
    storage.savePayments(payments);
  }, [payments]);

  const handleUpdateStatus = (workerId: string, status: AttendanceStatus | null) => {
    setWorkers(workers.map(w => w.id === workerId ? { ...w, currentStatus: status } : w));
    
    // Also add to attendance log if status is being set
    if (status) {
      const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const worker = workers.find(w => w.id === workerId);
      
      if (worker) {
        // Check if attendance already marked for today
        const existingLog = attendanceLog[workerId] || [];
        const alreadyMarked = existingLog.some(log => log.date === today);
        
        if (alreadyMarked) {
          return; // Already marked for today
        }
        
        let pay = 0;
        if (status === 'Present') pay = worker.dailyRate;
        
        const newRecord: AttendanceRecord = {
          id: Date.now().toString(),
          date: today,
          status,
          pay
        };
        
        const updatedLog = {
          ...attendanceLog,
          [workerId]: [newRecord, ...(attendanceLog[workerId] || [])].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        };
        
        setAttendanceLog(updatedLog);
      }
    }
  };

  const handleMarkAll = (status: AttendanceStatus) => {
    setWorkers(workers.map(w => ({ ...w, currentStatus: status })));
  };

  const handleResetAll = () => {
    setWorkers(workers.map(w => ({ ...w, currentStatus: null })));
  };

  const handleWorkerClick = (worker: Worker) => {
    setSelectedWorkerId(worker.id);
    setCurrentView('worker');
  };

  const handleAddWorker = (workerData: Omit<Worker, 'id' | 'currentStatus'>) => {
    const newWorker: Worker = {
      ...workerData,
      id: Date.now().toString(),
      currentStatus: null
    };
    setWorkers([...workers, newWorker]);
    setAttendanceLog({ ...attendanceLog, [newWorker.id]: [] });
    setPayments({ ...payments, [newWorker.id]: [] });
  };

  const handleEditWorker = (workerId: string, updates: Partial<Worker>) => {
    setWorkers(workers.map(w => w.id === workerId ? { ...w, ...updates } : w));
  };

  const handleDeleteWorker = (workerId: string) => {
    setWorkers(workers.filter(w => w.id !== workerId));
    const newAttendanceLog = { ...attendanceLog };
    const newPayments = { ...payments };
    delete newAttendanceLog[workerId];
    delete newPayments[workerId];
    setAttendanceLog(newAttendanceLog);
    setPayments(newPayments);
    setCurrentView('dashboard');
    setSelectedWorkerId(null);
  };

  const selectedWorker = workers.find(w => w.id === selectedWorkerId);
  const workerAttendance = selectedWorkerId ? (attendanceLog[selectedWorkerId] || []) : [];
  const workerPayments = selectedWorkerId ? (payments[selectedWorkerId] || []) : [];

  const handleMarkAttendance = (status: AttendanceStatus, dateStr?: string) => {
    if (!selectedWorkerId || !selectedWorker) return;
    
    const dateToUse = dateStr || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    if (workerAttendance.some(log => log.date === dateToUse)) {
      alert(`Attendance already marked for ${dateToUse}!`);
      return;
    }

    let pay = 0;
    if (status === 'Present') pay = selectedWorker.dailyRate;
    
    const newRecord: AttendanceRecord = {
      id: Date.now().toString(),
      date: dateToUse,
      status,
      pay
    };
    
    const updatedLog = {
      ...attendanceLog,
      [selectedWorkerId]: [newRecord, ...workerAttendance].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    };
    
    setAttendanceLog(updatedLog);
    
    // Also update current status on dashboard if the date is today
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    if (dateToUse === today) {
      handleUpdateStatus(selectedWorkerId, status);
    }
  };

  const handleEditAttendance = (workerId: string, recordId: string, updates: Partial<AttendanceRecord>) => {
    setAttendanceLog({
      ...attendanceLog,
      [workerId]: attendanceLog[workerId].map(log => log.id === recordId ? { ...log, ...updates } : log)
    });
  };

  const handleDeleteAttendance = (workerId: string, recordId: string) => {
    setAttendanceLog({
      ...attendanceLog,
      [workerId]: attendanceLog[workerId].filter(log => log.id !== recordId)
    });
  };

  const handleEditPayment = (workerId: string, recordId: string, updates: Partial<PaymentRecord>) => {
    setPayments({
      ...payments,
      [workerId]: payments[workerId].map(p => p.id === recordId ? { ...p, ...updates } : p)
    });
  };

  const handleDeletePayment = (workerId: string, recordId: string) => {
    setPayments({
      ...payments,
      [workerId]: payments[workerId].filter(p => p.id !== recordId)
    });
  };

  const handleAddPayment = (description: string, amount: number, dateStr?: string) => {
    if (!selectedWorkerId) return;
    const dateToUse = dateStr || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const newPayment: PaymentRecord = {
      id: Date.now().toString(),
      date: dateToUse,
      description,
      amount
    };
    setPayments({
      ...payments,
      [selectedWorkerId]: [newPayment, ...workerPayments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    });
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <Header currentView={currentView} onViewChange={setCurrentView} />
        <main className="flex-1 px-4 md:px-10 py-6 max-w-5xl mx-auto w-full pb-6">
          {currentView === 'dashboard' ? (
            <Dashboard 
              workers={workers}
              onUpdateStatus={handleUpdateStatus}
              onMarkAll={handleMarkAll}
              onResetAll={handleResetAll}
              onWorkerClick={handleWorkerClick}
              onAddWorker={handleAddWorker}
            />
          ) : (
            selectedWorker ? (
              <div className="space-y-6">
                <WorkerInfo 
                  worker={selectedWorker} 
                  onMarkAttendance={handleMarkAttendance} 
                  onAddPayment={handleAddPayment}
                  onEditWorker={handleEditWorker}
                  onDeleteWorker={handleDeleteWorker}
                />
                <Summary attendanceLog={workerAttendance} payments={workerPayments} />
                <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
                
                {activeTab === 'attendance' && (
                  <AttendanceTable 
                    logs={workerAttendance} 
                    onEdit={(recordId, updates) => handleEditAttendance(selectedWorker.id, recordId, updates)}
                    onDelete={(recordId) => handleDeleteAttendance(selectedWorker.id, recordId)}
                  />
                )}
                {activeTab === 'payments' && (
                  <PaymentsTable 
                    payments={workerPayments} 
                    onAddPayment={handleAddPayment} 
                    onEdit={(recordId, updates) => handleEditPayment(selectedWorker.id, recordId, updates)}
                    onDelete={(recordId) => handleDeletePayment(selectedWorker.id, recordId)}
                  />
                )}
              </div>
            ) : (
              <div className="text-center py-20 text-slate-500">
                Please select a worker from the dashboard.
              </div>
            )
          )}
        </main>
      </div>
    </div>
  );
}
