import React, { useState } from 'react';
import { Category, TransactionType } from '../types';
import { Card } from './ui/Card';
import { Trash2, Plus, Tag } from 'lucide-react';

interface CategoryManagerProps {
  categories: Category[];
  onAdd: (category: Category) => void;
  onDelete: (id: string) => void;
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({ categories, onAdd, onDelete }) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryType, setNewCategoryType] = useState<TransactionType>(TransactionType.EXPENSE);

  const handleAdd = () => {
    if (!newCategoryName.trim()) return;
    
    const newCategory: Category = {
      id: Date.now().toString(),
      name: newCategoryName,
      type: newCategoryType,
      color: newCategoryType === TransactionType.INCOME ? '#4ade80' : '#f87171', // Default colors for simplicity
    };

    onAdd(newCategory);
    setNewCategoryName('');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-white">Gerenciar Categorias</h2>
      
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-200 mb-4">Adicionar Nova</h3>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input 
              type="text" 
              placeholder="Nome da categoria (ex: Freelance, Uber...)" 
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-neon-500"
            />
          </div>
          <select 
            value={newCategoryType}
            onChange={(e) => setNewCategoryType(e.target.value as TransactionType)}
            className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-neon-500"
          >
            <option value={TransactionType.INCOME}>Receita</option>
            <option value={TransactionType.EXPENSE}>Despesa</option>
          </select>
          <button 
            onClick={handleAdd}
            className="bg-neon-500 hover:bg-neon-400 text-dark-950 font-bold px-6 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Plus size={18} />
            <span>Adicionar</span>
          </button>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Income List */}
        <Card title="Categorias de Receita">
           <div className="space-y-2 mt-2">
             {categories.filter(c => c.type === TransactionType.INCOME).map(c => (
               <div key={c.id} className="flex items-center justify-between p-3 bg-gray-900 rounded-lg border border-gray-700">
                 <div className="flex items-center gap-3">
                   <div className="w-3 h-3 rounded-full bg-neon-500"></div>
                   <span className="text-gray-200">{c.name}</span>
                 </div>
                 <button 
                   onClick={() => onDelete(c.id)}
                   className="text-gray-500 hover:text-red-400 p-1"
                 >
                   <Trash2 size={16} />
                 </button>
               </div>
             ))}
           </div>
        </Card>

        {/* Expense List */}
        <Card title="Categorias de Despesa">
           <div className="space-y-2 mt-2">
             {categories.filter(c => c.type === TransactionType.EXPENSE).map(c => (
               <div key={c.id} className="flex items-center justify-between p-3 bg-gray-900 rounded-lg border border-gray-700">
                 <div className="flex items-center gap-3">
                   <div className="w-3 h-3 rounded-full bg-red-400"></div>
                   <span className="text-gray-200">{c.name}</span>
                 </div>
                 <button 
                   onClick={() => onDelete(c.id)}
                   className="text-gray-500 hover:text-red-400 p-1"
                 >
                   <Trash2 size={16} />
                 </button>
               </div>
             ))}
           </div>
        </Card>
      </div>
    </div>
  );
};
