"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Database, Brain, TrendingUp } from "lucide-react"
import { AnomalyRuleGroup } from "./anomaly-rule-group"

export function TriageCenter() {
  const [showUnresolvedOnly, setShowUnresolvedOnly] = useState(false)

  // Mock data - in real app this would come from API
  const triageData = {
    dataQuality: {
      total: 89,
      resolved: 23,
      unresolved: 66,
      rules: {
        missing_key_field: { total: 43, resolved: 12, unresolved: 31 },
        unexpected_null_rate: { total: 19, resolved: 8, unresolved: 11 },
        data_type_mismatch: { total: 15, resolved: 2, unresolved: 13 },
        duplicate_records: { total: 12, resolved: 1, unresolved: 11 },
      },
    },
    smartDataQuality: {
      total: 67,
      resolved: 15,
      unresolved: 52,
      rules: {
        outlier_detection: { total: 28, resolved: 7, unresolved: 21 },
        pattern_anomaly: { total: 22, resolved: 5, unresolved: 17 },
        correlation_break: { total: 17, resolved: 3, unresolved: 14 },
      },
    },
    business: {
      total: 42,
      resolved: 8,
      unresolved: 34,
      rules: {
        business_pct_spike: { total: 25, resolved: 4, unresolved: 21 },
        kpi_threshold_breach: { total: 12, resolved: 3, unresolved: 9 },
        trend_deviation: { total: 5, resolved: 1, unresolved: 4 },
      },
    },
  }

  const PillarCard = ({
    title,
    description,
    icon: Icon,
    data,
    color,
  }: {
    title: string
    description: string
    icon: any
    data: any
    color: string
  }) => {
    const resolvedPercentage = Math.round((data.resolved / data.total) * 100)

    return (
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${color}`}>
              <Icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-card-foreground">{title}</h3>
              <CardDescription>{description}</CardDescription>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-card-foreground">{data.total}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-destructive">{data.unresolved}</div>
              <div className="text-sm text-muted-foreground">Unresolved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-chart-2">{data.resolved}</div>
              <div className="text-sm text-muted-foreground">Resolved</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Resolution Progress</span>
              <span className="text-card-foreground font-medium">{resolvedPercentage}%</span>
            </div>
            <Progress value={resolvedPercentage} className="h-2" />
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-card-foreground">Rules Breakdown</h4>
            {Object.entries(data.rules).map(([ruleName, ruleData]: [string, any]) => (
              <div key={ruleName} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{ruleName.replace(/_/g, " ")}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {ruleData.total}
                  </Badge>
                  {ruleData.unresolved > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {ruleData.unresolved} open
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PillarCard
          title="Data Quality"
          description="Basic data validation and integrity checks"
          icon={Database}
          data={triageData.dataQuality}
          color="bg-chart-1"
        />
        <PillarCard
          title="Smart Data Quality"
          description="AI-powered anomaly detection and pattern analysis"
          icon={Brain}
          data={triageData.smartDataQuality}
          color="bg-chart-3"
        />
        <PillarCard
          title="Business Rules"
          description="Business logic validation and KPI monitoring"
          icon={TrendingUp}
          data={triageData.business}
          color="bg-primary"
        />
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
          <Tabs defaultValue="data-quality" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="data-quality">Data Quality ({triageData.dataQuality.total})</TabsTrigger>
              <TabsTrigger value="smart-dq">Smart DQ ({triageData.smartDataQuality.total})</TabsTrigger>
              <TabsTrigger value="business">Business ({triageData.business.total})</TabsTrigger>
            </TabsList>

            <TabsContent value="data-quality" className="space-y-4">
              <AnomalyRuleGroup
                stage="Data Quality"
                rules={triageData.dataQuality.rules}
                showUnresolvedOnly={showUnresolvedOnly}
              />
            </TabsContent>

            <TabsContent value="smart-dq" className="space-y-4">
              <AnomalyRuleGroup
                stage="Smart Data Quality"
                rules={triageData.smartDataQuality.rules}
                showUnresolvedOnly={showUnresolvedOnly}
              />
            </TabsContent>

            <TabsContent value="business" className="space-y-4">
              <AnomalyRuleGroup
                stage="Business Rules"
                rules={triageData.business.rules}
                showUnresolvedOnly={showUnresolvedOnly}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
