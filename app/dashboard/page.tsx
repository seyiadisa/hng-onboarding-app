"use client"

import { useState } from "react"
import Link from "next/link"
import { useToursStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Modal } from "@/components/ui/modal"
import { format } from "date-fns"

export default function ToursPage() {
  const { tours, deleteTour } = useToursStore()
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; tourId?: string }>({ isOpen: false })
  const [embedModal, setEmbedModal] = useState<{ isOpen: boolean; code?: string }>({ isOpen: false })

  const handleDelete = (tourId: string) => {
    deleteTour(tourId)
    setDeleteModal({ isOpen: false })
  }

  const handleShowEmbed = (tourId: string) => {
    const embedCode = `<script src="https://tourwidget.com/widget.js"></script>
<script>
  initTour({
    tourId: "${tourId}",
  });
</script>`
    setEmbedModal({ isOpen: true, code: embedCode })
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Tours</h1>
            <p className="text-gray-600 mt-1">Manage your product tours and onboarding flows</p>
          </div>
          <Link href="/dashboard/tours/create">
            <Button variant="primary">Create Tour</Button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {tours.length === 0 ? (
          <Card className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-gray-600 mb-4">No tours yet. Create your first one!</p>
              <Link href="/dashboard/tours/create">
                <Button>Create Tour</Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {tours.map((tour) => (
              <Card key={tour.id} hoverable className="overflow-hidden">
                <div className="flex items-center justify-between p-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold">{tour.title}</h3>
                      <span
                        className={`text-xs px-2 py-1 rounded ${tour.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}
                      >
                        {tour.status}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{tour.description}</p>
                    <div className="flex gap-6 text-sm text-gray-500">
                      <span>Created {format(new Date(tour.createdDate), "MMM d, yyyy")}</span>
                      <span>{tour.steps.length} steps</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleShowEmbed(tour.id)}>
                      Embed
                    </Button>
                    <Link href={`/dashboard/tours/${tour.id}`}>
                      <Button variant="secondary" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setDeleteModal({ isOpen: true, tourId: tour.id })}
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
        <p className="text-gray-600 mb-6">Are you sure you want to delete this tour? This action cannot be undone.</p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={() => setDeleteModal({ isOpen: false })}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => deleteModal.tourId && handleDelete(deleteModal.tourId)}>
            Delete
          </Button>
        </div>
      </Modal>

      <Modal isOpen={embedModal.isOpen} onClose={() => setEmbedModal({ isOpen: false })} title="Embed Code">
        <p className="text-sm text-gray-600 mb-4">Copy this code and paste it into your website:</p>
        <pre className="bg-gray-900 text-white p-4 rounded text-xs overflow-x-auto mb-4">
          <code>{embedModal.code}</code>
        </pre>
        <Button
          variant="primary"
          className="w-full"
          onClick={() => {
            navigator.clipboard.writeText(embedModal.code || "")
            setEmbedModal({ isOpen: false })
          }}
        >
          Copy Code
        </Button>
      </Modal>
    </div>
  )
}
