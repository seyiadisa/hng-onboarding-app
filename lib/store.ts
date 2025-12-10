// lib/store.ts
import { create } from "zustand"
import { supabase } from "./supabase"
import { toast } from "sonner" 
import type { Tour } from "./types"

type CreateTourInput = {
  title: string
  description: string
  status: "draft" | "active"
  steps: Array<{
    title: string
    description: string
    targetSelector: string
  }>
}

interface ToursStore {
  tours: Tour[]
  loading: boolean
  error: string | null
  fetchTours: () => Promise<void>
  addTour: (tour: CreateTourInput) => Promise<void>
  updateTour: (tour: Tour) => Promise<void>
  deleteTour: (id: string) => Promise<void>
  getTourById: (id: string) => Tour | undefined
}

export const useToursStore = create<ToursStore>((set, get) => ({
  tours: [],
  loading: false,
  error: null,

  fetchTours: async () => {
    set({ loading: true, error: null })
    try {
      const { data: { session }, error: authError } = await supabase.auth.getSession()
      if (authError) throw authError
      if (!session?.user) {
        set({ loading: false })
        return
      }

      // 1. Select tours and steps
      // Note: Since 'order' column is deleted, we rely on default DB sort or ID
      const { data, error } = await supabase
        .from("tours")
        .select("*, steps(*)")
        .eq("user_id", session.user.id)
        .order("created_date", { ascending: false })

      if (error) throw error

      // 2. Map response to App Types
      const tours = (data || []).map((tour: any) => ({
        ...tour,
        createdDate: tour.created_date,
        // Remove .sort by step_order since it doesn't exist
        steps: (tour.steps || [])
          // Optional: Sort by ID or created_at if available to keep them stable
          .sort((a: any, b: any) => (a.created_at > b.created_at ? 1 : -1)) 
          .map((step: any) => ({
            id: step.id,
            tourId: step.tour_id,
            title: step.title,
            description: step.description,
            // Map DB snake_case to App camelCase
            targetSelector: step.target_selector || "", 
            // Removed position and order properties entirely
          })),
      }))

      set({ tours: tours as Tour[], loading: false })
    } catch (err: any) {
      console.error("Fetch tours error:", err)
      toast.error("Failed to load tours")
      set({ loading: false })
    }
  },

  addTour: async (tourData) => {
    set({ loading: true })

    const createPromise = async () => {
      const { data: { session }, error: authError } = await supabase.auth.getSession()
      if (authError) throw authError
      if (!session?.user) throw new Error("Not authenticated")

      // 1. Create Tour
      const { data: newTour, error: tourError } = await supabase
        .from("tours")
        .insert({
          user_id: session.user.id,
          title: tourData.title,
          description: tourData.description,
          status: tourData.status,
        })
        .select()
        .single()

      if (tourError) throw tourError

      // 2. Create Steps
      // IMPORTANT: Ensure no 'undefined' values are sent
      if (tourData.steps && tourData.steps.length > 0) {
        const stepsToInsert = tourData.steps.map((step) => ({
          tour_id: newTour.id,
          title: step.title || "Untitled Step", // Fallback if empty
          description: step.description || "",
          target_selector: step.targetSelector || "body", // Ensure not null if DB requires it
        }))

        const { error: stepsError } = await supabase.from("steps").insert(stepsToInsert)
        
        if (stepsError) {
            // If steps fail, we might want to clean up the empty tour
            // await supabase.from("tours").delete().eq("id", newTour.id) 
            throw stepsError
        }
      }

      // 3. Update Local State (Optimistic or Refresh)
      // It's safer to just fetch fresh data to ensure IDs are correct
      await get().fetchTours()
    }

    try {
      await toast.promise(createPromise(), {
        loading: "Creating your tour...",
        success: "Tour created successfully!",
        error: (err) => `Failed: ${err.message}`,
      })
    } finally {
      set({ loading: false })
    }
  },

  updateTour: async (updatedTour) => {
    set({ loading: true })

    const updatePromise = async () => {
      const { data: { session }, error: authError } = await supabase.auth.getSession()
      if (authError) throw authError
      if (!session?.user) throw new Error("Not authenticated")

      // 1. Update Tour Details
      const { error: tourError } = await supabase
        .from("tours")
        .update({
          title: updatedTour.title,
          description: updatedTour.description,
          status: updatedTour.status,
        })
        .eq("id", updatedTour.id)

      if (tourError) throw tourError

      // 2. Delete old steps (Simple strategy: delete all, re-insert)
      await supabase.from("steps").delete().eq("tour_id", updatedTour.id)

      // 3. Insert new steps
      if (updatedTour.steps && updatedTour.steps.length > 0) {
        const stepsToInsert = updatedTour.steps.map((step) => ({
          tour_id: updatedTour.id,
          title: step.title,
          description: step.description,
          target_selector: step.targetSelector,
        }))

        const { error: stepsError } = await supabase.from("steps").insert(stepsToInsert)
        if (stepsError) throw stepsError
      }

      // 4. Update Local State
      await get().fetchTours()
    }

    try {
      await toast.promise(updatePromise(), {
        loading: "Saving changes...",
        success: "Tour updated successfully!",
        error: (err) => `Failed: ${err.message}`,
      })
    } finally {
      set({ loading: false })
    }
  },

  deleteTour: async (id) => {
    const previousTours = get().tours
    set((state) => ({
      tours: state.tours.filter((t) => t.id !== id),
      loading: true 
    }))

    const deletePromise = async () => {
      const { error } = await supabase.from("tours").delete().eq("id", id)
      if (error) {
        set({ tours: previousTours })
        throw error
      }
    }

    try {
      await toast.promise(deletePromise(), {
        loading: "Deleting tour...",
        success: "Tour deleted",
        error: (err) => `Failed: ${err.message}`,
      })
    } finally {
      set({ loading: false })
    }
  },

  getTourById: (id) => get().tours.find((t) => t.id === id),
}))