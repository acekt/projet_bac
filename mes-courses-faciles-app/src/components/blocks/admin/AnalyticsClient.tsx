"use client";

import React from 'react';
import { Card } from '@/components/ui/card';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  BarChart3, 
  DollarSign, 
  ShoppingBag, 
  Percent,
  Calendar
} from 'lucide-react';

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color?: string; fill?: string }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-950/95 dark:bg-slate-900/95 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-xl text-xs space-y-1">
        <p className="font-black text-white">{label}</p>
        {payload.map((pld, index) => (
          <p key={`${pld.name || ''}-${index}`} className="font-bold" style={{ color: pld.color || pld.fill }}>
            {pld.name} : {pld.value.toLocaleString('fr-FR')} {pld.name.includes('Revenu') ? 'CFA' : ''}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

interface AnalyticsClientProps {
  totalRevenue: number;
  totalOrders: number;
  averageBasket: number;
  revenueData: Array<{
    name: string;
    'Revenus (CFA)': number;
    'Commandes': number;
  }>;
  categoryData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

export default function AnalyticsClient({
  totalRevenue,
  totalOrders,
  averageBasket,
  revenueData,
  categoryData
}: AnalyticsClientProps) {
  const totalSalesFromCategories = categoryData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="space-y-8 animate-in duration-300 overflow-y-auto h-full pr-2 pb-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="text-brand-primary" size={28} /> Analytiques
          </h1>
          <p className="text-slate-550 dark:text-slate-400 font-medium">Analysez les performances commerciales et les parts de marché.</p>
        </div>
        
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm text-xs font-bold text-slate-600 dark:text-slate-350 hover:bg-slate-55 transition-colors cursor-pointer">
          <Calendar size={16} /> Derniers 6 mois
        </button>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/30 dark:border-white/10 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.03)] flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-500 border border-emerald-555/20 rounded-2xl">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-widest">Revenus Totaux</p>
            <p className="text-2xl font-black text-slate-800 dark:text-white mt-1 tracking-tight">{totalRevenue.toLocaleString('fr-FR')} CFA</p>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider mt-0.5">+14.2% vs semestre précédent</p>
          </div>
        </Card>

        <Card className="p-6 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/30 dark:border-white/10 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.03)] flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 text-indigo-500 border border-indigo-555/20 rounded-2xl">
            <ShoppingBag size={24} />
          </div>
          <div>
            <p className="text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-widest">Volume Commandes</p>
            <p className="text-2xl font-black text-slate-800 dark:text-white mt-1 tracking-tight">{totalOrders.toLocaleString('fr-FR')}</p>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider mt-0.5">+9.6% vs semestre précédent</p>
          </div>
        </Card>

        <Card className="p-6 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/30 dark:border-white/10 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.03)] flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-500 border border-amber-555/20 rounded-2xl">
            <Percent size={24} />
          </div>
          <div>
            <p className="text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-widest">Panier Moyen</p>
            <p className="text-2xl font-black text-slate-800 dark:text-white mt-1 tracking-tight">{Math.round(averageBasket).toLocaleString('fr-FR')} CFA</p>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider mt-0.5">+4.1% de valeur d&apos;achat</p>
          </div>
        </Card>
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Monthly Revenues Bar Chart */}
        <Card className="lg:col-span-2 p-8 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/30 dark:border-white/10 rounded-[2rem] shadow-[0_8px_32px_0_rgba(0,0,0,0.03)]">
          <div className="mb-6">
            <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">Revenus Mensuels</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Évolution du chiffre d&apos;affaires et du nombre de commandes.</p>
          </div>

          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={revenueData}
                margin={{ top: 10, right: -10, left: -10, bottom: 0 }}
              >
                <XAxis 
                  dataKey="name" 
                  stroke="#94a3b8" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  yAxisId="left"
                  stroke="#94a3b8" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `${value / 1000}k`}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  stroke="#94a3b8" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar 
                  yAxisId="left"
                  dataKey="Revenus (CFA)" 
                  fill="#10b981"
                  radius={[8, 8, 0, 0]} 
                  maxBarSize={40}
                />
                <Bar 
                  yAxisId="right"
                  dataKey="Commandes" 
                  fill="#e07a5f"
                  radius={[8, 8, 0, 0]} 
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Categories Share Pie Donut Chart */}
        <Card className="p-8 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/30 dark:border-white/10 rounded-[2rem] shadow-[0_8px_32px_0_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">Répartition par Catégorie</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Part des ventes totales sur la plateforme.</p>
          </div>

          <div className="relative h-[220px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Text inside Donut */}
            <div className="absolute text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Ventes</span>
              <span className="text-lg font-black text-slate-800 dark:text-white">
                {totalSalesFromCategories.toLocaleString('fr-FR')}
              </span>
              <span className="text-[10px] text-slate-550 font-medium block">CFA</span>
            </div>
          </div>

          {/* Legend and breakdown details */}
          <div className="space-y-3 mt-6">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="font-bold text-slate-700 dark:text-slate-350">{cat.name}</span>
                </div>
                <div className="text-right">
                  <span className="font-black text-slate-800 dark:text-white block">
                    {cat.value.toLocaleString('fr-FR')} CFA
                  </span>
                  <span className="text-[10px] text-slate-450">
                    {totalSalesFromCategories > 0 ? ((cat.value / totalSalesFromCategories) * 100).toFixed(1) : 0}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

      </div>
    </div>
  );
}
