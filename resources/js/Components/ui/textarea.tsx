import type React from "react"

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export function Textarea({ className = "", ...props }: TextareaProps) {
  return (
    <textarea
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
        min-h-[140px] resize-y
        ${className}
      `}
      {...props}
    />
  )
}
