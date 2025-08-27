import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function TestPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-4xl font-bold text-foreground mb-8">Test Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Test Card</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">This is a test card to see if the UI is working.</p>
            <Button className="mt-4">Test Button</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Another Test Card</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">This should have proper styling.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
