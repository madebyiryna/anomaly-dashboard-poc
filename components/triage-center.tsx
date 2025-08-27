"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { AnomalyRuleGroup } from "./anomaly-rule-group"
import { getStageInfo, getStageDisplayNameSafe } from "@/lib/stage-mapping"
import { CSVLoader, type AnomalyRow } from "@/lib/csv-loader"

export function TriageCenter() {
  const [showUnresolvedOnly, setShowUnresolvedOnly] = useState(false)
  const [anomalyData, setAnomalyData] = useState<{
    stages: Record<string, { total: number; rules: Record<string, { total: number; resolved: number; unresolved: number }> }>
    totalAnomalies: number
    uniqueRules: number
  }>({
    stages: {},
    totalAnomalies: 0,
    uniqueRules: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAnomalyData = async () => {
      try {
        console.log("Starting to load anomaly data...")
        
        const csvLoader = CSVLoader.getInstance()
        await csvLoader.loadData()
        
        const anomalies = csvLoader.getAnomalies()
        console.log("Loaded anomalies:", anomalies.length)
        
        // Calculate real statistics
        const totalAnomalies = anomalies.length
        
        // Get unique rules count
        const uniqueRules = new Set(anomalies.map(a => a.rule)).size
        
        // Group by stage and rule
        const stageData: Record<string, { total: number; rules: Record<string, { total: number; resolved: number; unresolved: number }> }> = {}
        
        anomalies.forEach(anomaly => {
          const stageName = getStageDisplayNameSafe(anomaly.stage)
          
          if (!stageData[stageName]) {
            stageData[stageName] = {
              total: 0,
              rules: {}
            }
          }
          
          stageData[stageName].total++
          
          if (!stageData[stageName].rules[anomaly.rule]) {
            stageData[stageName].rules[anomaly.rule] = {
              total: 0,
              resolved: 0,
              unresolved: 0
            }
          }
          
          stageData[stageName].rules[anomaly.rule].total++
          // For now, all anomalies are unresolved (we can add resolution logic later)
          stageData[stageName].rules[anomaly.rule].unresolved++
        })
        
        console.log("Processed anomaly data:", {
          totalAnomalies,
          uniqueRules,
          stageData
        })
        
        setAnomalyData({
          stages: stageData,
          totalAnomalies,
          uniqueRules
        })
        
      } catch (error) {
        console.error("Failed to load anomaly data:", error)
        // Set loading to false even on error
        setLoading(false)
      } finally {
        setLoading(false)
      }
    }
    
    loadAnomalyData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-8">
        <Card className="border-border">
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-muted-foreground">Loading anomaly data...</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Debug: Show if no data is loaded
  if (anomalyData.totalAnomalies === 0) {
    return (
      <div className="space-y-8">
        <Card className="border-border">
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-muted-foreground">
              No anomaly data found. Total anomalies: {anomalyData.totalAnomalies}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const stageEntries = Object.entries(anomalyData.stages)
  const defaultStage = stageEntries.length > 0 ? stageEntries[0][0] : ""

  return (
    <div className="space-y-8">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg">Total Anomalies</CardTitle>
            <CardDescription>All detected anomalies across all stages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-card-foreground">{anomalyData.totalAnomalies.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg">Active Stages</CardTitle>
            <CardDescription>Stages with detected anomalies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-card-foreground">{stageEntries.length}</div>
          </CardContent>
        </Card>
        
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg">Unique Rules</CardTitle>
            <CardDescription>Different anomaly detection rules triggered</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-card-foreground">{anomalyData.uniqueRules}</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Triage Interface */}
      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-card-foreground">Anomaly Management</CardTitle>
              <CardDescription>Detailed view and management of all detected anomalies</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="unresolved-only" checked={showUnresolvedOnly} onCheckedChange={setShowUnresolvedOnly} />
              <Label htmlFor="unresolved-only" className="text-sm">
                Show unresolved only
              </Label>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {stageEntries.length > 0 ? (
            <Tabs defaultValue={defaultStage} className="space-y-6">
              <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${stageEntries.length}, 1fr)` }}>
                {stageEntries.map(([stageName, stageData]) => (
                  <TabsTrigger key={stageName} value={stageName}>
                    {stageName} ({stageData.total})
                  </TabsTrigger>
                ))}
              </TabsList>

              {stageEntries.map(([stageName, stageData]) => (
                <TabsContent key={stageName} value={stageName} className="space-y-4">
                  <AnomalyRuleGroup
                    stage={stageName}
                    rules={stageData.rules}
                    showUnresolvedOnly={showUnresolvedOnly}
                  />
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No anomaly data available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
