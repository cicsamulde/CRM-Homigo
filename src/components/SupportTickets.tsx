import React from 'react';
import { Wrench, AlertCircle, Clock, CheckCircle2, Search, Filter, Plus, MessageSquare } from 'lucide-react';
import { SUPPORT_TICKETS } from '../constants';
import { clsx } from 'clsx';
import { motion } from 'motion/react';

const PriorityBadge = ({ priority }: { priority: string }) => {
  const styles = {
    Low: "bg-blue-50 text-blue-600 border-blue-100",
    Medium: "bg-amber-50 text-amber-600 border-amber-100",
    High: "bg-red-50 text-red-600 border-red-100",
  };
  return (
    <span className={clsx(
      "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
      styles[priority as keyof typeof styles]
    )}>
      {priority}
    </span>
  );
};

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case 'Open': return <AlertCircle className="w-4 h-4 text-blue-500" />;
    case 'In Progress': return <Clock className="w-4 h-4 text-amber-500" />;
    case 'Resolved': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    default: return <AlertCircle className="w-4 h-4 text-zinc-400" />;
  }
};

export const SupportTickets: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Support Tickets</h1>
          <p className="text-zinc-500 mt-1">Manage platform support requests from landlords and tenants.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-all shadow-sm">
          <Plus className="w-4 h-4" />
          Create Internal Ticket
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm">
            <h3 className="text-sm font-bold text-zinc-900 mb-4 uppercase tracking-wider">Queue Health</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-zinc-500">Unassigned</span>
                <span className="text-sm font-bold text-red-600">8</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-zinc-500">Avg. First Response</span>
                <span className="text-sm font-bold text-zinc-900">14m</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-zinc-500">Resolved Today</span>
                <span className="text-sm font-bold text-emerald-600">42</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <div className="flex gap-4 bg-white p-4 rounded-xl border border-zinc-100 shadow-sm">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input 
                type="text" 
                placeholder="Search by subject, user ID, or ticket ID..." 
                className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-zinc-200 rounded-lg text-sm font-medium text-zinc-600 hover:bg-zinc-50">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
            <div className="divide-y divide-zinc-50">
              {SUPPORT_TICKETS.map((ticket) => (
                <div key={ticket.id} className="p-6 hover:bg-zinc-50/50 transition-all group">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4">
                      <div className="mt-1">
                        <StatusIcon status={ticket.status} />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="text-base font-bold text-zinc-900">{ticket.subject}</h4>
                          <PriorityBadge priority={ticket.priority} />
                        </div>
                        <div className="flex items-center gap-4 text-xs text-zinc-400 font-medium">
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            {ticket.userType}: {ticket.userId}
                          </span>
                          <span>•</span>
                          <span>Created {ticket.createdAt}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={clsx(
                        "text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md",
                        ticket.status === 'In Progress' ? "bg-amber-50 text-amber-600" : 
                        ticket.status === 'Resolved' ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                      )}>
                        {ticket.status}
                      </span>
                      <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity">
                        Open Ticket
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
