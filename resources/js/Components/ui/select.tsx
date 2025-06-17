"use client"

import React, { useState } from "react"

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
      <div className={`dropdown ${className}`}>{children}</div>
    </SelectContext.Provider>
  )
}

export function SelectTrigger({ children, className = "" }: SelectTriggerProps) {
  const { isOpen, setIsOpen } = React.useContext(SelectContext)

  return (
    <button
      type="button"
      className={`btn btn-outline-secondary dropdown-toggle w-100 text-start ${className}`}
      onClick={() => setIsOpen(!isOpen)}
      data-bs-toggle="dropdown"
      aria-expanded={isOpen}
    >
      {children}
    </button>
  )
}

export function SelectContent({ children }: SelectContentProps) {
  const { isOpen } = React.useContext(SelectContext)

  return (
    <ul className={`dropdown-menu w-100 ${isOpen ? "show" : ""}`} style={{ maxHeight: "200px", overflowY: "auto" }}>
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
        className={`dropdown-item ${isSelected ? "active" : ""}`}
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
    return <span className="text-muted">{placeholder}</span>
  }

  // Mapear valores a texto legible
  const valueMap: { [key: string]: string } = {
    pendiente: "Pendiente",
    en_proceso: "En Proceso",
    resuelto: "Resuelto",
    zona1: "Zona Centro",
    zona2: "Zona Norte",
    zona3: "Zona Sur",
    zona4: "Zona Este",
    internet: "Problemas de Internet",
    tv_cable: "TV por Cable",
    iptv: "Servicio IPTV",
    facturacion: "Facturación",
    atencion_cliente: "Atención al Cliente",
    instalacion: "Instalación",
    otros: "Otros",
  }

  return <span>{valueMap[value] || value}</span>
}
