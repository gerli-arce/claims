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
        return "btn-primary"
      case "outline":
        return "btn-outline-primary"
      case "secondary":
       return "btn-secondary"
      case "success":
         return "btn-success"
      case "danger":
        return "btn-danger"
      default:
        return "btn-primary"
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
