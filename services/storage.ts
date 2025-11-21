import { Transaction, Category } from '../types';
import { DEFAULT_CATEGORIES } from '../constants';

const STORAGE_KEYS = {
  TRANSACTIONS: 'finflux_transactions',
  CATEGORIES: 'finflux_categories',
};

export const getTransactions = (): Transaction[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
  if (!stored) {
    // Initialize with mock data if empty
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify([]));
    return [];
  }
  return JSON.parse(stored);
};

export const saveTransactions = (transactions: Transaction[]) => {
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
};

export const getCategories = (): Category[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
    return DEFAULT_CATEGORIES;
  }
  return JSON.parse(stored);
};

export const saveCategories = (categories: Category[]) => {
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
};
