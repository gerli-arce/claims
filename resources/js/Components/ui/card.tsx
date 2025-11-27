import type React from "react"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  variant?: "default" | "elevated" | "bordered"
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode
  className?: string
}

export function Card({ children, className = "", variant = "default", ...props }: CardProps) {
  const variants = {
    default: "bg-white border border-slate-200 rounded-xl shadow-sm",
    elevated: "bg-white border border-slate-200 rounded-xl shadow-lg",
    bordered: "bg-transparent border-2 border-slate-300 rounded-xl",
  }

  return (
    <div className={`${variants[variant]} transition-all duration-200 ${className}`} {...props}>
      {children}
    </div>
  )
}

export function CardContent({ children, className = "", ...props }: CardContentProps) {
  return (
    <div className={`p-4 md:p-6 ${className}`} {...props}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className = "", ...props }: CardHeaderProps) {
  return (
    <div className={`p-4 md:p-6 border-b border-slate-200 ${className}`} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className = "", ...props }: CardTitleProps) {
  return (
    <h3 className={`text-lg font-bold text-slate-900 ${className}`} {...props}>
      {children}
    </h3>
  )
}
