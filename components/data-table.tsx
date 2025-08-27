"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AlertTriangle, Search, Filter } from "lucide-react"
import { cn } from "@/lib/utils"
import { CSVLoader, type Source, type DataRow, type AnomalyRow } from "@/lib/csv-loader"

interface DataTableProps {
  dataset: Source
}

export function DataTable({ dataset }: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 20
  const [data, setData] = useState<DataRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [csvLoader, setCsvLoader] = useState<CSVLoader | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const loader = CSVLoader.getInstance()
        await loader.loadData()
        const datasetRows = loader.getDataset(dataset)
        setData(datasetRows)
        setCsvLoader(loader)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [dataset])

  const filteredData = data.filter((row) =>
    Object.values(row).some((value) => value?.toString().toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const paginatedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
  const totalPages = Math.ceil(filteredData.length / rowsPerPage)

  const getAnomalyTooltip = (anomalies: AnomalyRow[]) => {
    return (
      <div className="space-y-2">
        {anomalies.map((anomaly, index) => (
          <div key={index}>
            <p className="font-medium">{anomaly.rule}</p>
            <p className="text-sm text-muted-foreground">{anomaly.description}</p>
          </div>
        ))}
      </div>
    )
  }

  const handleRowClick = (rowIndex: number, anomalies: AnomalyRow[]) => {
    if (anomalies.length === 1) {
      window.location.href = `/anomaly/${anomalies[0].anomaly_id}`
    } else if (anomalies.length > 1) {
      window.location.href = `/row/${dataset}/${rowIndex}`
    }
  }

  const renderTableHeaders = () => {
    if (data.length === 0) return null

    const columns = Object.keys(data[0])
    return columns
      .map((column) => (
        <TableHead key={column} className="text-card-foreground font-medium">
          {column.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
        </TableHead>
      ))
      .concat(
        <TableHead key="status" className="text-card-foreground font-medium">
          Status
        </TableHead>,
      )
  }

  const renderTableRow = (row: DataRow, rowIndex: number) => {
    const anomalies = csvLoader?.getAnomaliesForRow(dataset, rowIndex) || []
    const hasAnomalies = anomalies.length > 0

    return (
      <TooltipProvider key={rowIndex}>
        <TableRow
          className={cn(
            "cursor-pointer transition-colors",
            hasAnomalies && "bg-destructive/10 border-destructive/20 hover:bg-destructive/20",
          )}
          onClick={() => handleRowClick(rowIndex, anomalies)}
        >
          {Object.entries(row).map(([key, value]) => (
            <TableCell key={key} className={key.includes("id") ? "font-medium" : ""}>
              {value === null || value === undefined || value === "" ? (
                <span className="text-muted-foreground italic">null</span>
              ) : typeof value === "number" && key.toLowerCase().includes("cost") ? (
                `$${value.toFixed(2)}`
              ) : (
                value.toString()
              )}
            </TableCell>
          ))}
          <TableCell>
            {hasAnomalies ? (
              <Tooltip>
                <TooltipTrigger>
                  <Badge variant="destructive" className="flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {anomalies.length} anomal{anomalies.length === 1 ? "y" : "ies"}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">{getAnomalyTooltip(anomalies)}</TooltipContent>
              </Tooltip>
            ) : (
              <Badge variant="secondary">Healthy</Badge>
            )}
          </TableCell>
        </TableRow>
      </TooltipProvider>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading {dataset} data...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-destructive">
          Error loading {dataset}.csv: {error}
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">No data found in {dataset}.csv</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search data..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Data Table */}
      <div className="border border-border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>{renderTableHeaders()}</TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((row, index) => renderTableRow(row, (currentPage - 1) * rowsPerPage + index))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {(currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, filteredData.length)} of{" "}
          {filteredData.length} results
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
