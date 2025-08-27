"use client"

import { useState, useEffect } from "react"
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
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { getStageDisplayNameSafe } from "@/lib/stage-mapping"
import { CSVLoader, type AnomalyRow, type DataRow } from "@/lib/csv-loader"

interface AnomalyDetailProps {
  anomalyId: string
}

export function AnomalyDetail({ anomalyId }: AnomalyDetailProps) {
  const [resolutionNote, setResolutionNote] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [anomalyData, setAnomalyData] = useState<AnomalyRow | null>(null)
  const [rowData, setRowData] = useState<DataRow | null>(null)
  const [csvLoader, setCsvLoader] = useState<CSVLoader | null>(null)

  useEffect(() => {
    const loadAnomalyData = async () => {
      try {
        setLoading(true)
        setError(null)

        const loader = CSVLoader.getInstance()
        await loader.loadData()
        setCsvLoader(loader)

        const anomalyIdNum = parseInt(anomalyId)
        if (isNaN(anomalyIdNum)) {
          throw new Error("Invalid anomaly ID")
        }

        const anomaly = loader.getAnomalyById(anomalyIdNum)
        if (!anomaly) {
          throw new Error("Anomaly not found")
        }

        setAnomalyData(anomaly)

        // Get the actual row data from the source dataset
        const dataset = loader.getDataset(anomaly.source)
        if (dataset && dataset[anomaly.row_index]) {
          setRowData(dataset[anomaly.row_index])
        } else {
          throw new Error(`Row data not found for index ${anomaly.row_index} in ${anomaly.source} dataset`)
        }

      } catch (err) {
        console.error("Failed to load anomaly data:", err)
        setError(err instanceof Error ? err.message : "Failed to load anomaly data")
      } finally {
        setLoading(false)
      }
    }

    loadAnomalyData()
  }, [anomalyId])

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
      case 'Data Quality':
        return "bg-chart-1"
      case 'Smart Data Quality':
        return "bg-chart-3"
      case 'Business Rules':
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

  const formatFieldName = (fieldName: string) => {
    return fieldName.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  }

  const isDataQualityIssue = (stage: string) => {
    return stage.toLowerCase() === 'dq' || stage.toLowerCase() === 'sdq'
  }

  const formatFieldValue = (value: any, fieldName: string) => {
    if (value === null || value === undefined) return "null"
    
    // Format currency fields
    if (typeof value === "number" && fieldName.toLowerCase().includes("cost") || 
        fieldName.toLowerCase().includes("amount") || 
        fieldName.toLowerCase().includes("paid") ||
        fieldName.toLowerCase().includes("charge")) {
      return `$${Number(value).toFixed(2)}`
    }
    
    // Format percentages
    if (typeof value === "number" && fieldName.toLowerCase().includes("pct") || 
        fieldName.toLowerCase().includes("percentage")) {
      return `${(Number(value) * 100).toFixed(2)}%`
    }
    
    // Format dates
    if (typeof value === "string" && (fieldName.toLowerCase().includes("date") || 
        fieldName.toLowerCase().includes("time"))) {
      try {
        return new Date(value).toLocaleDateString()
      } catch {
        return value
      }
    }
    
    return value.toString()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading anomaly details...</span>
        </div>
      </div>
    )
  }

  if (error || !anomalyData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
          <h3 className="text-lg font-semibold">Error Loading Anomaly</h3>
          <p className="text-muted-foreground">{error || "Anomaly not found"}</p>
          <Button onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-foreground text-balance">
            {isDataQualityIssue(anomalyData.stage) ? 'Data Quality Issue' : 'Anomaly Detail'}
          </h2>
          <p className="text-muted-foreground">ID: {anomalyData.anomaly_id}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Open
          </Badge>
          {isDataQualityIssue(anomalyData.stage) && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Data Quality
            </Badge>
          )}
          <Badge variant="outline">High Priority</Badge>
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
                    <div className={cn("w-3 h-3 rounded-full", getStageColor(getStageDisplayNameSafe(anomalyData.stage)))} />
                    <span className="text-card-foreground">
                      {isDataQualityIssue(anomalyData.stage) 
                        ? 'Data Quality Issue' 
                        : getStageDisplayNameSafe(anomalyData.stage)
                      }
                    </span>
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
                  <Label className="text-sm font-medium text-muted-foreground">Anomaly ID</Label>
                  <span className="text-card-foreground font-mono">{anomalyData.anomaly_id}</span>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Source</Label>
                  <div className="flex items-center gap-2 text-card-foreground">
                    <Database className="h-4 w-4" />
                    {anomalyData.source}
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
                {isDataQualityIssue(anomalyData.stage) 
                  ? 'Data Quality Issue Description' 
                  : 'Description'
                }
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-card-foreground leading-relaxed">{anomalyData.description}</p>
            </CardContent>
          </Card>

          {/* Row Context Viewer */}
          {rowData && (
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
                        <TableHead>Type</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(rowData).map(([field, value]) => (
                        <TableRow key={field}>
                          <TableCell className="font-medium">{formatFieldName(field)}</TableCell>
                          <TableCell className="font-mono text-sm">
                            {formatFieldValue(value, field)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="text-xs">
                              {typeof value === "number" ? "Number" : typeof value === "string" ? "String" : "Other"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
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
            </CardContent>
          </Card>

          {/* Dataset Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Dataset Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Source Dataset</Label>
                <Badge variant="outline" className="capitalize">
                  {anomalyData.source}
                </Badge>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Total Rows</Label>
                <span className="text-card-foreground">
                  {csvLoader ? csvLoader.getDataset(anomalyData.source).length.toLocaleString() : "Loading..."}
                </span>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Anomalies in Dataset</Label>
                <span className="text-card-foreground">
                  {csvLoader ? csvLoader.getAnomalies().filter(a => a.source === anomalyData.source).length : "Loading..."}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
