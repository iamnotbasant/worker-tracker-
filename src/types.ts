export type AttendanceStatus = 'Present' | 'Half day' | 'Absent';
export type WorkerRole = 'Mistri' | 'Labour' | 'Helper';

export interface AttendanceRecord {
  id: string;
  date: string;
  status: AttendanceStatus;
  pay: number;
}

export interface PaymentRecord {
  id: string;
  date: string;
  description: string;
  amount: number;
}

export interface Worker {
  id: string;
  name: string;
  location: string;
  role: WorkerRole;
  dailyRate: number;
  currentStatus?: AttendanceStatus | null;
}
