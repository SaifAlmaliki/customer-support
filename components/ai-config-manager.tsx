"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Mic,
  Brain,
  MessageSquare,
  Zap,
  Play,
  Save,
  TestTube,
  Volume2,
  Clock,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"

interface VoiceSettings {
  provider: string
  voiceId: string
  stability: number
  similarityBoost: number
  speed: number
  volume: number
}

interface AISettings {
  model: string
  temperature: number
  maxTokens: number
  topP: number
  systemPrompt: string
  responseStyle: string
  language: string
}

interface EscalationRules {
  enabled: boolean
  maxAttempts: number
  confidenceThreshold: number
  escalationMessage: string
  humanHandoffEnabled: boolean
}

export function AIConfigManager() {
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    provider: "elevenlabs",
    voiceId: "21m00Tcm4TlvDq8ikWAM",
    stability: 75,
    similarityBoost: 80,
    speed: 100,
    volume: 85,
  })

  const [aiSettings, setAISettings] = useState<AISettings>({
    model: "gpt-4",
    temperature: 0.7,
    maxTokens: 500,
    topP: 0.9,
    systemPrompt:
      "You are a helpful customer support assistant. Be friendly, professional, and concise in your responses.",
    responseStyle: "professional",
    language: "en-US",
  })

  const [escalationRules, setEscalationRules] = useState<EscalationRules>({
    enabled: true,
    maxAttempts: 3,
    confidenceThreshold: 0.8,
    escalationMessage: "I'm going to connect you with a human agent who can better assist you.",
    humanHandoffEnabled: true,
  })

  const [isTestingVoice, setIsTestingVoice] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleTestVoice = async () => {
    setIsTestingVoice(true)
    // Simulate voice test
    setTimeout(() => {
      setIsTestingVoice(false)
    }, 3000)
  }

  const handleSaveConfiguration = async () => {
    setIsSaving(true)
    // Simulate saving configuration
    setTimeout(() => {
      setIsSaving(false)
    }, 1500)
  }

  const voiceOptions = [
    { id: "21m00Tcm4TlvDq8ikWAM", name: "Rachel - Professional Female", accent: "American" },
    { id: "AZnzlk1XvdvUeBnXmlld", name: "Domi - Warm Female", accent: "American" },
    { id: "EXAVITQu4vr4xnSDxMaL", name: "Bella - Confident Female", accent: "American" },
    { id: "ErXwobaYiN019PkySvjV", name: "Antoni - Friendly Male", accent: "American" },
    { id: "VR6AewLTigWG4xSOukaG", name: "Arnold - Deep Male", accent: "American" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">AI Configuration</h2>
          <p className="text-gray-600">Configure your AI voice assistant's behavior and settings</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleTestVoice}
            disabled={isTestingVoice}
            className="flex items-center gap-2 bg-transparent"
          >
            <TestTube className="h-4 w-4" />
            {isTestingVoice ? "Testing..." : "Test Voice"}
          </Button>
          <Button onClick={handleSaveConfiguration} disabled={isSaving} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save Configuration"}
          </Button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Model Status</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Active</div>
            <p className="text-xs text-gray-600">GPT-4 responding</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Voice Synthesis</CardTitle>
            <Volume2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">Ready</div>
            <p className="text-xs text-gray-600">ElevenLabs connected</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2s</div>
            <p className="text-xs text-gray-600">Average latency</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="voice" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="voice">Voice Settings</TabsTrigger>
          <TabsTrigger value="ai-model">AI Model</TabsTrigger>
          <TabsTrigger value="behavior">Behavior</TabsTrigger>
          <TabsTrigger value="escalation">Escalation</TabsTrigger>
          <TabsTrigger value="integration">Integration</TabsTrigger>
        </TabsList>

        <TabsContent value="voice" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="h-5 w-5" />
                Voice Configuration
              </CardTitle>
              <CardDescription>Configure ElevenLabs voice synthesis settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="voice-selection">Voice Selection</Label>
                <Select
                  value={voiceSettings.voiceId}
                  onValueChange={(value) => setVoiceSettings({ ...voiceSettings, voiceId: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {voiceOptions.map((voice) => (
                      <SelectItem key={voice.id} value={voice.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{voice.name}</span>
                          <Badge variant="outline" className="ml-2">
                            {voice.accent}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label>Stability: {voiceSettings.stability}%</Label>
                  <Slider
                    value={[voiceSettings.stability]}
                    onValueChange={(value) => setVoiceSettings({ ...voiceSettings, stability: value[0] })}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-600">Higher values make voice more consistent</p>
                </div>

                <div className="space-y-3">
                  <Label>Similarity Boost: {voiceSettings.similarityBoost}%</Label>
                  <Slider
                    value={[voiceSettings.similarityBoost]}
                    onValueChange={(value) => setVoiceSettings({ ...voiceSettings, similarityBoost: value[0] })}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-600">Enhances voice similarity to original</p>
                </div>

                <div className="space-y-3">
                  <Label>Speaking Speed: {voiceSettings.speed}%</Label>
                  <Slider
                    value={[voiceSettings.speed]}
                    onValueChange={(value) => setVoiceSettings({ ...voiceSettings, speed: value[0] })}
                    min={50}
                    max={150}
                    step={5}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-600">Adjust speaking pace</p>
                </div>

                <div className="space-y-3">
                  <Label>Volume: {voiceSettings.volume}%</Label>
                  <Slider
                    value={[voiceSettings.volume]}
                    onValueChange={(value) => setVoiceSettings({ ...voiceSettings, volume: value[0] })}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-600">Output volume level</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium">Test Voice Settings</p>
                  <p className="text-sm text-gray-600">Preview how your voice assistant will sound</p>
                </div>
                <Button onClick={handleTestVoice} disabled={isTestingVoice} className="flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  {isTestingVoice ? "Playing..." : "Test Voice"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-model" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Model Configuration
              </CardTitle>
              <CardDescription>Configure the language model and generation parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ai-model">AI Model</Label>
                  <Select
                    value={aiSettings.model}
                    onValueChange={(value) => setAISettings({ ...aiSettings, model: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4">GPT-4 (Recommended)</SelectItem>
                      <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                      <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                      <SelectItem value="claude-3">Claude 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={aiSettings.language}
                    onValueChange={(value) => setAISettings({ ...aiSettings, language: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="en-GB">English (UK)</SelectItem>
                      <SelectItem value="es-ES">Spanish</SelectItem>
                      <SelectItem value="fr-FR">French</SelectItem>
                      <SelectItem value="de-DE">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label>Temperature: {aiSettings.temperature}</Label>
                  <Slider
                    value={[aiSettings.temperature]}
                    onValueChange={(value) => setAISettings({ ...aiSettings, temperature: value[0] })}
                    min={0}
                    max={1}
                    step={0.1}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-600">Controls creativity vs consistency</p>
                </div>

                <div className="space-y-3">
                  <Label>Max Tokens: {aiSettings.maxTokens}</Label>
                  <Slider
                    value={[aiSettings.maxTokens]}
                    onValueChange={(value) => setAISettings({ ...aiSettings, maxTokens: value[0] })}
                    min={100}
                    max={1000}
                    step={50}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-600">Maximum response length</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="system-prompt">System Prompt</Label>
                <Textarea
                  id="system-prompt"
                  value={aiSettings.systemPrompt}
                  onChange={(e) => setAISettings({ ...aiSettings, systemPrompt: e.target.value })}
                  rows={4}
                  placeholder="Define how your AI assistant should behave..."
                />
                <p className="text-xs text-gray-600">This prompt defines your AI's personality and behavior</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="behavior" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Response Behavior
              </CardTitle>
              <CardDescription>Configure how your AI assistant responds to customers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="response-style">Response Style</Label>
                <Select
                  value={aiSettings.responseStyle}
                  onValueChange={(value) => setAISettings({ ...aiSettings, responseStyle: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="empathetic">Empathetic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="proactive-suggestions">Proactive Suggestions</Label>
                    <p className="text-sm text-gray-600">Offer helpful suggestions during conversations</p>
                  </div>
                  <Switch id="proactive-suggestions" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="follow-up-questions">Follow-up Questions</Label>
                    <p className="text-sm text-gray-600">Ask clarifying questions when needed</p>
                  </div>
                  <Switch id="follow-up-questions" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="conversation-memory">Conversation Memory</Label>
                    <p className="text-sm text-gray-600">Remember context within the same call</p>
                  </div>
                  <Switch id="conversation-memory" defaultChecked />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="greeting-message">Greeting Message</Label>
                <Textarea
                  id="greeting-message"
                  defaultValue="Hello! I'm your AI assistant. How can I help you today?"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fallback-message">Fallback Message</Label>
                <Textarea
                  id="fallback-message"
                  defaultValue="I'm not sure I understand. Could you please rephrase your question?"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="escalation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Escalation Rules
              </CardTitle>
              <CardDescription>Configure when and how to escalate to human agents</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="escalation-enabled">Enable Escalation</Label>
                  <p className="text-sm text-gray-600">Allow AI to escalate complex issues to humans</p>
                </div>
                <Switch
                  id="escalation-enabled"
                  checked={escalationRules.enabled}
                  onCheckedChange={(checked) => setEscalationRules({ ...escalationRules, enabled: checked })}
                />
              </div>

              {escalationRules.enabled && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="max-attempts">Max AI Attempts</Label>
                      <Input
                        id="max-attempts"
                        type="number"
                        value={escalationRules.maxAttempts}
                        onChange={(e) =>
                          setEscalationRules({ ...escalationRules, maxAttempts: Number.parseInt(e.target.value) })
                        }
                        min={1}
                        max={10}
                      />
                      <p className="text-xs text-gray-600">Number of attempts before escalation</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confidence-threshold">Confidence Threshold</Label>
                      <Input
                        id="confidence-threshold"
                        type="number"
                        value={escalationRules.confidenceThreshold}
                        onChange={(e) =>
                          setEscalationRules({
                            ...escalationRules,
                            confidenceThreshold: Number.parseFloat(e.target.value),
                          })
                        }
                        min={0}
                        max={1}
                        step={0.1}
                      />
                      <p className="text-xs text-gray-600">Minimum confidence to provide answer</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="escalation-message">Escalation Message</Label>
                    <Textarea
                      id="escalation-message"
                      value={escalationRules.escalationMessage}
                      onChange={(e) => setEscalationRules({ ...escalationRules, escalationMessage: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="human-handoff">Human Handoff</Label>
                      <p className="text-sm text-gray-600">Transfer call to human agent when escalating</p>
                    </div>
                    <Switch
                      id="human-handoff"
                      checked={escalationRules.humanHandoffEnabled}
                      onCheckedChange={(checked) =>
                        setEscalationRules({ ...escalationRules, humanHandoffEnabled: checked })
                      }
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                n8n Integration
              </CardTitle>
              <CardDescription>Configure webhook and workflow integration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <Input
                  id="webhook-url"
                  defaultValue="https://your-n8n-instance.com/webhook/ai-support"
                  placeholder="Enter your n8n webhook URL"
                />
                <p className="text-xs text-gray-600">n8n workflow endpoint for processing calls</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <Input id="api-key" type="password" defaultValue="••••••••••••••••" placeholder="Enter your API key" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timeout">Request Timeout (seconds)</Label>
                  <Input id="timeout" type="number" defaultValue="30" min={5} max={120} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="retry-attempts">Retry Attempts</Label>
                  <Input id="retry-attempts" type="number" defaultValue="3" min={0} max={5} />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="logging-enabled">Enable Logging</Label>
                    <p className="text-sm text-gray-600">Log all webhook requests and responses</p>
                  </div>
                  <Switch id="logging-enabled" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="async-processing">Async Processing</Label>
                    <p className="text-sm text-gray-600">Process requests asynchronously</p>
                  </div>
                  <Switch id="async-processing" defaultChecked />
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-800">Connection Status: Active</span>
                </div>
                <p className="text-sm text-green-700">Last successful webhook call: 2 minutes ago</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
