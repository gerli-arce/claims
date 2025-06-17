import type React from "react"

interface CardProps {
  children: React.ReactNode
  className?: string
}

interface CardContentProps {
  children: React.ReactNode
  className?: string
}

interface CardHeaderProps {
  children: React.ReactNode
  className?: string
}

interface CardTitleProps {
  children: React.ReactNode
  className?: string
}

export function Card({ children, className = "" }: CardProps) {
  return <div className={`card custom-card ${className}`}>{children}</div>
}

export function CardContent({ children, className = "" }: CardContentProps) {
  return <div className={`card-body ${className}`}>{children}</div>
}

export function CardHeader({ children, className = "" }: CardHeaderProps) {
  return <div className={`card-header custom-card-header ${className}`}>{children}</div>
}

export function CardTitle({ children, className = "" }: CardTitleProps) {
  return <h5 className={`card-title mb-0 ${className}`}>{children}</h5>
}
