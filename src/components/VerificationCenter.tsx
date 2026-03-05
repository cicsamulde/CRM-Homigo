import React, { useState } from 'react';
import { ShieldCheck, FileText, CheckCircle2, XCircle, Clock, ExternalLink, Search, Filter } from 'lucide-react';
import { LANDLORDS, TENANTS, PROPERTIES } from '../constants';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'motion/react';

type VerificationType = 'KYC' | 'Property';

export const VerificationCenter: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<VerificationType>('KYC');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const pendingLandlords = LANDLORDS.filter(l => l.kycStatus === 'Pending');
  const pendingTenants = TENANTS.filter(t => t.kycStatus === 'Pending');
  const pendingProperties = PROPERTIES.filter(p => p.verificationStatus === 'Pending');

  const kycQueue = [...pendingLandlords.map(l => ({ ...l, type: 'Landlord' })), ...pendingTenants.map(t => ({ ...t, type: 'Tenant' }))];
  const propertyQueue = pendingProperties;

  const currentQueue = activeFilter === 'KYC' ? kycQueue : propertyQueue;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Verification Center</h1>
          <p className="text-zinc-500 mt-1">Review and approve KYC and property ownership documents.</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl border border-zinc-200 shadow-sm">
          <button 
            onClick={() => setActiveFilter('KYC')}
            className={clsx(
              "px-4 py-1.5 rounded-lg text-sm font-medium transition-all",
              activeFilter === 'KYC' ? "bg-zinc-900 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-900"
            )}
          >
            KYC ({kycQueue.length})
          </button>
          <button 
            onClick={() => setActiveFilter('Property')}
            className={clsx(
              "px-4 py-1.5 rounded-lg text-sm font-medium transition-all",
              activeFilter === 'Property' ? "bg-zinc-900 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-900"
            )}
          >
            Property Ownership ({propertyQueue.length})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Queue List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-zinc-50 bg-zinc-50/50">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Pending Review</h3>
            </div>
            <div className="divide-y divide-zinc-50 max-h-[600px] overflow-y-auto">
              {currentQueue.length === 0 ? (
                <div className="p-8 text-center text-zinc-400">
                  <CheckCircle2 className="w-8 h-8 mx-auto mb-2 opacity-20" />
                  <p className="text-sm">Queue is empty!</p>
                </div>
              ) : (
                currentQueue.map((item: any) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={clsx(
                      "w-full p-4 text-left hover:bg-zinc-50 transition-all flex items-center justify-between group",
                      selectedItem?.id === item.id ? "bg-zinc-50 border-l-4 border-emerald-500" : "border-l-4 border-transparent"
                    )}
                  >
                    <div>
                      <p className="text-sm font-bold text-zinc-900">{item.name}</p>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {activeFilter === 'KYC' ? `${item.type} • ${item.email}` : item.address}
                      </p>
                    </div>
                    <Clock className="w-4 h-4 text-zinc-300 group-hover:text-amber-500 transition-colors" />
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Review Panel */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {selectedItem ? (
              <motion.div 
                key={selectedItem.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-8 space-y-8"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center text-2xl font-bold text-zinc-400">
                      {selectedItem.name.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-zinc-900">{selectedItem.name}</h2>
                      <p className="text-zinc-500">{activeFilter === 'KYC' ? selectedItem.email : selectedItem.address}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-zinc-50 rounded-lg text-zinc-400 hover:text-zinc-600">
                      <ExternalLink className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Verification Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-zinc-50">
                        <span className="text-sm text-zinc-500">Submission Date</span>
                        <span className="text-sm font-medium text-zinc-900">Feb 24, 2024</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-zinc-50">
                        <span className="text-sm text-zinc-500">Risk Level</span>
                        <span className="text-sm font-medium text-emerald-600">Low</span>
                      </div>
                      {activeFilter === 'KYC' && (
                        <div className="flex justify-between py-2 border-b border-zinc-50">
                          <span className="text-sm text-zinc-500">User Type</span>
                          <span className="text-sm font-medium text-zinc-900">{selectedItem.type}</span>
                        </div>
                      )}
                      {activeFilter === 'Property' && (
                        <>
                          <div className="flex justify-between py-2 border-b border-zinc-50">
                            <span className="text-sm text-zinc-500">Property Type</span>
                            <span className="text-sm font-medium text-zinc-900">{selectedItem.type}</span>
                          </div>
                          <div className="pt-4 space-y-3">
                            <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Owner Information</h4>
                            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-zinc-500">Name</span>
                                <span className="text-xs font-bold text-zinc-900">
                                  {LANDLORDS.find(l => l.id === selectedItem.landlordId)?.name || 'Unknown'}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-zinc-500">KYC Status</span>
                                <span className={clsx(
                                  "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                                  LANDLORDS.find(l => l.id === selectedItem.landlordId)?.kycStatus === 'Verified' ? "bg-emerald-100 text-emerald-700" :
                                  LANDLORDS.find(l => l.id === selectedItem.landlordId)?.kycStatus === 'Pending' ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                                )}>
                                  {LANDLORDS.find(l => l.id === selectedItem.landlordId)?.kycStatus || 'Unverified'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Documents Provided</h3>
                    <div className="space-y-2">
                      {selectedItem.documents?.map((doc: any) => (
                        <div key={doc.id} className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                          <div className="flex items-center gap-3">
                            <FileText className="w-4 h-4 text-zinc-400" />
                            <span className="text-sm font-medium text-zinc-700">{doc.type}</span>
                          </div>
                          <button className="text-xs font-bold text-emerald-600 hover:underline">View</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100">
                  <h3 className="text-sm font-bold text-zinc-900 mb-4">Internal Review Notes</h3>
                  <textarea 
                    placeholder="Add notes about this verification..."
                    className="w-full h-24 p-4 bg-white border border-zinc-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-md shadow-emerald-100">
                    <CheckCircle2 className="w-5 h-5" />
                    Approve Verification
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-red-200 text-red-600 rounded-xl font-bold hover:bg-red-50 transition-all">
                    <XCircle className="w-5 h-5" />
                    Reject Submission
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-zinc-400 bg-zinc-50/50 rounded-2xl border-2 border-dashed border-zinc-200 p-12">
                <ShieldCheck className="w-16 h-16 mb-4 opacity-10" />
                <h3 className="text-lg font-medium">Select an item to review</h3>
                <p className="text-sm">Choose a pending verification from the queue on the left.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
