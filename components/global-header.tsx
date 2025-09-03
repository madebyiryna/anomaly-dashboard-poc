"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Search, Download, Settings, User } from "lucide-react"
import { GlobalSearch } from "./global-search"
import { ExportDialog } from "./export-dialog"

interface GlobalHeaderProps {
  currentPage: "overview" | "data-explorer" | "triage" | "anomaly-detail" | "documentation"
}

export function GlobalHeader({ currentPage }: GlobalHeaderProps) {
  const [showSearch, setShowSearch] = useState(false)
  const [showExport, setShowExport] = useState(false)

  const navItems = [
    { key: "overview", label: "Overview", href: "/" },
    { key: "data-explorer", label: "Data Explorer", href: "/data-explorer" },
    { key: "triage", label: "Triage Center", href: "/triage" },
    { key: "documentation", label: "Documentation", href: "/documentation" },
  ]

  return (
    <header className="border-b border-border bg-card sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">NY Oncology Data Product</h1>
              <span className="text-sm text-muted-foreground">Anomaly Detection Dashboard</span>
            </div>
          </div>

          {/* Global Search */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search anomalies, rules, or data..."
                className="pl-10 pr-4"
                onFocus={() => setShowSearch(true)}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Navigation */}
            <nav className="flex items-center gap-6">
              {navItems.map((item) => (
                <a
                  key={item.key}
                  href={item.href}
                  className={
                    currentPage === item.key
                      ? "text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground transition-colors"
                  }
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Export Menu */}
            <Dialog open={showExport} onOpenChange={setShowExport}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </DialogTrigger>
              <DialogContent>
                <ExportDialog onClose={() => setShowExport(false)} />
              </DialogContent>
            </Dialog>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden md:inline">Dr. Sarah Johnson</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Badge variant="secondary" className="mr-2">
                    Data Engineer
                  </Badge>
                  Role: Full Access
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Global Search Dialog */}
      <Dialog open={showSearch} onOpenChange={setShowSearch}>
        <DialogContent className="max-w-4xl">
          <GlobalSearch onClose={() => setShowSearch(false)} />
        </DialogContent>
      </Dialog>
    </header>
  )
}
