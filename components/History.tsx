import React, { useState, useMemo } from 'react';
import { Transaction, TransactionType } from '../types';
import { Card } from './ui/Card';
import { ArrowDownCircle, ArrowUpCircle, Search, Download, Filter, Trash2 } from 'lucide-react';

interface HistoryProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export const History: React.FC<HistoryProps> = ({ transactions, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('');

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = 
        t.sourceOrDest.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.note && t.note.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesType = typeFilter === 'all' ? true : t.type === typeFilter;
      const matchesCategory = categoryFilter ? t.category === categoryFilter : true;

      return matchesSearch && matchesType && matchesCategory;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, searchTerm, typeFilter, categoryFilter]);

  const uniqueCategories = useMemo(() => {
    return Array.from(new Set(transactions.map(t => t.category)));
  }, [transactions]);

  const handleExport = () => {
    const headers = ['ID,Data,Tipo,Categoria,Origem/Destino,Valor,Observacao'];
    const csvContent = filteredTransactions.map(t => 
      `${t.id},${t.date},${t.type},${t.category},"${t.sourceOrDest}",${t.amount},"${t.note || ''}"`
    ).join('\n');
    
    const blob = new Blob([headers + '\n' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'finflux_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-white">Histórico de Transações</h2>
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-200 px-4 py-2 rounded-lg transition-colors"
        >
          <Download size={18} />
          <span>Exportar CSV</span>
        </button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Buscar..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-gray-200 focus:outline-none focus:border-neon-500"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
            <select 
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-gray-200 appearance-none focus:outline-none focus:border-neon-500"
            >
              <option value="all">Todos os Tipos</option>
              <option value="income">Entradas</option>
              <option value="expense">Saídas</option>
            </select>
          </div>

          <div className="relative">
             <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-200 appearance-none focus:outline-none focus:border-neon-500"
            >
              <option value="">Todas as Categorias</option>
              {uniqueCategories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center text-gray-400 text-sm justify-end">
            Total: {filteredTransactions.length} registros
          </div>
        </div>
      </Card>

      {/* List */}
      <div className="space-y-3">
        {filteredTransactions.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
                Nenhuma transação encontrada.
            </div>
        ) : (
            filteredTransactions.map(transaction => (
            <div 
                key={transaction.id} 
                className="bg-gray-800 hover:bg-gray-750 border border-gray-700 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 transition-all"
            >
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className={`p-3 rounded-full ${
                        transaction.type === TransactionType.INCOME ? 'bg-green-500/10 text-neon-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                        {transaction.type === TransactionType.INCOME ? <ArrowUpCircle size={24} /> : <ArrowDownCircle size={24} />}
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-100">{transaction.sourceOrDest}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <span className="bg-gray-700 px-2 py-0.5 rounded text-xs">{transaction.category}</span>
                            <span>•</span>
                            <span>{new Date(transaction.date).toLocaleDateString('pt-BR')}</span>
                        </div>
                        {transaction.note && (
                          <p className="text-xs text-gray-500 mt-1 italic">"{transaction.note}"</p>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-between w-full md:w-auto gap-6">
                    <span className={`text-lg font-bold ${
                        transaction.type === TransactionType.INCOME ? 'text-neon-400' : 'text-red-400'
                    }`}>
                        {transaction.type === TransactionType.INCOME ? '+' : '-'} R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    <button 
                        onClick={() => onDelete(transaction.id)}
                        className="text-gray-500 hover:text-red-400 p-2 hover:bg-red-400/10 rounded-full transition-colors"
                        title="Excluir"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
            ))
        )}
      </div>
    </div>
  );
};
