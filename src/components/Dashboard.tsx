import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { Building2, Users, Wrench, TrendingUp, ArrowUpRight, ArrowDownRight, DollarSign, UserPlus, ShieldCheck, Target, CreditCard, MessageSquare } from 'lucide-react';
import { PROPERTIES, LANDLORDS, SUPPORT_TICKETS, PLATFORM_METRICS, LEADS, SUBSCRIPTIONS, CONVERSATIONS } from '../constants';
import { formatCurrency } from '../lib/utils';
import { motion } from 'motion/react';
import { clsx } from 'clsx';

const StatCard = ({ title, value, icon: Icon, trend, trendValue }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-zinc-50 rounded-lg">
        <Icon className="w-5 h-5 text-zinc-600" />
      </div>
      {trend && (
        <div className={clsx(
          "flex items-center text-xs font-medium px-2 py-1 rounded-full",
          trend === 'up' ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
        )}>
          {trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
          {trendValue}
        </div>
      )}
    </div>
    <h3 className="text-zinc-500 text-sm font-medium mb-1">{title}</h3>
    <p className="text-2xl font-bold text-zinc-900">{value}</p>
  </div>
);

export const Dashboard: React.FC = () => {
  const [activeKPI, setActiveKPI] = useState<'commission' | 'gmv' | 'newUsers'>('commission');
  const [activeTimeline, setActiveTimeline] = useState<'YOY' | '6M' | '3M'>('YOY');
  const [showPreviousYear, setShowPreviousYear] = useState(true);

  const totalGMV = PLATFORM_METRICS.reduce((acc, curr) => acc + curr.gmv, 0);
  const subscriptionRevenue = SUBSCRIPTIONS.reduce((acc, curr) => acc + curr.amount, 0);
  const pendingLandlords = LANDLORDS.filter(l => l.kycStatus === 'Pending').length;
  const pendingProperties = PROPERTIES.filter(p => p.verificationStatus === 'Pending').length;
  const totalPendingVerifications = pendingLandlords + pendingProperties;
  const flaggedConversations = CONVERSATIONS.filter(c => c.status === 'Flagged').length;

  // Process data for YOY or Timeline
  const chartData = React.useMemo(() => {
    if (activeTimeline === 'YOY') {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return months.map(m => {
        const currentYearData = PLATFORM_METRICS.find(d => d.month === m && d.year === 2024);
        const previousYearData = PLATFORM_METRICS.find(d => d.month === m && d.year === 2023);
        return {
          month: m,
          current: currentYearData ? currentYearData[activeKPI] : null,
          previous: previousYearData ? previousYearData[activeKPI] : null,
        };
      });
    } else {
      const count = activeTimeline === '6M' ? 6 : 3;
      return PLATFORM_METRICS.slice(-count).map(d => ({
        month: `${d.month} ${d.year}`,
        current: d[activeKPI],
      }));
    }
  }, [activeKPI, activeTimeline]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 w-full"
    >
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Marketplace Overview</h1>
          <p className="text-zinc-500 mt-1">Homigo internal operations and platform performance.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-all">
            Export Data
          </button>
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-all shadow-sm">
            Review Pending Listings
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total GMV" 
          value={formatCurrency(totalGMV)} 
          icon={DollarSign} 
          trend="up" 
          trendValue="18.2%" 
        />
        <StatCard 
          title="Subscription Revenue" 
          value={formatCurrency(subscriptionRevenue)} 
          icon={CreditCard} 
          trend="up" 
          trendValue="12.4%" 
        />
        <StatCard 
          title="Pending Verifications" 
          value={totalPendingVerifications} 
          icon={ShieldCheck} 
          trend="up" 
          trendValue={`${totalPendingVerifications} items`} 
        />
        <StatCard 
          title="Flagged Chats" 
          value={flaggedConversations} 
          icon={MessageSquare} 
          trend="down" 
          trendValue="Action Required" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-zinc-900">Platform Performance</h2>
              <select 
                value={activeKPI}
                onChange={(e) => setActiveKPI(e.target.value as any)}
                className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border-none outline-none cursor-pointer hover:bg-emerald-100 transition-colors"
              >
                <option value="commission">Commission Growth</option>
                <option value="gmv">GMV Performance</option>
                <option value="newUsers">User Acquisition</option>
              </select>
            </div>
            <div className="flex gap-2">
              <div className="flex bg-zinc-100 p-1 rounded-lg mr-4">
                {(['YOY', '6M', '3M'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveTimeline(t)}
                    className={clsx(
                      "px-3 py-1 rounded-md text-[10px] font-bold transition-all",
                      activeTimeline === t ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                <div className={clsx(
                  "w-2 h-2 rounded-full",
                  activeKPI === 'commission' ? "bg-emerald-500" : 
                  activeKPI === 'gmv' ? "bg-blue-500" : "bg-purple-500"
                )} />
                {activeTimeline === 'YOY' ? 'Current Year' : (activeKPI === 'commission' ? 'Revenue' : activeKPI === 'gmv' ? 'Volume' : 'Users')}
              </span>
              {activeTimeline === 'YOY' && (
                <button 
                  onClick={() => setShowPreviousYear(!showPreviousYear)}
                  className={clsx(
                    "flex items-center gap-1.5 text-xs ml-2 transition-all px-2 py-0.5 rounded-md",
                    showPreviousYear ? "text-zinc-500 bg-zinc-50" : "text-zinc-300 opacity-50 hover:opacity-100"
                  )}
                >
                  <div className={clsx(
                    "w-2 h-2 rounded-full",
                    showPreviousYear ? "bg-zinc-300" : "bg-zinc-200"
                  )} />
                  Previous Year
                </button>
              )}
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorKPI" x1="0" y1="0" x2="0" y2="1">
                    <stop 
                      offset="5%" 
                      stopColor={activeKPI === 'commission' ? "#10b981" : activeKPI === 'gmv' ? "#3b82f6" : "#a855f7"} 
                      stopOpacity={0.1}
                    />
                    <stop 
                      offset="95%" 
                      stopColor={activeKPI === 'commission' ? "#10b981" : activeKPI === 'gmv' ? "#3b82f6" : "#a855f7"} 
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#71717a', fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#71717a', fontSize: 12 }}
                  tickFormatter={(value) => {
                    if (activeKPI === 'newUsers') return value;
                    return `$${value / 1000}k`;
                  }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e4e4e7', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: '600', padding: '2px 0' }}
                  labelStyle={{ fontSize: '11px', fontWeight: '700', color: '#71717a', marginBottom: '4px', textTransform: 'uppercase' }}
                  formatter={(value: any, name: string) => [
                    activeKPI === 'newUsers' ? value : formatCurrency(value),
                    name === 'current' ? (activeTimeline === 'YOY' ? '2024' : 'Current') : '2023'
                  ]}
                />
                {activeTimeline === 'YOY' && showPreviousYear && (
                  <Area 
                    type="monotone" 
                    dataKey="previous" 
                    stroke="#d1d1d6" 
                    strokeWidth={2}
                    fill="transparent"
                    strokeDasharray="5 5"
                    animationDuration={500}
                  />
                )}
                <Area 
                  type="monotone" 
                  dataKey="current" 
                  stroke={activeKPI === 'commission' ? "#10b981" : activeKPI === 'gmv' ? "#3b82f6" : "#a855f7"} 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorKPI)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-900 mb-6">Critical Tickets</h2>
          <div className="space-y-6">
            {SUPPORT_TICKETS.map((ticket) => (
              <div key={ticket.id} className="flex gap-4">
                <div className={clsx(
                  "w-2 h-2 mt-2 rounded-full shrink-0",
                  ticket.priority === 'High' ? "bg-red-500" : ticket.priority === 'Medium' ? "bg-amber-500" : "bg-blue-500"
                )} />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-medium text-zinc-900">{ticket.subject}</p>
                    <span className="text-[10px] text-zinc-400">{ticket.createdAt}</span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    From: {ticket.userType} • ID: {ticket.userId}
                  </p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className={clsx(
                      "text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full",
                      ticket.status === 'In Progress' ? "bg-amber-50 text-amber-600" : "bg-zinc-100 text-zinc-600"
                    )}>
                      {ticket.status}
                    </span>
                    <button className="text-[10px] font-bold text-emerald-600 hover:underline">Assign</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors border-t border-zinc-100 pt-4">
            View All Tickets
          </button>
        </div>
      </div>
    </motion.div>
  );
};
