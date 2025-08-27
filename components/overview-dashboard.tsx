"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, TrendingUp, Database } from "lucide-react"
import { HealthMeter } from "./health-meter"
import { StageBreakdown } from "./stage-breakdown"
import { CSVLoader } from "@/lib/csv-loader"
import { useEffect, useState } from "react"
import { getStageNames } from "@/lib/stage-mapping"

export function OverviewDashboard() {
  const [healthData, setHealthData] = useState({
    totalRows: 0,
    healthyRows: 0,
    anomalousRows: 0,
    healthyPercentage: 0,
  })
  const [dataProductHealth, setDataProductHealth] = useState({
    healthDataIndex: 0,
    dataAnomalies: 0,
    healthDataProductIndex: 0,
    dataProductAnomalies: 0,
    totalRowsAllDatasets: 0,
    joinedRows: 0,
    joinedAnomaliesCount: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const csvLoader = CSVLoader.getInstance()
        await csvLoader.loadData()
        const stats = csvLoader.getHealthStats()
        const dataProductStats = csvLoader.getDataProductHealthMetrics()
        setHealthData(stats)
        setDataProductHealth(dataProductStats)
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
          Comprehensive health metrics across pharmacy, medical, and joined datasets with anomaly analysis
        </p>
      </div>

      {/* Data Product Health Monitor KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Health Data Index */}
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Health Data Index</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">
              {dataProductHealth.healthDataIndex.toFixed(2)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Healthy rows to total rows across all datasets
            </p>
            <Progress value={dataProductHealth.healthDataIndex} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {dataProductHealth.totalRowsAllDatasets - dataProductHealth.dataAnomalies} / {dataProductHealth.totalRowsAllDatasets.toLocaleString()} rows
            </p>
          </CardContent>
        </Card>

        {/* Data Anomalies */}
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Data Anomalies</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {dataProductHealth.dataAnomalies.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Total anomalies across all sources</p>
            <Badge variant="destructive" className="mt-2">
              Requires Review
            </Badge>
          </CardContent>
        </Card>

        {/* Health Data Product Index */}
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Health Data Product Index</CardTitle>
            <CheckCircle className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-2">
              {dataProductHealth.healthDataProductIndex.toFixed(2)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Healthy rows in joined dataset
            </p>
            <Progress value={dataProductHealth.healthDataProductIndex} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {dataProductHealth.joinedRows - dataProductHealth.joinedAnomaliesCount} / {dataProductHealth.joinedRows.toLocaleString()} rows
            </p>
          </CardContent>
        </Card>

        {/* Data Product Anomalies */}
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Data Product Anomalies</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">
              {dataProductHealth.dataProductAnomalies.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Anomalies in joined dataset</p>
            <div className="flex gap-1 mt-2">
              <Badge variant="outline" className="text-xs">
                {dataProductHealth.joinedRows > 0 ? Math.round((dataProductHealth.dataProductAnomalies / dataProductHealth.joinedRows) * 100) : 0}%
                of joined dataset
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dataset Summary */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Data Overview</CardTitle>
          <CardDescription>Comprehensive breakdown of data across all three datasets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{dataProductHealth.totalRowsAllDatasets.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Rows</div>
              <div className="text-xs text-muted-foreground mt-1">
                All Datasets Combined
              </div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">{dataProductHealth.totalRowsAllDatasets - dataProductHealth.dataAnomalies}</div>
              <div className="text-sm text-muted-foreground">Healthy Rows</div>
              <div className="text-xs text-muted-foreground mt-1">
                No Anomalies Detected
              </div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{dataProductHealth.dataAnomalies.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Anomalies</div>
              <div className="text-xs text-muted-foreground mt-1">
                Across All Sources
              </div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{dataProductHealth.joinedRows.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Joined Dataset</div>
              <div className="text-xs text-muted-foreground mt-1">
                Primary Data Product
              </div>
            </div>
          </div>
          
          {/* Health Summary */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <div className="text-sm font-medium text-muted-foreground mb-2">Health Summary</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Overall Health:</span>
                <span className="ml-2 font-medium">{dataProductHealth.healthDataIndex.toFixed(2)}% healthy</span>
              </div>
              <div>
                <span className="text-muted-foreground">Data Product Health:</span>
                <span className="ml-2 font-medium">{dataProductHealth.healthDataProductIndex.toFixed(2)}% healthy</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Health Meter */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">System Health Overview</CardTitle>
            <CardDescription>Visual representation of healthy vs anomalous data rows across all datasets</CardDescription>
          </CardHeader>
          <CardContent>
            <HealthMeter 
              healthyRows={dataProductHealth.totalRowsAllDatasets - dataProductHealth.dataAnomalies} 
              anomalousRows={dataProductHealth.dataAnomalies} 
            />
          </CardContent>
        </Card>

        {/* Stage Breakdown moved to right column */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Anomalies by Detection Stage</CardTitle>
            <CardDescription>
              Distribution of anomalies across {getStageNames().join(', ')} stages
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
