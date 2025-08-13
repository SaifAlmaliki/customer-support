import { createClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/actions"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user?.profile?.company_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { query, ai_config_id, test_type = "single" } = body

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    // Simulate AI response (in real implementation, this would call your AI service)
    const simulatedResponse = {
      response_text: `This is a simulated response to: "${query}"`,
      confidence_score: Math.random() * 0.3 + 0.7, // Random score between 0.7-1.0
      response_time_ms: Math.floor(Math.random() * 2000) + 500, // Random time 500-2500ms
      knowledge_sources: [
        {
          source_type: "documentation",
          source_id: "doc_123",
          relevance_score: Math.random() * 0.3 + 0.7,
        },
      ],
    }

    // Store test result
    const supabase = createClient()
    const { data, error } = await supabase
      .from("test_results")
      .insert([
        {
          company_id: user.profile.company_id,
          ai_config_id,
          test_type,
          results: {
            query,
            ...simulatedResponse,
          },
          overall_score: simulatedResponse.confidence_score,
          passed_tests: simulatedResponse.confidence_score > 0.8 ? 1 : 0,
          total_tests: 1,
          execution_time_ms: simulatedResponse.response_time_ms,
          created_by: user.id,
        },
      ])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      data: {
        ...data,
        simulation: simulatedResponse,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
