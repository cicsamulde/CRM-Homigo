import React, { useState } from 'react';
import { MessageSquare, Search, Filter, MoreVertical, Flag, ShieldAlert, CheckCircle2, XCircle, User, Clock, AlertTriangle } from 'lucide-react';
import { CONVERSATIONS } from '../constants';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export const ConversationModeration: React.FC = () => {
  const [selectedConv, setSelectedConv] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredConversations = CONVERSATIONS.filter(conv => {
    const participantNames = conv.participants.map(p => p.name).join(' ').toLowerCase();
    return participantNames.includes(searchTerm.toLowerCase()) || 
           conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Conversation Moderation</h1>
          <p className="text-zinc-500 mt-1">Monitor and moderate user interactions to ensure platform safety.</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl border border-zinc-200 shadow-sm">
          <button className="px-4 py-1.5 bg-zinc-900 text-white rounded-lg text-sm font-medium shadow-sm">
            All Chats
          </button>
          <button className="px-4 py-1.5 text-zinc-500 hover:text-zinc-900 rounded-lg text-sm font-medium transition-all">
            Flagged Only
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-220px)]">
        {/* Conversation List */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-zinc-100 shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-zinc-50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input 
                type="text" 
                placeholder="Search conversations..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-zinc-50">
            {filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConv(conv)}
                className={cn(
                  "w-full p-4 text-left hover:bg-zinc-50 transition-all flex flex-col gap-2",
                  selectedConv?.id === conv.id ? "bg-zinc-50 border-l-4 border-emerald-500" : "border-l-4 border-transparent"
                )}
              >
                <div className="flex justify-between items-start">
                  <div className="flex -space-x-2">
                    {conv.participants.map((p, idx) => (
                      <div key={p.id} className={cn(
                        "w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white",
                        idx === 0 ? "bg-emerald-500" : "bg-blue-500"
                      )}>
                        {p.name.charAt(0)}
                      </div>
                    ))}
                  </div>
                  {conv.status === 'Flagged' && (
                    <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3" />
                      Flagged
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-900 truncate">
                    {conv.participants.map(p => p.name).join(' & ')}
                  </p>
                  <p className="text-xs text-zinc-500 mt-0.5 truncate italic">"{conv.lastMessage}"</p>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-[10px] text-zinc-400 font-medium">{conv.updatedAt}</span>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">
                    {conv.messages.length} Messages
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat View & Moderation */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <AnimatePresence mode="wait">
            {selectedConv ? (
              <motion.div 
                key={selectedConv.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col h-full gap-6"
              >
                {/* Chat Header */}
                <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {selectedConv.participants.map((p, idx) => (
                        <div key={p.id} className={cn(
                          "w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white",
                          idx === 0 ? "bg-emerald-500" : "bg-blue-500"
                        )}>
                          {p.name.charAt(0)}
                        </div>
                      ))}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-zinc-900">
                        {selectedConv.participants.map(p => p.name).join(' & ')}
                      </h3>
                      <p className="text-xs text-zinc-500">
                        {selectedConv.participants.map(p => `${p.name} (${p.role})`).join(' • ')}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-400">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 bg-white rounded-2xl border border-zinc-100 shadow-sm p-6 overflow-y-auto space-y-6">
                  {selectedConv.messages.map((msg: any) => (
                    <div key={msg.id} className={cn(
                      "flex flex-col gap-1 max-w-[80%]",
                      msg.senderId.startsWith('l') ? "self-start" : "self-end items-end ml-auto"
                    )}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{msg.senderName}</span>
                        <span className="text-[10px] text-zinc-300">{msg.timestamp}</span>
                        {msg.isFlagged && <AlertTriangle className="w-3 h-3 text-red-500" />}
                      </div>
                      <div className={cn(
                        "p-4 rounded-2xl text-sm",
                        msg.isFlagged ? "bg-red-50 border border-red-100 text-red-900" : 
                        msg.senderId.startsWith('l') ? "bg-zinc-100 text-zinc-900 rounded-tl-none" : "bg-emerald-600 text-white rounded-tr-none"
                      )}>
                        {msg.content}
                      </div>
                      {msg.isFlagged && (
                        <p className="text-[10px] font-bold text-red-600 uppercase tracking-tighter mt-1 flex items-center gap-1">
                          <Flag className="w-2.5 h-2.5" />
                          Flagged by System: Potential Off-Platform Payment Request
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Moderation Actions */}
                <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6 flex gap-4">
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Moderation Actions</h4>
                    <div className="flex gap-3">
                      <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-zinc-900 text-white rounded-xl text-sm font-bold hover:bg-zinc-800 transition-all">
                        <ShieldAlert className="w-4 h-4" />
                        Warn Users
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white border border-red-200 text-red-600 rounded-xl text-sm font-bold hover:bg-red-50 transition-all">
                        <XCircle className="w-4 h-4" />
                        Suspend Chat
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white border border-zinc-200 text-zinc-600 rounded-xl text-sm font-bold hover:bg-zinc-50 transition-all">
                        <CheckCircle2 className="w-4 h-4" />
                        Clear Flags
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-zinc-400 bg-zinc-50/50 rounded-2xl border-2 border-dashed border-zinc-200 p-12">
                <MessageSquare className="w-16 h-16 mb-4 opacity-10" />
                <h3 className="text-lg font-medium">Select a conversation to moderate</h3>
                <p className="text-sm">Choose a chat from the list on the left to review message history.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
