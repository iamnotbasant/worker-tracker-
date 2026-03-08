/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Header } from './components/Header';
import { WorkerInfo } from './components/WorkerInfo';
import { Tabs } from './components/Tabs';
import { AttendanceTable } from './components/AttendanceTable';
import { PaymentsTable } from './components/PaymentsTable';
import { Summary } from './components/Summary';
import { Dashboard } from './components/Dashboard';
import { AttendanceRecord, PaymentRecord, Worker, AttendanceStatus } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'worker'>('dashboard');
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'attendance' | 'payments'>('attendance');
  
  const [workers, setWorkers] = useState<Worker[]>([
    { id: '1', name: 'Ramesh Kumar', role: 'Mistri', dailyRate: 850, currentStatus: 'Present' },
    { id: '2', name: 'Sunil Yadav', role: 'Labour', dailyRate: 650, currentStatus: 'Half day' },
    { id: '3', name: 'Pooja Devi', role: 'Helper', dailyRate: 450, currentStatus: 'Absent' },
    { id: '4', name: 'Abdul Khan', role: 'Labour', dailyRate: 650, currentStatus: null },
  ]);

  const [attendanceLog, setAttendanceLog] = useState<Record<string, AttendanceRecord[]>>({
    '1': [
      { id: '1', date: 'Oct 27, 2023', status: 'Present', pay: 850 },
      { id: '2', date: 'Oct 26, 2023', status: 'Absent', pay: 0 },
    ],
    '2': [
      { id: '3', date: 'Oct 27, 2023', status: 'Half day', pay: 325 },
    ]
  });

  const [payments, setPayments] = useState<Record<string, PaymentRecord[]>>({
    '1': [
      { id: '1', date: 'Oct 26, 2023', description: 'Weekly Advance', amount: 1000 },
    ]
  });

  const handleUpdateStatus = (workerId: string, status: AttendanceStatus | null) => {
    setWorkers(workers.map(w => w.id === workerId ? { ...w, currentStatus: status } : w));
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
  };

  const handleEditWorker = (workerId: string, updates: Partial<Worker>) => {
    setWorkers(workers.map(w => w.id === workerId ? { ...w, ...updates } : w));
  };

  const handleDeleteWorker = (workerId: string) => {
    setWorkers(workers.filter(w => w.id !== workerId));
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
    if (status === 'Half day') pay = selectedWorker.dailyRate / 2;

    const newRecord: AttendanceRecord = {
      id: Date.now().toString(),
      date: dateToUse,
      status,
      pay
    };

    setAttendanceLog({
      ...attendanceLog,
      [selectedWorkerId]: [newRecord, ...workerAttendance].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    });
    
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
