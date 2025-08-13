"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, CreditCard } from "lucide-react"
import { getSubscriptionInfo, type SubscriptionInfo } from "@/lib/subscription-utils"
import { loadStripe } from "@stripe/stripe-js"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface UsageGuardProps {
  companyId: string
  usageType: "conversations" | "dataSources" | "users"
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function UsageGuard({ companyId, usageType, children, fallback }: UsageGuardProps) {
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSubscriptionInfo()
  }, [companyId])

  const loadSubscriptionInfo = async () => {
    try {
      const info = await getSubscriptionInfo(companyId)
      setSubscriptionInfo(info)
    } catch (error) {
      console.error("Error loading subscription info:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = async () => {
    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId: "professional",
          companyId,
        }),
      })

      const { sessionId } = await response.json()
      const stripe = await stripePromise

      if (stripe) {
        await stripe.redirectToCheckout({ sessionId })
      }
    } catch (error) {
      console.error("Error creating checkout session:", error)
    }
  }

  if (loading) {
    return <div className="animate-pulse h-32 bg-gray-200 rounded"></div>
  }

  if (!subscriptionInfo) {
    return <>{children}</>
  }

  const { currentUsage, limits, usagePercentage } = subscriptionInfo
  const limit = limits[usageType]
  const usage = currentUsage[usageType]
  const percentage = usagePercentage[usageType]

  // Allow unlimited usage
  if (limit === -1) {
    return <>{children}</>
  }

  // Check if at or over limit
  if (usage >= limit) {
    return (
      fallback || (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-orange-600 mr-2" />
              <CardTitle className="text-lg text-orange-900">Usage Limit Reached</CardTitle>
            </div>
            <CardDescription className="text-orange-700">
              You've reached your {usageType} limit for this month. Upgrade your plan to continue.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-orange-900">
                  {usageType.charAt(0).toUpperCase() + usageType.slice(1)}
                </span>
                <span className="text-sm text-orange-700">
                  {usage.toLocaleString()} / {limit.toLocaleString()}
                </span>
              </div>
              <Progress value={100} className="h-2" />
            </div>
            <Button onClick={handleUpgrade} className="w-full">
              <CreditCard className="h-4 w-4 mr-2" />
              Upgrade Plan
            </Button>
          </CardContent>
        </Card>
      )
    )
  }

  // Show warning if approaching limit (>80%)
  if (percentage > 80) {
    return (
      <div className="space-y-4">
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-yellow-900">
                {usageType.charAt(0).toUpperCase() + usageType.slice(1)} Usage
              </span>
              <span className="text-sm text-yellow-700">
                {usage.toLocaleString()} / {limit.toLocaleString()}
              </span>
            </div>
            <Progress value={percentage} className="h-2 mb-2" />
            <p className="text-xs text-yellow-700">
              You're approaching your monthly limit. Consider upgrading your plan.
            </p>
          </CardContent>
        </Card>
        {children}
      </div>
    )
  }

  return <>{children}</>
}
