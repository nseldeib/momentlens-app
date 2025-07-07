import { supabase } from "@/lib/supabase/client"
import { DEMO_CREDENTIALS, DEMO_MOMENTS } from "./demo-data"

export async function createDemoAccount() {
  try {
    // First, try to sign up the demo user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: DEMO_CREDENTIALS.email,
      password: DEMO_CREDENTIALS.password,
    })

    // If user already exists, that's fine - we'll just sign them in
    if (signUpError && !signUpError.message.includes("already registered")) {
      throw signUpError
    }

    // Sign in to get the user ID
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: DEMO_CREDENTIALS.email,
      password: DEMO_CREDENTIALS.password,
    })

    if (signInError) throw signInError

    const userId = signInData.user?.id
    if (!userId) throw new Error("No user ID found")

    // Check if demo data already exists
    const { data: existingMoments } = await supabase.from("moments").select("id").eq("user_id", userId).limit(1)

    // Only create demo data if it doesn't exist
    if (!existingMoments || existingMoments.length === 0) {
      // Create demo moments
      const momentsToInsert = DEMO_MOMENTS.map((moment) => ({
        ...moment,
        user_id: userId,
      }))

      const { error: momentsError } = await supabase.from("moments").insert(momentsToInsert)

      if (momentsError) {
        console.error("Error creating demo moments:", momentsError)
      }

      // Create profile if it doesn't exist
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: userId,
        email: DEMO_CREDENTIALS.email,
        full_name: "Demo User",
      })

      if (profileError) {
        console.error("Error creating demo profile:", profileError)
      }
    }

    return { success: true, user: signInData.user }
  } catch (error) {
    console.error("Error setting up demo account:", error)
    return { success: false, error }
  }
}

export async function signInWithDemo() {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: DEMO_CREDENTIALS.email,
      password: DEMO_CREDENTIALS.password,
    })

    if (error) {
      // If demo account doesn't exist, create it
      if (error.message.includes("Invalid login credentials")) {
        return await createDemoAccount()
      }
      throw error
    }

    return { success: true, user: data.user }
  } catch (error) {
    console.error("Error signing in with demo:", error)
    return { success: false, error }
  }
}
