import type React from "react"

interface BadgeProps {
  children: React.ReactNode
  className?: string
  variant?: "pending" | "process" | "resolved" | "primary" | "secondary"
}

export function Badge({ children, className = "", variant = "primary" }: BadgeProps) {
  const getVariantClass = () => {
    switch (variant) {
      case "pending":
        return "badge-custom-pending"
      case "process":
        return "badge-custom-process"
      case "resolved":
        return "badge-custom-resolved"
      case "primary":
        return "bg-primary"
      case "secondary":
        return "bg-secondary"
      default:
        return "bg-primary"
    }
  }

  return <span className={`badge ${getVariantClass()} ${className}`}>{children}</span>
}
