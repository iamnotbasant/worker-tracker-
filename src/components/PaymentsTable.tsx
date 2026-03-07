import React, { useState } from 'react';
import { Banknote, X, Calendar } from 'lucide-react';
import { PaymentRecord } from '../types';

interface PaymentsTableProps {
  payments: PaymentRecord[];
  onAddPayment: (description: string, amount: number, date?: string) => void;
}

export function PaymentsTable({ payments, onAddPayment }: PaymentsTableProps) {
  const [showModal, setShowModal] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount && !isNaN(Number(amount))) {
      const formattedDate = new Date(paymentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      onAddPayment(description || 'Payment', Number(amount), formattedDate);
      setDescription('');
      setAmount('');
      setShowModal(false);
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-slate-800/50 rounded-xl border border-primary/10 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-primary/5 bg-slate-50/50 dark:bg-slate-800/30 flex justify-between items-center">
          <h3 className="font-bold text-slate-700 dark:text-slate-300">Payments Made</h3>
          <button 
            onClick={() => setShowModal(true)}
            className="text-primary text-xs font-bold flex items-center gap-1 hover:underline"
          >
            <Banknote size={14} />
            Add Payment
          </button>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-4 md:px-6 py-4 font-semibold">Date</th>
                <th className="px-4 md:px-6 py-4 font-semibold">Description</th>
                <th className="px-4 md:px-6 py-4 font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 md:px-6 py-8 text-center text-slate-500">No payment records found.</td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-primary/5 transition-colors">
                    <td className="px-4 md:px-6 py-4 text-sm">{payment.date}</td>
                    <td className="px-4 md:px-6 py-4 text-sm italic text-slate-500">{payment.description}</td>
                    <td className="px-4 md:px-6 py-4 text-sm font-bold text-right text-red-500">-₹{payment.amount.toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-sm shadow-xl border border-primary/10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Add Payment</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., Weekly Advance"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Amount (₹)</label>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
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
    </>
  );
}
