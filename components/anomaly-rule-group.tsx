"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronDown, ChevronRight, AlertTriangle, CheckCircle, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

interface AnomalyRuleGroupProps {
  stage: string
  rules: Record<string, { total: number; resolved: number; unresolved: number }>
  showUnresolvedOnly: boolean
}

export function AnomalyRuleGroup({ stage, rules, showUnresolvedOnly }: AnomalyRuleGroupProps) {
  const [expandedRules, setExpandedRules] = useState<Set<string>>(new Set())

  const toggleRule = (ruleName: string) => {
    const newExpanded = new Set(expandedRules)
    if (newExpanded.has(ruleName)) {
      newExpanded.delete(ruleName)
    } else {
      newExpanded.add(ruleName)
    }
    setExpandedRules(newExpanded)
  }

  // Mock anomaly details - in real app this would come from API
  const generateMockAnomalies = (ruleName: string, count: number) => {
    const baseAnomalies = [
      {
        id: "ANO-001",
        rule: ruleName,
        rowIndex: 1247,
        source: "pharmacy",
        resolved: false,
        lastUpdated: "2024-01-20T10:30:00Z",
        description: "Business KPI percent change spike detected: +45.2% vs previous week (threshold 25%)",
      },
      {
        id: "ANO-002",
        rule: ruleName,
        rowIndex: 3891,
        source: "medical",
        resolved: true,
        lastUpdated: "2024-01-19T14:15:00Z",
        description: "Required field 'diagnosis' is missing or null when it should contain data",
      },
      {
        id: "ANO-003",
        rule: ruleName,
        rowIndex: 5623,
        source: "joined",
        resolved: false,
        lastUpdated: "2024-01-21T09:45:00Z",
        description: "Null rate exceeds expected threshold for this field (actual: 15%, expected: <5%)",
      },
    ]

    return baseAnomalies.slice(0, Math.min(count, 3)).map((anomaly, index) => ({
      ...anomaly,
      id: `${ruleName.toUpperCase()}-${String(index + 1).padStart(3, "0")}`,
    }))
  }

  const handleAnomalyClick = (anomalyId: string) => {
    window.location.href = `/anomaly/${anomalyId}`
  }

  const filteredRules = Object.entries(rules).filter(([_, ruleData]) => {
    if (showUnresolvedOnly) {
      return ruleData.unresolved > 0
    }
    return true
  })

  return (
    <div className="space-y-4">
      {filteredRules.map(([ruleName, ruleData]) => {
        const isExpanded = expandedRules.has(ruleName)
        const mockAnomalies = generateMockAnomalies(ruleName, ruleData.total)
        const displayedAnomalies = showUnresolvedOnly ? mockAnomalies.filter((a) => !a.resolved) : mockAnomalies

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
                    {ruleName.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
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
                        <TableHead>Status</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayedAnomalies.map((anomaly) => (
                        <TableRow
                          key={anomaly.id}
                          className={cn(
                            "cursor-pointer transition-colors",
                            !anomaly.resolved && "bg-destructive/5 hover:bg-destructive/10",
                          )}
                          onClick={() => handleAnomalyClick(anomaly.id)}
                        >
                          <TableCell className="font-medium">{anomaly.id}</TableCell>
                          <TableCell>{anomaly.rowIndex}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {anomaly.source}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {anomaly.resolved ? (
                              <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                                <CheckCircle className="h-3 w-3" />
                                Resolved
                              </Badge>
                            ) : (
                              <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                                <AlertTriangle className="h-3 w-3" />
                                Open
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(anomaly.lastUpdated).toLocaleDateString()}
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
