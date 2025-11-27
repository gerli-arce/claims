"use client"

import type React from "react"
import { useEffect } from "react"

interface ModalProps {
  show: boolean
  onClose: () => void
  title?: string
  size?: "sm" | "md" | "lg" | "xl"
  children: React.ReactNode
}

export default function Modal({ show, onClose, title, size = "lg", children }: ModalProps) {
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [show])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (show) {
      document.addEventListener("keydown", handleEscape)
    }
    return () => document.removeEventListener("keydown", handleEscape)
  }, [show, onClose])

  if (!show) return null

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Content */}
      <div
        className={`
          relative w-full ${sizeClasses[size]}
          bg-white
          border border-slate-200
          rounded-2xl
          shadow-2xl
          max-h-[90vh] overflow-hidden
          flex flex-col
        `}
        style={{ animation: "fadeIn 0.2s ease-out" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          {title && <h2 className="text-xl font-bold text-slate-900">{title}</h2>}
          <button
            type="button"
            onClick={onClose}
            className="
              w-9 h-9 flex items-center justify-center
              rounded-lg
              bg-slate-200
              text-slate-600
              hover:bg-slate-300 hover:text-slate-900
              transition-colors duration-200
            "
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  )
}
