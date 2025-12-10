export type CreateStep = Omit<Step, "id" | "tourId">

export interface Tour {
  id: string
  title: string
  description: string
  createdDate: string
  steps: Step[]
  status: "active" | "draft"
}

export type CreateTour = Omit<Tour, "id" | "createdDate"> & {
  steps: CreateStep[]
}

export interface Step {
  id: string
  tourId: string
  title: string
  description: string
  targetSelector: string
  position: "top" | "right" | "bottom" | "left"
  order: number
}

export interface AnalyticsEvent {
  id: string
  tourId: string
  eventType: "started" | "completed" | "skipped" | "resumed"
  timestamp: string
  userId?: string
}

export interface AnalyticsData {
  tourId: string
  completionRate: number
  usersReached: number
  timesResumed: number
  skippedRate: number
  stepsCompletion: Array<{ stepId: string; completionRate: number }>
}

export interface User {
  id: string
  email: string
  name: string
  createdAt: string
}
