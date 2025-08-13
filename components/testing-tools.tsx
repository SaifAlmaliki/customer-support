"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Play,
  Volume2,
  TestTube,
  MessageSquare,
  Clock,
  CheckCircle,
  BarChart3,
  FileText,
  Zap,
  Download,
  Upload,
} from "lucide-react"

interface TestResult {
  id: string
  query: string
  response: string
  confidence: number
  responseTime: number
  sources: string[]
  timestamp: string
  rating?: number
}

interface TestScenario {
  id: string
  name: string
  description: string
  queries: string[]
  category: string
}

export function TestingTools() {
  const [currentQuery, setCurrentQuery] = useState("")
  const [isTestingQuery, setIsTestingQuery] = useState(false)
  const [isTestingVoice, setIsTestingVoice] = useState(false)
  const [testResults, setTestResults] = useState<TestResult[]>([
    {
      id: "1",
      query: "What is your return policy?",
      response:
        "Our return policy allows you to return items within 30 days of purchase for a full refund. Items must be in original condition with tags attached.",
      confidence: 0.95,
      responseTime: 1200,
      sources: ["Policy Documents", "Customer Database"],
      timestamp: "2 minutes ago",
      rating: 5,
    },
    {
      id: "2",
      query: "How do I reset my password?",
      response:
        "To reset your password, go to the login page and click 'Forgot Password'. Enter your email address and we'll send you a reset link.",
      confidence: 0.88,
      responseTime: 950,
      sources: ["Product API", "Customer Database"],
      timestamp: "5 minutes ago",
      rating: 4,
    },
  ])

  const [testScenarios] = useState<TestScenario[]>([
    {
      id: "1",
      name: "Customer Support Basics",
      description: "Common customer service inquiries",
      queries: [
        "What are your business hours?",
        "How can I contact customer support?",
        "What is your return policy?",
        "Do you offer international shipping?",
      ],
      category: "Support",
    },
    {
      id: "2",
      name: "Product Information",
      description: "Questions about products and services",
      queries: [
        "What products do you offer?",
        "What are the specifications of product X?",
        "Is product Y available in different colors?",
        "What is the warranty on your products?",
      ],
      category: "Products",
    },
    {
      id: "3",
      name: "Account Management",
      description: "User account related queries",
      queries: [
        "How do I create an account?",
        "How do I reset my password?",
        "How can I update my profile?",
        "How do I delete my account?",
      ],
      category: "Account",
    },
  ])

  const [batchTestProgress, setBatchTestProgress] = useState(0)
  const [isBatchTesting, setIsBatchTesting] = useState(false)

  const handleSingleTest = async () => {
    if (!currentQuery.trim()) return

    setIsTestingQuery(true)

    // Simulate API call
    setTimeout(() => {
      const newResult: TestResult = {
        id: Date.now().toString(),
        query: currentQuery,
        response:
          "This is a simulated response to your query. The AI assistant would provide a helpful answer based on your knowledge base.",
        confidence: Math.random() * 0.3 + 0.7, // Random confidence between 0.7-1.0
        responseTime: Math.floor(Math.random() * 1000) + 500, // Random time 500-1500ms
        sources: ["Customer Database", "Policy Documents"],
        timestamp: "Just now",
      }

      setTestResults([newResult, ...testResults])
      setCurrentQuery("")
      setIsTestingQuery(false)
    }, 2000)
  }

  const handleVoiceTest = async (text: string) => {
    setIsTestingVoice(true)
    // Simulate voice synthesis
    setTimeout(() => {
      setIsTestingVoice(false)
    }, 3000)
  }

  const handleBatchTest = async (scenarioId: string) => {
    const scenario = testScenarios.find((s) => s.id === scenarioId)
    if (!scenario) return

    setIsBatchTesting(true)
    setBatchTestProgress(0)

    // Simulate batch testing
    for (let i = 0; i < scenario.queries.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setBatchTestProgress(((i + 1) / scenario.queries.length) * 100)

      const newResult: TestResult = {
        id: `batch-${Date.now()}-${i}`,
        query: scenario.queries[i],
        response: `Simulated response for: ${scenario.queries[i]}`,
        confidence: Math.random() * 0.3 + 0.7,
        responseTime: Math.floor(Math.random() * 1000) + 500,
        sources: ["Knowledge Base"],
        timestamp: "Just now",
      }

      setTestResults((prev) => [newResult, ...prev])
    }

    setIsBatchTesting(false)
    setBatchTestProgress(0)
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return "text-green-600"
    if (confidence >= 0.7) return "text-yellow-600"
    return "text-red-600"
  }

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 0.9) return "default"
    if (confidence >= 0.7) return "secondary"
    return "destructive"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Testing Tools</h2>
          <p className="text-gray-600">Test and simulate your AI voice assistant before going live</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Export Results
          </Button>
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <Upload className="h-4 w-4" />
            Import Scenarios
          </Button>
        </div>
      </div>

      {/* Testing Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tests Run</CardTitle>
            <TestTube className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{testResults.length}</div>
            <p className="text-xs text-gray-600">Total queries tested</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
            <BarChart3 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {testResults.length > 0
                ? Math.round((testResults.reduce((sum, r) => sum + r.confidence, 0) / testResults.length) * 100)
                : 0}
              %
            </div>
            <p className="text-xs text-gray-600">Response confidence</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {testResults.length > 0
                ? Math.round(testResults.reduce((sum, r) => sum + r.responseTime, 0) / testResults.length)
                : 0}
              ms
            </div>
            <p className="text-xs text-gray-600">Processing time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {testResults.length > 0
                ? Math.round((testResults.filter((r) => r.confidence >= 0.7).length / testResults.length) * 100)
                : 0}
              %
            </div>
            <p className="text-xs text-gray-600">High confidence responses</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="single-test" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="single-test">Single Test</TabsTrigger>
          <TabsTrigger value="batch-test">Batch Testing</TabsTrigger>
          <TabsTrigger value="scenarios">Test Scenarios</TabsTrigger>
          <TabsTrigger value="results">Test Results</TabsTrigger>
        </TabsList>

        <TabsContent value="single-test" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Single Query Test
              </CardTitle>
              <CardDescription>Test individual queries and see how your AI assistant responds</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="test-query">Customer Query</Label>
                <Textarea
                  id="test-query"
                  value={currentQuery}
                  onChange={(e) => setCurrentQuery(e.target.value)}
                  placeholder="Enter a customer question to test..."
                  rows={3}
                />
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={handleSingleTest}
                  disabled={isTestingQuery || !currentQuery.trim()}
                  className="flex items-center gap-2"
                >
                  <Play className="h-4 w-4" />
                  {isTestingQuery ? "Testing..." : "Test Query"}
                </Button>
                <Select defaultValue="text-only">
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text-only">Text Response Only</SelectItem>
                    <SelectItem value="with-voice">Text + Voice Preview</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {testResults.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Latest Test Result</h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div>
                      <strong>Query:</strong> {testResults[0].query}
                    </div>
                    <div>
                      <strong>Response:</strong> {testResults[0].response}
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <strong>Confidence:</strong>
                        <Badge variant={getConfidenceBadge(testResults[0].confidence)}>
                          {Math.round(testResults[0].confidence * 100)}%
                        </Badge>
                      </div>
                      <div>
                        <strong>Response Time:</strong> {testResults[0].responseTime}ms
                      </div>
                      <div>
                        <strong>Sources:</strong> {testResults[0].sources.join(", ")}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleVoiceTest(testResults[0].response)}
                        disabled={isTestingVoice}
                        className="flex items-center gap-1"
                      >
                        <Volume2 className="h-3 w-3" />
                        {isTestingVoice ? "Playing..." : "Test Voice"}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="batch-test" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Batch Testing
              </CardTitle>
              <CardDescription>Run multiple test queries automatically using predefined scenarios</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isBatchTesting && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Running batch test...</span>
                    <span>{Math.round(batchTestProgress)}%</span>
                  </div>
                  <Progress value={batchTestProgress} className="w-full" />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {testScenarios.map((scenario) => (
                  <Card key={scenario.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{scenario.name}</CardTitle>
                        <Badge variant="outline">{scenario.category}</Badge>
                      </div>
                      <CardDescription>{scenario.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="text-sm text-gray-600">
                          <strong>{scenario.queries.length} queries</strong>
                        </div>
                        <div className="text-xs text-gray-500">Sample: "{scenario.queries[0]}"</div>
                        <Button
                          size="sm"
                          onClick={() => handleBatchTest(scenario.id)}
                          disabled={isBatchTesting}
                          className="w-full"
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Run Test
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Test Scenarios
              </CardTitle>
              <CardDescription>Manage and create test scenarios for comprehensive testing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Available Scenarios</h4>
                <Button size="sm" className="flex items-center gap-1">
                  <TestTube className="h-3 w-3" />
                  Create Scenario
                </Button>
              </div>

              <div className="space-y-3">
                {testScenarios.map((scenario) => (
                  <div key={scenario.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium">{scenario.name}</h5>
                      <Badge variant="outline">{scenario.category}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{scenario.description}</p>
                    <div className="space-y-1">
                      <strong className="text-sm">Test Queries:</strong>
                      {scenario.queries.map((query, index) => (
                        <div key={index} className="text-sm text-gray-600 ml-2">
                          • {query}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Test Results History
              </CardTitle>
              <CardDescription>Review all test results and performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {testResults.map((result) => (
                  <div key={result.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <strong className="text-sm">Query:</strong> {result.query}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        {result.timestamp}
                      </div>
                    </div>
                    <div className="mb-3">
                      <strong className="text-sm">Response:</strong>
                      <p className="text-sm text-gray-600 mt-1">{result.response}</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <strong>Confidence:</strong>
                        <Badge variant={getConfidenceBadge(result.confidence)}>
                          {Math.round(result.confidence * 100)}%
                        </Badge>
                      </div>
                      <div>
                        <strong>Time:</strong> {result.responseTime}ms
                      </div>
                      <div>
                        <strong>Sources:</strong> {result.sources.join(", ")}
                      </div>
                      {result.rating && (
                        <div>
                          <strong>Rating:</strong> {result.rating}/5 ⭐
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
