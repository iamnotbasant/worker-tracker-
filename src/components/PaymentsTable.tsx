import React, { useState } from 'react';
import { Banknote, X, Calendar, Trash2 } from 'lucide-react';
import { PaymentRecord } from '../types';

interface PaymentsTableProps {
  payments: PaymentRecord[];
  onAddPayment: (description: string, amount: number, date?: string) => void;
  onEdit: (recordId: string, updates: Partial<PaymentRecord>) => void;
  onDelete: (recordId: string) => void;
}

export function PaymentsTable({ payments, onAddPayment, onEdit, onDelete }: PaymentsTableProps) {
  const [showModal, setShowModal] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);

  const [editingPayment, setEditingPayment] = useState<PaymentRecord | null>(null);
  const [editDescription, setEditDescription] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editDate, setEditDate] = useState('');

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

  const handleRowClick = (payment: PaymentRecord) => {
    setEditingPayment(payment);
    setEditDescription(payment.description);
    setEditAmount(payment.amount.toString());
    // Convert "Oct 27, 2023" to "2023-10-27" for input type="date"
    const date = new Date(payment.date);
    if (!isNaN(date.getTime())) {
      setEditDate(date.toISOString().split('T')[0]);
    } else {
      setEditDate('');
    }
  };

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPayment && editAmount && !isNaN(Number(editAmount))) {
      const formattedDate = new Date(editDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      onEdit(editingPayment.id, {
        description: editDescription,
        amount: Number(editAmount),
        date: formattedDate
      });
      setEditingPayment(null);
    }
  };

  const handleDelete = () => {
    if (editingPayment && window.confirm('Are you sure you want to delete this payment record?')) {
      onDelete(editingPayment.id);
      setEditingPayment(null);
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark shadow-sm overflow-hidden hover:shadow-md transition-all duration-200">
        <div className="p-5 md:p-6 border-b border-border-light dark:border-border-dark bg-slate-50/60 dark:bg-slate-900/20 flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">Payments Made</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track payment transactions</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="text-primary text-xs md:text-sm font-bold flex items-center gap-2 hover:bg-primary/10 px-3 py-2 rounded-lg transition-colors"
          >
            <Banknote size={16} />
            Add Payment
          </button>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400 text-xs uppercase tracking-widest border-b border-border-light dark:border-border-dark">
              <tr>
                <th className="px-5 md:px-6 py-4 font-semibold">Date</th>
                <th className="px-5 md:px-6 py-4 font-semibold">Description</th>
                <th className="px-5 md:px-6 py-4 font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light dark:divide-border-dark">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-5 md:px-6 py-12 text-center text-slate-400 dark:text-slate-500">
                    <p className="font-medium">No payment records yet</p>
                    <p className="text-sm mt-1">Add payments to track transactions</p>
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr 
                    key={payment.id} 
                    className="hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-200 cursor-pointer"
                    onDoubleClick={() => handleRowClick(payment)}
                    title="Double click to edit"
                  >
                    <td className="px-5 md:px-6 py-4 text-sm font-medium text-slate-700 dark:text-slate-300">{payment.date}</td>
                    <td className="px-5 md:px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{payment.description}</td>
                    <td className="px-5 md:px-6 py-4 text-sm font-bold text-right text-red-600 dark:text-red-400">-₹{payment.amount.toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-border-light dark:border-border-dark">
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

      {editingPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-border-light dark:border-border-dark">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Edit Payment</h3>
              <button onClick={() => setEditingPayment(null)} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleEditSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Date</label>
                <input 
                  type="date" 
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Description</label>
                <input 
                  type="text" 
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Amount (₹)</label>
                <input 
                  type="number" 
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 dark:text-white"
                  required
                />
              </div>
              <div className="pt-2 flex gap-3">
                <button type="button" onClick={handleDelete} className="flex-1 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg font-bold hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors flex items-center justify-center gap-2">
                  <Trash2 size={18} />
                  Delete
                </button>
                <button type="submit" className="flex-[2] py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
