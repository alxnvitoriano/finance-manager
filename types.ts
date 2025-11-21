export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;
  sourceOrDest: string; // "Origem" for income, "Destino" for expense
  date: string; // ISO Date string
  note?: string;
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color: string;
}

export type ViewState = 'dashboard' | 'transactions' | 'categories';
