"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Database, FileText, Settings, TestTube, BarChart3, MessageSquare, LogOut, CreditCard } from "lucide-react"
import { DataSourceManager } from "@/components/data-source-manager"
import { KnowledgeBaseManager } from "@/components/knowledge-base-manager"
import { AIConfigManager } from "@/components/ai-config-manager"
import { TestingTools } from "@/components/testing-tools"
import { MonitoringDashboard } from "@/components/monitoring-dashboard"
import { ConversationLogs } from "@/components/conversation-logs"
import { BillingDashboard } from "@/components/billing-dashboard"
import { signOut } from "@/lib/actions"

interface AdminDashboardProps {
  user: {
    id: string
    email: string
    profile: {
      id: string
      company_id: string
      full_name: string
      role: string
      companies: {
        id: string
        name: string
        domain: string
        plan: string
        status: string
      }
    }
  }
}

export function AdminDashboard({ user }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")

  const handleLogout = async () => {
    await signOut()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Support Admin Portal</h1>
            <p className="text-sm text-gray-600">
              {user.profile.companies.name} • {user.profile.full_name || user.email}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full capitalize">
              {user.profile.companies.plan}
            </span>
            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2 bg-transparent">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar Navigation */}
        <nav className="w-64 bg-white border-r border-gray-200 min-h-screen p-4">
          <div className="space-y-2">
            <Button
              variant={activeTab === "overview" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("overview")}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </Button>
            <Button
              variant={activeTab === "data-sources" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("data-sources")}
            >
              <Database className="h-4 w-4 mr-2" />
              Data Sources
            </Button>
            <Button
              variant={activeTab === "knowledge-base" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("knowledge-base")}
            >
              <FileText className="h-4 w-4 mr-2" />
              Knowledge Base
            </Button>
            <Button
              variant={activeTab === "ai-config" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("ai-config")}
            >
              <Settings className="h-4 w-4 mr-2" />
              AI Configuration
            </Button>
            <Button
              variant={activeTab === "testing" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("testing")}
            >
              <TestTube className="h-4 w-4 mr-2" />
              Testing Tools
            </Button>
            <Button
              variant={activeTab === "conversations" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("conversations")}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Conversations
            </Button>
            <Button
              variant={activeTab === "billing" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("billing")}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Billing
            </Button>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 p-6">
          {activeTab === "overview" && <MonitoringDashboard user={user} />}
          {activeTab === "data-sources" && <DataSourceManager user={user} />}
          {activeTab === "knowledge-base" && <KnowledgeBaseManager user={user} />}
          {activeTab === "ai-config" && <AIConfigManager user={user} />}
          {activeTab === "testing" && <TestingTools user={user} />}
          {activeTab === "conversations" && <ConversationLogs user={user} />}
          {activeTab === "billing" && <BillingDashboard user={user} />}
        </main>
      </div>
    </div>
  )
}
