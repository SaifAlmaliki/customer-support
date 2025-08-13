import { createClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/actions"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user?.profile?.company_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const days = Number.parseInt(searchParams.get("days") || "30")

    const supabase = createClient()

    // Get conversation analytics
    const { data: conversationAnalytics } = await supabase.rpc("get_conversation_analytics", {
      company_uuid: user.profile.company_id,
      start_date: new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString(),
      end_date: new Date().toISOString(),
    })

    // Get system health
    const { data: systemHealth } = await supabase.rpc("get_system_health", {
      company_uuid: user.profile.company_id,
    })

    // Get recent activity
    const { data: recentConversations } = await supabase
      .from("conversations")
      .select("id, customer_id, status, created_at, duration_seconds")
      .eq("company_id", user.profile.company_id)
      .order("created_at", { ascending: false })
      .limit(10)

    return NextResponse.json({
      analytics: conversationAnalytics?.[0] || {},
      health: systemHealth?.[0] || {},
      recent_conversations: recentConversations || [],
    })
  } catch (error) {
    console.error("Analytics error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
