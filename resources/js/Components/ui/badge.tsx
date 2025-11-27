import type React from "react"

interface BadgeProps {
  children: React.ReactNode
  className?: string
  variant?: "pending" | "process" | "resolved" | "primary" | "secondary" | "success" | "warning" | "danger"
}

export function Badge({ children, className = "", variant = "primary" }: BadgeProps) {
  const variants = {
    pending: "bg-amber-100 text-amber-700 border-amber-200",
    process: "bg-blue-100 text-blue-700 border-blue-200",
    resolved: "bg-emerald-100 text-emerald-700 border-emerald-200",
    primary: "bg-blue-100 text-blue-700 border-blue-200",
    secondary: "bg-slate-100 text-slate-700 border-slate-200",
    success: "bg-emerald-100 text-emerald-700 border-emerald-200",
    warning: "bg-amber-100 text-amber-700 border-amber-200",
    danger: "bg-red-100 text-red-700 border-red-200",
  }

  return (
    <span
      className={`
        inline-flex items-center
        px-2.5 py-0.5
        text-xs font-semibold
        rounded-full
        border
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  )
}
