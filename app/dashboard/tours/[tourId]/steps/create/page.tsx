"use client"

import type React from "react"
import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useToursStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export default function CreateStepPage() {
  const params = useParams()
  const router = useRouter()
  const { getTourById, updateTour } = useToursStore()
  const tour = getTourById(params.tourId as string)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [targetSelector, setTargetSelector] = useState("")
  const [position, setPosition] = useState("bottom")
  const [errors, setErrors] = useState<Record<string, string>>({})

  if (!tour) {
    return (
      <div className="p-6">
        <p className="text-gray-600">Tour not found</p>
      </div>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    if (!title.trim()) newErrors.title = "Title is required"
    if (!targetSelector.trim()) newErrors.selector = "Selector is required"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const newStep = {
      id: `step_${Date.now()}`,
      tourId: tour.id,
      title,
      description,
      targetSelector,
      position: position as "top" | "right" | "bottom" | "left",
      order: tour.steps.length + 1,
    }

    const updatedTour = {
      ...tour,
      steps: [...tour.steps, newStep],
    }

    updateTour(updatedTour)
    router.push(`/dashboard/tours/${tour.id}`)
  }

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => router.back()} className="text-accent hover:underline text-sm mb-4">
          ← Back
        </button>
        <h1 className="text-3xl font-bold mb-2">Add Step</h1>
        <p className="text-gray-600 mb-8">Add a new step to your tour</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-6">
            <div className="space-y-4">
              <Input
                label="Step Title"
                placeholder="e.g., Welcome to our app"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                error={errors.title}
              />
              <Input
                label="Description"
                placeholder="Describe this step"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Input
                label="Target Element Selector"
                placeholder="e.g., #navbar, .btn-primary, [data-tour='step1']"
                value={targetSelector}
                onChange={(e) => setTargetSelector(e.target.value)}
                error={errors.selector}
              />
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Position</label>
                <select value={position} onChange={(e) => setPosition(e.target.value)} className="input-base">
                  <option value="top">Top</option>
                  <option value="right">Right</option>
                  <option value="bottom">Bottom</option>
                  <option value="left">Left</option>
                </select>
              </div>
            </div>
          </Card>

          <div className="flex gap-3">
            <Button type="submit" variant="primary" className="flex-1">
              Add Step
            </Button>
            <Button type="button" variant="secondary" className="flex-1" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
