import type React from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "secondary" | "success" | "danger"
  size?: "sm" | "md" | "lg"
  children: React.ReactNode
}

export function Button({ variant = "primary", size = "md", className = "", children, ...props }: ButtonProps) {
  const getVariantClass = () => {
    switch (variant) {
      case "primary":
        return "btn-custom-primary text-white"
      case "outline":
        return "btn-outline-custom"
      case "secondary":
        return "btn btn-secondary"
      case "success":
        return "btn btn-success"
      case "danger":
        return "btn btn-danger"
      default:
        return "btn-custom-primary text-white"
    }
  }

  const getSizeClass = () => {
    switch (size) {
      case "sm":
        return "btn-sm"
      case "lg":
        return "btn-lg"
      default:
        return ""
    }
  }

  return (
    <button className={`btn ${getVariantClass()} ${getSizeClass()} ${className}`} {...props}>
      {children}
    </button>
  )
}
