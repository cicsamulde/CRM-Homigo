import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Mail, 
  Phone, 
  Calendar, 
  Target, 
  UserPlus, 
  ArrowRight, 
  LayoutGrid, 
  List, 
  X, 
  Clock, 
  MessageSquare, 
  History, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  Download,
  ExternalLink,
  Trash2,
  Check,
  ChevronDown,
  Briefcase,
  Star,
  Activity,
  StickyNote,
  Send
} from 'lucide-react';
import { LEADS, LEAD_SEGMENTS } from '../constants';
import { Lead, LeadSegment } from '../types';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'motion/react';
import Papa from 'papaparse';

const LEAD_STATUSES: Lead['status'][] = ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'];

export const LeadManagement: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>(LEADS);
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'Tenant' | 'Landlord'>('All');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<Lead['status'] | 'All'>('All');
  const [selectedSegment, setSelectedSegment] = useState<string | 'All'>('All');
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'notes'>('overview');
  const [noteText, setNoteText] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  // Create Lead Form State
  const [newLead, setNewLead] = useState<Partial<Lead>>({
    name: '',
    email: '',
    phone: '',
    company: '',
    type: 'Tenant',
    status: 'New',
    source: 'Website',
    tags: [],
    score: 50
  });

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           lead.company?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'All' || lead.type === filterType;
      const matchesStatus = selectedStatus === 'All' || lead.status === selectedStatus;
      const matchesSegment = selectedSegment === 'All' || lead.segment === selectedSegment;
      return matchesSearch && matchesType && matchesStatus && matchesSegment;
    });
  }, [leads, searchTerm, filterType, selectedStatus, selectedSegment]);

  const leadsByStatus = useMemo(() => {
    const groups: Record<Lead['status'], Lead[]> = {
      'New': [],
      'Contacted': [],
      'Qualified': [],
      'Converted': [],
      'Lost': []
    };
    filteredLeads.forEach(lead => {
      groups[lead.status].push(lead);
    });
    return groups;
  }, [filteredLeads]);

  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'New': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Contacted': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Qualified': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Converted': return 'bg-zinc-900 text-white border-zinc-800';
      case 'Lost': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-zinc-50 text-zinc-600 border-zinc-100';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 50) return 'text-amber-500';
    return 'text-red-500';
  };

  const toggleLeadSelection = (id: string) => {
    setSelectedLeads(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleAllSelection = () => {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(filteredLeads.map(l => l.id));
    }
  };

  const handleImport = (file: File) => {
    setImportError(null);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const { data, errors } = results;
        if (errors.length > 0) {
          setImportError('Error parsing CSV file. Please check the format.');
          return;
        }

        const newLeads: Lead[] = (data as any[]).map((row, index) => ({
          id: `ld-import-${Date.now()}-${index}`,
          name: row.name || 'Unknown',
          email: row.email || '',
          phone: row.phone || '',
          company: row.company || '',
          type: (row.type === 'Landlord' ? 'Landlord' : 'Tenant') as Lead['type'],
          status: (LEAD_STATUSES.includes(row.status) ? row.status : 'New') as Lead['status'],
          source: (['Website', 'Referral', 'Social Media', 'Direct'].includes(row.source) ? row.source : 'Direct') as Lead['source'],
          score: Math.floor(Math.random() * 100),
          tags: row.tags ? row.tags.split(',').map((t: string) => t.trim()) : [],
          createdAt: new Date().toISOString().split('T')[0]
        }));

        if (newLeads.length === 0) {
          setImportError('No valid leads found in the CSV file.');
          return;
        }

        setLeads(prev => [...newLeads, ...prev]);
        setIsImportModalOpen(false);
      },
      error: (error) => {
        setImportError(`Error: ${error.message}`);
      }
    });
  };

  const downloadTemplate = () => {
    const csv = Papa.unparse([
      {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '555-0123',
        company: 'Acme Corp',
        type: 'Tenant',
        status: 'New',
        source: 'Website',
        tags: 'VIP, Urgent'
      }
    ]);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'lead_import_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    const lead: Lead = {
      ...newLead as Lead,
      id: `ld-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      tags: newLead.tags || [],
      score: Math.floor(Math.random() * 100) // Simulate AI scoring
    };
    setLeads([lead, ...leads]);
    setIsCreateModalOpen(false);
    setNewLead({
      name: '',
      email: '',
      phone: '',
      company: '',
      type: 'Tenant',
      status: 'New',
      source: 'Website',
      tags: [],
      score: 50
    });
  };

  return (
    <div className="relative h-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Lead Pipeline</h1>
          <p className="text-zinc-500 mt-1">Manage, track, and convert your high-value prospects.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white text-zinc-700 border border-zinc-200 rounded-xl font-bold hover:bg-zinc-50 transition-all shadow-sm"
          >
            <Download className="w-4 h-4" />
            Import
          </button>
          <div className="flex bg-zinc-100 p-1 rounded-xl border border-zinc-200">
            <button 
              onClick={() => setViewMode('list')}
              className={clsx(
                "p-2 rounded-lg transition-all",
                viewMode === 'list' ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
              )}
            >
              <List className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('kanban')}
              className={clsx(
                "p-2 rounded-lg transition-all",
                viewMode === 'kanban' ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
              )}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-md shadow-emerald-100"
          >
            <Plus className="w-4 h-4" />
            Create Lead
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Leads', value: leads.length, icon: Target, color: 'blue' },
          { label: 'Qualified', value: leads.filter(l => l.status === 'Qualified').length, icon: CheckCircle2, color: 'emerald' },
          { label: 'Avg. Velocity', value: '4.2 Days', icon: Clock, color: 'amber' },
          { label: 'Win Rate', value: '32%', icon: Star, color: 'purple' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl border border-zinc-100 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={clsx("w-4 h-4", `text-${stat.color}-500`)} />
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{stat.label}</span>
            </div>
            <p className="text-xl font-bold text-zinc-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Segmentation & Groups Bar */}
      <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
        <button 
          onClick={() => setSelectedSegment('All')}
          className={clsx(
            "flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all border",
            selectedSegment === 'All' 
              ? "bg-zinc-900 text-white border-zinc-900" 
              : "bg-white text-zinc-500 border-zinc-100 hover:border-zinc-200"
          )}
        >
          All Leads
        </button>
        {LEAD_SEGMENTS.map((seg) => (
          <button 
            key={seg.id}
            onClick={() => setSelectedSegment(seg.id)}
            className={clsx(
              "flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-2",
              selectedSegment === seg.id 
                ? `bg-${seg.color}-600 text-white border-${seg.color}-600` 
                : "bg-white text-zinc-500 border-zinc-100 hover:border-zinc-200"
            )}
          >
            <div className={clsx(
              "w-1.5 h-1.5 rounded-full",
              selectedSegment === seg.id ? "bg-white" : `bg-${seg.color}-500`
            )} />
            {seg.name}
            <span className={clsx(
              "text-[10px] px-1.5 py-0.5 rounded-md",
              selectedSegment === seg.id ? "bg-white/20" : "bg-zinc-100"
            )}>
              {leads.filter(l => l.segment === seg.id).length}
            </span>
          </button>
        ))}
        <button className="flex-shrink-0 p-2 rounded-xl border border-dashed border-zinc-200 text-zinc-400 hover:text-zinc-600 hover:border-zinc-300 transition-all">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-100 shadow-sm flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Search by name, email, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          <div className="flex bg-zinc-50 p-1 rounded-xl border border-zinc-100">
            {(['All', 'Tenant', 'Landlord'] as const).map((t) => (
              <button 
                key={t}
                onClick={() => setFilterType(t)}
                className={clsx(
                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                  filterType === t ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
                )}
              >
                {t}
              </button>
            ))}
          </div>
          <select 
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="bg-zinc-50 border border-zinc-100 rounded-xl px-3 py-1.5 text-xs font-bold text-zinc-600 outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="All">All Statuses</option>
            {LEAD_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 rounded-lg transition-all">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0">
        {viewMode === 'list' ? (
          <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden h-full flex flex-col">
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-white z-10">
                  <tr className="bg-zinc-50/50 border-b border-zinc-100">
                    <th className="px-6 py-4 w-10">
                      <button 
                        onClick={toggleAllSelection}
                        className={clsx(
                          "w-4 h-4 rounded border flex items-center justify-center transition-all",
                          selectedLeads.length === filteredLeads.length 
                            ? "bg-emerald-600 border-emerald-600 text-white" 
                            : "bg-white border-zinc-300"
                        )}
                      >
                        {selectedLeads.length === filteredLeads.length && <Check className="w-3 h-3" />}
                      </button>
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Lead Details</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Score</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Type</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Source</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {filteredLeads.map((lead) => (
                    <tr 
                      key={lead.id} 
                      onClick={() => setSelectedLead(lead)}
                      className={clsx(
                        "hover:bg-zinc-50/50 transition-colors group cursor-pointer",
                        selectedLeads.includes(lead.id) && "bg-emerald-50/30"
                      )}
                    >
                      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                        <button 
                          onClick={() => toggleLeadSelection(lead.id)}
                          className={clsx(
                            "w-4 h-4 rounded border flex items-center justify-center transition-all",
                            selectedLeads.includes(lead.id) 
                              ? "bg-emerald-600 border-emerald-600 text-white" 
                              : "bg-white border-zinc-300"
                          )}
                        >
                          {selectedLeads.includes(lead.id) && <Check className="w-3 h-3" />}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-600 font-bold border border-zinc-200">
                            {lead.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-zinc-900">{lead.name}</p>
                            <p className="text-[10px] text-zinc-500 flex items-center gap-1">
                              <Briefcase className="w-3 h-3" />
                              {lead.company || 'Individual'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className={clsx("text-xs font-black", getScoreColor(lead.score))}>
                            {lead.score}
                          </div>
                          <div className="w-12 h-1 bg-zinc-100 rounded-full overflow-hidden">
                            <div 
                              className={clsx("h-full", lead.score >= 80 ? 'bg-emerald-500' : lead.score >= 50 ? 'bg-amber-500' : 'bg-red-500')} 
                              style={{ width: `${lead.score}%` }} 
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={clsx(
                          "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                          lead.type === 'Tenant' ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"
                        )}>
                          {lead.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={clsx(
                          "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                          getStatusColor(lead.status)
                        )}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-zinc-500">
                        {lead.source}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-lg transition-colors">
                            <Mail className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-zinc-100 text-zinc-600 rounded-lg transition-colors">
                            <Phone className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-zinc-100 text-zinc-400 rounded-lg transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4 h-full">
            {LEAD_STATUSES.map((status) => (
              <div key={status} className="flex-shrink-0 w-80 flex flex-col gap-4">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest">{status}</h3>
                    <span className="bg-zinc-100 text-zinc-500 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {leadsByStatus[status].length}
                    </span>
                  </div>
                  <button className="p-1 hover:bg-zinc-100 rounded text-zinc-400">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                
                <div className="flex-1 bg-zinc-50/50 rounded-2xl p-2 space-y-3 overflow-y-auto border border-zinc-100/50">
                  {leadsByStatus[status].map((lead) => (
                    <motion.div
                      key={lead.id}
                      layoutId={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className="bg-white p-4 rounded-xl border border-zinc-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <div className={clsx(
                            "w-2 h-2 rounded-full",
                            lead.type === 'Tenant' ? "bg-blue-500" : "bg-purple-500"
                          )} />
                          <span className={clsx("text-[10px] font-black", getScoreColor(lead.score))}>{lead.score}</span>
                        </div>
                        <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-zinc-50 rounded text-zinc-400 transition-opacity">
                          <MoreVertical className="w-3 h-3" />
                        </button>
                      </div>
                      <h4 className="text-sm font-bold text-zinc-900 mb-1">{lead.name}</h4>
                      <p className="text-[10px] text-zinc-500 mb-3 truncate flex items-center gap-1">
                        <Briefcase className="w-3 h-3" />
                        {lead.company || 'Individual'}
                      </p>
                      
                      <div className="flex items-center justify-between pt-3 border-t border-zinc-50">
                        <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
                          <Clock className="w-3 h-3" />
                          {lead.createdAt.split(' ')[0]}
                        </div>
                        <div className="flex -space-x-1">
                          <div className="w-5 h-5 rounded-full bg-zinc-100 border border-white flex items-center justify-center text-[8px] font-bold text-zinc-500">
                            AT
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {leadsByStatus[status].length === 0 && (
                    <div className="h-32 flex items-center justify-center border-2 border-dashed border-zinc-200 rounded-xl">
                      <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">No Leads</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Bar for Bulk Selection */}
      <AnimatePresence>
        {selectedLeads.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-zinc-900 text-white px-6 py-4 rounded-2xl shadow-2xl z-50 flex items-center gap-6 border border-zinc-800"
          >
            <div className="flex items-center gap-3 pr-6 border-r border-zinc-700">
              <span className="bg-emerald-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                {selectedLeads.length}
              </span>
              <span className="text-sm font-bold">Leads Selected</span>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-xs font-bold hover:text-emerald-400 transition-colors">
                <Mail className="w-4 h-4" />
                Email
              </button>
              <button className="flex items-center gap-2 text-xs font-bold hover:text-emerald-400 transition-colors">
                <CheckCircle2 className="w-4 h-4" />
                Update Status
              </button>
              <button className="flex items-center gap-2 text-xs font-bold hover:text-emerald-400 transition-colors">
                <Download className="w-4 h-4" />
                Export
              </button>
              <button className="flex items-center gap-2 text-xs font-bold text-red-400 hover:text-red-300 transition-colors">
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
            <button 
              onClick={() => setSelectedLeads([])}
              className="ml-4 p-1 hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lead Detail Side Panel */}
      <AnimatePresence>
        {selectedLead && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLead(null)}
              className="fixed inset-0 bg-zinc-900/20 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-xl bg-white shadow-2xl z-50 flex flex-col"
            >
              {/* Panel Header */}
              <div className="p-6 border-b border-zinc-100 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-zinc-100 rounded-2xl flex items-center justify-center text-xl font-bold text-zinc-600 border border-zinc-200">
                    {selectedLead.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-zinc-900">{selectedLead.name}</h2>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={clsx(
                        "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                        selectedLead.type === 'Tenant' ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"
                      )}>
                        {selectedLead.type}
                      </span>
                      <span className="text-xs text-zinc-400">•</span>
                      <span className="text-xs text-zinc-500">{selectedLead.company || 'Individual'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex flex-col items-end mr-4">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Lead Score</span>
                    <span className={clsx("text-lg font-black", getScoreColor(selectedLead.score))}>{selectedLead.score}</span>
                  </div>
                  <button 
                    onClick={() => setSelectedLead(null)}
                    className="p-2 hover:bg-zinc-100 rounded-xl text-zinc-400 transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-zinc-100 px-6">
                {[
                  { id: 'overview', label: 'Overview', icon: Target },
                  { id: 'activity', label: 'Activity', icon: Activity },
                  { id: 'notes', label: 'Notes', icon: StickyNote },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={clsx(
                      "flex items-center gap-2 px-4 py-4 text-xs font-bold transition-all relative",
                      activeTab === tab.id ? "text-emerald-600" : "text-zinc-400 hover:text-zinc-600"
                    )}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.div 
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600" 
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Panel Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-8">
                    {/* Quick Actions */}
                    <div className="grid grid-cols-4 gap-3">
                      {[
                        { label: 'Log Call', icon: Phone, color: 'blue' },
                        { label: 'Email', icon: Mail, color: 'emerald' },
                        { label: 'Task', icon: CheckCircle2, color: 'amber' },
                        { label: 'Meeting', icon: Calendar, color: 'purple' },
                      ].map((action, i) => (
                        <button key={i} className="flex flex-col items-center gap-2 p-3 rounded-2xl border border-zinc-100 hover:bg-zinc-50 transition-all group">
                          <div className={clsx("p-2 rounded-xl transition-all", `bg-${action.color}-50 text-${action.color}-600 group-hover:scale-110`)}>
                            <action.icon className="w-4 h-4" />
                          </div>
                          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{action.label}</span>
                        </button>
                      ))}
                    </div>

                    {/* Lead Score Breakdown */}
                    <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-amber-500" />
                          <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest">Score Breakdown</h3>
                        </div>
                        <span className={clsx("text-lg font-black", getScoreColor(selectedLead.score))}>{selectedLead.score}</span>
                      </div>
                      <div className="space-y-3">
                        {[
                          { label: 'Profile Completeness', value: 90, color: 'emerald' },
                          { label: 'Engagement Level', value: 65, color: 'blue' },
                          { label: 'Budget Fit', value: 85, color: 'purple' },
                        ].map((item, i) => (
                          <div key={i} className="space-y-1">
                            <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                              <span>{item.label}</span>
                              <span>{item.value}%</span>
                            </div>
                            <div className="w-full h-1 bg-zinc-200 rounded-full overflow-hidden">
                              <div 
                                className={clsx("h-full", `bg-${item.color}-500`)} 
                                style={{ width: `${item.value}%` }} 
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Status Management */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Lifecycle Stage</h3>
                      <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-2xl border border-zinc-200">
                        {LEAD_STATUSES.map((status) => (
                          <button
                            key={status}
                            className={clsx(
                              "flex-1 py-2 rounded-xl text-[10px] font-bold transition-all",
                              selectedLead.status === status 
                                ? "bg-white text-zinc-900 shadow-sm" 
                                : "text-zinc-500 hover:text-zinc-700"
                            )}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Email Address</label>
                        <p className="text-sm font-medium text-zinc-900 flex items-center gap-2">
                          {selectedLead.email}
                          <ExternalLink className="w-3 h-3 text-zinc-300" />
                        </p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Phone Number</label>
                        <p className="text-sm font-medium text-zinc-900">{selectedLead.phone}</p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Source</label>
                        <p className="text-sm font-medium text-zinc-900">{selectedLead.source}</p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Created Date</label>
                        <p className="text-sm font-medium text-zinc-900">{selectedLead.createdAt}</p>
                      </div>
                    </div>

                    {/* Interested In */}
                    <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 space-y-2">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-zinc-400" />
                        <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest">Lead Interest</h3>
                      </div>
                      <p className="text-sm text-zinc-600 leading-relaxed">
                        {selectedLead.interestedIn || "No specific interest recorded yet."}
                      </p>
                    </div>

                    {/* Associations */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Associations</h3>
                        <button className="text-[10px] font-bold text-emerald-600 hover:underline">Add</button>
                      </div>
                      <div className="p-4 bg-white border border-zinc-100 rounded-2xl flex items-center justify-between group hover:border-emerald-200 transition-all cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center">
                            <LayoutGrid className="w-5 h-5 text-zinc-400" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-zinc-900">Skyline Heights</p>
                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Property • Apartment</p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-emerald-500 transition-colors" />
                      </div>
                    </div>

                    {/* AI Insights / Research */}
                    <div className="p-5 bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl text-white space-y-4 shadow-xl shadow-zinc-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-emerald-500 rounded-lg flex items-center justify-center">
                            <Activity className="w-3.5 h-3.5 text-white" />
                          </div>
                          <h3 className="text-xs font-bold uppercase tracking-widest">AI Lead Research</h3>
                        </div>
                        <span className="text-[8px] font-bold bg-white/10 px-1.5 py-0.5 rounded uppercase tracking-widest">Powered by Gemini</span>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Get deep insights about {selectedLead.name.split(' ')[0]}'s company and professional background from the web.
                      </p>
                      <button className="w-full py-2.5 bg-white text-zinc-900 rounded-xl font-bold text-xs hover:bg-emerald-400 transition-all flex items-center justify-center gap-2">
                        <Search className="w-3.5 h-3.5" />
                        Research {selectedLead.company || 'Lead'}
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'activity' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Activity History</h3>
                      <button className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 hover:underline">
                        <Filter className="w-3 h-3" />
                        Filter
                      </button>
                    </div>
                    <div className="space-y-8 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-zinc-100">
                      {[
                        { type: 'Call', desc: 'Outbound call - No answer, left voicemail', time: '2 hours ago', icon: Phone, color: 'blue' },
                        { type: 'Email', desc: 'Sent "Welcome to Homigo" intro email', time: '1 day ago', icon: Mail, color: 'emerald' },
                        { type: 'Status', desc: 'Moved from "New" to "Contacted"', time: '1 day ago', icon: History, color: 'zinc' },
                        { type: 'Note', desc: 'Interested in 2-bedroom apartments in Downtown', time: '2 days ago', icon: FileText, color: 'amber' },
                        { type: 'Meeting', desc: 'Scheduled virtual tour for next Tuesday', time: '3 days ago', icon: Calendar, color: 'purple' },
                      ].map((activity, i) => (
                        <div key={i} className="relative pl-8">
                          <div className={clsx(
                            "absolute left-0 top-0 w-4 h-4 rounded-full flex items-center justify-center z-10",
                            `bg-${activity.color}-50 text-${activity.color}-600 border border-white`
                          )}>
                            <activity.icon className="w-2.5 h-2.5" />
                          </div>
                          <div className="bg-zinc-50/50 p-3 rounded-xl border border-zinc-100/50">
                            <div className="flex justify-between items-start mb-1">
                              <p className="text-xs font-bold text-zinc-900">{activity.type}</p>
                              <p className="text-[10px] text-zinc-400">{activity.time}</p>
                            </div>
                            <p className="text-xs text-zinc-500 leading-relaxed">{activity.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'notes' && (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Add New Note</h3>
                      <div className="relative">
                        <textarea 
                          placeholder="Type your note here..."
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          className="w-full h-32 p-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
                        />
                        <button 
                          disabled={!noteText.trim()}
                          className="absolute bottom-3 right-3 p-2 bg-emerald-600 text-white rounded-xl disabled:opacity-50 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Recent Notes</h3>
                      {[
                        { author: 'Alex Thompson', text: 'Spoke with James today. He is looking for a high-end apartment with a view. Budget is flexible but needs to be near the metro.', date: 'Feb 28, 2024' },
                        { author: 'Sarah Miller', text: 'Followed up on the document request. He promised to upload the ID by end of week.', date: 'Feb 26, 2024' },
                      ].map((note, i) => (
                        <div key={i} className="p-4 bg-amber-50/50 border border-amber-100 rounded-2xl space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">{note.author}</span>
                            <span className="text-[10px] text-zinc-400">{note.date}</span>
                          </div>
                          <p className="text-sm text-zinc-700 leading-relaxed">{note.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Panel Footer */}
              <div className="p-6 border-t border-zinc-100 bg-zinc-50/50 flex gap-3">
                <button className="flex-1 py-3 bg-zinc-900 text-white rounded-2xl font-bold text-sm hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200 flex items-center justify-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Convert to User
                </button>
                <button className="p-3 bg-white border border-zinc-200 rounded-2xl text-red-500 hover:bg-red-50 hover:border-red-100 transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Import Leads Modal */}
      <AnimatePresence>
        {isImportModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsImportModalOpen(false)}
              className="fixed inset-0 bg-zinc-900/40 backdrop-blur-md z-[60]"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-3xl shadow-2xl z-[70] overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                <div>
                  <h2 className="text-xl font-bold text-zinc-900">Import Leads</h2>
                  <p className="text-xs text-zinc-500 mt-1">Upload a CSV file to bulk add leads.</p>
                </div>
                <button 
                  onClick={() => setIsImportModalOpen(false)}
                  className="p-2 hover:bg-zinc-100 rounded-xl text-zinc-400 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-emerald-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-emerald-900">CSV Format Guide</p>
                    <p className="text-xs text-emerald-700 mt-1 leading-relaxed">
                      Your CSV should include headers: <code className="bg-emerald-100 px-1 rounded">name, email, phone, company, type, status, source, tags</code>.
                    </p>
                    <button 
                      onClick={downloadTemplate}
                      className="mt-3 text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      Download Template
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="border-2 border-dashed border-zinc-200 rounded-2xl p-10 flex flex-col items-center justify-center gap-4 hover:border-emerald-500/50 hover:bg-emerald-50/30 transition-all group relative">
                    <div className="p-4 bg-zinc-50 rounded-full group-hover:bg-emerald-100 transition-all">
                      <Download className="w-8 h-8 text-zinc-400 group-hover:text-emerald-600" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-zinc-900">Click to upload or drag and drop</p>
                      <p className="text-xs text-zinc-500 mt-1">CSV files only (max 10MB)</p>
                    </div>
                    <input 
                      type="file" 
                      accept=".csv"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImport(file);
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>

                  {importError && (
                    <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-xs font-bold">
                      <AlertCircle className="w-4 h-4" />
                      {importError}
                    </div>
                  )}
                </div>

                <div className="pt-4 flex justify-end">
                  <button 
                    onClick={() => setIsImportModalOpen(false)}
                    className="px-6 py-2.5 text-sm font-bold text-zinc-500 hover:text-zinc-700 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Create Lead Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreateModalOpen(false)}
              className="fixed inset-0 bg-zinc-900/40 backdrop-blur-md z-[60]"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-3xl shadow-2xl z-[70] overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                <div>
                  <h2 className="text-xl font-bold text-zinc-900">Create New Lead</h2>
                  <p className="text-xs text-zinc-500 mt-1">Add a new prospect to your sales pipeline.</p>
                </div>
                <button 
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-2 hover:bg-zinc-100 rounded-xl text-zinc-400 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateLead} className="p-8 overflow-y-auto space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Full Name</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. John Doe"
                      value={newLead.name}
                      onChange={(e) => setNewLead({...newLead, name: e.target.value})}
                      className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Email Address</label>
                    <input 
                      required
                      type="email" 
                      placeholder="john@example.com"
                      value={newLead.email}
                      onChange={(e) => setNewLead({...newLead, email: e.target.value})}
                      className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Phone Number</label>
                    <input 
                      type="tel" 
                      placeholder="(555) 000-0000"
                      value={newLead.phone}
                      onChange={(e) => setNewLead({...newLead, phone: e.target.value})}
                      className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Company</label>
                    <input 
                      type="text" 
                      placeholder="Company Name"
                      value={newLead.company}
                      onChange={(e) => setNewLead({...newLead, company: e.target.value})}
                      className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Lead Type</label>
                    <div className="flex bg-zinc-100 p-1 rounded-xl border border-zinc-200">
                      {(['Tenant', 'Landlord'] as const).map((t) => (
                        <button 
                          key={t}
                          type="button"
                          onClick={() => setNewLead({...newLead, type: t})}
                          className={clsx(
                            "flex-1 py-2 rounded-lg text-xs font-bold transition-all",
                            newLead.type === t ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
                          )}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Source</label>
                    <select 
                      value={newLead.source}
                      onChange={(e) => setNewLead({...newLead, source: e.target.value as any})}
                      className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    >
                      {['Website', 'Referral', 'Social Media', 'Direct'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Tags (Comma separated)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. VIP, Urgent, Investor"
                    onChange={(e) => setNewLead({...newLead, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t)})}
                    className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>

                <div className="pt-6 border-t border-zinc-100 flex justify-end gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-6 py-2.5 text-sm font-bold text-zinc-500 hover:text-zinc-700 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-8 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                  >
                    Create Lead
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
