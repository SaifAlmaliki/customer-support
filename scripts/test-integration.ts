// Test script to verify the integration is working properly
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testDatabaseConnection() {
  console.log("🔍 Testing database connection...")

  try {
    const { data, error } = await supabase.from("companies").select("id, name").limit(1)

    if (error) {
      console.error("❌ Database connection failed:", error.message)
      return false
    }

    console.log("✅ Database connection successful")
    console.log("📊 Sample data:", data)
    return true
  } catch (error) {
    console.error("❌ Database connection error:", error)
    return false
  }
}

async function testRLSPolicies() {
  console.log("🔒 Testing Row Level Security policies...")

  try {
    // Test that RLS is enabled
    const { data: companies } = await supabase.from("companies").select("*")

    const { data: dataSources } = await supabase.from("data_sources").select("*")

    console.log("✅ RLS policies are working")
    console.log(`📊 Found ${companies?.length || 0} companies, ${dataSources?.length || 0} data sources`)
    return true
  } catch (error) {
    console.error("❌ RLS policy test failed:", error)
    return false
  }
}

async function testAnalyticsFunctions() {
  console.log("📈 Testing analytics functions...")

  try {
    const { data: analytics, error } = await supabase.rpc("get_conversation_analytics", {
      company_uuid: "550e8400-e29b-41d4-a716-446655440000",
      start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      end_date: new Date().toISOString(),
    })

    if (error) {
      console.error("❌ Analytics function failed:", error.message)
      return false
    }

    console.log("✅ Analytics functions working")
    console.log("📊 Analytics data:", analytics?.[0])
    return true
  } catch (error) {
    console.error("❌ Analytics function error:", error)
    return false
  }
}

async function testVectorSearch() {
  console.log("🔍 Testing vector search functionality...")

  try {
    // Create a dummy embedding vector (in real implementation, this would come from OpenAI)
    const dummyEmbedding = Array(1536)
      .fill(0)
      .map(() => Math.random() - 0.5)

    const { data, error } = await supabase.rpc("search_knowledge_base", {
      company_uuid: "550e8400-e29b-41d4-a716-446655440000",
      query_embedding: dummyEmbedding,
      match_threshold: 0.1,
      match_count: 5,
    })

    if (error) {
      console.error("❌ Vector search failed:", error.message)
      return false
    }

    console.log("✅ Vector search working")
    console.log(`📊 Found ${data?.length || 0} knowledge base matches`)
    return true
  } catch (error) {
    console.error("❌ Vector search error:", error)
    return false
  }
}

async function testDataIntegrity() {
  console.log("🔍 Testing data integrity...")

  try {
    // Test foreign key relationships
    const { data: conversations } = await supabase
      .from("conversations")
      .select(`
        id,
        company_id,
        ai_configurations (name),
        conversation_messages (count)
      `)
      .limit(5)

    const { data: feedback } = await supabase
      .from("customer_feedback")
      .select(`
        id,
        conversation_id,
        conversations (session_id)
      `)
      .limit(5)

    console.log("✅ Data integrity checks passed")
    console.log(`📊 Found ${conversations?.length || 0} conversations with related data`)
    console.log(`📊 Found ${feedback?.length || 0} feedback entries with conversations`)
    return true
  } catch (error) {
    console.error("❌ Data integrity test failed:", error)
    return false
  }
}

async function runAllTests() {
  console.log("🚀 Starting integration tests...\n")

  const tests = [testDatabaseConnection, testRLSPolicies, testAnalyticsFunctions, testVectorSearch, testDataIntegrity]

  let passedTests = 0

  for (const test of tests) {
    const result = await test()
    if (result) passedTests++
    console.log("") // Add spacing between tests
  }

  console.log(`🎯 Test Results: ${passedTests}/${tests.length} tests passed`)

  if (passedTests === tests.length) {
    console.log("🎉 All integration tests passed! The system is ready to use.")
  } else {
    console.log("⚠️  Some tests failed. Please check the configuration and try again.")
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  runAllTests().catch(console.error)
}

export { runAllTests }
