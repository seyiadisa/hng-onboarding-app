"use client"

import type React from "react"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {title && (
          <div className="border-b border-border px-6 py-4">
            <h2 className="text-lg font-bold text-foreground">{title}</h2>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
