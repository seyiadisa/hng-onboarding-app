"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useToursStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Modal } from "@/components/ui/modal"
import { ArrowLeft, Trash2 } from "lucide-react" // Import Trash2 icon
import { toast } from "sonner"
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

export default function TourDetailsPage() {
  const params = useParams()
  const router = useRouter()
  // Import deleteStep
  const { getTourById, deleteStep } = useToursStore()
  const tour = getTourById(params.tourId as string)
  const [embedModal, setEmbedModal] = useState(false)
  const [stepToDelete, setStepToDelete] = useState<string | null>(null)

  if (!tour) {
    return (
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-foreground mb-4">
           <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        <p className="text-gray-600">Tour not found</p>
      </div>
    )
  }

  const handleDeleteStep = async () => {
    if (stepToDelete) {
        await deleteStep(tour.id, stepToDelete)
        setStepToDelete(null)
    }
  }

  const embedCode = `<script src="https://tourwidget-onboarding.vercel.app/tour.js"></script>
<script>
  TourWidget.init({
    tourId: "${tour.id}",
  });
</script>`

  return (
    <div className="p-4 md:p-6 pb-20 md:pb-6">
      <div className="max-w-4xl mx-auto">
        {/* ... (Header code remains same) ... */}
        
        {/* Navigation */}
        <div className="mb-4 md:mb-6">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold break-words">{tour.title}</h1>
            <p className="text-sm md:text-base text-gray-600">{tour.description}</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button 
                variant="secondary" 
                onClick={() => setEmbedModal(true)}
                className="flex-1 md:flex-none hover:bg-black hover:text-white transition-colors"
            >
              Show Embed Code
            </Button>
            <Link href={`/dashboard/tours/${tour.id}/steps/create`} className="flex-1 md:flex-none">
              <Button variant="primary" className="w-full">Add Step</Button>
            </Link>
          </div>
        </div>

        {/* Steps List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Steps ({tour.steps.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tour.steps.map((step) => (
                <div
                  key={step.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-border rounded-lg hover:bg-gray-50 transition-colors gap-3"
                >
                  <div className="flex-1 min-w-0 w-full">
                    <h3 className="font-semibold truncate">{step.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{step.description}</p>
                    <div className="flex gap-4 mt-2 text-xs text-gray-500 overflow-x-auto">
                      <span className="bg-gray-100 px-2 py-0.5 rounded whitespace-nowrap">Selector: {step.targetSelector || "N/A"}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                    <Link href={`/dashboard/tours/${tour.id}/steps/${step.id}/edit`} className="flex-1 sm:flex-none">
                      <Button 
                        variant="secondary" 
                        size="sm"
                        className="w-full hover:bg-black hover:text-white transition-colors"
                      >
                        Edit
                      </Button>
                    </Link>

                    {/* Delete Trigger */}
                    <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => setStepToDelete(step.id)}
                    >
                        <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Embed Modal ... */}
      <Modal isOpen={embedModal} onClose={() => setEmbedModal(false)} title="Embed Code">
         {/* ... (Existing modal content) ... */}
         <p className="text-sm text-gray-600 mb-4">Copy this code and paste it into your website:</p>
          <pre className="bg-gray-900 text-white p-4 rounded text-xs overflow-x-auto mb-4 whitespace-pre-wrap break-all">
            <code>{embedCode}</code>
          </pre>
          <Button
            variant="primary"
            className="w-full"
            onClick={() => {
              navigator.clipboard.writeText(embedCode)
              toast.success("Copied to clipboard")
              setEmbedModal(false)
            }}
          >
            Copy Code
          </Button>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!stepToDelete} onOpenChange={(open) => !open && setStepToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this step?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this step? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
                onClick={handleDeleteStep}
                className="bg-destructive text-white hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}