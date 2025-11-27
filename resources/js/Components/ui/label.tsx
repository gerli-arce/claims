import type React from "react"

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode
  required?: boolean
}

export function Label({ className = "", children, required, ...props }: LabelProps) {
  return (
    <label
      className={`
        block text-sm font-semibold
        text-slate-900 dark:text-slate-200
        mb-1.5
        ${className}
      `}
      {...props}
    >
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  )
}
