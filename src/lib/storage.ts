import { Worker, AttendanceRecord, PaymentRecord } from '../types';

const STORAGE_KEYS = {
  WORKERS: 'worker-tracker-workers',
  ATTENDANCE: 'worker-tracker-attendance',
  PAYMENTS: 'worker-tracker-payments',
};

// Workers
export const getWorkers = (): Worker[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.WORKERS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading workers from storage:', error);
    return [];
  }
};

export const saveWorkers = (workers: Worker[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.WORKERS, JSON.stringify(workers));
  } catch (error) {
    console.error('Error saving workers to storage:', error);
  }
};

// Attendance
export const getAttendanceLog = (): Record<string, AttendanceRecord[]> => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error reading attendance from storage:', error);
    return {};
  }
};

export const saveAttendanceLog = (log: Record<string, AttendanceRecord[]>): void => {
  try {
    console.log("[v0] Saving attendance log to localStorage:", log);
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(log));
  } catch (error) {
    console.error('Error saving attendance to storage:', error);
  }
};

// Payments
export const getPayments = (): Record<string, PaymentRecord[]> => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error reading payments from storage:', error);
    return {};
  }
};

export const savePayments = (payments: Record<string, PaymentRecord[]>): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
  } catch (error) {
    console.error('Error saving payments to storage:', error);
  }
};

// Clear all data
export const clearAllData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.WORKERS);
    localStorage.removeItem(STORAGE_KEYS.ATTENDANCE);
    localStorage.removeItem(STORAGE_KEYS.PAYMENTS);
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
};
