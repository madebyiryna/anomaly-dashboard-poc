"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  Calendar,
  Database,
  FileText,
  User,
  Clock,
  Flag,
  MessageSquare,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface AnomalyDetailProps {
  anomalyId: string
}

export function AnomalyDetail({ anomalyId }: AnomalyDetailProps) {
  const [resolutionNote, setResolutionNote] = useState("")

  // Mock data - in real app this would come from API
  const anomalyData = {
    anomaly_id: anomalyId,
    stage: "Business Rules",
    rule: "business_pct_spike",
    source: "joined",
    row_index: 1247,
    timestamp: "2024-01-20T10:30:00Z",
    resolved_flag: false,
    description:
      "Business KPI percent change spike detected: +45.2% vs previous week (threshold 25%). Total cost increased from $4,200 to $6,100 (+45.2%) for patient P001 treatment regimen.",
    assignee: "Dr. Sarah Johnson",
    priority: "High",
    created_by: "System",
    last_updated: "2024-01-21T14:22:00Z",
    audit_trail: [
      {
        action: "Anomaly Detected",
        timestamp: "2024-01-20T10:30:00Z",
        user: "System",
        details: "Automated detection via business rules engine",
      },
      {
        action: "Assigned",
        timestamp: "2024-01-20T11:15:00Z",
        user: "Admin",
        details: "Assigned to Dr. Sarah Johnson for review",
      },
      {
        action: "Investigation Started",
        timestamp: "2024-01-21T09:00:00Z",
        user: "Dr. Sarah Johnson",
        details: "Started investigating cost spike anomaly",
      },
    ],
  }

  // Mock row data - the actual data row where anomaly was detected
  const rowData = {
    patient_id: "P001",
    drug_name: "Carboplatin",
    diagnosis: "C78.9",
    total_cost: 6100.0, // This is the anomalous value
    treatment_date: "2024-01-15",
    provider: "Dr. Smith",
    insurance_coverage: 0.8,
    previous_cost: 4200.0, // For comparison
  }

  const handleMarkResolved = () => {
    // In real app, this would call API to mark as resolved
    console.log("Mark as resolved:", resolutionNote)
  }

  const handleEscalate = () => {
    // In real app, this would call API to escalate
    console.log("Escalate anomaly")
  }

  const handleAssign = () => {
    // In real app, this would open assignment dialog
    console.log("Assign to user")
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "Data Quality":
        return "bg-chart-1"
      case "Smart Data Quality":
        return "bg-chart-3"
      case "Business Rules":
        return "bg-primary"
      default:
        return "bg-muted"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "destructive"
      case "Medium":
        return "default"
      case "Low":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Triage
        </Button>
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-foreground text-balance">Anomaly Detail</h2>
          <p className="text-muted-foreground">ID: {anomalyData.anomaly_id}</p>
        </div>
        <div className="flex items-center gap-2">
          {anomalyData.resolved_flag ? (
            <Badge variant="secondary" className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Resolved
            </Badge>
          ) : (
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Open
            </Badge>
          )}
          <Badge variant={getPriorityColor(anomalyData.priority)}>{anomalyData.priority} Priority</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Anomaly Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Anomaly Metadata
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Stage</Label>
                  <div className="flex items-center gap-2">
                    <div className={cn("w-3 h-3 rounded-full", getStageColor(anomalyData.stage))} />
                    <span className="text-card-foreground">{anomalyData.stage}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Rule</Label>
                  <span className="text-card-foreground font-mono text-sm">{anomalyData.rule.replace(/_/g, " ")}</span>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Source Dataset</Label>
                  <Badge variant="outline" className="capitalize">
                    {anomalyData.source}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Row Index</Label>
                  <span className="text-card-foreground font-mono">{anomalyData.row_index}</span>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Detected</Label>
                  <div className="flex items-center gap-2 text-card-foreground">
                    <Calendar className="h-4 w-4" />
                    {new Date(anomalyData.timestamp).toLocaleString()}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Assignee</Label>
                  <div className="flex items-center gap-2 text-card-foreground">
                    <User className="h-4 w-4" />
                    {anomalyData.assignee}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-card-foreground leading-relaxed">{anomalyData.description}</p>
            </CardContent>
          </Card>

          {/* Row Context Viewer */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Row Context Viewer
              </CardTitle>
              <CardDescription>
                Data row from {anomalyData.source} dataset where the anomaly was detected (Row {anomalyData.row_index})
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border border-border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Field</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(rowData).map(([field, value]) => {
                      const isAnomalous = field === "total_cost" // Highlight the anomalous field
                      return (
                        <TableRow key={field} className={cn(isAnomalous && "bg-yellow-50 border-yellow-200")}>
                          <TableCell className="font-medium">{field.replace(/_/g, " ")}</TableCell>
                          <TableCell className={cn("font-mono", isAnomalous && "font-bold text-yellow-800")}>
                            {typeof value === "number" && field.includes("cost")
                              ? `$${value.toFixed(2)}`
                              : value?.toString() || "null"}
                          </TableCell>
                          <TableCell>
                            {isAnomalous ? (
                              <Badge variant="destructive" className="text-xs">
                                Anomalous
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs">
                                Normal
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
              {/* Comparison Info */}
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Cost Comparison:</strong> Previous treatment cost was ${rowData.previous_cost.toFixed(2)}.
                  Current cost of ${rowData.total_cost.toFixed(2)} represents a{" "}
                  {Math.round(((rowData.total_cost - rowData.previous_cost) / rowData.previous_cost) * 100)}% increase.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Resolution Workflow */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flag className="h-5 w-5" />
                Resolution Workflow
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!anomalyData.resolved_flag && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="resolution-note">Resolution Note</Label>
                    <Textarea
                      id="resolution-note"
                      placeholder="Add notes about the resolution..."
                      value={resolutionNote}
                      onChange={(e) => setResolutionNote(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Button onClick={handleMarkResolved} className="w-full">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Resolved
                    </Button>
                    <Button variant="outline" onClick={handleEscalate} className="w-full bg-transparent">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Escalate
                    </Button>
                    <Button variant="outline" onClick={handleAssign} className="w-full bg-transparent">
                      <User className="h-4 w-4 mr-2" />
                      Reassign
                    </Button>
                  </div>
                </>
              )}
              {anomalyData.resolved_flag && (
                <div className="text-center py-4">
                  <CheckCircle className="h-12 w-12 text-chart-2 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">This anomaly has been resolved</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Audit Trail */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Audit Trail
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {anomalyData.audit_trail.map((entry, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2" />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-card-foreground">{entry.action}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(entry.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">by {entry.user}</p>
                      <p className="text-sm text-muted-foreground">{entry.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
