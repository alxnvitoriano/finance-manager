import React, { useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar, Legend 
} from 'recharts';
import { Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Transaction, TransactionType } from '../types';
import { Card } from './ui/Card';

interface DashboardProps {
  transactions: Transaction[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 border border-gray-700 p-3 rounded shadow-xl text-sm">
        <p className="text-gray-200 font-bold mb-1">{label}</p>
        {payload.map((p: any, index: number) => (
          <p key={index} style={{ color: p.color }}>
            {p.name}: R$ {Number(p.value).toFixed(2)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const Dashboard: React.FC<DashboardProps> = ({ transactions }) => {
  // 1. Calculate Financial Summaries
  const summary = useMemo(() => {
    const income = transactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((acc, curr) => acc + curr.amount, 0);
    const expense = transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((acc, curr) => acc + curr.amount, 0);
    return {
      income,
      expense,
      balance: income - expense,
    };
  }, [transactions]);

  // 2. Prepare Chart Data - Timeline (Daily aggregation)
  const timelineData = useMemo(() => {
    const dataMap: Record<string, { date: string; income: number; expense: number }> = {};
    
    // Sort transactions by date
    const sortedTx = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    sortedTx.forEach(t => {
      const dateKey = new Date(t.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      if (!dataMap[dateKey]) {
        dataMap[dateKey] = { date: dateKey, income: 0, expense: 0 };
      }
      if (t.type === TransactionType.INCOME) {
        dataMap[dateKey].income += t.amount;
      } else {
        dataMap[dateKey].expense += t.amount;
      }
    });

    return Object.values(dataMap);
  }, [transactions]);

  // 3. Prepare Category Data
  const categoryData = useMemo(() => {
    const incomeMap: Record<string, number> = {};
    const expenseMap: Record<string, number> = {};

    transactions.forEach(t => {
      if (t.type === TransactionType.INCOME) {
        incomeMap[t.category] = (incomeMap[t.category] || 0) + t.amount;
      } else {
        expenseMap[t.category] = (expenseMap[t.category] || 0) + t.amount;
      }
    });

    const incomeData = Object.entries(incomeMap).map(([name, value]) => ({ name, value }));
    const expenseData = Object.entries(expenseMap).map(([name, value]) => ({ name, value }));

    return { income: incomeData, expense: expenseData };
  }, [transactions]);

  const COLORS = {
    income: ['#4ade80', '#22c55e', '#16a34a', '#15803d', '#bbf7d0'],
    expense: ['#f87171', '#ef4444', '#dc2626', '#b91c1c', '#fca5a5']
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10">
              <Wallet size={64} className="text-gray-100" />
           </div>
           <div className="relative z-10">
             <p className="text-gray-400 text-sm font-medium mb-1">Saldo Atual</p>
             <h2 className={`text-3xl font-bold ${summary.balance >= 0 ? 'text-white' : 'text-red-400'}`}>
               R$ {summary.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
             </h2>
             <p className="text-xs text-gray-500 mt-2">Receita - Despesas</p>
           </div>
        </Card>

        <Card className="relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10">
              <TrendingUp size={64} className="text-neon-400" />
           </div>
           <div className="relative z-10">
             <div className="flex items-center gap-2 mb-1">
                <div className="p-1 bg-green-500/20 rounded-full text-green-400">
                  <ArrowUpRight size={16} />
                </div>
                <p className="text-gray-400 text-sm font-medium">Receitas</p>
             </div>
             <h2 className="text-3xl font-bold text-neon-400">
               R$ {summary.income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
             </h2>
           </div>
        </Card>

        <Card className="relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10">
              <TrendingDown size={64} className="text-red-400" />
           </div>
           <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
                <div className="p-1 bg-red-500/20 rounded-full text-red-400">
                  <ArrowDownRight size={16} />
                </div>
                <p className="text-gray-400 text-sm font-medium">Despesas</p>
             </div>
             <h2 className="text-3xl font-bold text-red-400">
               R$ {summary.expense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
             </h2>
           </div>
        </Card>
      </div>

      {/* Main Chart - Cash Flow */}
      <Card title="Fluxo de Caixa" className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={timelineData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#4ade80" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f87171" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#f87171" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
                dataKey="date" 
                stroke="#6b7280" 
                tick={{fill: '#9ca3af'}} 
                tickLine={false} 
                axisLine={false}
            />
            <YAxis 
                stroke="#6b7280" 
                tick={{fill: '#9ca3af'}} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(value) => `R$${value/1000}k`}
            />
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area 
                type="monotone" 
                dataKey="income" 
                name="Receita"
                stroke="#4ade80" 
                fillOpacity={1} 
                fill="url(#colorIncome)" 
                strokeWidth={3}
            />
            <Area 
                type="monotone" 
                dataKey="expense" 
                name="Despesa"
                stroke="#f87171" 
                fillOpacity={1} 
                fill="url(#colorExpense)" 
                strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Bottom Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income Sources */}
        <Card title="Origem das Receitas" className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
                {categoryData.income.length > 0 ? (
                <PieChart>
                    <Pie
                        data={categoryData.income}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {categoryData.income.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS.income[index % COLORS.income.length]} stroke="none" />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" formatter={(value) => <span className="text-gray-300">{value}</span>} />
                </PieChart>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        Sem dados de receita
                    </div>
                )}
            </ResponsiveContainer>
        </Card>

        {/* Expense Categories */}
        <Card title="Destino dos Gastos" className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
                {categoryData.expense.length > 0 ? (
                <BarChart data={categoryData.expense} layout="vertical" margin={{ left: 20, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={100} tick={{fill: '#d1d5db', fontSize: 12}} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" name="Gasto" radius={[0, 4, 4, 0]}>
                        {categoryData.expense.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS.expense[index % COLORS.expense.length]} />
                        ))}
                    </Bar>
                </BarChart>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        Sem dados de despesa
                    </div>
                )}
            </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};
