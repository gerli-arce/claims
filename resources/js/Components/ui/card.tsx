import type React from "react"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
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

export function Card({ children, className = "", ...props }: CardProps) {
  return (
      <div className={`card bg-body text-body ${className}`} {...props}>
      {children}
    </div>
  )
}

export function CardContent({ children, className = "", ...props }: CardContentProps) {
  return (
    <div className={`card-body ${className} text-body`} {...props}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className = "", ...props }: CardHeaderProps) {
  return (
    <div className={`card-header bg-transparent ${className}`} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className = "", ...props }: CardTitleProps) {
  return (
    <h5 className={`card-title mb-0 ${className}`} {...props}>
      {children}
    </h5>
  )
}
