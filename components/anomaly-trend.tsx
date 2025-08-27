"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export function AnomalyTrend() {
  // Mock trend data - in real app this would come from API
  const trendData = [
    { week: "Week 1", anomalies: 45 },
    { week: "Week 2", anomalies: 52 },
    { week: "Week 3", anomalies: 38 },
    { week: "Week 4", anomalies: 61 },
    { week: "Week 5", anomalies: 43 },
    { week: "Week 6", anomalies: 55 },
    { week: "Week 7", anomalies: 49 },
    { week: "Week 8", anomalies: 67 },
  ]

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="text-popover-foreground font-medium">{label}</p>
          <p className="text-primary">{payload[0].value} anomalies detected</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={trendData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="anomalies"
            stroke="hsl(var(--primary))"
            strokeWidth={3}
            dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
