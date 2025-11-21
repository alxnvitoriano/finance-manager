import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { History } from './components/History';
import { CategoryManager } from './components/CategoryManager';
import { TransactionModal } from './components/TransactionModal';
import { Transaction, ViewState, Category } from './types';
import { getTransactions, saveTransactions, getCategories, saveCategories } from './services/storage';

function App() {
  // State
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Load data on mount
  useEffect(() => {
    setTransactions(getTransactions());
    setCategories(getCategories());
  }, []);

  // CRUD Operations
  const handleSaveTransaction = (data: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      id: Date.now().toString(),
      ...data
    };
    const updated = [newTx, ...transactions];
    setTransactions(updated);
    saveTransactions(updated);
  };

  const handleDeleteTransaction = (id: string) => {
    const updated = transactions.filter(t => t.id !== id);
    setTransactions(updated);
    saveTransactions(updated);
  };

  const handleAddCategory = (category: Category) => {
    const updated = [...categories, category];
    setCategories(updated);
    saveCategories(updated);
  };

  const handleDeleteCategory = (id: string) => {
    const updated = categories.filter(c => c.id !== id);
    setCategories(updated);
    saveCategories(updated);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex font-sans antialiased">
      <Sidebar
        currentView={currentView}
        onChangeView={setCurrentView}
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onOpenModal={() => setIsModalOpen(true)}
      />

      <main className="flex-1 md:ml-64 min-h-screen flex flex-col">
        {/* Top Mobile Bar (Spacer and Title) */}
        <header className="md:hidden bg-gray-900 p-4 flex items-center justify-center border-b border-gray-800">
          <span className="text-neon-400 font-bold">VTN FINANCE</span>
        </header>

        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full flex-1">
          {currentView === 'dashboard' && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold mb-6 text-white">Visão Geral</h2>
              <Dashboard transactions={transactions} />
            </div>
          )}

          {currentView === 'transactions' && (
            <div className="animate-fade-in">
              <History transactions={transactions} onDelete={handleDeleteTransaction} />
            </div>
          )}

          {currentView === 'categories' && (
            <div className="animate-fade-in">
              <CategoryManager
                categories={categories}
                onAdd={handleAddCategory}
                onDelete={handleDeleteCategory}
              />
            </div>
          )}
        </div>
      </main>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTransaction}
        categories={categories}
      />
    </div>
  );
}

export default App;
