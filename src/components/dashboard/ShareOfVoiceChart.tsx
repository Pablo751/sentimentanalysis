import { BarChart, Bar, XAxis, YAxis, Cell, ResponsiveContainer, LabelList } from "recharts";
import { useAppState } from "@/context/AppContext";

const dataByRange = {
  "7d": [
    { name: "Sultan Al Jaber (Masdar)", value: 38.2, isEnec: false },
    { name: "Dan Sumner (Westinghouse)", value: 24.7, isEnec: false },
    { name: "Chris Levesque (TerraPower)", value: 16.3, isEnec: false },
    { name: "Mohamed Al Hammadi (ENEC)", value: 9.8, isEnec: true },
    { name: "Joe Dominguez (Constellation)", value: 6.9, isEnec: false },
    { name: "Bernard Fontana (EDF)", value: 4.1, isEnec: false },
  ],
  "30d": [
    { name: "Sultan Al Jaber (Masdar)", value: 40.1, isEnec: false },
    { name: "Dan Sumner (Westinghouse)", value: 23.4, isEnec: false },
    { name: "Chris Levesque (TerraPower)", value: 15.8, isEnec: false },
    { name: "Mohamed Al Hammadi (ENEC)", value: 11.2, isEnec: true },
    { name: "Joe Dominguez (Constellation)", value: 6.2, isEnec: false },
    { name: "Bernard Fontana (EDF)", value: 3.3, isEnec: false },
  ],
  "90d": [
    { name: "Sultan Al Jaber (Masdar)", value: 43.5, isEnec: false },
    { name: "Dan Sumner (Westinghouse)", value: 21.8, isEnec: false },
    { name: "Chris Levesque (TerraPower)", value: 14.9, isEnec: false },
    { name: "Mohamed Al Hammadi (ENEC)", value: 12.4, isEnec: true },
    { name: "Joe Dominguez (Constellation)", value: 5.8, isEnec: false },
    { name: "Bernard Fontana (EDF)", value: 1.6, isEnec: false },
  ],
};

const periodLabels = { "7d": "7 days", "30d": "30 days", "90d": "90 days" };

const ShareOfVoiceChart = () => {
  const { dateRange } = useAppState();
  const data = dataByRange[dateRange];

  return (
    <div className="bg-background border border-border rounded-lg p-5 shadow-sm h-full">
      <h3 className="text-base font-bold text-foreground">Executive Share of Voice — Direct Quotes (Tier 1)</h3>
      <p className="text-xs text-muted-foreground mt-1 mb-6">Rolling {periodLabels[dateRange]} across 50+ monitored publications</p>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 50, left: 0, bottom: 0 }}>
          <XAxis type="number" domain={[0, 50]} hide />
          <YAxis
            type="category"
            dataKey="name"
            width={220}
            tick={{ fontSize: 12, fill: "hsl(0,0%,42%)" }}
            axisLine={false}
            tickLine={false}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={28} animationDuration={500}>
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={entry.isEnec ? "hsl(152,100%,26%)" : "hsl(0,0%,80%)"}
              />
            ))}
            <LabelList
              dataKey="value"
              position="right"
              formatter={(v: number) => `${v}%`}
              style={{ fontSize: 12, fontWeight: 600, fill: "hsl(0,0%,10%)" }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <p className="text-[11px] text-muted-foreground mt-4 border-t border-border pt-3">
        <span className="font-medium">Tier 1</span> = Direct quotes only. Source: monitored publications (FT, Bloomberg, Reuters, S&P Global, etc.)
      </p>
    </div>
  );
};

export default ShareOfVoiceChart;
