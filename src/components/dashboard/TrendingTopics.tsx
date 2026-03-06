const topics = [
  {
    name: "AI Data Centre Energy Demand",
    signal: "ALIGNED",
    signalClass: "bg-secondary text-secondary-foreground",
    desc: "Spiking across US tech and energy media, Google Trends breakout",
    action: "Own this narrative",
  },
  {
    name: "Small Modular Reactors (SMR)",
    signal: "SEARCH-LED",
    signalClass: "bg-primary text-primary-foreground",
    desc: "High public search interest, underrepresented in media coverage",
    action: "Content opportunity",
  },
  {
    name: "Nuclear Baseload vs Renewables",
    signal: "MEDIA-LED",
    signalClass: "bg-warning text-warning-foreground",
    desc: "Growing debate in Tier 1 publications",
    action: "Reinforce presence",
  },
  {
    name: "US Nuclear Policy & Permitting",
    signal: "ALIGNED",
    signalClass: "bg-secondary text-secondary-foreground",
    desc: "Post-election regulatory momentum",
    action: "Competitive alert",
  },
  {
    name: "Global South Nuclear Expansion",
    signal: "SEARCH-LED",
    signalClass: "bg-primary text-primary-foreground",
    desc: "Philippines, Kenya, Ghana driving search interest",
    action: "Own this narrative",
  },
];

const TrendingTopics = () => {
  return (
    <div className="bg-background border border-border rounded-lg p-5 shadow-sm h-full">
      <h3 className="text-base font-bold text-foreground">Emerging Topics This Week</h3>
      <p className="text-xs text-muted-foreground mt-1 mb-4">Signal: media + Google Trends combined</p>

      <div className="space-y-3">
        {topics.map((topic, i) => (
          <div key={i} className="border border-border rounded-md p-3">
            <div className="flex items-start justify-between gap-2 mb-1">
              <span className="text-sm font-semibold text-foreground">{topic.name}</span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${topic.signalClass} whitespace-nowrap`}>
                {topic.signal}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mb-2">{topic.desc}</p>
            <span className="text-[11px] font-medium text-primary">→ {topic.action}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingTopics;
