import { isSupabaseConfigured } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminDashboard } from "@/components/admin-dashboard"
import LoginForm from "@/components/auth/login-form"
import SignUpForm from "@/components/auth/signup-form"
import { getCurrentUser } from "@/lib/actions"

interface AdminPageProps {
  searchParams: {
    plan?: string
  }
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  // If Supabase is not configured, show setup message
  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <h1 className="text-2xl font-bold mb-4">Connect Supabase to get started</h1>
      </div>
    )
  }

  // Get the current user
  const user = await getCurrentUser()

  // If user is authenticated, show the dashboard
  if (user) {
    return <AdminDashboard user={user} />
  }

  const selectedPlan = searchParams.plan || "professional"

  // Show login/signup form
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">AI Support Admin</CardTitle>
          <CardDescription>
            {selectedPlan && selectedPlan !== "starter"
              ? `Get started with the ${selectedPlan} plan`
              : "Manage your AI voice assistant and knowledge base"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signup" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <LoginForm />
            </TabsContent>

            <TabsContent value="signup">
              <SignUpForm selectedPlan={selectedPlan} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
