import { useAppState } from "@/context/AppContext";

const dataByRange = {
  "7d": [
    { label: "Al Hammadi Share of Voice", value: "9.8%", valueClass: "text-secondary", subtitle: "+1.4% vs prev week", trend: "trending_up" as const, trendClass: "text-secondary" },
    { label: "Articles Monitored", value: "287", valueClass: "text-foreground", subtitle: "Across 50+ publications", trend: null, trendClass: "" },
    { label: "Executive Mentions", value: "21", valueClass: "text-foreground", subtitle: "Al Hammadi: 14 direct quotes", trend: "trending_up" as const, trendClass: "text-secondary" },
    { label: "Trending Topics", value: "2 new", valueClass: "text-foreground", subtitle: "In last 3 days", trend: null, trendClass: "" },
  ],
  "30d": [
    { label: "Al Hammadi Share of Voice", value: "11.2%", valueClass: "text-secondary", subtitle: "+3.1% vs last month", trend: "trending_up" as const, trendClass: "text-secondary" },
    { label: "Articles Monitored", value: "1,247", valueClass: "text-foreground", subtitle: "Across 50+ publications", trend: null, trendClass: "" },
    { label: "Executive Mentions", value: "89", valueClass: "text-foreground", subtitle: "Al Hammadi: 61 direct quotes", trend: "trending_up" as const, trendClass: "text-secondary" },
    { label: "Trending Topics", value: "5 new", valueClass: "text-foreground", subtitle: "In last 3 days", trend: null, trendClass: "" },
  ],
  "90d": [
    { label: "Al Hammadi Share of Voice", value: "12.4%", valueClass: "text-secondary", subtitle: "+5.7% vs prev period", trend: "trending_up" as const, trendClass: "text-secondary" },
    { label: "Articles Monitored", value: "3,891", valueClass: "text-foreground", subtitle: "Across 50+ publications", trend: null, trendClass: "" },
    { label: "Executive Mentions", value: "312", valueClass: "text-foreground", subtitle: "Al Hammadi: 198 direct quotes", trend: "trending_up" as const, trendClass: "text-secondary" },
    { label: "Trending Topics", value: "8 new", valueClass: "text-foreground", subtitle: "In last 3 days", trend: null, trendClass: "" },
  ],
};

const KPICards = () => {
  const { dateRange } = useAppState();
  const cards = dataByRange[dateRange];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-background border border-border rounded-lg px-5 py-4 shadow-sm transition-all duration-300"
        >
          <div className="text-[11px] font-semibold uppercase tracking-[0.09em] text-muted-foreground mb-2">
            {card.label}
          </div>
          <div className={`text-[32px] font-bold leading-tight ${card.valueClass} transition-all duration-300`}>
            {card.value}
          </div>
          <div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground">
            <span>{card.subtitle}</span>
            {card.trend && (
              <span className={`material-icons text-sm ${card.trendClass}`}>{card.trend}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KPICards;
