import React, { useState, useEffect } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { TransactionType, Category } from '../types';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  categories: Category[];
}

export const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose, onSave, categories }) => {
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [sourceOrDest, setSourceOrDest] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');

  // Reset form when opened
  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setSourceOrDest('');
      setNote('');
      setDate(new Date().toISOString().split('T')[0]);
      // Set default category based on type
      const defaultCat = categories.find(c => c.type === type);
      if (defaultCat) setCategory(defaultCat.name);
    }
  }, [isOpen, type, categories]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category || !sourceOrDest) return;

    onSave({
      type,
      amount: parseFloat(amount),
      category,
      sourceOrDest,
      date: new Date(date).toISOString(),
      note
    });
    onClose();
  };

  const filteredCategories = categories.filter(c => c.type === type);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h3 className="text-xl font-bold text-white">Nova Transação</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Type Toggle */}
        <div className="grid grid-cols-2 p-4 gap-4 bg-gray-800/50">
            <button
                type="button"
                onClick={() => setType(TransactionType.INCOME)}
                className={`py-2 rounded-lg font-medium transition-all ${
                    type === TransactionType.INCOME 
                    ? 'bg-green-500/20 text-neon-400 border border-neon-500' 
                    : 'text-gray-400 hover:bg-gray-800'
                }`}
            >
                Entrada
            </button>
            <button
                type="button"
                onClick={() => setType(TransactionType.EXPENSE)}
                className={`py-2 rounded-lg font-medium transition-all ${
                    type === TransactionType.EXPENSE 
                    ? 'bg-red-500/20 text-red-400 border border-red-400' 
                    : 'text-gray-400 hover:bg-gray-800'
                }`}
            >
                Saída
            </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Valor</label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">R$</span>
                    <input 
                        type="number" 
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0,00"
                        className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-12 pr-4 py-3 text-xl font-bold text-white focus:outline-none focus:border-neon-500 transition-colors"
                        autoFocus
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Data</label>
                    <input 
                        type="date" 
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-200 focus:outline-none focus:border-neon-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Categoria</label>
                    <select 
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-200 focus:outline-none focus:border-neon-500 appearance-none"
                        required
                    >
                        {filteredCategories.map(c => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                    {type === TransactionType.INCOME ? 'Origem (Quem pagou?)' : 'Destino (Onde gastou?)'}
                </label>
                <input 
                    type="text" 
                    value={sourceOrDest}
                    onChange={(e) => setSourceOrDest(e.target.value)}
                    placeholder={type === TransactionType.INCOME ? 'Ex: Cliente A, Reembolso...' : 'Ex: Supermercado, Posto...'}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-200 focus:outline-none focus:border-neon-500"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Observações (Opcional)</label>
                <textarea 
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={2}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-200 focus:outline-none focus:border-neon-500 resize-none"
                />
            </div>

            <button 
                type="submit" 
                className={`w-full py-3 rounded-xl font-bold text-dark-950 flex items-center justify-center gap-2 mt-4 transition-transform active:scale-95 ${
                    type === TransactionType.INCOME ? 'bg-neon-500 hover:bg-neon-400' : 'bg-red-500 hover:bg-red-400'
                }`}
            >
                <span>Salvar {type === TransactionType.INCOME ? 'Entrada' : 'Saída'}</span>
                <ArrowRight size={18} />
            </button>
        </form>
      </div>
    </div>
  );
};
