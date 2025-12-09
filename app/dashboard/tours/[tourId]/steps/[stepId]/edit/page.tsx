"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useToursStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export default function EditStepPage() {
  const params = useParams()
  const router = useRouter()
  const { getTourById, updateTour } = useToursStore()
  const tour = getTourById(params.tourId as string)
  const step = tour?.steps.find((s) => s.id === params.stepId)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [targetSelector, setTargetSelector] = useState("")
  const [position, setPosition] = useState("bottom")
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (step) {
      setTitle(step.title ?? "")
      setDescription(step.description ?? "")
      setTargetSelector(step.targetSelector ?? "")
      setPosition(step.position ?? "bottom")
    }
  }, [step])

  if (!tour || !step) {
    return (
      <div className="p-6">
        <p className="text-gray-600">Step not found</p>
      </div>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    if (!title?.trim()) newErrors.title = "Title is required"
    if (!targetSelector?.trim()) newErrors.selector = "Selector is required"

    if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors)
        return
      }

    const updatedSteps = tour.steps.map((s) =>
      s.id === step.id ? { ...s, title, description, targetSelector, position: position as any } : s,
    )

    updateTour({ ...tour, steps: updatedSteps })
    router.push(`/dashboard/tours/${tour.id}`)
  }

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => router.back()} className="text-accent hover:underline text-sm mb-4">
          ← Back
        </button>
        <h1 className="text-3xl font-bold mb-2">Edit Step</h1>
        <p className="text-gray-600 mb-8">Update step details</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-6">
            <div className="space-y-4">
              <Input label="Step Title" value={title} onChange={(e) => setTitle(e.target.value)} error={errors.title} />
              <Input label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
              <Input
                label="Target Element Selector"
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
              Save Changes
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
