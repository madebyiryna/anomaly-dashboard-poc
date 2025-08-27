"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface HealthMeterProps {
  healthyRows: number
  anomalousRows: number
}

export function HealthMeter({ healthyRows, anomalousRows }: HealthMeterProps) {
  const data = [
    {
      name: "Healthy Rows",
      value: healthyRows,
      color: "hsl(var(--chart-2))",
    },
    {
      name: "Anomalous Rows",
      value: anomalousRows,
      color: "hsl(var(--destructive))",
    },
  ]

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="text-popover-foreground font-medium">{data.name}</p>
          <p className="text-popover-foreground">{data.value.toLocaleString()} rows</p>
          <p className="text-muted-foreground text-sm">
            {Math.round((data.value / (healthyRows + anomalousRows)) * 100)}% of total
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={120} paddingAngle={2} dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value, entry) => <span style={{ color: entry.color }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
