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
  // Actions for steps
  updateStep: (tourId: string, stepId: string, stepData: { title: string; description: string; targetSelector: string }) => Promise<void>
  deleteStep: (tourId: string, stepId: string) => Promise<void>
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
          // FIXED SORT: Use ID as a tie-breaker for stable ordering
          .sort((a: any, b: any) => {
            const timeA = new Date(a.created_at).getTime()
            const timeB = new Date(b.created_at).getTime()
            
            // 1. Sort by time first
            if (timeA !== timeB) return timeA - timeB
            
            // 2. If times are equal, sort by ID (stable fallback)
            return a.id.localeCompare(b.id)
          })
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
      const { data, error } = await supabase
        .from("steps")
        .update({
          title: stepData.title,
          description: stepData.description,
          target_selector: stepData.targetSelector || "" // Handle empty
        })
        .eq("id", stepId)
        .select() // Forces return to catch RLS errors

      if (error) throw error
      
      // If data is empty, it means RLS blocked it or ID wasn't found
      if (!data || data.length === 0) {
        throw new Error("Update failed: Step not found or permission denied")
      }
      
      // 3. Sync: Ensure backend matches frontend
      await get().fetchTours()
    }

    try {
      await toast.promise(updatePromise(), {
        loading: "Updating step...",
        success: "Step updated successfully!",
        error: "Failed to update step"
      })
    } catch (e) {
        console.error(e)
        await get().fetchTours() // Revert/Sync on error
    }
  },

  deleteStep: async (tourId, stepId) => {
    // 1. Optimistic Update: Remove step from local state immediately
    const previousTours = get().tours
    set((state) => ({
      tours: state.tours.map((t) =>
        t.id === tourId
          ? { ...t, steps: t.steps.filter((s) => s.id !== stepId) }
          : t
      ),
    }))

    const deletePromise = async () => {
      // 2. Database Delete
      const { error } = await supabase.from("steps").delete().eq("id", stepId)
      
      if (error) {
        // Revert local state if DB fails
        set({ tours: previousTours })
        throw error
      }
    }

    try {
      await toast.promise(deletePromise(), {
        loading: "Deleting step...",
        success: "Step deleted",
        error: (err) => `Failed to delete step: ${err.message}`,
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