import { supabase } from './supabase';
import { Transaction, Category } from '../types';
import { DEFAULT_CATEGORIES } from '../constants';

export const getTransactions = async (): Promise<Transaction[]> => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
  return data || [];
};

export const addTransaction = async (transaction: Transaction) => {
  const { error } = await supabase.from('transactions').insert(transaction);
  if (error) throw error;
};

export const deleteTransaction = async (id: string) => {
  const { error } = await supabase.from('transactions').delete().eq('id', id);
  if (error) throw error;
};

export const getCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase.from('categories').select('*');

  if (error) {
    console.error('Error fetching categories:', error);
    return DEFAULT_CATEGORIES;
  }

  if (!data || data.length === 0) {
    // If no categories in DB, insert defaults (optional, or just return defaults)
    // For now, let's just return defaults if empty, or maybe we should seed them?
    // Let's return DEFAULT_CATEGORIES if empty to be safe for now.
    return DEFAULT_CATEGORIES;
  }

  return data;
};

export const addCategory = async (category: Category) => {
  const { error } = await supabase.from('categories').insert(category);
  if (error) throw error;
};

export const deleteCategory = async (id: string) => {
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw error;
};
