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
  // New action specifically for steps
  updateStep: (tourId: string, stepId: string, stepData: { title: string; description: string; targetSelector: string }) => Promise<void>
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

      const { data, error } = await supabase
        .from("tours")
        .select("*, steps(*)")
        .eq("user_id", session.user.id)
        .order("created_date", { ascending: false })

      if (error) throw error

      const tours = (data || []).map((tour: any) => ({
        ...tour,
        createdDate: tour.created_date,
        steps: (tour.steps || [])
          .sort((a: any, b: any) => (a.created_at > b.created_at ? 1 : -1)) 
          .map((step: any) => ({
            id: step.id,
            tourId: step.tour_id,
            title: step.title,
            description: step.description,
            targetSelector: step.target_selector || "", 
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

      if (tourData.steps && tourData.steps.length > 0) {
        const stepsToInsert = tourData.steps.map((step) => ({
          tour_id: newTour.id,
          title: step.title || "Untitled Step",
          description: step.description || "",
          target_selector: step.targetSelector || "", 
        }))

        const { error: stepsError } = await supabase.from("steps").insert(stepsToInsert)
        if (stepsError) throw stepsError
      }
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
      // Update Tour Details Only
      const { error: tourError } = await supabase
        .from("tours")
        .update({
          title: updatedTour.title,
          description: updatedTour.description,
          status: updatedTour.status,
        })
        .eq("id", updatedTour.id)

      if (tourError) throw tourError
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

  // --- NEW FUNCTION: Fixes the duplication bug ---
  updateStep: async (tourId, stepId, stepData) => {
    // 1. Optimistic Update (Update UI immediately)
    set((state) => ({
      tours: state.tours.map((t) => 
        t.id === tourId 
          ? {
              ...t,
              steps: t.steps.map(s => s.id === stepId ? { ...s, ...stepData } : s)
            }
          : t
      )
    }))

    const updatePromise = async () => {
      // 2. Database Update
      const { error } = await supabase
        .from("steps")
        .update({
          title: stepData.title,
          description: stepData.description,
          target_selector: stepData.targetSelector || "" // Handle empty
        })
        .eq("id", stepId)

      if (error) {
        // Revert on error would go here, but for now we just throw
        await get().fetchTours() // Re-fetch to sync
        throw error
      }
    }

    try {
      await toast.promise(updatePromise(), {
        loading: "Updating step...",
        success: "Step updated successfully!",
        error: "Failed to update step"
      })
    } catch (e) {
        console.error(e)
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