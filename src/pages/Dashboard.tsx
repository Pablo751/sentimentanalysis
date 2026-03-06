import KPICards from "@/components/dashboard/KPICards";
import ShareOfVoiceChart from "@/components/dashboard/ShareOfVoiceChart";
import TrendingTopics from "@/components/dashboard/TrendingTopics";
import RecentCoverage from "@/components/dashboard/RecentCoverage";
import { useAppState } from "@/context/AppContext";

const rangeOptions = [
  { value: "7d" as const, label: "Last 7 Days" },
  { value: "30d" as const, label: "Last 30 Days" },
  { value: "90d" as const, label: "Last 90 Days" },
];

const Dashboard = () => {
  const { dateRange, setDateRange } = useAppState();

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">ENEC Intelligence Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Nuclear Energy Industry | Updated today</p>
        </div>
        <div className="flex items-center gap-1 border border-border rounded-md p-1">
          {rangeOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setDateRange(opt.value)}
              className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                dateRange === opt.value
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <KPICards />

      {/* SoV + Trending */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mt-4">
        <div className="lg:col-span-3">
          <ShareOfVoiceChart />
        </div>
        <div className="lg:col-span-2">
          <TrendingTopics />
        </div>
      </div>

      {/* Recent Coverage */}
      <div className="mt-4">
        <RecentCoverage />
      </div>
    </div>
  );
};

export default Dashboard;
