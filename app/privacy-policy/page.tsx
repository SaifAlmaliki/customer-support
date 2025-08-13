import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, ArrowLeft, Shield, Eye, Lock, Database } from "lucide-react"
import Link from "next/link"

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <MessageSquare className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">AI Support Pro</span>
          </Link>
          <Button variant="outline" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-600">Last updated: January 15, 2025</p>
        </div>

        {/* Privacy Highlights */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">Data Protection</h3>
            <p className="text-sm text-gray-600">Enterprise-grade security</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Eye className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">Transparency</h3>
            <p className="text-sm text-gray-600">Clear data usage</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Lock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">Your Control</h3>
            <p className="text-sm text-gray-600">Manage your data</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <Database className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">Data Ownership</h3>
            <p className="text-sm text-gray-600">You own your data</p>
          </div>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>1. Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Account Information</h4>
                <p>When you create an account, we collect:</p>
                <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                  <li>Name and email address</li>
                  <li>Company information</li>
                  <li>Billing and payment details</li>
                  <li>Account preferences and settings</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Service Data</h4>
                <p>To provide AI support services, we process:</p>
                <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                  <li>Customer conversation transcripts</li>
                  <li>Knowledge base content you upload</li>
                  <li>Database connections and API integrations</li>
                  <li>AI configuration and training data</li>
                  <li>Usage analytics and performance metrics</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Technical Information</h4>
                <p>We automatically collect:</p>
                <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                  <li>IP addresses and device information</li>
                  <li>Browser type and version</li>
                  <li>Usage patterns and feature interactions</li>
                  <li>Error logs and performance data</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Service Provision</h4>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Provide AI-powered customer support functionality</li>
                  <li>Process and respond to customer inquiries</li>
                  <li>Maintain and improve service performance</li>
                  <li>Generate analytics and insights</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Account Management</h4>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Create and maintain your account</li>
                  <li>Process billing and payments</li>
                  <li>Provide customer support</li>
                  <li>Send service-related communications</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Improvement and Development</h4>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Analyze usage patterns to improve our service</li>
                  <li>Develop new features and capabilities</li>
                  <li>Train and improve AI models (with your consent)</li>
                  <li>Ensure security and prevent fraud</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Data Sharing and Disclosure</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We do not sell, trade, or rent your personal information to third parties. We may share information in
                these limited circumstances:
              </p>
              <div>
                <h4 className="font-semibold mb-2">Service Providers</h4>
                <p>We work with trusted third-party providers for:</p>
                <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                  <li>Cloud hosting and infrastructure (AWS, Google Cloud)</li>
                  <li>Payment processing (Stripe)</li>
                  <li>AI services (OpenAI, ElevenLabs)</li>
                  <li>Analytics and monitoring tools</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Legal Requirements</h4>
                <p>We may disclose information when required by law or to:</p>
                <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                  <li>Comply with legal processes</li>
                  <li>Protect our rights and property</li>
                  <li>Ensure user safety and security</li>
                  <li>Investigate potential violations</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Data Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>We implement comprehensive security measures to protect your data:</p>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <h4 className="font-semibold mb-2">Technical Safeguards</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>End-to-end encryption</li>
                    <li>Secure data transmission (TLS 1.3)</li>
                    <li>Regular security audits</li>
                    <li>Access controls and authentication</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Operational Security</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Employee background checks</li>
                    <li>Limited data access policies</li>
                    <li>Regular security training</li>
                    <li>Incident response procedures</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Your Rights and Choices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>You have the following rights regarding your personal data:</p>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <h4 className="font-semibold mb-2">Access and Control</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Access your personal data</li>
                    <li>Update or correct information</li>
                    <li>Download your data</li>
                    <li>Delete your account</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Privacy Controls</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Opt out of marketing communications</li>
                    <li>Control data sharing preferences</li>
                    <li>Manage cookie settings</li>
                    <li>Request data portability</li>
                  </ul>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                To exercise these rights, contact us at privacy@aisupportpro.com or through your account settings.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Data Retention</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>We retain your data for as long as necessary to provide our services:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Account Data:</strong> Retained while your account is active
                </li>
                <li>
                  <strong>Conversation Data:</strong> Retained for 2 years for service improvement
                </li>
                <li>
                  <strong>Billing Data:</strong> Retained for 7 years for legal compliance
                </li>
                <li>
                  <strong>Analytics Data:</strong> Aggregated data retained indefinitely
                </li>
              </ul>
              <p>You can request deletion of your data at any time, subject to legal retention requirements.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. International Data Transfers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Our services are hosted in the United States. If you are accessing our services from outside the US,
                your data may be transferred to and processed in the United States.
              </p>
              <p>
                We ensure appropriate safeguards are in place for international transfers, including standard
                contractual clauses and adequacy decisions where applicable.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Our service is not intended for children under 13 years of age. We do not knowingly collect personal
                information from children under 13. If you become aware that a child has provided us with personal
                information, please contact us immediately.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Changes to This Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any material changes by
                posting the new policy on this page and sending an email notification to registered users.
              </p>
              <p className="mt-2">
                Your continued use of our service after any changes indicates your acceptance of the updated policy.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p>If you have any questions about this Privacy Policy or our data practices, please contact us:</p>
              <div className="mt-4 space-y-2">
                <p>
                  <strong>Email:</strong> privacy@aisupportpro.com
                </p>
                <p>
                  <strong>Address:</strong> 123 AI Street, Tech City, TC 12345
                </p>
                <p>
                  <strong>Phone:</strong> +1 (555) 123-4567
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
