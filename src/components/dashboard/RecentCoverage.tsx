const coverageData = [
  {
    publication: "Financial Times",
    headline: "UAE's nuclear company seeks to capitalise on AI-induced energy demand in US",
    date: "Jan 26 2025",
    quoteType: "Direct Quote",
    sentiment: "Positive",
  },
  {
    publication: "S&P Global / Platts",
    headline: "ENEC wins Excellence in Energy — Power Award 2025",
    date: "Dec 12 2025",
    quoteType: "Direct Quote",
    sentiment: "Positive",
  },
  {
    publication: "Arabian Business",
    headline: "ENEC eyes US market as AI drives nuclear renaissance",
    date: "Jan 28 2025",
    quoteType: "Direct Quote",
    sentiment: "Positive",
  },
  {
    publication: "World Nuclear News",
    headline: "Al Hammadi: Barakah model ready for global export",
    date: "Feb 3 2025",
    quoteType: "Direct Quote",
    sentiment: "Positive",
  },
  {
    publication: "The National",
    headline: "UAE nuclear chief sees opportunity in global energy transition",
    date: "Feb 10 2025",
    quoteType: "Indirect Quote",
    sentiment: "Neutral",
  },
];

const badgeClass = (type: string) => {
  if (type === "Direct Quote") return "bg-secondary/10 text-secondary";
  if (type === "Indirect Quote") return "bg-warning/10 text-warning";
  if (type === "Positive") return "bg-secondary/10 text-secondary";
  return "bg-muted text-muted-foreground";
};

const RecentCoverage = () => {
  return (
    <div className="bg-background border border-border rounded-lg p-5 shadow-sm">
      <h3 className="text-base font-bold text-foreground">Recent Coverage — Mohamed Al Hammadi</h3>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 pr-4 text-xs font-semibold text-muted-foreground">Publication</th>
              <th className="text-left py-2 pr-4 text-xs font-semibold text-muted-foreground">Headline</th>
              <th className="text-left py-2 pr-4 text-xs font-semibold text-muted-foreground">Date</th>
              <th className="text-left py-2 pr-4 text-xs font-semibold text-muted-foreground">Quote Type</th>
              <th className="text-left py-2 text-xs font-semibold text-muted-foreground">Sentiment</th>
            </tr>
          </thead>
          <tbody>
            {coverageData.map((row, i) => (
              <tr key={i} className="border-b border-border last:border-0">
                <td className="py-3 pr-4 font-medium text-foreground whitespace-nowrap">{row.publication}</td>
                <td className="py-3 pr-4 text-foreground">{row.headline}</td>
                <td className="py-3 pr-4 text-muted-foreground whitespace-nowrap">{row.date}</td>
                <td className="py-3 pr-4">
                  <span className={`text-xs font-medium px-2 py-1 rounded ${badgeClass(row.quoteType)}`}>
                    {row.quoteType}
                  </span>
                </td>
                <td className="py-3">
                  <span className={`text-xs font-medium px-2 py-1 rounded ${badgeClass(row.sentiment)}`}>
                    {row.sentiment}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentCoverage;
