import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getSubscriptionInfo } from "@/lib/subscription-utils"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()

    // Verify user authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's company ID
    const { data: userProfile } = await supabase
      .from("user_profiles")
      .select("company_id")
      .eq("user_id", user.id)
      .single()

    if (!userProfile) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 })
    }

    // Get subscription information
    const subscriptionInfo = await getSubscriptionInfo(userProfile.company_id)

    if (!subscriptionInfo) {
      return NextResponse.json({ error: "Subscription information not found" }, { status: 404 })
    }

    return NextResponse.json(subscriptionInfo)
  } catch (error) {
    console.error("Error fetching subscription info:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
