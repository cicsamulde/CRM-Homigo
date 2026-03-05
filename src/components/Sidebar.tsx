import React from 'react';
import { LayoutDashboard, Building2, Users, Wrench, BarChart3, Settings, LogOut, ShieldCheck, Target, CreditCard, MessageSquare, ArrowUpRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
  { id: 'verifications', label: 'Verifications', icon: ShieldCheck },
  { id: 'leads', label: 'Lead Management', icon: Target },
  { id: 'landlords', label: 'Landlords', icon: Users },
  { id: 'properties', label: 'Listings', icon: Building2 },
  { id: 'tenants', label: 'Tenants', icon: Users },
  { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
  { id: 'conversations', label: 'Conversations', icon: MessageSquare },
  { id: 'support', label: 'Support Tickets', icon: Wrench },
  { id: 'heatmap', label: 'Demand Heatmap', icon: Target },
  { id: 'analytics', label: 'Platform Growth', icon: BarChart3 },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout, isCollapsed, setIsCollapsed }) => {
  return (
    <aside className={cn(
      "bg-zinc-950 text-zinc-400 flex flex-col h-screen border-r border-zinc-800 transition-all duration-300 ease-in-out relative",
      isCollapsed ? "w-20" : "w-64"
    )}>
      <div className={cn("p-6 flex items-center gap-3", isCollapsed && "justify-center px-0")}>
        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shrink-0">
          <Building2 className="text-zinc-950 w-5 h-5" />
        </div>
        {!isCollapsed && <span className="text-xl font-bold text-white tracking-tight">Homigo</span>}
      </div>

      <nav className={cn("flex-1 px-4 py-4 space-y-1", isCollapsed && "px-2")}>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            title={isCollapsed ? item.label : undefined}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 text-sm font-medium",
              activeTab === item.id 
                ? "bg-zinc-800 text-white shadow-sm" 
                : "hover:bg-zinc-900 hover:text-zinc-200",
              isCollapsed && "justify-center px-0"
            )}
          >
            <item.icon className={cn("w-4 h-4 shrink-0", activeTab === item.id ? "text-emerald-400" : "text-zinc-500")} />
            {!isCollapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className={cn("p-4 border-t border-zinc-800 space-y-1", isCollapsed && "px-2")}>
        <button 
          onClick={() => setActiveTab('settings')}
          title={isCollapsed ? "Settings" : undefined}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all",
            activeTab === 'settings' ? "bg-zinc-800 text-white" : "hover:bg-zinc-900 hover:text-zinc-200",
            isCollapsed && "justify-center px-0"
          )}
        >
          <Settings className="w-4 h-4 text-zinc-500 shrink-0" />
          {!isCollapsed && <span>Settings</span>}
        </button>
        <button 
          onClick={onLogout}
          title={isCollapsed ? "Logout" : undefined}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-zinc-900 hover:text-red-400 transition-all",
            isCollapsed && "justify-center px-0"
          )}
        >
          <LogOut className="w-4 h-4 text-zinc-500 shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>

      {/* Collapse Toggle Button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-zinc-800 border border-zinc-700 rounded-full flex items-center justify-center text-zinc-400 hover:text-white transition-colors z-50"
      >
        <div className={cn("transition-transform duration-300", isCollapsed ? "rotate-180" : "rotate-0")}>
          <ArrowUpRight className="w-3 h-3 rotate-45" />
        </div>
      </button>
    </aside>
  );
};
