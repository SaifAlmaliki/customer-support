import { type NextRequest, NextResponse } from "next/server"
import { getStripeClient } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()

    // Verify user authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's company and subscription info
    const { data: userProfile } = await supabase
      .from("user_profiles")
      .select("company_id")
      .eq("user_id", user.id)
      .single()

    if (!userProfile) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 })
    }

    const { data: company } = await supabase
      .from("companies")
      .select("stripe_subscription_id")
      .eq("id", userProfile.company_id)
      .single()

    if (!company?.stripe_subscription_id) {
      return NextResponse.json({ error: "No active subscription found" }, { status: 404 })
    }

    const stripe = getStripeClient()

    // Cancel the subscription at period end
    await stripe.subscriptions.update(company.stripe_subscription_id, {
      cancel_at_period_end: true,
    })

    // Update company status
    await supabase
      .from("companies")
      .update({
        subscription_status: "canceling",
        updated_at: new Date().toISOString(),
      })
      .eq("id", userProfile.company_id)

    return NextResponse.json({
      success: true,
      message: "Subscription will be canceled at the end of the billing period",
    })
  } catch (error) {
    console.error("Error canceling subscription:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
