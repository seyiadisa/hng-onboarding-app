// lib/store.ts (updated: removed mock data, integrated Supabase for CRUD)
import { create } from "zustand"
import type { Tour } from "./types"
import { supabase } from "./supabase"

interface ToursStore {
  tours: Tour[]
  loading: boolean
  error: string | null
  fetchTours: () => Promise<void>
  addTour: (tour: Omit<Tour, 'id' | 'createdDate'>) => Promise<void>
  updateTour: (tour: Tour) => Promise<void>
  deleteTour: (id: string) => Promise<void>
  getTourById: (id: string) => Tour | undefined
}

// Initialize with empty array
const initialTours: Tour[] = []

export const useToursStore = create<ToursStore>((set, get) => ({
  tours: initialTours,
  loading: false,
  error: null,

  fetchTours: async () => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('tours')
        .select('*')
        .order('createdDate', { ascending: false })

      if (error) throw error

      // Assuming steps are fetched separately or joined; for simplicity, fetch steps too
      const toursWithSteps = await Promise.all(
        (data || []).map(async (tour: any) => {
          const { data: stepsData } = await supabase
            .from('steps')
            .select('*')
            .eq('tourId', tour.id)
            .order('order')

          return {
            ...tour,
            steps: stepsData || [],
          }
        })
      )

      set({ tours: toursWithSteps as Tour[], loading: false })
    } catch (err) {
      set({ error: (err as Error).message, loading: false })
    }
  },

  addTour: async (tourData) => {
    set({ loading: true, error: null })
    try {
      const newTour = {
        ...tourData,
        createdDate: new Date().toISOString(),
        status: 'draft' as const,
      }

      const { data: tour, error: tourError } = await supabase
        .from('tours')
        .insert([newTour])
        .select()
        .single()

      if (tourError) throw tourError

      // Insert steps if provided
      if (tourData.steps && tourData.steps.length > 0) {
        const stepsWithTourId = tourData.steps.map((step: any) => ({ ...step, tourId: tour.id }))
        const { error: stepsError } = await supabase
          .from('steps')
          .insert(stepsWithTourId)

        if (stepsError) throw stepsError
      }

      set((state) => ({
        tours: [tour as Tour, ...state.tours],
        loading: false,
      }))
    } catch (err) {
      set({ error: (err as Error).message, loading: false })
    }
  },

  updateTour: async (tour) => {
    set({ loading: true, error: null })
    try {
      const { error: tourError } = await supabase
        .from('tours')
        .update(tour)
        .eq('id', tour.id)

      if (tourError) throw tourError

      // Update steps if changed
      const { error: stepsError } = await supabase
        .from('steps')
        .upsert(tour.steps)

      if (stepsError) throw stepsError

      set((state) => ({
        tours: state.tours.map((t) => (t.id === tour.id ? tour : t)),
        loading: false,
      }))
    } catch (err) {
      set({ error: (err as Error).message, loading: false })
    }
  },

  deleteTour: async (id) => {
    set({ loading: true, error: null })
    try {
      // Delete steps first
      await supabase.from('steps').delete().eq('tourId', id)

      const { error } = await supabase.from('tours').delete().eq('id', id)

      if (error) throw error

      set((state) => ({
        tours: state.tours.filter((t) => t.id !== id),
        loading: false,
      }))
    } catch (err) {
      set({ error: (err as Error).message, loading: false })
    }
  },

  getTourById: (id) => {
    return get().tours.find((tour) => tour.id === id)
  },
}))