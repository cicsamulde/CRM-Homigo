import React from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { PropertyList } from './components/PropertyList';
import { TenantList } from './components/TenantList';
import { LandlordList } from './components/LandlordList';
import { SupportTickets } from './components/SupportTickets';
import { VerificationCenter } from './components/VerificationCenter';
import { LeadManagement } from './components/LeadManagement';
import { SubscriptionManagement } from './components/SubscriptionManagement';
import { ConversationModeration } from './components/ConversationModeration';
import { Settings } from './components/Settings';
import { Login } from './components/Login';
import { Analytics } from './components/Analytics';
import { Heatmap } from './components/Heatmap';
import { useState, useEffect } from 'react';
import { Bell, Search, User } from 'lucide-react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Simple session check
  useEffect(() => {
    const session = localStorage.getItem('homigo_session');
    if (session) setIsAuthenticated(true);
  }, []);

  const handleLogin = () => {
    localStorage.setItem('homigo_session', 'active');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('homigo_session');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'verifications':
        return <VerificationCenter />;
      case 'leads':
        return <LeadManagement />;
      case 'landlords':
        return <LandlordList />;
      case 'properties':
        return <PropertyList />;
      case 'tenants':
        return <TenantList />;
      case 'subscriptions':
        return <SubscriptionManagement />;
      case 'conversations':
        return <ConversationModeration />;
      case 'support':
        return <SupportTickets />;
      case 'heatmap':
        return <Heatmap />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-zinc-400">
            <h2 className="text-xl font-medium">Feature coming soon</h2>
            <p>We're working hard to bring you the {activeTab} module.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-zinc-50 font-sans text-zinc-900">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout} 
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-6 shrink-0">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search anything..." 
              className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-transparent rounded-lg text-sm outline-none focus:bg-white focus:border-zinc-200 transition-all"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-zinc-500 hover:bg-zinc-50 rounded-full relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-zinc-200 mx-2"></div>
            <button className="flex items-center gap-3 pl-2 pr-1 py-1 hover:bg-zinc-50 rounded-lg transition-all">
              <div className="text-right">
                <p className="text-sm font-semibold text-zinc-900">Alex Rivera</p>
                <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Administrator</p>
              </div>
              <div className="w-8 h-8 bg-zinc-900 rounded-full flex items-center justify-center">
                <User className="text-white w-4 h-4" />
              </div>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="w-full h-full">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}
