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
import * as db from './lib/supabase';

export default function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'worker'>('dashboard');
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'attendance' | 'payments'>('attendance');
  const [loading, setLoading] = useState(true);
  
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [attendanceLog, setAttendanceLog] = useState<Record<string, AttendanceRecord[]>>({});
  const [payments, setPayments] = useState<Record<string, PaymentRecord[]>>({});

  // Load all data from database on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const workersData = await db.getWorkers();
        
        // Convert database workers to app format
        const formattedWorkers: Worker[] = workersData.map((w: any) => ({
          id: w.id,
          name: w.name,
          role: w.role,
          dailyRate: w.daily_rate,
          currentStatus: null
        }));
        
        setWorkers(formattedWorkers);

        // Load attendance and payments for each worker
        const attendanceData: Record<string, AttendanceRecord[]> = {};
        const paymentsData: Record<string, PaymentRecord[]> = {};

        for (const worker of formattedWorkers) {
          const attRecords = await db.getAttendanceByWorker(worker.id);
          attendanceData[worker.id] = attRecords.map((a: any) => ({
            id: a.id,
            date: a.date,
            status: a.status,
            pay: a.pay
          }));

          const paymentRecords = await db.getPaymentsByWorker(worker.id);
          paymentsData[worker.id] = paymentRecords.map((p: any) => ({
            id: p.id,
            date: p.date,
            description: p.description,
            amount: p.amount
          }));
        }

        setAttendanceLog(attendanceData);
        setPayments(paymentsData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

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

  const handleAddWorker = async (workerData: Omit<Worker, 'id' | 'currentStatus'>) => {
    try {
      const newWorkerDb = await db.addWorker(workerData.name, workerData.role, workerData.dailyRate);
      const newWorker: Worker = {
        id: newWorkerDb.id,
        name: newWorkerDb.name,
        role: newWorkerDb.role,
        dailyRate: newWorkerDb.daily_rate,
        currentStatus: null
      };
      setWorkers([...workers, newWorker]);
      setAttendanceLog({ ...attendanceLog, [newWorker.id]: [] });
      setPayments({ ...payments, [newWorker.id]: [] });
    } catch (error) {
      console.error('Error adding worker:', error);
      alert('Failed to add worker');
    }
  };

  const handleEditWorker = async (workerId: string, updates: Partial<Worker>) => {
    try {
      const worker = workers.find(w => w.id === workerId);
      if (!worker) return;

      await db.updateWorker(
        workerId,
        updates.name || worker.name,
        updates.role || worker.role,
        updates.dailyRate || worker.dailyRate
      );

      setWorkers(workers.map(w => w.id === workerId ? { ...w, ...updates } : w));
    } catch (error) {
      console.error('Error editing worker:', error);
      alert('Failed to update worker');
    }
  };

  const handleDeleteWorker = async (workerId: string) => {
    try {
      await db.deleteWorker(workerId);
      setWorkers(workers.filter(w => w.id !== workerId));
      const newAttendanceLog = { ...attendanceLog };
      const newPayments = { ...payments };
      delete newAttendanceLog[workerId];
      delete newPayments[workerId];
      setAttendanceLog(newAttendanceLog);
      setPayments(newPayments);
      setCurrentView('dashboard');
      setSelectedWorkerId(null);
    } catch (error) {
      console.error('Error deleting worker:', error);
      alert('Failed to delete worker');
    }
  };

  const selectedWorker = workers.find(w => w.id === selectedWorkerId);
  const workerAttendance = selectedWorkerId ? (attendanceLog[selectedWorkerId] || []) : [];
  const workerPayments = selectedWorkerId ? (payments[selectedWorkerId] || []) : [];

  const handleMarkAttendance = async (status: AttendanceStatus, dateStr?: string) => {
    if (!selectedWorkerId || !selectedWorker) return;
    
    const dateToUse = dateStr || new Date().toISOString().split('T')[0];
    
    if (workerAttendance.some(log => log.date === dateToUse)) {
      alert(`Attendance already marked for ${dateToUse}!`);
      return;
    }

    let pay = 0;
    if (status === 'Present') pay = selectedWorker.dailyRate;
    if (status === 'Half day') pay = selectedWorker.dailyRate / 2;

    try {
      const newRecord = await db.addAttendance(selectedWorkerId, dateToUse, status, pay);
      
      const newAttendanceRecord: AttendanceRecord = {
        id: newRecord.id,
        date: newRecord.date,
        status: newRecord.status,
        pay: newRecord.pay
      };

      setAttendanceLog({
        ...attendanceLog,
        [selectedWorkerId]: [newAttendanceRecord, ...workerAttendance].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      });
      
      // Also update current status on dashboard if the date is today
      const today = new Date().toISOString().split('T')[0];
      if (dateToUse === today) {
        handleUpdateStatus(selectedWorkerId, status);
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
      alert('Failed to mark attendance');
    }
  };

  const handleEditAttendance = async (workerId: string, recordId: string, updates: Partial<AttendanceRecord>) => {
    try {
      const currentRecord = attendanceLog[workerId].find(log => log.id === recordId);
      if (!currentRecord) return;

      await db.updateAttendance(
        recordId,
        updates.date || currentRecord.date,
        updates.status || currentRecord.status,
        updates.pay !== undefined ? updates.pay : currentRecord.pay
      );

      setAttendanceLog({
        ...attendanceLog,
        [workerId]: attendanceLog[workerId].map(log => log.id === recordId ? { ...log, ...updates } : log)
      });
    } catch (error) {
      console.error('Error editing attendance:', error);
      alert('Failed to update attendance');
    }
  };

  const handleDeleteAttendance = async (workerId: string, recordId: string) => {
    try {
      await db.deleteAttendance(recordId);
      setAttendanceLog({
        ...attendanceLog,
        [workerId]: attendanceLog[workerId].filter(log => log.id !== recordId)
      });
    } catch (error) {
      console.error('Error deleting attendance:', error);
      alert('Failed to delete attendance');
    }
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
