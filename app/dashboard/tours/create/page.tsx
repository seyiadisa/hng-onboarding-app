"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToursStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import type { CreateStep } from "@/lib/types"

export default function CreateTourPage() {
  const router = useRouter()
  const { addTour } = useToursStore()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  // Start with exactly 5 steps – perfect typing
  const [steps, setSteps] = useState<CreateStep[]>(
    Array.from({ length: 5 }, (_, i) => ({
      title: "",
      description: "",
      targetSelector: "",
      position: "bottom" as const,
      order: i + 1,
    }))
  )

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!title.trim()) newErrors.title = "Tour title is required"
    if (steps.length < 5) newErrors.steps = "Minimum 5 steps required"

    steps.forEach((step, idx) => {
      if (!step.title.trim()) newErrors[`step-${idx}-title`] = "Title required"
      if (!step.targetSelector.trim())
        newErrors[`step-${idx}-selector`] = "Selector required"
    })

    return newErrors
  }

  const handleAddStep = () => {
    if (steps.length >= 10) return
    setSteps((prev) => [
      ...prev,
      {
        title: "",
        description: "",
        targetSelector: "",
        position: "bottom",
        order: prev.length + 1,
      },
    ])
  }

  const handleUpdateStep = (
    idx: number,
    field: keyof CreateStep,
    value: string
  ) => {
    setSteps((prev) =>
      prev.map((step, i) => (i === idx ? { ...step, [field]: value } : step))
    )
  }

  const handleRemoveStep = (idx: number) => {
    if (steps.length <= 5) {
      toast.error("You must keep at least 5 steps")
      return
    }
    setSteps(steps.filter((_, i) => i !== idx))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      await addTour({
        title,
        description,
        status: "draft",
        steps: steps.map((step) => ({
          title: step.title,
          description: step.description,
          targetSelector: step.targetSelector,
          position: step.position,
          order: step.order,
        })),
      })

      toast.success("Tour created successfully!")
      router.push("/dashboard")
    } catch (err) {
      toast.error("Failed to create tour")
    }
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Create New Tour</h1>
        <p className="text-gray-600 mb-8">
          Set up your product tour with multiple steps
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-4">Tour Details</h2>
            <div className="space-y-4">
              <Input
                label="Tour Title"
                placeholder="e.g., Product Tour"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                error={errors.title}
              />
              <Input
                label="Description"
                placeholder="Describe what this tour covers"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </Card>

          {errors.steps && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
              {errors.steps}
            </div>
          )}

          <Card className="p-6">
            <h2 className="text-lg font-bold mb-4">
              Tour Steps (Minimum 5 — {steps.length} added)
            </h2>
            <div className="space-y-4">
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  className="border border-border rounded-lg p-4 space-y-3 bg-gray-50/50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Step {idx + 1}</h3>
                    {steps.length > 5 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveStep(idx)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <Input
                    label="Title"
                    placeholder="Step title"
                    value={step.title}
                    onChange={(e) => handleUpdateStep(idx, "title", e.target.value)}
                    error={errors[`step-${idx}-title`]}
                  />
                  <Input
                    label="Description"
                    placeholder="Step description"
                    value={step.description}
                    onChange={(e) => handleUpdateStep(idx, "description", e.target.value)}
                  />
                  <Input
                    label="Target Selector"
                    placeholder="#navbar, .btn-primary"
                    value={step.targetSelector}
                    onChange={(e) => handleUpdateStep(idx, "targetSelector", e.target.value)}
                    error={errors[`step-${idx}-selector`]}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-2">Position</label>
                      <select
                        value={step.position}
                        onChange={(e) => handleUpdateStep(idx, "position", e.target.value)}
                        className="input-base"
                      >
                        <option value="top">Top</option>
                        <option value="right">Right</option>
                        <option value="bottom">Bottom</option>
                        <option value="left">Left</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Order</label>
                      <input
                        type="text"
                        value={step.order}
                        disabled
                        className="input-base bg-gray-100 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {steps.length < 10 && (
                <Button type="button" variant="secondary" onClick={handleAddStep} className="w-full">
                  + Add Step
                </Button>
              )}
            </div>
          </Card>

          <div className="flex gap-3">
            <Button type="submit" variant="primary" className="flex-1">
              Create Tour
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