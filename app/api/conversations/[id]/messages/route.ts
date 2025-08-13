import { createClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/actions"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user?.profile?.company_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createClient()

    // First verify the conversation belongs to the user's company
    const { data: conversation } = await supabase
      .from("conversations")
      .select("id")
      .eq("id", params.id)
      .eq("company_id", user.profile.company_id)
      .single()

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
    }

    const { data, error } = await supabase
      .from("conversation_messages")
      .select("*")
      .eq("conversation_id", params.id)
      .order("created_at", { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
