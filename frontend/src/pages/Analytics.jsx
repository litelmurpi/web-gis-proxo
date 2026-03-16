import { useState, useMemo } from "react";
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
  Cell,
} from "recharts";
import {
  Search,
  Loader2,
  ThermometerSun,
  Waves,
  TreePine,
  Users,
  MapPin,
  Grid3X3,
} from "lucide-react";
import EmptyState from "../components/common/EmptyState";
import { AnalyticsService } from "../services/api";

<<<<<<< HEAD
const districtData = [
  { name: "Menteng", heat: 85, flood: 30, population: 15 },
  { name: "Kebayoran", heat: 65, flood: 60, population: 20 },
  { name: "Kelapa Gading", heat: 70, flood: 90, population: 18 },
  { name: "Cilandak", heat: 60, flood: 40, population: 12 },
  { name: "Tebet", heat: 75, flood: 55, population: 22 },
];

const trendData = [
  { year: "2024", temp: 34.2, projected: 34.2 },
  { year: "2025", temp: 34.5, projected: 33.8 },
  { year: "2026", temp: 34.8, projected: 33.1 },
  { year: "2027", temp: 35.1, projected: 32.5 },
  { year: "2028", temp: 35.5, projected: 31.8 },
];

=======
/* ───── Custom Tooltip ───── */
>>>>>>> 8e995918ff77d568520e5809681fe83bbaf7d5ef
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

/* ───── Helpers ───── */
function computeStats(features) {
  if (!features || features.length === 0) return null;

  const props = features.map((f) => f.properties);
  const count = props.length;

  // Averages
  const avgLst = props.reduce((s, p) => s + (p.lst || 0), 0) / count;
  const avgFlood = props.reduce((s, p) => s + (p.floodScore || 0), 0) / count;
  const avgEquity = props.reduce((s, p) => s + (p.equityScore || 0), 0) / count;
  const totalPop = props.reduce((s, p) => s + (p.population || 0), 0);

  // Extremes
  const maxLstCell = props.reduce((max, p) =>
    (p.lst || 0) > (max.lst || 0) ? p : max
  );
  const maxFloodCell = props.reduce((max, p) =>
    (p.floodScore || 0) > (max.floodScore || 0) ? p : max
  );
  const minEquityCell = props.reduce((min, p) =>
    (p.equityScore || 100) < (min.equityScore || 100) ? p : min
  );

  // Risk distribution buckets
  const bucketize = (value, thresholds) => {
    if (value >= thresholds[2]) return "Critical";
    if (value >= thresholds[1]) return "High";
    if (value >= thresholds[0]) return "Medium";
    return "Low";
  };

  const riskDist = { Low: { heat: 0, flood: 0 }, Medium: { heat: 0, flood: 0 }, High: { heat: 0, flood: 0 }, Critical: { heat: 0, flood: 0 } };
  props.forEach((p) => {
    const heatBucket = bucketize(p.lst || 0, [30, 33, 36]);
    const floodBucket = bucketize(p.floodScore || 0, [30, 50, 70]);
    riskDist[heatBucket].heat++;
    riskDist[floodBucket].flood++;
  });

  const riskChartData = ["Low", "Medium", "High", "Critical"].map((label) => ({
    name: label,
    heat: riskDist[label].heat,
    flood: riskDist[label].flood,
  }));

  // LST distribution (histogram)
  const lstMin = Math.floor(Math.min(...props.map((p) => p.lst || 0)));
  const lstMax = Math.ceil(Math.max(...props.map((p) => p.lst || 0)));
  const bins = [];
  const binSize = 1; // 1°C bins
  for (let t = lstMin; t < lstMax; t += binSize) {
    const cellsInBin = props.filter(
      (p) => (p.lst || 0) >= t && (p.lst || 0) < t + binSize
    ).length;
    bins.push({ range: `${t}–${t + binSize}°C`, cells: cellsInBin, temp: t });
  }

  // Equity distribution
  const equityDist = { "0–20": 0, "20–40": 0, "40–60": 0, "60–80": 0, "80–100": 0 };
  props.forEach((p) => {
    const eq = p.equityScore || 0;
    if (eq < 20) equityDist["0–20"]++;
    else if (eq < 40) equityDist["20–40"]++;
    else if (eq < 60) equityDist["40–60"]++;
    else if (eq < 80) equityDist["60–80"]++;
    else equityDist["80–100"]++;
  });
  const equityChartData = Object.entries(equityDist).map(([range, count]) => ({
    name: range,
    cells: count,
  }));

  return {
    count,
    avgLst: avgLst.toFixed(1),
    avgFlood: avgFlood.toFixed(1),
    avgEquity: avgEquity.toFixed(1),
    totalPop: Math.round(totalPop),
    maxLst: (maxLstCell.lst || 0).toFixed(1),
    maxFlood: (maxFloodCell.floodScore || 0).toFixed(0),
    minEquity: (minEquityCell.equityScore || 0).toFixed(0),
    riskChartData,
    lstHistogram: bins,
    equityChartData,
  };
}

/* ───── KPI Card ───── */
function KpiCard({ icon: Icon, iconColor, iconBg, label, value, unit, detail, detailColor }) {
  if (!Icon) return null;
  return (
    <div className="bg-base-900 border border-white/5 p-5 rounded-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Icon className={`w-16 h-16 ${iconColor}`} />
      </div>
      <p className="text-base-400 text-xs font-medium uppercase tracking-wider mb-2">
        {label}
      </p>
      <p className="text-3xl flex items-baseline gap-1 font-semibold text-white">
        {value}
        {unit && <span className="text-base-400 text-sm">{unit}</span>}
      </p>
      <p className={`text-sm mt-2 font-mono ${detailColor || "text-base-400"} ${iconBg} inline-block px-2 py-0.5 rounded`}>
        {detail}
      </p>
    </div>
  );
}

/* ───── Main Component ───── */
export default function Analytics() {
  const [searchInput, setSearchInput] = useState("");
  const [cityName, setCityName] = useState(null);
  const [geoData, setGeoData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    const query = searchInput.trim();
    if (!query) return;

    setIsLoading(true);
    setError(null);
    setGeoData(null);

    try {
      const data = await AnalyticsService.getCityData(query);
      if (data.error) throw new Error(data.error);
      setCityName(query);
      setGeoData(data);
    } catch (err) {
      setError(err.message || "Failed to fetch city data");
    } finally {
      setIsLoading(false);
    }
  };

  const stats = useMemo(() => {
    if (!geoData?.geojson?.features) return null;
    return computeStats(geoData.geojson.features);
  }, [geoData]);

  /* ── Empty / Initial State ── */
  if (!stats && !isLoading) {
    return (
      <div className="min-h-full w-full bg-base-950 p-6 lg:p-10 flex flex-col">
        {/* Search bar always visible */}
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-semibold text-white tracking-tight mb-1">
            City{" "}
            <span className="font-emphasis italic font-normal text-primary-400">
              Analytics
            </span>
          </h1>
          <p className="text-base-400 text-sm mb-6">
            Search a city to analyze its urban heat, flood risk, and green equity data.
          </p>
          <form onSubmit={handleSearch} className="flex gap-3 max-w-lg">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-400" />
              <input
                type="text"
                placeholder="Enter city name (e.g. Surabaya)..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full bg-base-900 border border-white/10 text-white placeholder:text-base-500 text-sm pl-10 pr-4 py-3 rounded-xl focus:ring-1 focus:ring-primary-500/50 focus:border-primary-500/50 outline-none transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-primary-500 hover:bg-primary-600 disabled:bg-primary-500/50 text-white rounded-xl px-5 py-3 text-sm font-medium transition-all flex items-center gap-2 shrink-0"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Analyze"
              )}
            </button>
          </form>
        </div>

        {error ? (
          <div className="flex-1 flex items-center justify-center">
            <EmptyState
              title="Analysis Failed"
              message={error}
              onRetry={() => setError(null)}
            />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <EmptyState
              title="No City Selected"
              message="Search for a city above to view its analytics dashboard — heat distribution, flood risk breakdown, and green equity analysis."
            />
          </div>
        )}
      </div>
    );
  }

  /* ── Loading State ── */
  if (isLoading) {
    return (
      <div className="min-h-full w-full bg-base-950 p-6 lg:p-10 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-primary-400 animate-spin" />
        <p className="text-base-400 text-sm">
          Analyzing <span className="text-white font-medium">{searchInput}</span>...
        </p>
        <p className="text-base-500 text-xs">
          Fetching grid data, computing microclimate metrics
        </p>
      </div>
    );
  }

  /* ── Data Loaded ── */
  return (
<<<<<<< HEAD
    <div className="h-full w-full bg-base-950 p-6 lg:p-10 overflow-auto">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
=======
    <div className="w-full bg-base-950 p-6 lg:p-10">
      {/* Header + Search */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
>>>>>>> 8e995918ff77d568520e5809681fe83bbaf7d5ef
        <div>
          <h1 className="text-3xl font-heading font-semibold text-white tracking-tight">
            City{" "}
            <span className="font-emphasis italic font-normal text-primary-400">
              Analytics
            </span>
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <MapPin className="w-3.5 h-3.5 text-primary-400" />
            <span className="text-white font-medium text-sm capitalize">{cityName}</span>
            <span className="text-base-500 text-xs">•</span>
            <span className="text-base-400 text-xs flex items-center gap-1">
              <Grid3X3 className="w-3 h-3" />
              {stats.count} grid cells
            </span>
          </div>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-400" />
            <input
              type="text"
              placeholder="Search another city..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-52 bg-base-900 border border-white/10 text-white placeholder:text-base-500 text-sm pl-9 pr-4 py-2 rounded-xl focus:ring-1 focus:ring-primary-500/50 outline-none transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-primary-500 hover:bg-primary-600 text-white rounded-xl px-4 py-2 text-sm font-medium transition-all"
          >
            Analyze
          </button>
        </form>
      </div>

<<<<<<< HEAD
      
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

      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
=======
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard
          icon={ThermometerSun}
          iconColor="text-red-500"
          iconBg="bg-red-500/10"
          label="Avg Surface Temperature"
          value={stats.avgLst}
          unit="°C"
          detail={`Hottest: ${stats.maxLst}°C`}
          detailColor="text-red-400"
        />
        <KpiCard
          icon={Waves}
          iconColor="text-blue-500"
          iconBg="bg-blue-500/10"
          label="Avg Flood Risk"
          value={stats.avgFlood}
          unit="/95"
          detail={`Highest: ${stats.maxFlood}/95`}
          detailColor="text-blue-400"
        />
        <KpiCard
          icon={TreePine}
          iconColor="text-emerald-500"
          iconBg="bg-emerald-500/10"
          label="Avg Green Equity"
          value={stats.avgEquity}
          unit="/95"
          detail={`Lowest: ${stats.minEquity}/95`}
          detailColor="text-emerald-400"
        />
        <KpiCard
          icon={Users}
          iconColor="text-purple-500"
          iconBg="bg-purple-500/10"
          label="Est. Population"
          value={stats.totalPop.toLocaleString()}
          detail={`Across ${stats.count} cells`}
          detailColor="text-purple-400"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Risk Distribution Bar Chart */}
>>>>>>> 8e995918ff77d568520e5809681fe83bbaf7d5ef
        <div className="bg-base-900 border border-white/5 p-6 rounded-2xl shadow-xl">
          <h3 className="text-white font-semibold text-sm mb-1">
            Risk Distribution
          </h3>
          <p className="text-base-500 text-xs mb-6">
            Grid cells grouped by risk severity level
          </p>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.riskChartData}
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

<<<<<<< HEAD
        
=======
        {/* LST Distribution */}
>>>>>>> 8e995918ff77d568520e5809681fe83bbaf7d5ef
        <div className="bg-base-900 border border-white/5 p-6 rounded-2xl shadow-xl">
          <h3 className="text-white font-semibold text-sm mb-1">
            Temperature Distribution
          </h3>
          <p className="text-base-500 text-xs mb-6">
            Number of grid cells per 1°C LST band
          </p>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={stats.lstHistogram}
                margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorLst" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                  vertical={false}
                />
                <XAxis
                  dataKey="range"
                  stroke="rgba(255,255,255,0.3)"
                  fontSize={11}
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
                <RechartsTooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="cells"
                  name="Grid Cells"
                  stroke="#ef4444"
                  fillOpacity={1}
                  fill="url(#colorLst)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Equity Distribution */}
      <div className="bg-base-900 border border-white/5 p-6 rounded-2xl shadow-xl">
        <h3 className="text-white font-semibold text-sm mb-1">
          Green Equity Distribution
        </h3>
        <p className="text-base-500 text-xs mb-6">
          Grid cells grouped by equity score range
        </p>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={stats.equityChartData}
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
                dataKey="cells"
                name="Grid Cells"
                radius={[4, 4, 0, 0]}
                maxBarSize={60}
              >
                {stats.equityChartData.map((entry, index) => {
                  const colors = ["#ef4444", "#f59e0b", "#eab308", "#22c55e", "#10b981"];
                  return <Cell key={index} fill={colors[index]} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
