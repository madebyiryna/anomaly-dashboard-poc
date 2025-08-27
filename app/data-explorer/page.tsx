import { DataExplorerTabs } from "@/components/data-explorer-tabs"
import { GlobalHeader } from "@/components/global-header"

export default function DataExplorerPage() {
  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader currentPage="data-explorer" />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-foreground text-balance">Data Product Exploration</h2>
            <p className="text-muted-foreground text-pretty">
              Browse and inspect raw data tables with anomalies clearly highlighted and linked to metadata
            </p>
          </div>
          <DataExplorerTabs />
        </div>
      </main>
    </div>
  )
}
