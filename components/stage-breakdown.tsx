"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { CSVLoader } from "@/lib/csv-loader"
import { useEffect, useState } from "react"

export function StageBreakdown() {
  const [stageData, setStageData] = useState<Array<{ stage: string; anomalies: number; percentage: number }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const csvLoader = CSVLoader.getInstance()
        await csvLoader.loadData()
        const stats = csvLoader.getActualStageStats()
        const totalAnomalies = stats.reduce((sum, stat) => sum + stat.count, 0)

        const formattedData = stats.map((stat) => ({
          stage: stat.stage,
          anomalies: stat.count,
          percentage: totalAnomalies > 0 ? Math.round((stat.count / totalAnomalies) * 100) : 0,
        }))

        setStageData(formattedData)
      } catch (err) {
        console.error("Failed to load stage data:", err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="text-popover-foreground font-medium">{label}</p>
          <p className="text-primary">
            {data.anomalies} anomalies ({data.percentage}%)
          </p>
        </div>
      )
    }
    return null
  }

  if (loading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-muted-foreground">Loading stage breakdown...</div>
      </div>
    )
  }

  if (stageData.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-muted-foreground">No anomalies found</div>
      </div>
    )
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={stageData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="stage" stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="anomalies" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
