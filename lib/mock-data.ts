import type { Tour, User, AnalyticsEvent } from "./types"

export const mockUser: User = {
  id: "1",
  email: "demo@tourwidget.com",
  name: "Demo User",
  createdAt: new Date().toISOString(),
}

export const mockTours: Tour[] = [
  {
    id: "tour-1",
    title: "Product Tour",
    description: "Guide users through your product features",
    createdDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active",
    steps: [
      {
        id: "step-1",
        tourId: "tour-1",
        title: "Welcome",
        description: "Welcome to our product tour",
        targetSelector: "#hero",
        position: "bottom",
        order: 1,
      },
      {
        id: "step-2",
        tourId: "tour-1",
        title: "Features",
        description: "Explore our amazing features",
        targetSelector: "#features",
        position: "top",
        order: 2,
      },
      {
        id: "step-3",
        tourId: "tour-1",
        title: "Getting Started",
        description: "Start using our platform in minutes",
        targetSelector: "#getting-started",
        position: "right",
        order: 3,
      },
    ],
  },
  {
    id: "tour-2",
    title: "Onboarding Flow",
    description: "New user onboarding experience",
    createdDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active",
    steps: [
      {
        id: "step-4",
        tourId: "tour-2",
        title: "Create Account",
        description: "Create your first account",
        targetSelector: "#signup",
        position: "bottom",
        order: 1,
      },
      {
        id: "step-5",
        tourId: "tour-2",
        title: "Setup Profile",
        description: "Complete your profile information",
        targetSelector: "#profile",
        position: "left",
        order: 2,
      },
    ],
  },
  {
    id: "tour-3",
    title: "Advanced Features",
    description: "Unlock advanced features",
    createdDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: "draft",
    steps: [
      {
        id: "step-6",
        tourId: "tour-3",
        title: "Analytics",
        description: "Track your performance",
        targetSelector: "#analytics",
        position: "top",
        order: 1,
      },
    ],
  },
]

export const mockAnalyticsEvents: AnalyticsEvent[] = [
  {
    id: "1",
    tourId: "tour-1",
    eventType: "started",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    tourId: "tour-1",
    eventType: "completed",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    tourId: "tour-2",
    eventType: "started",
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    tourId: "tour-1",
    eventType: "resumed",
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
]
