"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToursStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Modal } from "@/components/ui/modal"
import { format } from "date-fns"
import { toast } from "sonner"

export default function ToursPage() {
  const router = useRouter()
  const { tours, loading, fetchTours, deleteTour } = useToursStore()

  useEffect(() => {
    fetchTours()
  }, [])

  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; tourId?: string }>({ isOpen: false })
  const [embedModal, setEmbedModal] = useState<{ isOpen: boolean; code?: string }>({ isOpen: false })

  const handleDelete = (tourId: string) => {
    deleteTour(tourId)
    setDeleteModal({ isOpen: false })
  }

  const handleShowEmbed = (tourId: string) => {
    const embedCode = `<script src="https://tourwidget-onboarding.vercel.app/tour.js"></script>
<script>
  TourWidget.init({
    tourId: "${tourId}",
  });
</script>`
    setEmbedModal({ isOpen: true, code: embedCode })
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border bg-white p-4 md:p-6 sticky top-0 z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Tours</h1>
            <p className="text-sm md:text-base text-gray-600 mt-1">Manage your product tours and onboarding flows</p>
          </div>
          <Link href="/dashboard/tours/create" className="w-full sm:w-auto">
            <Button variant="primary" className="w-full sm:w-auto">Create Tour</Button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 md:p-6 pb-20 md:pb-6">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : tours.length === 0 ? (
          <Card className="flex items-center justify-center h-64">
            <div className="text-center p-4">
              <p className="text-gray-600 mb-4">No tours yet. Create your first one!</p>
              <Link href="/dashboard/tours/create">
                <Button>Create Tour</Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:gap-6">
            {tours.map((tour) => (
              <Card 
                key={tour.id} 
                className="overflow-hidden cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => router.push(`/dashboard/tours/${tour.id}`)}
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 md:p-6 gap-4">
                  <div className="flex-1 w-full">
                    <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
                      <h3 className="text-base md:text-lg font-bold truncate">{tour.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded whitespace-nowrap ${tour.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                        {tour.status}
                      </span>
                    </div>
                    <p className="text-gray-600 text-xs md:text-sm mb-3 line-clamp-2">{tour.description}</p>
                    <div className="flex flex-wrap gap-4 md:gap-6 text-xs md:text-sm text-gray-500">
                      <span>Created {format(new Date(tour.createdDate), "MMM d, yyyy")}</span>
                      <span>{tour.steps.length} steps</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation()
                        handleShowEmbed(tour.id)
                      }}
                      className="flex-1 md:flex-none hover:bg-black hover:text-white transition-colors"
                    >
                      Embed
                    </Button>
                    
                    <Link href={`/dashboard/tours/${tour.id}`} onClick={(e) => e.stopPropagation()} className="flex-1 md:flex-none">
                      <Button 
                        variant="secondary" 
                        size="sm"
                        className="w-full hover:bg-black hover:text-white transition-colors"
                      >
                        Edit
                      </Button>
                    </Link>
                    
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="flex-1 md:flex-none"
                      onClick={(e) => {
                        e.stopPropagation()
                        setDeleteModal({ isOpen: true, tourId: tour.id })
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <Modal isOpen={deleteModal.isOpen} onClose={() => setDeleteModal({ isOpen: false })} title="Delete Tour">
        <div className="p-1">
          <p className="text-gray-600 mb-6 text-sm md:text-base">Are you sure you want to delete this tour? This action cannot be undone.</p>
          <div className="flex gap-3 justify-end flex-col-reverse sm:flex-row">
            <Button variant="secondary" onClick={() => setDeleteModal({ isOpen: false })}>Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={() => deleteModal.tourId && handleDelete(deleteModal.tourId)}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={embedModal.isOpen} onClose={() => setEmbedModal({ isOpen: false })} title="Embed Code">
        <div className="p-1">
          <p className="text-sm text-gray-600 mb-4">Copy this code and paste it into your website:</p>
          <pre className="bg-gray-900 text-white p-4 rounded text-xs overflow-x-auto mb-4 whitespace-pre-wrap break-all">
            <code>{embedModal.code}</code>
          </pre>
          <Button
            variant="primary"
            className="w-full"
            onClick={() => {
              navigator.clipboard.writeText(embedModal.code || "")
              toast.success("Copied to clipboard")
              setEmbedModal({ isOpen: false })
            }}
          >
            Copy Code
          </Button>
        </div>
      </Modal>
    </div>
  )
}