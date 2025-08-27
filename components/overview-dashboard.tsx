"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, TrendingUp, Database } from "lucide-react"
import { HealthMeter } from "./health-meter"
import { StageBreakdown } from "./stage-breakdown"
import { CSVLoader } from "@/lib/csv-loader"
import { useEffect, useState } from "react"

export function OverviewDashboard() {
  const [healthData, setHealthData] = useState({
    totalRows: 0,
    healthyRows: 0,
    anomalousRows: 0,
    healthyPercentage: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const csvLoader = CSVLoader.getInstance()
        await csvLoader.loadData()
        const stats = csvLoader.getHealthStats()
        setHealthData(stats)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data")
      } finally {
        setLoading(false)
      }
    }

    // Only load data on the client side
    if (typeof window !== 'undefined') {
      loadData()
    } else {
      setLoading(false)
    }
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading dashboard data...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-destructive">Error loading data: {error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    )
  }

  const healthPercentage = Math.round(healthData.healthyPercentage)

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-foreground text-balance">Data Product Health Monitor</h2>
        <p className="text-muted-foreground text-pretty">
          Real-time overview of anomaly detection across the New York Oncology dataset
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Health Percentage */}
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Data Health</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{healthPercentage}%</div>
            <p className="text-xs text-muted-foreground">
              {healthData.healthyRows.toLocaleString()} of {healthData.totalRows.toLocaleString()} rows
            </p>
            <Progress value={healthPercentage} className="mt-2" />
          </CardContent>
        </Card>

        {/* Total Anomalous Rows */}
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Anomalous Rows</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{healthData.anomalousRows}</div>
            <p className="text-xs text-muted-foreground">Rows with detected anomalies</p>
            <Badge variant="destructive" className="mt-2">
              Requires Review
            </Badge>
          </CardContent>
        </Card>

        {/* Healthy Rows */}
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Healthy Rows</CardTitle>
            <CheckCircle className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-2">{healthData.healthyRows.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">No anomalies detected</p>
            <Badge variant="secondary" className="mt-2 bg-chart-2/10 text-chart-2">
              Clean
            </Badge>
          </CardContent>
        </Card>

        {/* Total Rows */}
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Total Dataset</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{healthData.totalRows.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Rows in joined dataset</p>
            <div className="flex gap-1 mt-2">
              <Badge variant="outline" className="text-xs">
                {healthData.anomalousRows > 0 ? Math.round((healthData.anomalousRows / healthData.totalRows) * 100) : 0}
                % Anomalous
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Health Meter */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">System Health Overview</CardTitle>
            <CardDescription>Visual representation of healthy vs anomalous data rows</CardDescription>
          </CardHeader>
          <CardContent>
            <HealthMeter healthyRows={healthData.healthyRows} anomalousRows={healthData.anomalousRows} />
          </CardContent>
        </Card>

        {/* Stage Breakdown moved to right column */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Anomalies by Detection Stage</CardTitle>
            <CardDescription>
              Distribution of anomalies across Data Quality, Smart Data Quality, and Business stages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StageBreakdown />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
