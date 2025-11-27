import type React from "react"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      className={`
        w-full px-4 py-3
        bg-slate-50
        border border-slate-300
        rounded-lg
        text-slate-900
        placeholder:text-slate-400
        transition-all duration-200
        focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    />
  )
}
