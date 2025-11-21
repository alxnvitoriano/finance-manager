import React from 'react';
import { ViewState } from '../types';
import { LayoutDashboard, History, Tags, DollarSign, Menu, X } from 'lucide-react';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
  onOpenModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, isOpen, toggleSidebar, onOpenModal }) => {

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Histórico', icon: History },
    { id: 'categories', label: 'Categorias', icon: Tags },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 rounded-lg text-white border border-gray-700"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 left-0 h-full bg-gray-900 border-r border-gray-800 w-64 z-40 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
      `}>
        <div className="p-6">
          <div className="flex items-center gap-2 text-neon-400 mb-8">
            <DollarSign size={32} className="bg-neon-500/10 p-1 rounded-lg" />
            <h1 className="text-2xl font-bold tracking-tight text-white">vtn finance</h1>
          </div>

          <button
            onClick={() => { onOpenModal(); if (window.innerWidth < 768) toggleSidebar(); }}
            className="w-full bg-neon-500 hover:bg-neon-400 text-dark-950 font-bold py-3 px-4 rounded-xl mb-8 flex items-center justify-center gap-2 transition-colors shadow-lg shadow-neon-500/20"
          >
            <DollarSign size={20} />
            <span>Nova Transação</span>
          </button>

          <nav className="space-y-2">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { onChangeView(item.id as ViewState); if (window.innerWidth < 768) toggleSidebar(); }}
                  className={`
                                w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                                ${isActive ? 'bg-gray-800 text-neon-400 border-l-4 border-neon-500' : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'}
                            `}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        <div className="absolute bottom-0 w-full p-6 border-t border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 font-bold">
              U
            </div>
            <div>
              <p className="text-sm font-medium text-white">Usuário Demo</p>
              <p className="text-xs text-gray-500">Free Plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};
