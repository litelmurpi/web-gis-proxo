import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { Download, TrendingDown, AlertTriangle } from "lucide-react";
import EmptyState from "../components/common/EmptyState";

// Mock Data untuk Bar Chart (Risiko per Kecamatan)
const districtData = [
  { name: "Menteng", heat: 85, flood: 30, population: 15 },
  { name: "Kebayoran", heat: 65, flood: 60, population: 20 },
  { name: "Kelapa Gading", heat: 70, flood: 90, population: 18 },
  { name: "Cilandak", heat: 60, flood: 40, population: 12 },
  { name: "Tebet", heat: 75, flood: 55, population: 22 },
];

// Mock Data untuk Area Chart (Trend Suhu 5 Tahun)
const trendData = [
  { year: "2024", temp: 34.2, projected: 34.2 },
  { year: "2025", temp: 34.5, projected: 33.8 },
  { year: "2026", temp: 34.8, projected: 33.1 },
  { year: "2027", temp: 35.1, projected: 32.5 },
  { year: "2028", temp: 35.5, projected: 31.8 },
];

// Custom Tooltip for Charts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/80 backdrop-blur-md border border-white/10 p-3 rounded-lg shadow-2xl">
        <p className="text-white font-medium text-sm mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex flex-col gap-1 mb-1">
            <span
              className="text-[10px] uppercase tracking-wider"
              style={{ color: entry.color }}
            >
              {entry.name}
            </span>
            <span className="text-white font-mono text-sm">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  if (!districtData.length || !trendData.length) {
    return (
      <div className="h-full w-full bg-base-950 p-6 lg:p-10 flex items-center justify-center">
        <EmptyState
          title="No Analytics Data Yet"
          message="Analytics models are currently being generated. Please run a simulation or connect the GEE backend to see city-wide risk distributions."
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-base-950 p-6 lg:p-10 overflow-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-heading font-semibold text-white tracking-tight">
            City{" "}
            <span className="font-emphasis italic font-normal text-primary-400">
              Analytics
            </span>
          </h1>
          <p className="text-base-400 text-sm mt-1">
            Comprehensive overview of urban risk factors.
          </p>
        </div>

        <button className="bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all py-2 px-4 rounded-xl text-sm font-medium flex items-center justify-center gap-2 outline-none">
          <Download className="w-4 h-4 opacity-70" />
          Export Report
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-base-900 border border-white/5 p-5 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
            <AlertTriangle className="w-16 h-16 text-red-500" />
          </div>
          <p className="text-base-400 text-xs font-medium uppercase tracking-wider mb-2">
            Highest Heat Risk
          </p>
          <p className="text-3xl items-baseline flex gap-1 font-semibold text-white">
            Menteng
          </p>
          <p className="text-red-400 text-sm mt-2 font-mono bg-red-500/10 inline-block px-2 py-0.5 rounded">
            LST: 42.5°C
          </p>
        </div>

        <div className="bg-base-900 border border-white/5 p-5 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
            <AlertTriangle className="w-16 h-16 text-blue-500" />
          </div>
          <p className="text-base-400 text-xs font-medium uppercase tracking-wider mb-2">
            Highest Flood Risk
          </p>
          <p className="text-3xl items-baseline flex gap-1 font-semibold text-white">
            Kelapa Gading
          </p>
          <p className="text-blue-400 text-sm mt-2 font-mono bg-blue-500/10 inline-block px-2 py-0.5 rounded">
            90% Severity
          </p>
        </div>

        <div className="bg-base-900 border border-white/5 p-5 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
            <TrendingDown className="w-16 h-16 text-emerald-500" />
          </div>
          <p className="text-base-400 text-xs font-medium uppercase tracking-wider mb-2">
            Target Mitigation
          </p>
          <p className="text-3xl flex items-baseline gap-1 font-semibold text-white">
            -2.5 <span className="text-base-400 text-sm">°C</span>
          </p>
          <p className="text-emerald-400 text-sm mt-2 font-mono bg-emerald-500/10 inline-block px-2 py-0.5 rounded">
            Projected by 2028
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-base-900 border border-white/5 p-6 rounded-2xl shadow-xl">
          <h3 className="text-white font-semibold text-sm mb-6">
            Risk Distribution by District
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={districtData}
                margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="rgba(255,255,255,0.3)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis
                  stroke="rgba(255,255,255,0.3)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <RechartsTooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "rgba(255,255,255,0.05)" }}
                />
                <Bar
                  dataKey="heat"
                  name="Heat Risk"
                  fill="#ef4444"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
                <Bar
                  dataKey="flood"
                  name="Flood Risk"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Area Chart */}
        <div className="bg-base-900 border border-white/5 p-6 rounded-2xl shadow-xl">
          <h3 className="text-white font-semibold text-sm mb-6">
            5-Year Temperature Projection (Baseline vs RL Optimized)
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={trendData}
                margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="colorProjected"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                  vertical={false}
                />
                <XAxis
                  dataKey="year"
                  stroke="rgba(255,255,255,0.3)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis
                  stroke="rgba(255,255,255,0.3)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  domain={["dataMin - 1", "dataMax + 1"]}
                />
                <RechartsTooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="temp"
                  name="Baseline Temp (°C)"
                  stroke="#ef4444"
                  fillOpacity={1}
                  fill="url(#colorTemp)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="projected"
                  name="Optimized Temp (°C)"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorProjected)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
