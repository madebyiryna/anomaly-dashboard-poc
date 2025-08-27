import { OverviewDashboard } from "@/components/overview-dashboard"
import { GlobalHeader } from "@/components/global-header"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader currentPage="overview" />
      <main className="container mx-auto px-4 py-8">
        <OverviewDashboard />
      </main>
    </div>
  )
}
