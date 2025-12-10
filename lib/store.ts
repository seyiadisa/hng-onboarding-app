// lib/store.ts
import { create } from "zustand"
import { supabase } from "./supabase"
import { toast } from "sonner" // Ensure this is imported
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

      const { data, error } = await supabase
        .from("tours")
        .select("*, steps(*)")
        .eq("user_id", session.user.id)
        .order("created_date", { ascending: false })

      if (error) throw error

      // Mapping logic included (from previous fix)
      const tours = (data || []).map((tour: any) => ({
        ...tour,
        createdDate: tour.created_date,
        steps: (tour.steps || [])
          .sort((a: any, b: any) => a.step_order - b.step_order)
          .map((step: any) => ({
            id: step.id,
            tourId: step.tour_id,
            title: step.title,
            description: step.description,
            targetSelector: step.target_selector, 
            position: step.position,
            order: step.step_order,
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
    // We don't necessarily need set({loading: true}) here because toast handles the UI state,
    // but we keep it if you have disabled buttons in your UI relying on it.
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
      const stepsToInsert = tourData.steps.map((step) => ({
        tour_id: newTour.id,
        title: step.title,
        description: step.description,
        target_selector: step.targetSelector,
      }))

      const { error: stepsError } = await supabase.from("steps").insert(stepsToInsert)
      if (stepsError) throw stepsError

      // 3. Update Local State
      const fullTour: Tour = {
        ...newTour,
        createdDate: newTour.created_date || new Date().toISOString(),
        steps: tourData.steps.map((s, i) => ({
          id: `temp-${Date.now()}-${i}`,
          tourId: newTour.id,
          title: s.title,
          description: s.description,
          targetSelector: s.targetSelector,
        })),
      }

      set((state) => ({
        tours: [fullTour, ...state.tours],
      }))
    }

    // Wrap the promise with Toast
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

      // 2. Delete old steps
      await supabase.from("steps").delete().eq("tour_id", updatedTour.id)

      // 3. Insert new steps (using mapped data)
      const stepsToInsert = updatedTour.steps.map((step, i) => ({
        tour_id: updatedTour.id,
        title: step.title,
        description: step.description,
        target_selector: step.targetSelector, 
      }))

      const { error: stepsError } = await supabase.from("steps").insert(stepsToInsert)
      if (stepsError) throw stepsError

      // 4. Update Local State
      set((state) => ({
        tours: state.tours.map((t) => (t.id === updatedTour.id ? updatedTour : t)),
      }))
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
    // Optimistically update UI first for instant feel on delete
    const previousTours = get().tours
    set((state) => ({
      tours: state.tours.filter((t) => t.id !== id),
      loading: true // keep loading true during background request
    }))

    const deletePromise = async () => {
      const { error } = await supabase.from("tours").delete().eq("id", id)
      if (error) {
        // Revert on failure
        set({ tours: previousTours })
        throw error
      }
    }

    try {
      await toast.promise(deletePromise(), {
        loading: "Deleting tour...",
        success: "Tour deleted",
        error: (err) => {
          return `Failed to delete: ${err.message}`
        }
      })
    } finally {
      set({ loading: false })
    }
  },

  getTourById: (id) => get().tours.find((t) => t.id === id),
}))