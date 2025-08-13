"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Calendar, TrendingUp, AlertTriangle, CheckCircle, ExternalLink, Download } from "lucide-react"
import { PRICING_PLANS } from "@/lib/stripe"
import { getSubscriptionInfo, type SubscriptionInfo } from "@/lib/subscription-utils"
import { loadStripe } from "@stripe/stripe-js"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface BillingDashboardProps {
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

export function BillingDashboard({ user }: BillingDashboardProps) {
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [upgrading, setUpgrading] = useState(false)

  useEffect(() => {
    loadSubscriptionInfo()
  }, [user.profile.company_id])

  const loadSubscriptionInfo = async () => {
    try {
      const info = await getSubscriptionInfo(user.profile.company_id)
      setSubscriptionInfo(info)
    } catch (error) {
      console.error("Error loading subscription info:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = async (planId: string) => {
    setUpgrading(true)
    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId,
          companyId: user.profile.company_id,
        }),
      })

      const { sessionId } = await response.json()
      const stripe = await stripePromise

      if (stripe) {
        await stripe.redirectToCheckout({ sessionId })
      }
    } catch (error) {
      console.error("Error creating checkout session:", error)
    } finally {
      setUpgrading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!subscriptionInfo) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to load billing information</h3>
        <p className="text-gray-600">Please try refreshing the page or contact support.</p>
      </div>
    )
  }

  const currentPlan = PRICING_PLANS[subscriptionInfo.plan]
  const isActive = subscriptionInfo.status === "active"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Billing & Subscription</h2>
          <p className="text-gray-600">Manage your subscription and view usage</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2 bg-transparent">
          <Download className="h-4 w-4" />
          Download Invoice
        </Button>
      </div>

      {/* Current Plan Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentPlan.name}</div>
            <p className="text-xs text-muted-foreground">${currentPlan.price}/month</p>
            <Badge className={`mt-2 ${isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
              {subscriptionInfo.status}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Billing</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Jan 15, 2025</div>
            <p className="text-xs text-muted-foreground">${currentPlan.price} will be charged</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Spend</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${currentPlan.price}</div>
            <p className="text-xs text-muted-foreground">Base subscription cost</p>
          </CardContent>
        </Card>
      </div>

      {/* Usage Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Usage This Month</CardTitle>
          <CardDescription>Track your usage against plan limits</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Conversations</span>
              <span className="text-sm text-gray-600">
                {subscriptionInfo.currentUsage.conversations.toLocaleString()} /{" "}
                {subscriptionInfo.limits.conversations === -1
                  ? "Unlimited"
                  : subscriptionInfo.limits.conversations.toLocaleString()}
              </span>
            </div>
            <Progress value={subscriptionInfo.usagePercentage.conversations} className="h-2" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Data Sources</span>
              <span className="text-sm text-gray-600">
                {subscriptionInfo.currentUsage.dataSources} /{" "}
                {subscriptionInfo.limits.dataSources === -1 ? "Unlimited" : subscriptionInfo.limits.dataSources}
              </span>
            </div>
            <Progress value={subscriptionInfo.usagePercentage.dataSources} className="h-2" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Team Members</span>
              <span className="text-sm text-gray-600">
                {subscriptionInfo.currentUsage.users} /{" "}
                {subscriptionInfo.limits.users === -1 ? "Unlimited" : subscriptionInfo.limits.users}
              </span>
            </div>
            <Progress value={subscriptionInfo.usagePercentage.users} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Plan Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Available Plans</CardTitle>
          <CardDescription>Upgrade or downgrade your plan anytime</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(PRICING_PLANS).map(([planId, plan]) => {
              const isCurrent = planId === subscriptionInfo.plan
              const isUpgrade = plan.price > currentPlan.price

              return (
                <Card
                  key={planId}
                  className={`relative ${isCurrent ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}
                >
                  {isCurrent && <Badge className="absolute -top-2 left-4 bg-blue-600 text-white">Current Plan</Badge>}

                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                    <div className="text-3xl font-bold">${plan.price}</div>
                    <p className="text-sm text-gray-600">/month</p>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <ul className="space-y-2 text-sm">
                      {plan.features.slice(0, 4).map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {!isCurrent && (
                      <Button
                        className="w-full"
                        variant={isUpgrade ? "default" : "outline"}
                        onClick={() => handleUpgrade(planId)}
                        disabled={upgrading}
                      >
                        {upgrading ? "Processing..." : isUpgrade ? "Upgrade" : "Downgrade"}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>View your recent payments and invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { date: "Dec 15, 2024", amount: currentPlan.price, status: "Paid", invoice: "INV-001" },
              { date: "Nov 15, 2024", amount: currentPlan.price, status: "Paid", invoice: "INV-002" },
              { date: "Oct 15, 2024", amount: currentPlan.price, status: "Paid", invoice: "INV-003" },
            ].map((payment, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b last:border-b-0">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">
                      ${payment.amount} - {payment.status}
                    </p>
                    <p className="text-sm text-gray-600">{payment.date}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{payment.invoice}</span>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Billing Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Billing Settings</CardTitle>
          <CardDescription>Manage your payment method and billing information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Payment Method</p>
              <p className="text-sm text-gray-600">•••• •••• •••• 4242</p>
            </div>
            <Button variant="outline">Update</Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Billing Email</p>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
            <Button variant="outline">Change</Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Cancel Subscription</p>
              <p className="text-sm text-gray-600">End your subscription at the next billing cycle</p>
            </div>
            <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
              Cancel Plan
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
