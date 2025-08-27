"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "./data-table"
import { Badge } from "@/components/ui/badge"

export function DataExplorerTabs() {
  const [activeTab, setActiveTab] = useState("pharmacy")

  // Mock data counts - in real app this would come from API
  const dataCounts = {
    pharmacy: { total: 45623, anomalous: 892 },
    medical: { total: 67234, anomalous: 1134 },
    joined: { total: 125847, anomalous: 2152 },
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="pharmacy" className="flex items-center gap-2">
          Pharmacy Claims
          <Badge variant="secondary" className="text-xs">
            {dataCounts.pharmacy.total.toLocaleString()}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="medical" className="flex items-center gap-2">
          Medical Claims
          <Badge variant="secondary" className="text-xs">
            {dataCounts.medical.total.toLocaleString()}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="joined" className="flex items-center gap-2">
          Joined Data Product
          <Badge variant="secondary" className="text-xs">
            {dataCounts.joined.total.toLocaleString()}
          </Badge>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="pharmacy" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Pharmacy Claims Dataset
              <div className="flex items-center gap-2">
                <Badge variant="outline">{dataCounts.pharmacy.anomalous} anomalies</Badge>
                <Badge variant="destructive">
                  {Math.round((dataCounts.pharmacy.anomalous / dataCounts.pharmacy.total) * 100)}% anomalous
                </Badge>
              </div>
            </CardTitle>
            <CardDescription>
              Pharmacy claims data with prescription details, costs, and patient information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable dataset="pharmacy" />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="medical" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Medical Claims Dataset
              <div className="flex items-center gap-2">
                <Badge variant="outline">{dataCounts.medical.anomalous} anomalies</Badge>
                <Badge variant="destructive">
                  {Math.round((dataCounts.medical.anomalous / dataCounts.medical.total) * 100)}% anomalous
                </Badge>
              </div>
            </CardTitle>
            <CardDescription>
              Medical claims data including diagnoses, procedures, and provider information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable dataset="medical" />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="joined" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              NY Oncology Data Product (Joined)
              <div className="flex items-center gap-2">
                <Badge variant="outline">{dataCounts.joined.anomalous} anomalies</Badge>
                <Badge variant="destructive">
                  {Math.round((dataCounts.joined.anomalous / dataCounts.joined.total) * 100)}% anomalous
                </Badge>
              </div>
            </CardTitle>
            <CardDescription>
              Combined pharmacy and medical claims data for comprehensive oncology analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable dataset="joined" />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
