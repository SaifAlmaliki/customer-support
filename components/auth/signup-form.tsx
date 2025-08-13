"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle } from "lucide-react"
import { signUp } from "@/lib/actions"
import { PRICING_PLANS } from "@/lib/stripe"

function SubmitButton({ selectedPlan }: { selectedPlan: string }) {
  const { pending } = useFormStatus()
  const plan = PRICING_PLANS[selectedPlan as keyof typeof PRICING_PLANS]

  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Creating account...
        </>
      ) : (
        `Start ${plan?.name || "Free"} Trial`
      )}
    </Button>
  )
}

interface SignUpFormProps {
  selectedPlan?: string
}

export default function SignUpForm({ selectedPlan = "starter" }: SignUpFormProps) {
  const [state, formAction] = useActionState(signUp, null)
  const plan = PRICING_PLANS[selectedPlan as keyof typeof PRICING_PLANS]

  return (
    <div className="space-y-6">
      {plan && selectedPlan !== "starter" && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{plan.name} Plan</CardTitle>
              <Badge className="bg-blue-600 text-white">${plan.price}/month</Badge>
            </div>
            <CardDescription>14-day free trial, then ${plan.price}/month</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="space-y-1 text-sm">
              {plan.features.slice(0, 3).map((feature, index) => (
                <li key={index} className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <form action={formAction} className="space-y-4">
        {state?.error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{state.error}</div>
        )}

        {state?.success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">{state.success}</div>
        )}

        <input type="hidden" name="plan" value={selectedPlan} />

        <div className="space-y-2">
          <Label htmlFor="company">Company Name</Label>
          <Input id="company" name="company" type="text" placeholder="Your Company" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="admin@company.com" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" placeholder="••••••••" required />
        </div>
        <SubmitButton selectedPlan={selectedPlan} />

        <p className="text-xs text-gray-600 text-center">
          By signing up, you agree to our Terms of Service and Privacy Policy.
          {selectedPlan !== "starter" && " You can cancel anytime during your free trial."}
        </p>
      </form>
    </div>
  )
}
