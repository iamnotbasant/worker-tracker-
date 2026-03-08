import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Worker operations
export const getWorkers = async () => {
  const { data, error } = await supabase
    .from('workers')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching workers:', error);
    return [];
  }
  
  return data || [];
};

export const addWorker = async (name: string, role: string, dailyRate: number) => {
  const { data, error } = await supabase
    .from('workers')
    .insert([
      {
        name,
        role,
        daily_rate: dailyRate,
      }
    ])
    .select()
    .single();
  
  if (error) {
    console.error('Error adding worker:', error);
    throw error;
  }
  
  return data;
};

export const updateWorker = async (id: string, name: string, role: string, dailyRate: number) => {
  const { data, error } = await supabase
    .from('workers')
    .update({
      name,
      role,
      daily_rate: dailyRate,
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating worker:', error);
    throw error;
  }
  
  return data;
};

export const deleteWorker = async (id: string) => {
  const { error } = await supabase
    .from('workers')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting worker:', error);
    throw error;
  }
};

// Attendance operations
export const getAttendanceByWorker = async (workerId: string) => {
  const { data, error } = await supabase
    .from('attendance')
    .select('*')
    .eq('worker_id', workerId)
    .order('date', { ascending: false });
  
  if (error) {
    console.error('Error fetching attendance:', error);
    return [];
  }
  
  return data || [];
};

export const addAttendance = async (workerId: string, date: string, status: string, pay: number) => {
  const { data, error } = await supabase
    .from('attendance')
    .insert([
      {
        worker_id: workerId,
        date,
        status,
        pay,
      }
    ])
    .select()
    .single();
  
  if (error) {
    console.error('Error adding attendance:', error);
    throw error;
  }
  
  return data;
};

export const updateAttendance = async (id: string, date: string, status: string, pay: number) => {
  const { data, error } = await supabase
    .from('attendance')
    .update({
      date,
      status,
      pay,
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating attendance:', error);
    throw error;
  }
  
  return data;
};

export const deleteAttendance = async (id: string) => {
  const { error } = await supabase
    .from('attendance')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting attendance:', error);
    throw error;
  }
};

// Payment operations
export const getPaymentsByWorker = async (workerId: string) => {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('worker_id', workerId)
    .order('date', { ascending: false });
  
  if (error) {
    console.error('Error fetching payments:', error);
    return [];
  }
  
  return data || [];
};

export const addPayment = async (workerId: string, date: string, description: string, amount: number) => {
  const { data, error } = await supabase
    .from('payments')
    .insert([
      {
        worker_id: workerId,
        date,
        description,
        amount,
      }
    ])
    .select()
    .single();
  
  if (error) {
    console.error('Error adding payment:', error);
    throw error;
  }
  
  return data;
};

export const updatePayment = async (id: string, date: string, description: string, amount: number) => {
  const { data, error } = await supabase
    .from('payments')
    .update({
      date,
      description,
      amount,
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating payment:', error);
    throw error;
  }
  
  return data;
};

export const deletePayment = async (id: string) => {
  const { error } = await supabase
    .from('payments')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting payment:', error);
    throw error;
  }
};
