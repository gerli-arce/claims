"use client"

import React, { useState, useRef, useEffect } from "react"

interface SelectProps {
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
  className?: string
}

interface SelectTriggerProps {
  children: React.ReactNode
  className?: string
}

interface SelectContentProps {
  children: React.ReactNode
}

interface SelectItemProps {
  value: string
  children: React.ReactNode
}

interface SelectValueProps {
  placeholder?: string
}

const SelectContext = React.createContext<{
  value: string
  onValueChange: (value: string) => void
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}>({
  value: "",
  onValueChange: () => {},
  isOpen: false,
  setIsOpen: () => {},
})

export function Select({ value, onValueChange, children, className = "" }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const contextValue = {
    value,
    onValueChange: (newValue: string) => {
      onValueChange(newValue)
      setIsOpen(false)
    },
    isOpen,
    setIsOpen,
  }

  return (
    <SelectContext.Provider value={contextValue}>
      <div ref={ref} className={`relative ${className}`}>
        {children}
      </div>
    </SelectContext.Provider>
  )
}

export function SelectTrigger({ children, className = "" }: SelectTriggerProps) {
  const { isOpen, setIsOpen } = React.useContext(SelectContext)

  return (
    <button
      type="button"
      className={`
        w-full flex items-center justify-between gap-2
        px-4 py-3
        bg-slate-50
        border border-slate-300
        rounded-lg
        text-slate-900
        transition-all duration-200
        hover:border-slate-400
        focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100
        ${isOpen ? "border-blue-500 ring-2 ring-blue-100" : ""}
        ${className}
      `}
      onClick={() => setIsOpen(!isOpen)}
      aria-expanded={isOpen}
    >
      <span className="flex items-center gap-2 truncate">{children}</span>
      <svg
        className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  )
}

export function SelectContent({ children }: SelectContentProps) {
  const { isOpen } = React.useContext(SelectContext)

  if (!isOpen) return null

  return (
    <ul
      className={`
        absolute z-50 w-full mt-1
        bg-white
        border border-slate-200
        rounded-lg
        shadow-lg
        max-h-[240px] overflow-y-auto
        py-1
      `}
    >
      {children}
    </ul>
  )
}

export function SelectItem({ value, children }: SelectItemProps) {
  const { value: selectedValue, onValueChange } = React.useContext(SelectContext)
  const isSelected = value === selectedValue

  return (
    <li>
      <button
        type="button"
        className={`
          w-full px-4 py-2.5 text-left text-sm
          transition-colors duration-150
          ${isSelected ? "bg-blue-600 text-white font-semibold" : "text-slate-900 hover:bg-slate-100"}
        `}
        onClick={() => onValueChange(value)}
      >
        {children}
      </button>
    </li>
  )
}

export function SelectValue({ placeholder }: SelectValueProps) {
  const { value } = React.useContext(SelectContext)

  if (!value && placeholder) {
    return <span className="text-slate-400">{placeholder}</span>
  }

  const valueMap: { [key: string]: string } = {
    pendiente: "Pendiente",
    en_proceso: "En Proceso",
    resuelto: "Resuelto",
    all: "Todos los estados",
    zona1: "Zona Centro",
    zona2: "Zona Norte",
    zona3: "Zona Sur",
    zona4: "Zona Este",
    internet: "Problemas de Internet",
    tv_cable: "TV por Cable",
    iptv: "Servicio IPTV",
    facturacion: "Facturacion",
    atencion_cliente: "Atencion al Cliente",
    instalacion: "Instalacion",
    otros: "Otros",
  }

  return <span className="text-slate-900">{valueMap[value] || value}</span>
}
