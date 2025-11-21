import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { History } from './components/History';
import { CategoryManager } from './components/CategoryManager';
import { TransactionModal } from './components/TransactionModal';
import { Login } from './components/Login';
import { Transaction, ViewState, Category } from './types';
import {
  getTransactions,
  addTransaction,
  deleteTransaction,
  getCategories,
  addCategory,
  deleteCategory
} from './services/storage';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { user, loading, signOut } = useAuth();

  // State
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Load data on mount or when user changes
  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      const [txs, cats] = await Promise.all([
        getTransactions(),
        getCategories()
      ]);
      setTransactions(txs);
      setCategories(cats);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  // CRUD Operations
  const handleSaveTransaction = async (data: Omit<Transaction, 'id'>) => {
    try {
      const newTx: Transaction = {
        id: crypto.randomUUID(),
        ...data
      };

      // Optimistic update
      setTransactions(prev => [newTx, ...prev]);

      await addTransaction(newTx);
      // Optionally reload to confirm
      // loadData(); 
    } catch (error) {
      console.error('Error saving transaction:', error);
      // Rollback if needed
      loadData();
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      // Optimistic update
      setTransactions(prev => prev.filter(t => t.id !== id));

      await deleteTransaction(id);
    } catch (error) {
      console.error('Error deleting transaction:', error);
      loadData();
    }
  };

  const handleAddCategory = async (category: Category) => {
    try {
      // Optimistic update
      setCategories(prev => [...prev, category]);

      await addCategory(category);
    } catch (error) {
      console.error('Error adding category:', error);
      loadData();
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      // Optimistic update
      setCategories(prev => prev.filter(c => c.id !== id));

      await deleteCategory(id);
    } catch (error) {
      console.error('Error deleting category:', error);
      loadData();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex font-sans antialiased">
      <Sidebar
        currentView={currentView}
        onChangeView={setCurrentView}
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onOpenModal={() => setIsModalOpen(true)}
        onSignOut={signOut}
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
