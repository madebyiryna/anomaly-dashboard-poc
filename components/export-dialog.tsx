"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Download, Mail, CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface ExportDialogProps {
  onClose: () => void
}

export function ExportDialog({ onClose }: ExportDialogProps) {
  const [exportType, setExportType] = useState<"csv" | "excel">("csv")
  const [includeResolved, setIncludeResolved] = useState(false)
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})
  const [selectedStages, setSelectedStages] = useState<string[]>(["all"])

  const handleExport = () => {
    // In real app, this would call API to generate export
    console.log("Exporting data:", {
      type: exportType,
      includeResolved,
      dateRange,
      stages: selectedStages,
    })

    // Simulate download
    const filename = `anomaly-report-${format(new Date(), "yyyy-MM-dd")}.${exportType}`
    console.log(`Downloading ${filename}`)

    onClose()
  }

  const handleScheduleReport = () => {
    // In real app, this would set up automated reporting
    console.log("Scheduling weekly report")
    onClose()
  }

  const stages = [
    { id: "all", label: "All Stages" },
    { id: "data-quality", label: "Data Quality" },
    { id: "smart-dq", label: "Smart Data Quality" },
    { id: "business", label: "Business Rules" },
  ]

  const handleStageChange = (stageId: string, checked: boolean) => {
    if (stageId === "all") {
      setSelectedStages(checked ? ["all"] : [])
    } else {
      const newStages = checked
        ? [...selectedStages.filter((s) => s !== "all"), stageId]
        : selectedStages.filter((s) => s !== stageId)
      setSelectedStages(newStages)
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Export & Reporting
        </DialogTitle>
        <DialogDescription>Export anomaly data or set up automated reporting schedules.</DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        {/* Export Options */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Data Export</CardTitle>
            <CardDescription>Export current anomaly data for offline analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Export Format */}
            <div className="space-y-2">
              <Label>Export Format</Label>
              <Select value={exportType} onValueChange={(value: "csv" | "excel") => setExportType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV (Comma Separated Values)</SelectItem>
                  <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <Label>Date Range (Optional)</Label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("justify-start text-left font-normal", !dateRange.from && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? format(dateRange.from, "PPP") : "From date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateRange.from}
                      onSelect={(date) => setDateRange((prev) => ({ ...prev, from: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("justify-start text-left font-normal", !dateRange.to && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.to ? format(dateRange.to, "PPP") : "To date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateRange.to}
                      onSelect={(date) => setDateRange((prev) => ({ ...prev, to: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Stages Filter */}
            <div className="space-y-2">
              <Label>Include Stages</Label>
              <div className="space-y-2">
                {stages.map((stage) => (
                  <div key={stage.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={stage.id}
                      checked={selectedStages.includes(stage.id)}
                      onCheckedChange={(checked) => handleStageChange(stage.id, checked as boolean)}
                    />
                    <Label htmlFor={stage.id} className="text-sm">
                      {stage.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Options */}
            <div className="flex items-center space-x-2">
              <Checkbox id="include-resolved" checked={includeResolved} onCheckedChange={setIncludeResolved} />
              <Label htmlFor="include-resolved" className="text-sm">
                Include resolved anomalies
              </Label>
            </div>

            <Button onClick={handleExport} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </CardContent>
        </Card>

        {/* Automated Reporting */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Automated Reporting</CardTitle>
            <CardDescription>Set up weekly summary reports delivered via email</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Weekly Summary Report</Label>
              <p className="text-sm text-muted-foreground">
                Receive a comprehensive weekly summary of anomaly detection results, resolution progress, and key
                metrics every Monday morning.
              </p>
            </div>

            <div className="bg-muted p-3 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Report Contents:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• New anomalies detected this week</li>
                <li>• Resolution progress and trends</li>
                <li>• Top anomaly rules by frequency</li>
                <li>• Data health metrics and KPIs</li>
                <li>• Recommendations for improvement</li>
              </ul>
            </div>

            <Button onClick={handleScheduleReport} variant="outline" className="w-full bg-transparent">
              <Mail className="h-4 w-4 mr-2" />
              Schedule Weekly Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
