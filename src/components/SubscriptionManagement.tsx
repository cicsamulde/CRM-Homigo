import React, { useState } from 'react';
import { CreditCard, Search, Filter, MoreVertical, Calendar, DollarSign, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { SUBSCRIPTIONS, LANDLORDS } from '../constants';
import { formatCurrency, cn } from '../lib/utils';
import { motion } from 'motion/react';

export const SubscriptionManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSubscriptions = SUBSCRIPTIONS.filter(sub => {
    const landlord = LANDLORDS.find(l => l.id === sub.landlordId);
    return landlord?.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           sub.plan.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Subscription Management</h1>
          <p className="text-zinc-500 mt-1">Manage landlord billing, plans, and recurring revenue.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-all">
            Billing Settings
          </button>
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-all shadow-sm">
            Generate Invoices
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Monthly Revenue</h3>
          </div>
          <p className="text-3xl font-bold text-zinc-900">{formatCurrency(12450)}</p>
          <p className="text-xs text-emerald-600 font-medium mt-2">+8% from last month</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 rounded-lg">
              <CreditCard className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Active Plans</h3>
          </div>
          <p className="text-3xl font-bold text-zinc-900">{SUBSCRIPTIONS.length}</p>
          <p className="text-xs text-zinc-500 mt-2">Across all landlord tiers</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Past Due</h3>
          </div>
          <p className="text-3xl font-bold text-zinc-900">2</p>
          <p className="text-xs text-red-500 font-medium mt-2">Requires attention</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-zinc-50 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search by landlord or plan..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-zinc-200 rounded-xl text-sm font-medium text-zinc-600 hover:bg-zinc-50">
            <Filter className="w-4 h-4" />
            Filter Plans
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 border-b border-zinc-50">
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Landlord</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Plan Tier</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Billing</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Next Date</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {filteredSubscriptions.map((sub) => {
                const landlord = LANDLORDS.find(l => l.id === sub.landlordId);
                return (
                  <tr key={sub.id} className="hover:bg-zinc-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-zinc-100 rounded-full flex items-center justify-center text-xs font-bold text-zinc-600">
                          {landlord?.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-zinc-900">{landlord?.name}</p>
                          <p className="text-[10px] text-zinc-500">{landlord?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                        sub.plan === 'Enterprise' ? "bg-purple-50 text-purple-600" :
                        sub.plan === 'Pro' ? "bg-blue-50 text-blue-600" : "bg-zinc-100 text-zinc-600"
                      )}>
                        {sub.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <div className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          sub.status === 'Active' ? "bg-emerald-500" :
                          sub.status === 'Past Due' ? "bg-amber-500" : "bg-zinc-300"
                        )} />
                        <span className="text-sm font-medium text-zinc-700">{sub.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-500">
                      {sub.billingCycle}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-zinc-900">
                      {formatCurrency(sub.amount)}
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-500">
                      {sub.nextBillingDate}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-zinc-600 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};
