"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Search, AlertTriangle, Database, Calendar, ExternalLink } from "lucide-react"
import { getStageDisplayName } from "@/lib/stage-mapping"

interface GlobalSearchProps {
  onClose: () => void
}

export function GlobalSearch({ onClose }: GlobalSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<any>({
    anomalies: [],
    dataRows: [],
    rules: [],
  })
  const [isSearching, setIsSearching] = useState(false)

  // Mock search function - in real app this would call API
  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults({ anomalies: [], dataRows: [], rules: [] })
      return
    }

    setIsSearching(true)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Mock search results
    const mockResults = {
      anomalies: [
        {
          id: "BUSINESS_PCT_SPIKE-001",
          rule: "business_pct_spike",
          stage: getStageDisplayName('Business'),
          source: "joined",
          rowIndex: 1247,
          description: "Business KPI percent change spike detected: +45.2% vs previous week (threshold 25%)",
          resolved: false,
          timestamp: "2024-01-20T10:30:00Z",
          patientId: "P001",
        },
        {
          id: "MISSING_KEY_FIELD-002",
          rule: "missing_key_field",
          stage: getStageDisplayName('Data Quality'),
          source: "medical",
          rowIndex: 3891,
          description: "Required field 'diagnosis' is missing or null when it should contain data",
          resolved: true,
          timestamp: "2024-01-19T14:15:00Z",
          patientId: "P003",
        },
      ],
      dataRows: [
        {
          id: 1,
          source: "pharmacy",
          patientId: "P001",
          drugName: "Carboplatin",
          cost: 2340.5,
          hasAnomalies: true,
          anomalyCount: 1,
        },
        {
          id: 2,
          source: "joined",
          patientId: "P001",
          drugName: "Carboplatin",
          totalCost: 6840.5,
          hasAnomalies: true,
          anomalyCount: 2,
        },
      ],
      rules: [
        {
          name: "business_pct_spike",
          stage: getStageDisplayName('Business'),
          description: "Detects significant percentage changes in business KPIs",
          anomalyCount: 25,
          unresolvedCount: 21,
        },
        {
          name: "missing_key_field",
          stage: getStageDisplayName('Data Quality'),
          description: "Identifies missing or null values in required fields",
          anomalyCount: 43,
          unresolvedCount: 31,
        },
      ],
    }

    // Filter results based on search term
    const filteredResults = {
      anomalies: mockResults.anomalies.filter(
        (anomaly) =>
          anomaly.description.toLowerCase().includes(query.toLowerCase()) ||
          anomaly.rule.toLowerCase().includes(query.toLowerCase()) ||
          anomaly.id.toLowerCase().includes(query.toLowerCase()) ||
          anomaly.patientId.toLowerCase().includes(query.toLowerCase()),
      ),
      dataRows: mockResults.dataRows.filter(
        (row) =>
          row.patientId.toLowerCase().includes(query.toLowerCase()) ||
          row.drugName?.toLowerCase().includes(query.toLowerCase()),
      ),
      rules: mockResults.rules.filter(
        (rule) =>
          rule.name.toLowerCase().includes(query.toLowerCase()) ||
          rule.description.toLowerCase().includes(query.toLowerCase()),
      ),
    }

    setSearchResults(filteredResults)
    setIsSearching(false)
  }

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      performSearch(searchTerm)
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm])

  const handleAnomalyClick = (anomalyId: string) => {
    window.location.href = `/anomaly/${anomalyId}`
    onClose()
  }

  const handleDataRowClick = (source: string) => {
    window.location.href = `/data-explorer`
    onClose()
  }

  const handleRuleClick = () => {
    window.location.href = `/triage`
    onClose()
  }

  const totalResults = searchResults.anomalies.length + searchResults.dataRows.length + searchResults.rules.length

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Global Search
        </DialogTitle>
        <DialogDescription>
          Search across anomalies, data rows, and rules. Use keywords like patient IDs, rule names, or descriptions.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search anomalies, rules, patient IDs, or descriptions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            autoFocus
          />
        </div>

        {/* Search Results */}
        {searchTerm && (
          <div className="space-y-4">
            {isSearching ? (
              <div className="text-center py-8 text-muted-foreground">Searching...</div>
            ) : totalResults === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No results found for "{searchTerm}"</div>
            ) : (
              <Tabs defaultValue="anomalies" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="anomalies">Anomalies ({searchResults.anomalies.length})</TabsTrigger>
                  <TabsTrigger value="data">Data Rows ({searchResults.dataRows.length})</TabsTrigger>
                  <TabsTrigger value="rules">Rules ({searchResults.rules.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="anomalies" className="space-y-3 max-h-96 overflow-y-auto">
                  {searchResults.anomalies.map((anomaly: any) => (
                    <Card
                      key={anomaly.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleAnomalyClick(anomaly.id)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-medium">{anomaly.id}</CardTitle>
                          <div className="flex items-center gap-2">
                            {anomaly.resolved ? (
                              <Badge variant="secondary" className="text-xs">
                                Resolved
                              </Badge>
                            ) : (
                              <Badge variant="destructive" className="text-xs">
                                Open
                              </Badge>
                            )}
                            <ExternalLink className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Rule: {anomaly.rule}</span>
                            <span>Patient: {anomaly.patientId}</span>
                            <span>Row: {anomaly.rowIndex}</span>
                          </div>
                          <p className="text-sm text-card-foreground line-clamp-2">{anomaly.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="data" className="space-y-3 max-h-96 overflow-y-auto">
                  {searchResults.dataRows.map((row: any) => (
                    <Card
                      key={`${row.source}-${row.id}`}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleDataRowClick(row.source)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-medium">
                            {row.patientId} - {row.drugName}
                          </CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs capitalize">
                              {row.source}
                            </Badge>
                            {row.hasAnomalies && (
                              <Badge variant="destructive" className="text-xs">
                                {row.anomalyCount} anomal{row.anomalyCount === 1 ? "y" : "ies"}
                              </Badge>
                            )}
                            <ExternalLink className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Cost: ${(row.cost || row.totalCost).toFixed(2)}</span>
                          <span>Source: {row.source}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="rules" className="space-y-3 max-h-96 overflow-y-auto">
                  {searchResults.rules.map((rule: any) => (
                    <Card
                      key={rule.name}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={handleRuleClick}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-medium">
                            {rule.name.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}
                          </CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {rule.stage}
                            </Badge>
                            <Badge variant="destructive" className="text-xs">
                              {rule.unresolvedCount} open
                            </Badge>
                            <ExternalLink className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          <p className="text-sm text-card-foreground">{rule.description}</p>
                          <div className="text-sm text-muted-foreground">Total anomalies: {rule.anomalyCount}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>
            )}
          </div>
        )}

        {/* Quick Actions */}
        {!searchTerm && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" size="sm" onClick={() => setSearchTerm("business_pct_spike")}>
                <AlertTriangle className="h-4 w-4 mr-2" />
                Business Spikes
              </Button>
              <Button variant="outline" size="sm" onClick={() => setSearchTerm("missing_key_field")}>
                <Database className="h-4 w-4 mr-2" />
                Missing Fields
              </Button>
              <Button variant="outline" size="sm" onClick={() => setSearchTerm("P001")}>
                <Search className="h-4 w-4 mr-2" />
                Patient P001
              </Button>
              <Button variant="outline" size="sm" onClick={() => setSearchTerm("unresolved")}>
                <Calendar className="h-4 w-4 mr-2" />
                Open Issues
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
