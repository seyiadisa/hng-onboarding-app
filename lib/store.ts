import { create } from "zustand"
import type { Tour } from "./types"
import { mockTours } from "./mock-data"

interface ToursStore {
  tours: Tour[]
  addTour: (tour: Tour) => void
  updateTour: (tour: Tour) => void
  deleteTour: (id: string) => void
  getTourById: (id: string) => Tour | undefined
}

// Initialize with mock data
const initialTours = mockTours

export const useToursStore = create<ToursStore>((set, get) => ({
  tours: initialTours,

  addTour: (tour) =>
    set((state) => ({
      tours: [tour, ...state.tours],
    })),

  updateTour: (tour) =>
    set((state) => ({
      tours: state.tours.map((t) => (t.id === tour.id ? tour : t)),
    })),

  deleteTour: (id) =>
    set((state) => ({
      tours: state.tours.filter((t) => t.id !== id),
    })),

  getTourById: (id) => {
    return get().tours.find((tour) => tour.id === id)
  },
}))
