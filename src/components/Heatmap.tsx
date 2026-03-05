import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Map as MapIcon, Layers, Info, Filter, TrendingUp, Users, Building2, Search } from 'lucide-react';
import { cn } from '../lib/utils';
import * as d3 from 'd3';

interface RegionData {
  id: string;
  name: string;
  demand: number; // 0-100
  supply: number; // 0-100
  avgRent: number;
  growth: number;
  coords: [number, number]; // x, y for grid
}

const MOCK_REGIONS: RegionData[] = [
  { id: 'r1', name: 'Downtown Core', demand: 95, supply: 40, avgRent: 3200, growth: 12.5, coords: [2, 2] },
  { id: 'r2', name: 'West End', demand: 82, supply: 65, avgRent: 2800, growth: 8.2, coords: [1, 2] },
  { id: 'r3', name: 'North Heights', demand: 45, supply: 80, avgRent: 2100, growth: -2.1, coords: [2, 1] },
  { id: 'r4', name: 'East Side', demand: 70, supply: 30, avgRent: 2400, growth: 15.4, coords: [3, 2] },
  { id: 'r5', name: 'South Waterfront', demand: 88, supply: 20, avgRent: 3500, growth: 18.2, coords: [2, 3] },
  { id: 'r6', name: 'Tech District', demand: 92, supply: 55, avgRent: 3100, growth: 10.5, coords: [3, 3] },
  { id: 'r7', name: 'Suburban West', demand: 30, supply: 90, avgRent: 1800, growth: 1.5, coords: [0, 2] },
  { id: 'r8', name: 'University Quarter', demand: 98, supply: 15, avgRent: 1900, growth: 5.0, coords: [1, 1] },
  { id: 'r9', name: 'Arts District', demand: 65, supply: 45, avgRent: 2600, growth: 9.8, coords: [1, 3] },
];

export const Heatmap: React.FC = () => {
  const [activeMetric, setActiveMetric] = useState<'demand' | 'supply' | 'avgRent'>('demand');
  const [selectedRegion, setSelectedRegion] = useState<RegionData | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const getMetricColor = (value: number, metric: string) => {
    if (metric === 'avgRent') {
      const normalized = (value - 1800) / (3500 - 1800);
      return d3.interpolateYlOrRd(normalized);
    }
    return d3.interpolateYlOrRd(value / 100);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 h-full flex flex-col"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Market Demand Heatmap</h1>
          <p className="text-zinc-500 mt-1">Geographic visualization of supply, demand, and pricing trends.</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl border border-zinc-200 shadow-sm">
          {(['demand', 'supply', 'avgRent'] as const).map((m) => (
            <button 
              key={m}
              onClick={() => setActiveMetric(m)}
              className={cn(
                "px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize",
                activeMetric === m ? "bg-zinc-900 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-900"
              )}
            >
              {m === 'avgRent' ? 'Avg Rent' : m}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        {/* Map Visualization */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden relative flex flex-col">
          <div className="p-4 border-b border-zinc-50 flex justify-between items-center bg-zinc-50/30">
            <div className="flex items-center gap-2">
              <MapIcon className="w-4 h-4 text-zinc-400" />
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Metropolis City Grid</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gradient-to-r from-[#ffffb2] via-[#fd8d3c] to-[#bd0026] rounded-full" />
                <span className="text-[10px] font-bold text-zinc-400 uppercase">Low → High</span>
              </div>
              <button className="p-1.5 hover:bg-zinc-100 rounded-lg text-zinc-400 transition-colors">
                <Layers className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 relative p-8 flex items-center justify-center bg-zinc-50/50">
            <div className="grid grid-cols-4 grid-rows-4 gap-4 w-full max-w-2xl aspect-square">
              {Array.from({ length: 16 }).map((_, i) => {
                const x = i % 4;
                const y = Math.floor(i / 4);
                const region = MOCK_REGIONS.find(r => r.coords[0] === x && r.coords[1] === y);
                
                return (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.02, zIndex: 10 }}
                    onClick={() => region && setSelectedRegion(region)}
                    className={cn(
                      "rounded-2xl border-2 transition-all relative group overflow-hidden",
                      region ? "cursor-pointer shadow-sm" : "bg-zinc-100/50 border-zinc-200/50 cursor-default border-dashed"
                    )}
                    style={{
                      backgroundColor: region ? getMetricColor(region[activeMetric], activeMetric) : undefined,
                      borderColor: region ? 'white' : undefined,
                      opacity: region ? 0.9 : 0.3
                    }}
                  >
                    {region && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center">
                        <span className={cn(
                          "text-[10px] font-black uppercase tracking-tighter leading-none mb-1",
                          region[activeMetric] > 60 ? "text-white/90" : "text-zinc-900/60"
                        )}>
                          {region.name}
                        </span>
                        <span className={cn(
                          "text-lg font-black",
                          region[activeMetric] > 60 ? "text-white" : "text-zinc-900"
                        )}>
                          {activeMetric === 'avgRent' ? `$${region.avgRent}` : `${region[activeMetric]}%`}
                        </span>
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Floating Legend Overlay */}
            <div className="absolute bottom-6 left-6 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-white shadow-xl max-w-xs">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-3 h-3 text-emerald-500" />
                <span className="text-[10px] font-bold text-zinc-900 uppercase tracking-wider">Market Insight</span>
              </div>
              <p className="text-[11px] text-zinc-600 leading-relaxed">
                The <span className="font-bold text-zinc-900">South Waterfront</span> currently shows the highest supply-demand gap with an 18.2% growth rate.
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar Details */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm p-6 space-y-6">
            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Region Analysis</h3>
            
            {selectedRegion ? (
              <motion.div 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold text-zinc-900">{selectedRegion.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={cn(
                      "text-xs font-bold px-2 py-0.5 rounded-full",
                      selectedRegion.growth > 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                    )}>
                      {selectedRegion.growth > 0 ? '+' : ''}{selectedRegion.growth}% Growth
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-zinc-400" />
                        <span className="text-xs font-bold text-zinc-500">Market Demand</span>
                      </div>
                      <span className="text-sm font-bold text-zinc-900">{selectedRegion.demand}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: `${selectedRegion.demand}%` }} />
                    </div>
                  </div>

                  <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-zinc-400" />
                        <span className="text-xs font-bold text-zinc-500">Available Supply</span>
                      </div>
                      <span className="text-sm font-bold text-zinc-900">{selectedRegion.supply}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: `${selectedRegion.supply}%` }} />
                    </div>
                  </div>

                  <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-zinc-400" />
                        <span className="text-xs font-bold text-zinc-500">Avg. Monthly Rent</span>
                      </div>
                      <span className="text-sm font-black text-zinc-900">${selectedRegion.avgRent}</span>
                    </div>
                  </div>
                </div>

                <button className="w-full py-3 bg-zinc-900 text-white rounded-2xl font-bold text-sm hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200">
                  View Properties in Area
                </button>
              </motion.div>
            ) : (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto">
                  <Search className="w-8 h-8 text-zinc-200" />
                </div>
                <p className="text-sm text-zinc-400 px-4">Select a region on the map to view detailed market analytics.</p>
              </div>
            )}
          </div>

          <div className="bg-zinc-900 rounded-3xl p-6 text-white space-y-4">
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Global Trend</h4>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold">+14.2%</span>
              <span className="text-xs text-emerald-400 font-bold mb-1">Overall Demand</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Platform-wide demand has increased by 14.2% compared to the previous quarter, primarily driven by the Tech District expansion.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
