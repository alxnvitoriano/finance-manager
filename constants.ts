import { Category, Transaction, TransactionType } from './types';

export const DEFAULT_CATEGORIES: Category[] = [
  // Income
  { id: 'c1', name: 'Vendas', type: TransactionType.INCOME, color: '#4ade80' },
  { id: 'c2', name: 'Salário', type: TransactionType.INCOME, color: '#22c55e' },
  { id: 'c3', name: 'Investimentos', type: TransactionType.INCOME, color: '#86efac' },
  // Expense
  { id: 'c4', name: 'Aluguel', type: TransactionType.EXPENSE, color: '#f87171' },
  { id: 'c5', name: 'Alimentação', type: TransactionType.EXPENSE, color: '#fb923c' },
  { id: 'c6', name: 'Transporte', type: TransactionType.EXPENSE, color: '#60a5fa' },
  { id: 'c7', name: 'Serviços', type: TransactionType.EXPENSE, color: '#a78bfa' },
  { id: 'c8', name: 'Ferramentas', type: TransactionType.EXPENSE, color: '#94a3b8' },
];


