"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useToursStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function EditStepPage() {
  const params = useParams()
  const router = useRouter()
  // Import deleteStep
  const { getTourById, updateStep, deleteStep } = useToursStore()
  
  const tourId = params.tourId as string
  const stepId = params.stepId as string
  
  const tour = getTourById(tourId)
  const step = tour?.steps.find((s) => s.id === stepId)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [targetSelector, setTargetSelector] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (step) {
      setTitle(step.title ?? "")
      setDescription(step.description ?? "")
      setTargetSelector(step.targetSelector ?? "")
    }
  }, [step])

  if (!tour || !step) {
    return (
      <div className="p-6">
        <p className="text-gray-600">Step not found</p>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    if (!title?.trim()) newErrors.title = "Title is required"

    if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors)
        return
      }

    await updateStep(tourId, stepId, {
        title,
        description,
        targetSelector
    })

    router.push(`/dashboard/tours/${tour.id}`)
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await deleteStep(tourId, stepId)
      router.push(`/dashboard/tours/${tour.id}`)
    } catch (error) {
      console.error(error)
      setIsDeleting(false)
    }
  }

  return (
    <div className="p-4 md:p-6 pb-20 md:pb-6">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => router.back()} className="text-accent hover:underline text-sm mb-4">
          ← Back
        </button>
        <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl md:text-3xl font-bold">Edit Step</h1>
            
            {/* DELETE BUTTON with Confirmation */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" type="button">
                  Delete Step
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this step?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This step will be permanently removed from your tour.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive text-white hover:bg-destructive/90">
                    {isDeleting ? "Deleting..." : "Yes, Delete Step"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
        </div>
        
        <p className="text-gray-600 mb-8">Update step details</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-6">
            <div className="space-y-4">
              <Input label="Step Title" value={title} onChange={(e) => setTitle(e.target.value)} error={errors.title} />
              <Input label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
              <Input
                label="Target Element Selector (Optional)"
                placeholder="e.g., #navbar, .btn-primary"
                value={targetSelector}
                onChange={(e) => setTargetSelector(e.target.value)}
              />
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