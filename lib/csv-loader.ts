export type Source = "pharmacy" | "medical" | "joined"

export type AnomalyRow = {
  anomaly_id: number
  stage: string
  rule: string
  source: Source
  row_index: number
  description: string
}

export type DataRow = Record<string, string | number>

export class CSVLoader {
  private static instance: CSVLoader
  private anomalies: AnomalyRow[] = []
  private datasets: Record<Source, DataRow[]> = {
    pharmacy: [],
    medical: [],
    joined: [],
  }
  private anomaliesById: Map<number, AnomalyRow> = new Map()
  private anomaliesBySourceRow: Map<Source, Map<number, AnomalyRow[]>> = new Map()
  private loaded = false
  private loading = false

  static getInstance(): CSVLoader {
    if (!CSVLoader.instance) {
      CSVLoader.instance = new CSVLoader()
    }
    return CSVLoader.instance
  }

  async loadData(): Promise<void> {
    if (this.loaded || this.loading) return
    this.loading = true

    try {
      // Load all CSV files
      const [anomaliesData, joinedData, medicalData, pharmacyData] = await Promise.all([
        this.loadCSV("/data/anomalies_output.csv"),
        this.loadCSV("/data/joined.csv"),
        this.loadCSV("/data/medical.csv"),
        this.loadCSV("/data/pharmacy.csv"),
      ])

      // Parse anomalies
      this.anomalies = anomaliesData.map((row) => ({
        anomaly_id: Number.parseInt(row.anomaly_id as string),
        stage: row.stage as string,
        rule: row.rule as string,
        source: this.mapSourceToInternal(row.source as string),
        row_index: Number.parseInt(row.row_index as string),
        description: row.description as string,
      }))

      // Store datasets
      this.datasets.joined = joinedData
      this.datasets.medical = medicalData
      this.datasets.pharmacy = pharmacyData

      // Build lookup maps
      this.buildLookupMaps()

      this.loaded = true
    } catch (error) {
      console.error("Failed to load CSV data:", error)
      throw error
    } finally {
      this.loading = false
    }
  }

  private async loadCSV(path: string): Promise<DataRow[]> {
    const response = await fetch(path)
    if (!response.ok) {
      throw new Error(`Failed to load ${path}: ${response.statusText}`)
    }

    const text = await response.text()
    return this.parseCSV(text)
  }

  private parseCSV(text: string): DataRow[] {
    const lines = text.trim().split("\n")
    if (lines.length < 2) return []

    const headers = lines[0].split(",").map((h) => h.trim())
    const rows: DataRow[] = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim())
      const row: DataRow = {}

      headers.forEach((header, index) => {
        const value = values[index] || ""
        // Try to parse as number, otherwise keep as string
        row[header] = isNaN(Number(value)) ? value : Number(value)
      })

      rows.push(row)
    }

    return rows
  }

  private mapSourceToInternal(source: string): Source {
    // Map external source names to internal source names
    switch (source.toLowerCase()) {
      case "join":
        return "joined"
      case "pharmacy":
        return "pharmacy"
      case "medical":
        return "medical"
      default:
        return "joined" // Default fallback
    }
  }

  private buildLookupMaps(): void {
    // Build anomaliesById map
    this.anomaliesById.clear()
    this.anomalies.forEach((anomaly) => {
      this.anomaliesById.set(anomaly.anomaly_id, anomaly)
    })

    // Build anomaliesBySourceRow map
    this.anomaliesBySourceRow.clear()
    ;["pharmacy", "medical", "joined"].forEach((source) => {
      this.anomaliesBySourceRow.set(source as Source, new Map())
    })

    this.anomalies.forEach((anomaly) => {
      const sourceMap = this.anomaliesBySourceRow.get(anomaly.source)
      if (sourceMap) {
        if (!sourceMap.has(anomaly.row_index)) {
          sourceMap.set(anomaly.row_index, [])
        }
        sourceMap.get(anomaly.row_index)!.push(anomaly)
      }
    })
  }

  // Public getters
  getAnomalies(): AnomalyRow[] {
    return this.anomalies
  }

  getDataset(source: Source): DataRow[] {
    return this.datasets[source]
  }

  getAnomalyById(id: number): AnomalyRow | undefined {
    return this.anomaliesById.get(id)
  }

  getAnomaliesForRow(source: Source, rowIndex: number): AnomalyRow[] {
    return this.anomaliesBySourceRow.get(source)?.get(rowIndex) || []
  }

  getHealthStats() {
    const joinedRows = this.datasets.joined.length
    const joinedAnomalies = this.anomalies.filter((a) => a.source === "joined")
    const uniqueAnomalousRows = new Set(joinedAnomalies.map((a) => a.row_index)).size

    return {
      totalRows: joinedRows,
      healthyRows: joinedRows - uniqueAnomalousRows,
      anomalousRows: uniqueAnomalousRows,
      healthyPercentage: joinedRows > 0 ? ((joinedRows - uniqueAnomalousRows) / joinedRows) * 100 : 0,
    }
  }

  getStageStats() {
    const stages = ["Data Quality", "Smart Data Quality", "Business"]
    return stages.map((stage) => ({
      stage,
      count: this.anomalies.filter((a) => a.stage === stage).length,
    }))
  }

  getRuleStats() {
    const ruleCounts = new Map<string, number>()
    this.anomalies.forEach((anomaly) => {
      ruleCounts.set(anomaly.rule, (ruleCounts.get(anomaly.rule) || 0) + 1)
    })

    return Array.from(ruleCounts.entries())
      .map(([rule, count]) => ({ rule, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }

  getDatasetStats() {
    const stats = {
      pharmacy: {
        total: this.datasets.pharmacy.length,
        anomalous: this.anomalies.filter((a) => a.source === "pharmacy").length,
      },
      medical: {
        total: this.datasets.medical.length,
        anomalous: this.anomalies.filter((a) => a.source === "medical").length,
      },
      joined: {
        total: this.datasets.joined.length,
        anomalous: this.anomalies.filter((a) => a.source === "joined").length,
      },
    }

    return stats
  }

  isLoaded(): boolean {
    return this.loaded
  }
}
