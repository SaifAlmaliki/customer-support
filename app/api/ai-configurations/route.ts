import { createClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/actions"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user?.profile?.company_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createClient()
    const { data, error } = await supabase
      .from("ai_configurations")
      .select("*")
      .eq("company_id", user.profile.company_id)
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user?.profile?.company_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      model_provider,
      model_name,
      model_parameters,
      voice_provider,
      voice_id,
      voice_settings,
      system_prompt,
      response_style,
      escalation_rules,
      webhook_url,
      webhook_settings,
    } = body

    const supabase = createClient()
    const { data, error } = await supabase
      .from("ai_configurations")
      .insert([
        {
          company_id: user.profile.company_id,
          name: name || "New Configuration",
          model_provider,
          model_name,
          model_parameters,
          voice_provider,
          voice_id,
          voice_settings,
          system_prompt,
          response_style,
          escalation_rules,
          webhook_url,
          webhook_settings,
          created_by: user.id,
        },
      ])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
