import { AnomalyDetail } from "@/components/anomaly-detail"
import { GlobalHeader } from "@/components/global-header"
import { notFound } from "next/navigation"

interface AnomalyDetailPageProps {
  params: {
    id: string
  }
}

export default function AnomalyDetailPage({ params }: AnomalyDetailPageProps) {
  // In real app, this would fetch anomaly data from API
  const anomalyId = params.id

  if (!anomalyId) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader currentPage="anomaly-detail" />
      <main className="container mx-auto px-4 py-8">
        <AnomalyDetail anomalyId={anomalyId} />
      </main>
    </div>
  )
}
