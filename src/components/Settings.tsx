import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Shield, Bell, Globe, Save, Lock, Mail, Smartphone, CreditCard, Database, Users, MoreVertical, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';
import { INTERNAL_USERS } from '../constants';
import { Role } from '../types';

export const Settings: React.FC = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);

  const sections = [
    { id: 'profile', label: 'Admin Profile', icon: User },
    { id: 'roles', label: 'Roles & Permissions', icon: ShieldCheck },
    { id: 'security', label: 'Security & Auth', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'platform', label: 'Platform Config', icon: Globe },
    { id: 'billing', label: 'Billing & Tiers', icon: CreditCard },
    { id: 'system', label: 'System Health', icon: Database },
  ];

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">System Settings</h1>
          <p className="text-zinc-500 mt-1">Configure Homigo internal operations and security.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-md shadow-emerald-100 disabled:opacity-70"
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                activeSection === section.id 
                  ? "bg-zinc-900 text-white shadow-lg shadow-zinc-200" 
                  : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
              )}
            >
              <section.icon className="w-4 h-4" />
              {section.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden">
          <div className="p-8">
            {activeSection === 'profile' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-zinc-900">Admin Profile</h3>
                  <p className="text-sm text-zinc-500">Your personal information within the internal system.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">Full Name</label>
                    <input 
                      type="text" 
                      defaultValue="Alex Thompson"
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">Admin Role</label>
                    <input 
                      type="text" 
                      defaultValue="Senior Operations Manager"
                      disabled
                      className="w-full px-4 py-3 bg-zinc-100 border border-zinc-100 rounded-2xl text-sm text-zinc-500 cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <input 
                        type="email" 
                        defaultValue="alex.t@homigo.com"
                        className="w-full pl-11 pr-4 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">Phone Number</label>
                    <div className="relative">
                      <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <input 
                        type="tel" 
                        defaultValue="+1 (555) 000-1234"
                        className="w-full pl-11 pr-4 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'roles' && (
              <div className="space-y-8">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900">Roles & Permissions</h3>
                    <p className="text-sm text-zinc-500">Manage internal user access levels and system permissions.</p>
                  </div>
                  <button className="px-4 py-2 bg-zinc-900 text-white rounded-xl text-xs font-bold hover:bg-zinc-800 transition-all">
                    Invite Internal User
                  </button>
                </div>

                <div className="overflow-hidden border border-zinc-100 rounded-2xl">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-zinc-50 border-b border-zinc-100">
                        <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">User</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Role</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Status</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Last Active</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50">
                      {INTERNAL_USERS.map((user) => (
                        <tr key={user.id} className="hover:bg-zinc-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-zinc-100 rounded-full flex items-center justify-center text-xs font-bold text-zinc-500">
                                {user.name.charAt(0)}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-zinc-900">{user.name}</p>
                                <p className="text-xs text-zinc-500">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <select 
                              defaultValue={user.role}
                              className="text-xs font-bold text-zinc-700 bg-white border border-zinc-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                            >
                              <option value="Super Admin">Super Admin</option>
                              <option value="Admin">Admin</option>
                              <option value="Editor">Editor</option>
                              <option value="Viewer">Viewer</option>
                            </select>
                          </td>
                          <td className="px-6 py-4">
                            <span className={cn(
                              "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                              user.status === 'Active' ? "bg-emerald-50 text-emerald-600" : "bg-zinc-100 text-zinc-500"
                            )}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs text-zinc-500">
                            {user.lastActive}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-400 transition-colors">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-100 space-y-4">
                    <h4 className="text-sm font-bold text-zinc-900">Role Definitions</h4>
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-zinc-900">Super Admin</p>
                          <p className="text-[10px] text-zinc-500">Full access to all modules, settings, and user management.</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-zinc-900">Editor</p>
                          <p className="text-[10px] text-zinc-500">Can manage listings, leads, and support but cannot change global settings.</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 mt-1.5 shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-zinc-900">Viewer</p>
                          <p className="text-[10px] text-zinc-500">Read-only access to analytics and overview dashboards.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-100 space-y-4">
                    <h4 className="text-sm font-bold text-zinc-900">Security Audit Log</h4>
                    <div className="space-y-3">
                      {[
                        { action: 'Role Changed', user: 'Alex T.', target: 'Sarah M.', time: '2h ago' },
                        { action: 'User Invited', user: 'Alex T.', target: 'James C.', time: '1d ago' },
                        { action: 'Login Attempt', user: 'Emma D.', target: 'Failed', time: '2d ago' },
                      ].map((log, i) => (
                        <div key={i} className="flex justify-between items-center text-[10px]">
                          <div className="flex gap-2">
                            <span className="font-bold text-zinc-900">{log.action}</span>
                            <span className="text-zinc-400">by {log.user}</span>
                          </div>
                          <span className="text-zinc-400">{log.time}</span>
                        </div>
                      ))}
                    </div>
                    <button className="w-full py-2 text-[10px] font-bold text-emerald-600 hover:underline border-t border-zinc-200 mt-2">
                      View Full Audit Trail
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'security' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-zinc-900">Security Settings</h3>
                  <p className="text-sm text-zinc-500">Manage your password and authentication methods.</p>
                </div>

                <div className="space-y-6">
                  <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white rounded-xl shadow-sm">
                        <Lock className="w-5 h-5 text-zinc-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-zinc-900">Two-Factor Authentication</p>
                        <p className="text-xs text-zinc-500">Add an extra layer of security to your account.</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-all">
                      Enable 2FA
                    </button>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">Change Password</h4>
                    <div className="grid grid-cols-1 gap-4">
                      <input 
                        type="password" 
                        placeholder="Current Password"
                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                      />
                      <input 
                        type="password" 
                        placeholder="New Password"
                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'notifications' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-zinc-900">Notification Preferences</h3>
                  <p className="text-sm text-zinc-500">Control which alerts you receive from the system.</p>
                </div>

                <div className="space-y-4">
                  {[
                    { title: 'New Lead Alerts', desc: 'Notify when a new tenant or landlord lead is captured.' },
                    { title: 'Verification Requests', desc: 'Alert when new KYC or property documents are uploaded.' },
                    { title: 'Flagged Conversations', desc: 'Immediate alert for suspicious user interactions.' },
                    { title: 'System Health Reports', desc: 'Daily summary of platform performance and errors.' },
                  ].map((item, i) => (
                    <label key={i} className="flex items-center justify-between p-4 hover:bg-zinc-50 rounded-2xl transition-colors cursor-pointer group">
                      <div>
                        <p className="text-sm font-bold text-zinc-900">{item.title}</p>
                        <p className="text-xs text-zinc-500">{item.desc}</p>
                      </div>
                      <div className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'platform' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-zinc-900">Platform Configuration</h3>
                  <p className="text-sm text-zinc-500">Global settings for the Homigo marketplace.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">Default Commission Rate (%)</label>
                    <input 
                      type="number" 
                      defaultValue="10"
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">Maintenance Fee ($)</label>
                    <input 
                      type="number" 
                      defaultValue="25"
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
