import { TriageCenter } from "@/components/triage-center"
import { GlobalHeader } from "@/components/global-header"

export default function TriagePage() {
  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader currentPage="triage" />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-foreground text-balance">Anomalies Triage Center</h2>
            <p className="text-muted-foreground text-pretty">
              Centralized command center for anomaly management, grouped by severity and rule type
            </p>
          </div>
          <TriageCenter />
        </div>
      </main>
    </div>
  )
}
