"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart3,
  TrendingUp,
  Clock,
  Users,
  Phone,
  AlertTriangle,
  CheckCircle,
  Download,
  RefreshCw,
  Activity,
  Zap,
  Database,
  Volume2,
  Loader2,
} from "lucide-react"

interface MetricCard {
  title: string
  value: string
  change: string
  trend: "up" | "down" | "neutral"
  icon: React.ReactNode
}

interface AlertItem {
  id: string
  alert_type: "warning" | "error" | "info" | "performance" | "usage" | "security"
  severity: "low" | "medium" | "high" | "critical"
  title: string
  message: string
  created_at: string
  status: "active" | "acknowledged" | "resolved"
}

interface MonitoringDashboardProps {
  user: {
    id: string
    profile: {
      company_id: string
    }
  }
}

export function MonitoringDashboard({ user }: MonitoringDashboardProps) {
  const [timeRange, setTimeRange] = useState("24h")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [analytics, setAnalytics] = useState<any>({})
  const [systemHealth, setSystemHealth] = useState<any>({})
  const [alerts, setAlerts] = useState<AlertItem[]>([])

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    setIsLoading(true)
    try {
      const days = timeRange === "1h" ? 1 : timeRange === "24h" ? 1 : timeRange === "7d" ? 7 : 30
      const response = await fetch(`/api/analytics/overview?days=${days}`)
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data.analytics || {})
        setSystemHealth(data.health || {})

        // Fetch alerts
        const alertsResponse = await fetch("/api/alerts")
        if (alertsResponse.ok) {
          const alertsData = await alertsResponse.json()
          setAlerts(alertsData.data || [])
        }
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const metrics: MetricCard[] = [
    {
      title: "Total Conversations",
      value: analytics.total_conversations?.toString() || "0",
      change: "+12.5%",
      trend: "up",
      icon: <Phone className="h-4 w-4 text-blue-600" />,
    },
    {
      title: "Resolution Rate",
      value: `${Math.round(analytics.resolution_rate || 0)}%`,
      change: "+2.1%",
      trend: "up",
      icon: <CheckCircle className="h-4 w-4 text-green-600" />,
    },
    {
      title: "Avg Duration",
      value: `${Math.round((analytics.avg_duration_seconds || 0) / 60)}m`,
      change: "-0.5m",
      trend: "up",
      icon: <Clock className="h-4 w-4 text-purple-600" />,
    },
    {
      title: "Satisfaction Score",
      value: `${(analytics.avg_satisfaction_score || 0).toFixed(1)}/5`,
      change: "+0.2",
      trend: "up",
      icon: <Users className="h-4 w-4 text-orange-600" />,
    },
    {
      title: "Escalation Rate",
      value: `${Math.round(analytics.escalation_rate || 0)}%`,
      change: "-1.2%",
      trend: "up",
      icon: <TrendingUp className="h-4 w-4 text-red-600" />,
    },
    {
      title: "Active Data Sources",
      value: systemHealth.active_data_sources?.toString() || "0",
      change: "+1",
      trend: "up",
      icon: <Database className="h-4 w-4 text-green-600" />,
    },
  ]

  const systemHealthComponents = [
    {
      component: "AI Model (GPT-4)",
      status: "healthy",
      uptime: "99.9%",
      responseTime: `${Math.round(systemHealth.avg_response_time_ms || 850)}ms`,
    },
    { component: "Voice Synthesis", status: "healthy", uptime: "99.7%", responseTime: "1.2s" },
    {
      component: "Vector Database",
      status: systemHealth.total_indexed_content > 1000 ? "healthy" : "warning",
      uptime: "98.5%",
      responseTime: "2.1s",
    },
    { component: "n8n Webhook", status: "healthy", uptime: "100%", responseTime: "120ms" },
    {
      component: "Knowledge Base",
      status: "healthy",
      uptime: "99.8%",
      responseTime: "450ms",
      records: systemHealth.total_indexed_content,
    },
  ]

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchAnalytics()
    setIsRefreshing(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-600"
      case "warning":
        return "text-yellow-600"
      case "error":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "healthy":
        return "default"
      case "warning":
        return "secondary"
      case "error":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "info":
        return <CheckCircle className="h-4 w-4 text-blue-600" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins} minutes ago`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`
    return `${Math.floor(diffMins / 1440)} days ago`
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Monitoring & Analytics</h2>
          <p className="text-gray-600">Real-time performance metrics and system health monitoring</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 bg-transparent"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              {metric.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center text-xs">
                <span
                  className={`${
                    metric.trend === "up"
                      ? "text-green-600"
                      : metric.trend === "down"
                        ? "text-red-600"
                        : "text-gray-600"
                  }`}
                >
                  {metric.change}
                </span>
                <span className="text-gray-600 ml-1">from yesterday</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="system-health">System Health</TabsTrigger>
          <TabsTrigger value="usage-analytics">Usage Analytics</TabsTrigger>
          <TabsTrigger value="alerts">Alerts & Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Call Volume Trends
                </CardTitle>
                <CardDescription>Hourly call distribution over the selected period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                  <div className="text-center text-gray-500">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Call volume chart would be rendered here</p>
                    <p className="text-sm">Peak: 89 calls at 2:00 PM</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Response Time Distribution
                </CardTitle>
                <CardDescription>AI response time breakdown by percentiles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">P50 (Median)</span>
                    <span className="font-medium">0.9s</span>
                  </div>
                  <Progress value={45} className="h-2" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm">P90</span>
                    <span className="font-medium">1.8s</span>
                  </div>
                  <Progress value={75} className="h-2" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm">P95</span>
                    <span className="font-medium">2.4s</span>
                  </div>
                  <Progress value={85} className="h-2" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm">P99</span>
                    <span className="font-medium">4.1s</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Success Rate Trends
                </CardTitle>
                <CardDescription>AI assistant success rate over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-32 flex items-center justify-center bg-gray-50 rounded">
                  <div className="text-center text-gray-500">
                    <TrendingUp className="h-8 w-8 mx-auto mb-1 opacity-50" />
                    <p className="text-sm">Success rate trend chart</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-green-600">96.2%</div>
                    <div className="text-xs text-gray-600">This week</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold">94.8%</div>
                    <div className="text-xs text-gray-600">Last week</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold">93.1%</div>
                    <div className="text-xs text-gray-600">Last month</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Customer Satisfaction
                </CardTitle>
                <CardDescription>Feedback ratings and satisfaction trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">5 Stars</span>
                    <div className="flex items-center gap-2">
                      <Progress value={68} className="w-24 h-2" />
                      <span className="text-sm font-medium">68%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">4 Stars</span>
                    <div className="flex items-center gap-2">
                      <Progress value={22} className="w-24 h-2" />
                      <span className="text-sm font-medium">22%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">3 Stars</span>
                    <div className="flex items-center gap-2">
                      <Progress value={7} className="w-24 h-2" />
                      <span className="text-sm font-medium">7%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">2 Stars</span>
                    <div className="flex items-center gap-2">
                      <Progress value={2} className="w-24 h-2" />
                      <span className="text-sm font-medium">2%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">1 Star</span>
                    <div className="flex items-center gap-2">
                      <Progress value={1} className="w-24 h-2" />
                      <span className="text-sm font-medium">1%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="system-health" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                System Components Status
              </CardTitle>
              <CardDescription>Real-time health monitoring of all system components</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemHealthComponents.map((component, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {component.component.includes("AI Model") && <Zap className="h-4 w-4 text-blue-600" />}
                        {component.component.includes("Voice") && <Volume2 className="h-4 w-4 text-purple-600" />}
                        {component.component.includes("Database") && <Database className="h-4 w-4 text-green-600" />}
                        {component.component.includes("Webhook") && <Activity className="h-4 w-4 text-orange-600" />}
                        {component.component.includes("Knowledge") && <BarChart3 className="h-4 w-4 text-indigo-600" />}
                        <span className="font-medium">{component.component}</span>
                      </div>
                      <Badge variant={getStatusBadge(component.status)}>{component.status}</Badge>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Uptime:</span> {component.uptime}
                      </div>
                      <div>
                        <span className="font-medium">Response:</span> {component.responseTime}
                      </div>
                      {component.records && (
                        <div>
                          <span className="font-medium">Records:</span> {component.records.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Resource Usage</CardTitle>
                <CardDescription>Current system resource utilization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">CPU Usage</span>
                    <span className="text-sm font-medium">34%</span>
                  </div>
                  <Progress value={34} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Memory Usage</span>
                    <span className="text-sm font-medium">67%</span>
                  </div>
                  <Progress value={67} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Storage Usage</span>
                    <span className="text-sm font-medium">23%</span>
                  </div>
                  <Progress value={23} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Network I/O</span>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>API Rate Limits</CardTitle>
                <CardDescription>Current usage against API limits</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">OpenAI API</span>
                    <span className="text-sm font-medium">1,247 / 10,000</span>
                  </div>
                  <Progress value={12.47} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">ElevenLabs API</span>
                    <span className="text-sm font-medium">892 / 5,000</span>
                  </div>
                  <Progress value={17.84} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Vector Database</span>
                    <span className="text-sm font-medium">3,456 / 50,000</span>
                  </div>
                  <Progress value={6.91} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="usage-analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Query Categories</CardTitle>
                <CardDescription>Breakdown of customer query types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Product Information</span>
                    <div className="flex items-center gap-2">
                      <Progress value={35} className="w-24 h-2" />
                      <span className="text-sm font-medium">35%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Support Issues</span>
                    <div className="flex items-center gap-2">
                      <Progress value={28} className="w-24 h-2" />
                      <span className="text-sm font-medium">28%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Account Management</span>
                    <div className="flex items-center gap-2">
                      <Progress value={22} className="w-24 h-2" />
                      <span className="text-sm font-medium">22%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Billing & Payments</span>
                    <div className="flex items-center gap-2">
                      <Progress value={15} className="w-24 h-2" />
                      <span className="text-sm font-medium">15%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost Analysis</CardTitle>
                <CardDescription>Operational costs breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">AI Model (GPT-4)</span>
                    <span className="text-sm font-medium">$89.50</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Voice Synthesis</span>
                    <span className="text-sm font-medium">$34.20</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Vector Database</span>
                    <span className="text-sm font-medium">$12.80</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Infrastructure</span>
                    <span className="text-sm font-medium">$28.90</span>
                  </div>
                  <div className="border-t pt-2 flex items-center justify-between font-medium">
                    <span>Total Daily Cost</span>
                    <span>$165.40</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Peak Usage Patterns</CardTitle>
              <CardDescription>Identify busy periods and optimize resource allocation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-48 flex items-center justify-center bg-gray-50 rounded">
                <div className="text-center text-gray-500">
                  <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Hourly usage pattern chart would be rendered here</p>
                  <p className="text-sm">Peak hours: 9-11 AM, 2-4 PM</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                System Alerts
              </CardTitle>
              <CardDescription>Recent alerts and system notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No active alerts</p>
                    <p className="text-sm">All systems are running normally</p>
                  </div>
                ) : (
                  alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`flex items-start gap-3 p-3 rounded-lg border ${
                        alert.status === "resolved" ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      {getAlertIcon(alert.alert_type)}
                      <div className="flex-1">
                        <p
                          className={`text-sm font-medium ${alert.status === "resolved" ? "text-gray-600" : "text-gray-900"}`}
                        >
                          {alert.title}
                        </p>
                        <p className={`text-sm ${alert.status === "resolved" ? "text-gray-500" : "text-gray-700"}`}>
                          {alert.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(alert.created_at)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            alert.severity === "critical"
                              ? "destructive"
                              : alert.severity === "high"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {alert.severity}
                        </Badge>
                        <Badge variant={alert.status === "resolved" ? "secondary" : "outline"}>{alert.status}</Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alert Configuration</CardTitle>
              <CardDescription>Configure thresholds and notification settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Response Time Threshold</label>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm">Alert when &gt; </span>
                      <span className="font-medium">2.0s</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Success Rate Threshold</label>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm">Alert when &lt; </span>
                      <span className="font-medium">90%</span>
                    </div>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  Configure Alerts
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
