import React from 'react';
import { Users, Mail, Phone, Calendar, MoreHorizontal, Search, ShieldCheck, Clock } from 'lucide-react';
import { TENANTS, PROPERTIES } from '../constants';
import { clsx } from 'clsx';
import { motion } from 'motion/react';

export const TenantList: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Tenants</h1>
          <p className="text-zinc-500 mt-1">Platform-wide tenant database and KYC verification.</p>
        </div>
        <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-all shadow-sm">
          Export Tenant Data
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-50 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search tenants by name, email, or ID..." 
              className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 border-b border-zinc-100">
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Tenant</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Current Property</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">KYC Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Account Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {TENANTS.map((tenant) => {
                const property = PROPERTIES.find(p => p.id === tenant.propertyId);
                return (
                  <tr key={tenant.id} className="hover:bg-zinc-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-600 font-bold">
                          {tenant.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-zinc-900">{tenant.name}</p>
                          <p className="text-xs text-zinc-500">{tenant.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-zinc-700">{property?.name || 'N/A'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        {tenant.kycStatus === 'Verified' ? (
                          <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Clock className="w-4 h-4 text-amber-500" />
                        )}
                        <span className={clsx(
                          "text-xs font-semibold",
                          tenant.kycStatus === 'Verified' ? "text-emerald-600" : "text-amber-600"
                        )}>
                          {tenant.kycStatus}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={clsx(
                        "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        tenant.status === 'Active' ? "bg-emerald-50 text-emerald-600" : "bg-zinc-100 text-zinc-600"
                      )}>
                        {tenant.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 hover:bg-zinc-100 rounded-lg transition-colors">
                        <MoreHorizontal className="w-4 h-4 text-zinc-400" />
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
