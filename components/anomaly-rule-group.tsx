"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronDown, ChevronRight, AlertTriangle, CheckCircle, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import { CSVLoader, type AnomalyRow } from "@/lib/csv-loader"

interface AnomalyRuleGroupProps {
  stage: string
  rules: Record<string, { total: number; resolved: number; unresolved: number }>
  showUnresolvedOnly: boolean
}

export function AnomalyRuleGroup({ stage, rules, showUnresolvedOnly }: AnomalyRuleGroupProps) {
  const [expandedRules, setExpandedRules] = useState<Set<string>>(new Set())
  const [anomaliesByRule, setAnomaliesByRule] = useState<Record<string, AnomalyRow[]>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAnomalies = async () => {
      try {
        const csvLoader = CSVLoader.getInstance()
        await csvLoader.loadData()
        
        const allAnomalies = csvLoader.getAnomalies()
        
        // Filter anomalies by stage and group by rule
        const stageAnomalies = allAnomalies.filter(anomaly => {
          const stageName = anomaly.stage
          return stageName === stage || 
                 (stage === 'Data Quality' && stageName === 'DQ') ||
                 (stage === 'Smart Data Quality' && stageName === 'SmartDQ') ||
                 (stage === 'Business Rules' && stageName === 'Business')
        })
        
        const groupedAnomalies: Record<string, AnomalyRow[]> = {}
        
        stageAnomalies.forEach(anomaly => {
          if (!groupedAnomalies[anomaly.rule]) {
            groupedAnomalies[anomaly.rule] = []
          }
          groupedAnomalies[anomaly.rule].push(anomaly)
        })
        
        setAnomaliesByRule(groupedAnomalies)
      } catch (error) {
        console.error("Failed to load anomalies:", error)
      } finally {
        setLoading(false)
      }
    }
    
    loadAnomalies()
  }, [stage])

  const toggleRule = (ruleName: string) => {
    const newExpanded = new Set(expandedRules)
    if (newExpanded.has(ruleName)) {
      newExpanded.delete(ruleName)
    } else {
      newExpanded.add(ruleName)
    }
    setExpandedRules(newExpanded)
  }

  const handleAnomalyClick = (anomalyId: number) => {
    window.location.href = `/anomaly/${anomalyId}`
  }

  const formatRuleName = (ruleName: string) => {
    return ruleName.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  }

  const filteredRules = Object.entries(rules).filter(([_, ruleData]) => {
    if (showUnresolvedOnly) {
      return ruleData.unresolved > 0
    }
    return true
  })

  if (loading) {
    return (
      <div className="space-y-4">
        <Card className="border-border">
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Loading anomalies...</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {filteredRules.map(([ruleName, ruleData]) => {
        const isExpanded = expandedRules.has(ruleName)
        const ruleAnomalies = anomaliesByRule[ruleName] || []
        const displayedAnomalies = ruleAnomalies // All anomalies are considered unresolved for now

        return (
          <Card key={ruleName} className="border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 p-0 h-auto font-medium text-left"
                  onClick={() => toggleRule(ruleName)}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                  <CardTitle className="text-lg text-card-foreground">
                    {formatRuleName(ruleName)}
                  </CardTitle>
                </Button>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{ruleData.total} total</Badge>
                  {ruleData.unresolved > 0 && <Badge variant="destructive">{ruleData.unresolved} unresolved</Badge>}
                  {ruleData.resolved > 0 && <Badge variant="secondary">{ruleData.resolved} resolved</Badge>}
                </div>
              </div>
            </CardHeader>

            {isExpanded && (
              <CardContent className="pt-0">
                <div className="border border-border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Anomaly ID</TableHead>
                        <TableHead>Row Index</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayedAnomalies.slice(0, 10).map((anomaly) => (
                        <TableRow
                          key={anomaly.anomaly_id}
                          className={cn(
                            "cursor-pointer transition-colors",
                            "bg-destructive/5 hover:bg-destructive/10",
                          )}
                          onClick={() => handleAnomalyClick(anomaly.anomaly_id)}
                        >
                          <TableCell className="font-medium">{anomaly.anomaly_id}</TableCell>
                          <TableCell>{anomaly.row_index}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {anomaly.source}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-xs truncate" title={anomaly.description}>
                            {anomaly.description}
                          </TableCell>
                          <TableCell>
                            <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                              <AlertTriangle className="h-3 w-3" />
                              Open
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {displayedAnomalies.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    {showUnresolvedOnly ? "No unresolved anomalies for this rule" : "No anomalies found"}
                  </div>
                )}

                {displayedAnomalies.length > 10 && (
                  <div className="text-center py-4 text-muted-foreground">
                    Showing first 10 of {displayedAnomalies.length} anomalies
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        )
      })}

      {filteredRules.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          {showUnresolvedOnly ? "No unresolved anomalies found" : "No anomalies found"}
        </div>
      )}
    </div>
  )
}
