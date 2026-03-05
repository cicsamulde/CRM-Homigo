import React, { useState } from 'react';
import { Building2, MapPin, MoreVertical, Search, Filter, User, LayoutGrid, List, ShieldCheck } from 'lucide-react';
import { PROPERTIES, LANDLORDS } from '../constants';
import { formatCurrency } from '../lib/utils';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'motion/react';

export const PropertyList: React.FC = () => {
  const [layout, setLayout] = useState<'grid' | 'list'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [verificationFilter, setVerificationFilter] = useState<string>('All');

  const filteredProperties = PROPERTIES.filter(property => {
    const landlord = LANDLORDS.find(l => l.id === property.landlordId);
    const matchesSearch = 
      property.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      landlord?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || property.status === statusFilter;
    const matchesVerification = verificationFilter === 'All' || property.verificationStatus === verificationFilter;

    return matchesSearch && matchesStatus && matchesVerification;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Marketplace Listings</h1>
          <p className="text-zinc-500 mt-1">Review and manage properties listed on Homigo.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-all">
            Bulk Actions
          </button>
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-all shadow-sm">
            Create Listing
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 bg-white p-4 rounded-xl border border-zinc-100 shadow-sm items-center">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Search listings..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          >
            <option value="All">All Statuses</option>
            <option value="Published">Published</option>
            <option value="Under Review">Under Review</option>
            <option value="Draft">Draft</option>
          </select>

          <select 
            value={verificationFilter}
            onChange={(e) => setVerificationFilter(e.target.value)}
            className="px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          >
            <option value="All">All Verifications</option>
            <option value="Verified">Verified</option>
            <option value="Pending">Pending</option>
            <option value="Unverified">Unverified</option>
          </select>
        </div>
        
        <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-lg">
          <button 
            onClick={() => setLayout('grid')}
            className={clsx(
              "p-1.5 rounded-md transition-all",
              layout === 'grid' ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
            )}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setLayout('list')}
            className={clsx(
              "p-1.5 rounded-md transition-all",
              layout === 'list' ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
            )}
            title="List View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {layout === 'grid' ? (
          <motion.div 
            key="grid"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {filteredProperties.map((property) => {
              const landlord = LANDLORDS.find(l => l.id === property.landlordId);
              return (
                <div key={property.id} className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={property.image} 
                      alt={property.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
                      <span className={clsx(
                        "px-3 py-1 rounded-full text-xs font-semibold shadow-sm",
                        property.status === 'Published' ? "bg-emerald-500 text-white" : 
                        property.status === 'Under Review' ? "bg-amber-500 text-white" : "bg-zinc-900 text-white"
                      )}>
                        {property.status}
                      </span>
                      <span className={clsx(
                        "px-3 py-1 rounded-full text-[10px] font-bold shadow-sm uppercase tracking-wider",
                        property.verificationStatus === 'Verified' ? "bg-blue-500 text-white" : 
                        property.verificationStatus === 'Pending' ? "bg-amber-500 text-white" : "bg-zinc-400 text-white"
                      )}>
                        {property.verificationStatus}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-zinc-900">{property.name}</h3>
                      <button className="p-1 hover:bg-zinc-50 rounded-md">
                        <MoreVertical className="w-4 h-4 text-zinc-400" />
                      </button>
                    </div>
                    <div className="flex items-center gap-1 text-zinc-500 text-sm mb-4">
                      <MapPin className="w-3 h-3" />
                      {property.address}
                    </div>
                    
                    <div className="flex items-center gap-2 mb-6 p-2 bg-zinc-50 rounded-lg">
                      <div className="w-6 h-6 bg-zinc-200 rounded-full flex items-center justify-center">
                        <User className="w-3 h-3 text-zinc-500" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-tighter">Owner</span>
                        <span className="text-xs font-semibold text-zinc-700">{landlord?.name}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-zinc-50">
                      <div>
                        <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Rent</p>
                        <p className="text-lg font-bold text-zinc-900">{formatCurrency(property.rent)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Commission</p>
                        <p className="text-sm font-semibold text-emerald-600">{(property.commissionRate * 100).toFixed(0)}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div 
            key="list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden"
          >
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50/50 border-b border-zinc-50">
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Property</th>
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Owner</th>
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Rent</th>
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Commission</th>
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {filteredProperties.map((property) => {
                  const landlord = LANDLORDS.find(l => l.id === property.landlordId);
                  return (
                    <tr key={property.id} className="hover:bg-zinc-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img 
                            src={property.image} 
                            alt={property.name}
                            className="w-12 h-12 rounded-lg object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <p className="text-sm font-bold text-zinc-900">{property.name}</p>
                            <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                              <MapPin className="w-2.5 h-2.5" />
                              {property.address}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-zinc-100 rounded-full flex items-center justify-center text-[10px] font-bold text-zinc-500">
                            {landlord?.name.charAt(0)}
                          </div>
                          <span className="text-sm font-medium text-zinc-700">{landlord?.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className={clsx(
                            "w-fit px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                            property.status === 'Published' ? "bg-emerald-50 text-emerald-600" : 
                            property.status === 'Under Review' ? "bg-amber-50 text-amber-600" : "bg-zinc-100 text-zinc-900"
                          )}>
                            {property.status}
                          </span>
                          <span className={clsx(
                            "w-fit px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                            property.verificationStatus === 'Verified' ? "bg-blue-50 text-blue-600" : 
                            property.verificationStatus === 'Pending' ? "bg-amber-50 text-amber-600" : "bg-zinc-100 text-zinc-400"
                          )}>
                            {property.verificationStatus}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-zinc-900">{formatCurrency(property.rent)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-emerald-600">{(property.commissionRate * 100).toFixed(0)}%</p>
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
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
