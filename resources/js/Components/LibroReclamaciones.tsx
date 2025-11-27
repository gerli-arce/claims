"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import Swal from "sweetalert2"
import "sweetalert2/dist/sweetalert2.min.css"
import { Badge } from "./ui/badge"
import DetalleReclamacionModal from "./DetalleReclamacionModal"
import GestionReclamacionModal from "./GestionReclamacionModal"
import Modal from "./ui/modal"
import type { FormData, Estadisticas, Reclamacion, Sucursal, Ejecutivo } from "../types"
import ChatbotWidget from "./ChatbotWidget"
import Footer from "./Footer"

declare global {
  interface Window {
    sucursalesData: Sucursal[]
  }
}

// Icon Components
const Icons = {
  Sun: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  ),
  Moon: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>
  ),
  MapPin: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Users: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  ),
  FileText: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  ),
  Send: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  ),
  Clock: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  Check: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  Search: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  ),
  Eye: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  ),
  Upload: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
      />
    </svg>
  ),
  X: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  WhatsApp: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  ),
  ChartBar: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  ),
  Lightbulb: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
      />
    </svg>
  ),
  Calendar: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  ),
}

export default function LibroReclamaciones() {
  const [formData, setFormData] = useState<FormData>({
    nombre_completo: "",
    correo_electronico: "",
    telefono: "",
    zona: "",
    tipo_reclamo: "",
    asunto: "",
    descripcion: "",
    sucursal_id: "",
    ejecutivo_id: "",
  })

  const [sucursales, setSucursales] = useState<Sucursal[]>([])
  const [selectedSucursal, setSelectedSucursal] = useState<Sucursal | null>(null)
  const [ejecutivos, setEjecutivos] = useState<Ejecutivo[]>([])
  const [selectedEjecutivo, setSelectedEjecutivo] = useState<Ejecutivo | null>(null)
  const [loadingEjecutivos, setLoadingEjecutivos] = useState(false)
  const [estadisticas, setEstadisticas] = useState<Estadisticas>({
    total: 0,
    resueltos: 0,
    pendientes: 0,
    en_proceso: 0,
    tiempo_promedio: "24 horas",
  })
  const [reclamaciones, setReclamaciones] = useState<Reclamacion[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingReclamaciones, setLoadingReclamaciones] = useState(true)
  const [errors, setErrors] = useState<any>({})
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroEstado, setFiltroEstado] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedReclamacion, setSelectedReclamacion] = useState<Reclamacion | null>(null)
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [documents, setDocuments] = useState<File[]>([])
  const [userData, setUserData] = useState<any | null>(null)
  const [showGestionModal, setShowGestionModal] = useState(false)

  // Dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("darkMode")
      if (saved !== null) return JSON.parse(saved)
      return window.matchMedia("(prefers-color-scheme: dark)").matches
    }
    return false
  })

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
      document.body.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
      document.body.classList.remove("dark")
    }
    localStorage.setItem("darkMode", JSON.stringify(darkMode))
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode((prev: boolean) => !prev)
  }

  useEffect(() => {
    if (window.sucursalesData) {
      setSucursales(window.sucursalesData)
    }
    fetchEstadisticas()
  }, [])

  useEffect(() => {
    try {
      const stored = localStorage.getItem("data")
      if (stored) {
        setUserData(JSON.parse(stored))
      }
    } catch (err) {
      console.error("Invalid user data in localStorage", err)
    }
  }, [])

  useEffect(() => {
    fetchReclamaciones()
  }, [currentPage])

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const zonaId = urlParams.get("zona")
    if (zonaId && sucursales.length > 0) {
      const sucursalFromUrl = sucursales.find((s) => s.id === Number.parseInt(zonaId, 10))
      if (sucursalFromUrl) {
        handleSucursalSelect(sucursalFromUrl)
      }
    }
  }, [sucursales])

  const fetchEjecutivos = async (sucursalId: number) => {
    setLoadingEjecutivos(true)
    try {
      const response = await fetch(`/api/ejecutivos/${sucursalId}`)
      const data = await response.json()
      if (data.status === 200) {
        setEjecutivos(data.data)
      } else {
        setEjecutivos([])
      }
    } catch (error) {
      console.error("Error fetching ejecutivos:", error)
      setEjecutivos([])
    } finally {
      setLoadingEjecutivos(false)
    }
  }

  const fetchEstadisticas = async () => {
    try {
      const response = await fetch("/api/reclamos/estadisticas")
      const data = await response.json()
      setEstadisticas(data)
    } catch (error) {
      console.error("Error fetching estadisticas:", error)
    }
  }

  const fetchReclamaciones = async () => {
    setLoadingReclamaciones(true)
    try {
      const response = await fetch(`/api/reclamaciones?page=${currentPage}`)
      const data = await response.json()
      setReclamaciones(data.data || [])
      setTotalPages(data.last_page || 1)
    } catch (error) {
      console.error("Error fetching reclamaciones:", error)
    } finally {
      setLoadingReclamaciones(false)
    }
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSucursalSelect = (sucursal: Sucursal) => {
    setSelectedSucursal(sucursal)
    setSelectedEjecutivo(null)
    setEjecutivos([])
    setFormData((prev) => ({ ...prev, sucursal_id: sucursal.id.toString(), ejecutivo_id: "" }))
    fetchEjecutivos(sucursal.id)
  }

  const handleEjecutivoSelect = (ejecutivo: Ejecutivo) => {
    setSelectedEjecutivo(ejecutivo)
    setFormData((prev) => ({ ...prev, ejecutivo_id: ejecutivo.id.toString() }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    setImages((prev) => [...prev, ...files])
    setImagePreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))])
    e.target.value = ""
  }

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx))
    setImagePreviews((prev) => {
      const url = prev[idx]
      if (url) URL.revokeObjectURL(url)
      return prev.filter((_, i) => i !== idx)
    })
  }

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    setDocuments((prev) => [...prev, ...files])
    e.target.value = ""
  }

  const removeDocument = (idx: number) => {
    setDocuments((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content")

    const payload = new FormData()
    Object.entries(formData).forEach(([key, value]) => payload.append(key, value))
    images.forEach((f) => payload.append("images[]", f))
    documents.forEach((f) => payload.append("documents[]", f))

    try {
      const response = await fetch("/api/reclamaciones", {
        method: "POST",
        headers: { "X-CSRF-TOKEN": token || "" },
        credentials: "same-origin",
        body: payload,
      })

      const data = await response.json()
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Reclamo enviado exitosamente",
          text: data.message || "Su reclamo ha sido registrado correctamente",
          timer: 5000,
          timerProgressBar: true,
        })
        setFormData({
          nombre_completo: "",
          correo_electronico: "",
          telefono: "",
          zona: "",
          tipo_reclamo: "",
          asunto: "",
          descripcion: "",
          sucursal_id: "",
          ejecutivo_id: "",
        })
        setSelectedSucursal(null)
        setSelectedEjecutivo(null)
        setEjecutivos([])
        setImages([])
        setImagePreviews([])
        setDocuments([])
        fetchEstadisticas()
        fetchReclamaciones()
      } else {
        Swal.fire({
          icon: "error",
          title: "Error al enviar reclamo",
          text: data.message || "No se pudo enviar la reclamación",
        })
        setErrors(data.errors || {})
      }
    } catch (error) {
      console.error("Error:", error)
      Swal.fire({
        icon: "error",
        title: "Error al enviar reclamo",
        text: "Error al enviar la reclamación",
      })
      setErrors({ general: "Error al enviar la reclamación" })
    } finally {
      setLoading(false)
    }
  }

  const getEstadoBadge = (estado: string): "pending" | "process" | "resolved" => {
    switch (estado.toLowerCase()) {
      case "pendiente":
        return "pending"
      case "en_proceso":
        return "process"
      case "resuelto":
        return "resolved"
      default:
        return "pending"
    }
  }

  const getEstadoTexto = (estado: string) => {
    const textos: { [key: string]: string } = {
      pendiente: "Pendiente",
      en_proceso: "En Proceso",
      resuelto: "Resuelto",
    }
    return textos[estado.toLowerCase()] || estado
  }

  const whatsappMessage = encodeURIComponent(
    "Hola, vengo del Libro de Reclamaciones de FASTNETPERU.%0A%0AQuisiera gestionar la siguiente consulta:",
  )

  const contactosWhatsapp = [
    { label: "Reclamos", phone: "51986470369" },
    { label: "Soporte", phone: "51978451680" },
    { label: "Ventas", phone: "51942059874" },
    { label: "Cobranza", phone: "51940842303" },
  ]

  const filteredReclamaciones = reclamaciones.filter((reclamacion) => {
    const term = searchTerm.toLowerCase()
    const ejecutivoNombre =
      `${reclamacion.ejecutive?.name ?? ""} ${reclamacion.ejecutive?.lastname ?? ""}`.toLowerCase()
    const matchesSearch =
      reclamacion.numero_reclamacion?.toLowerCase().includes(term) ||
      reclamacion.nombre_completo.toLowerCase().includes(term) ||
      ejecutivoNombre.includes(term) ||
      reclamacion.asunto?.toLowerCase().includes(term)
    const matchesEstado =
      filtroEstado === "" || filtroEstado === "all" || reclamacion.estado.toLowerCase() === filtroEstado.toLowerCase()
    return matchesSearch && matchesEstado
  })

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-slate-950" : "bg-slate-50"}`}>
      {/* Header */}
      <header
        className={`sticky top-0 z-50 border-b shadow-sm transition-colors duration-300 ${
          darkMode ? "bg-slate-900/95 backdrop-blur-md border-slate-700/50" : "bg-white border-slate-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between py-4 gap-4">
            {/* Brand */}
            <div className="flex items-center gap-4">
              <img
                src="http://almacen.fastnetperu.com.pe/img/logo-light.png"
                alt="FASTNETPERU"
                className="h-12 w-auto object-contain"
              />
              <div className="text-center lg:text-left">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full mb-1 ${
                    darkMode ? "bg-blue-500/20 text-blue-400" : "bg-blue-50 text-blue-600"
                  }`}
                >
                  Libro de Reclamaciones
                </span>
                <h1 className={`text-xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>FASTNETPERU</h1>
                <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>TV | Internet | IPTV</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Contact Pills */}
              <div className="flex flex-wrap justify-center gap-2">
                {contactosWhatsapp.map((contacto) => (
                  <a
                    key={contacto.phone}
                    href={`https://wa.me/${contacto.phone}?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 px-3 py-2 border rounded-full text-xs font-medium transition-all duration-200 ${
                      darkMode
                        ? "bg-slate-800/50 border-slate-700 text-slate-300 hover:border-green-500 hover:text-green-400 hover:bg-green-500/10"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:border-green-500 hover:text-green-600 hover:bg-green-50"
                    }`}
                  >
                    <Icons.WhatsApp className="w-4 h-4 text-green-500" />
                    <span className="hidden sm:inline">{contacto.label}</span>
                    <span className="sm:hidden">{contacto.label.slice(0, 3)}</span>
                  </a>
                ))}
              </div>

              {/* Dark Mode Toggle Button */}
              <button
                onClick={toggleDarkMode}
                className={`p-2.5 rounded-xl border-2 transition-all duration-300 ${
                  darkMode
                    ? "bg-slate-800 border-slate-600 text-yellow-400 hover:bg-slate-700 hover:border-yellow-500/50"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-blue-500/50 hover:text-blue-600"
                }`}
                title={darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
              >
                {darkMode ? <Icons.Sun className="w-5 h-5" /> : <Icons.Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <section className="text-center mb-10">
          <h2
            className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mb-3 ${
              darkMode ? "text-white" : "text-slate-900"
            }`}
          >
            Libro de Reclamaciones
            {selectedSucursal && (
              <span
                className="inline-flex items-center ml-3 px-3 py-1 text-base font-semibold text-white rounded-full"
                style={{ backgroundColor: selectedSucursal.color }}
              >
                {selectedSucursal.name}
              </span>
            )}
          </h2>
          <p className={`text-base max-w-2xl mx-auto ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
            Registra tu reclamo sobre nuestros servicios. Respondemos con prioridad y seguimiento en linea.
          </p>
        </section>

        {/* Branch Selection */}
        <section className="mb-8">
          <div className="flex flex-wrap justify-center gap-3">
            {sucursales.map((sucursal) => {
              const isActive = selectedSucursal?.id === sucursal.id
              return (
                <button
                  key={sucursal.id}
                  onClick={() => handleSucursalSelect(sucursal)}
                  className={`
                    min-w-[120px] px-5 py-3 rounded-xl text-sm font-semibold uppercase tracking-wider
                    transition-all duration-200 border-2
                    ${
                      isActive
                        ? "text-white shadow-lg scale-105"
                        : darkMode
                          ? "bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-500"
                          : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                    }
                  `}
                  style={isActive ? { backgroundColor: sucursal.color, borderColor: sucursal.color } : {}}
                >
                  <Icons.MapPin
                    className={`inline-block w-4 h-4 mr-2 ${isActive ? "text-white" : darkMode ? "text-slate-400" : "text-slate-400"}`}
                  />
                  {sucursal.name}
                </button>
              )
            })}
          </div>
        </section>

        {/* Branch Info Card */}
        {selectedSucursal && (
          <section className="mb-8">
            <div
              className={`rounded-xl border-l-4 shadow-sm p-4 sm:p-6 transition-colors duration-300 ${
                darkMode ? "bg-slate-900 border-slate-700" : "bg-white"
              }`}
              style={{ borderLeftColor: selectedSucursal.color }}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${selectedSucursal.color}20` }}
                  >
                    <Icons.MapPin className="w-6 h-6" style={{ color: selectedSucursal.color }} />
                  </div>
                  <div>
                    <p
                      className={`text-xs font-semibold uppercase tracking-wider mb-1 ${darkMode ? "text-slate-400" : "text-slate-400"}`}
                    >
                      Sucursal
                    </p>
                    <h3
                      className={`text-lg font-bold ${darkMode ? "text-white" : ""}`}
                      style={{ color: selectedSucursal.color }}
                    >
                      {selectedSucursal.name}
                    </h3>
                    <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                      {selectedSucursal.address || "Direccion no disponible"}
                    </p>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center gap-2 px-3 py-1.5 border rounded-full text-xs font-medium transition-all duration-200 ${
                    darkMode
                      ? "bg-slate-800/50 border-slate-700 text-slate-300"
                      : "bg-slate-50 border-slate-200 text-slate-600"
                  }`}
                >
                  <Icons.Clock className="w-3.5 h-3.5" />
                  Atencion prioritaria
                </span>
              </div>
            </div>
          </section>
        )}

        {/* Executives Grid */}
        {selectedSucursal && (
          <section className="mb-8">
            <h3
              className={`text-lg font-semibold mb-4 flex items-center gap-2 ${darkMode ? "text-white" : "text-slate-900"}`}
            >
              <Icons.Users className={`w-5 h-5 ${darkMode ? "text-blue-400" : "text-blue-600"}`} />
              Ejecutivos de Atencion
            </h3>
            <p className={`text-sm mb-6 ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
              Seleccione el ejecutivo que le atendio
            </p>
            {loadingEjecutivos ? (
              <div className="flex justify-center py-8">
                <div
                  className={`animate-spin rounded-full h-8 w-8 border-b-2 ${darkMode ? "border-blue-400" : "border-blue-600"}`}
                ></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {ejecutivos.map((ejecutivo) => {
                  const isSelected = selectedEjecutivo?.id === ejecutivo.id
                  const initials = `${ejecutivo.name.charAt(0)}${ejecutivo.lastname?.charAt(0) || ""}`

                  return (
                    <button
                      key={ejecutivo.id}
                      onClick={() => handleEjecutivoSelect(ejecutivo)}
                      className={`
                        flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200 text-left
                        ${
                          isSelected
                            ? darkMode
                              ? "border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/25"
                              : "border-blue-500 bg-blue-50 shadow-md shadow-blue-500/10"
                            : darkMode
                              ? "border-slate-700 bg-slate-800/50 hover:border-slate-500 hover:bg-slate-800"
                              : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-md"
                        }
                      `}
                    >
                      {/* Profile Picture Circle */}
                      <div className="flex-shrink-0">
                        <img
                          src={`https://almacen.fastnetperu.com.pe/api/image_person/${ejecutivo.relative_id}/full`}
                          alt={`${ejecutivo.name} ${ejecutivo.lastname}`}
                          className={`w-12 h-12 rounded-full object-cover border-2 ${
                            isSelected ? "border-blue-500" : darkMode ? "border-slate-600" : "border-slate-200"
                          }`}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.onerror = null
                            target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(ejecutivo.name + " " + ejecutivo.lastname)}&background=random&color=fff&size=48`
                          }}
                        />
                      </div>

                      {/* Executive Info */}
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-bold truncate ${
                            isSelected
                              ? darkMode
                                ? "text-blue-300"
                                : "text-blue-700"
                              : darkMode
                                ? "text-white"
                                : "text-slate-900"
                          }`}
                        >
                          {ejecutivo.name} {ejecutivo.lastname}
                        </p>
                        <p
                          className={`text-xs truncate ${
                            isSelected
                              ? darkMode
                                ? "text-blue-400/80"
                                : "text-blue-600/80"
                              : darkMode
                                ? "text-slate-400"
                                : "text-slate-500"
                          }`}
                        >
                          {selectedSucursal.name}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </section>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div
              className={`rounded-2xl border shadow-sm overflow-hidden ${
                darkMode ? "bg-slate-900/80 border-slate-700/50 backdrop-blur-sm" : "bg-white border-slate-200"
              }`}
            >
              <div className={`px-6 py-4 border-b ${darkMode ? "border-slate-700/50" : "border-slate-100"}`}>
                <h3
                  className={`text-lg font-semibold flex items-center gap-2 ${darkMode ? "text-white" : "text-slate-900"}`}
                >
                  <Icons.FileText className={`w-5 h-5 ${darkMode ? "text-blue-400" : "text-blue-600"}`} />
                  Formulario de reclamo
                </h3>
              </div>
              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Info Section */}
                  <div>
                    <h4
                      className={`text-sm font-semibold uppercase tracking-wider mb-4 ${
                        darkMode ? "text-slate-300" : "text-slate-500"
                      }`}
                    >
                      Información Personal
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="nombre_completo">Nombre Completo *</Label>
                        <Input
                          id="nombre_completo"
                          value={formData.nombre_completo}
                          onChange={(e) => handleInputChange("nombre_completo", e.target.value)}
                          placeholder="Ingrese su nombre completo"
                          className={`mt-1 ${darkMode ? "bg-slate-800 border-slate-600 text-white placeholder:text-slate-500" : ""}`}
                        />
                        {errors.nombre_completo && (
                          <p className="mt-1 text-xs text-red-500">{errors.nombre_completo}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="correo_electronico">Correo Electrónico *</Label>
                        <Input
                          id="correo_electronico"
                          type="email"
                          value={formData.correo_electronico}
                          onChange={(e) => handleInputChange("correo_electronico", e.target.value)}
                          placeholder="ejemplo@correo.com"
                          className={`mt-1 ${darkMode ? "bg-slate-800 border-slate-600 text-white placeholder:text-slate-500" : ""}`}
                        />
                        {errors.correo_electronico && (
                          <p className="mt-1 text-xs text-red-500">{errors.correo_electronico}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="telefono">Teléfono *</Label>
                        <Input
                          id="telefono"
                          type="tel"
                          value={formData.telefono}
                          onChange={(e) => handleInputChange("telefono", e.target.value)}
                          placeholder="999 999 999"
                          className={`mt-1 ${darkMode ? "bg-slate-800 border-slate-600 text-white placeholder:text-slate-500" : ""}`}
                        />
                        {errors.telefono && <p className="mt-1 text-xs text-red-500">{errors.telefono}</p>}
                      </div>
                      <div>
                        <Label htmlFor="zona">Zona / Dirección</Label>
                        <Input
                          id="zona"
                          value={formData.zona}
                          onChange={(e) => handleInputChange("zona", e.target.value)}
                          placeholder="Su zona o dirección"
                          className={`mt-1 ${darkMode ? "bg-slate-800 border-slate-600 text-white placeholder:text-slate-500" : ""}`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Claim Details Section */}
                  <div>
                    <h4
                      className={`text-sm font-semibold uppercase tracking-wider mb-4 ${
                        darkMode ? "text-slate-300" : "text-slate-500"
                      }`}
                    >
                      Detalle del Reclamo
                    </h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="tipo_reclamo">Tipo de Reclamo *</Label>
                          <Select
                            value={formData.tipo_reclamo}
                            onValueChange={(value) => handleInputChange("tipo_reclamo", value)}
                          >
                            <SelectTrigger
                              className={`mt-1 ${darkMode ? "bg-slate-800 border-slate-600 text-white" : ""}`}
                            >
                              <SelectValue placeholder="Seleccione el tipo" />
                            </SelectTrigger>
                            <SelectContent className={darkMode ? "bg-slate-800 border-slate-700" : ""}>
                              <SelectItem value="queja" className={darkMode ? "text-white hover:bg-slate-700" : ""}>
                                Queja
                              </SelectItem>
                              <SelectItem value="reclamo" className={darkMode ? "text-white hover:bg-slate-700" : ""}>
                                Reclamo
                              </SelectItem>
                              <SelectItem
                                value="sugerencia"
                                className={darkMode ? "text-white hover:bg-slate-700" : ""}
                              >
                                Sugerencia
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.tipo_reclamo && <p className="mt-1 text-xs text-red-500">{errors.tipo_reclamo}</p>}
                        </div>
                        <div>
                          <Label htmlFor="asunto">Asunto *</Label>
                          <Input
                            id="asunto"
                            value={formData.asunto}
                            onChange={(e) => handleInputChange("asunto", e.target.value)}
                            placeholder="Asunto del reclamo"
                            className={`mt-1 ${darkMode ? "bg-slate-800 border-slate-600 text-white placeholder:text-slate-500" : ""}`}
                          />
                          {errors.asunto && <p className="mt-1 text-xs text-red-500">{errors.asunto}</p>}
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="descripcion">Descripción *</Label>
                        <Textarea
                          id="descripcion"
                          value={formData.descripcion}
                          onChange={(e) => handleInputChange("descripcion", e.target.value)}
                          placeholder="Describa detalladamente su reclamo..."
                          rows={5}
                          className={`mt-1 ${darkMode ? "bg-slate-800 border-slate-600 text-white placeholder:text-slate-500" : ""}`}
                        />
                        {errors.descripcion && <p className="mt-1 text-xs text-red-500">{errors.descripcion}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Attachments Section */}
                  <div>
                    <h4
                      className={`text-sm font-semibold uppercase tracking-wider mb-4 ${
                        darkMode ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      Archivos Adjuntos
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Images Upload */}
                      <div>
                        <Label className={darkMode ? "text-slate-300" : ""}>Imágenes</Label>
                        <div
                          className={`mt-1 border-2 border-dashed rounded-xl p-4 text-center transition-colors ${
                            darkMode
                              ? "border-slate-600 hover:border-slate-500 bg-slate-800/50"
                              : "border-slate-300 hover:border-blue-400 bg-slate-50"
                          }`}
                        >
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                            className="hidden"
                            id="images-upload"
                          />
                          <label htmlFor="images-upload" className="cursor-pointer">
                            <Icons.Upload
                              className={`w-8 h-8 mx-auto mb-2 ${darkMode ? "text-slate-500" : "text-slate-400"}`}
                            />
                            <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                              Click para subir imágenes
                            </p>
                          </label>
                        </div>
                        {imagePreviews.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-3">
                            {imagePreviews.map((preview, idx) => (
                              <div key={idx} className="relative group">
                                <img
                                  src={preview || "/placeholder.svg"}
                                  alt={`Preview ${idx + 1}`}
                                  className={`w-24 h-24 object-cover rounded-lg border ${darkMode ? "border-slate-600" : "border-slate-200"}`}
                                />
                                <button
                                  type="button"
                                  onClick={() => removeImage(idx)}
                                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Icons.X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      {/* Documents Upload */}
                      <div>
                        <Label className={darkMode ? "text-slate-300" : ""}>Documentos</Label>
                        <div
                          className={`mt-1 border-2 border-dashed rounded-xl p-4 text-center transition-colors ${
                            darkMode
                              ? "border-slate-600 hover:border-slate-500 bg-slate-800/50"
                              : "border-slate-300 hover:border-blue-400 bg-slate-50"
                          }`}
                        >
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            multiple
                            onChange={handleDocumentChange}
                            className="hidden"
                            id="documents-upload"
                          />
                          <label htmlFor="documents-upload" className="cursor-pointer">
                            <Icons.FileText
                              className={`w-8 h-8 mx-auto mb-2 ${darkMode ? "text-slate-500" : "text-slate-400"}`}
                            />
                            <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                              Click para subir documentos
                            </p>
                          </label>
                        </div>
                        {documents.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {documents.map((doc, idx) => (
                              <div
                                key={idx}
                                className={`flex items-center justify-between p-2 rounded-lg ${
                                  darkMode ? "bg-slate-800" : "bg-slate-100"
                                }`}
                              >
                                <span className={`text-sm truncate ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                                  {doc.name}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => removeDocument(idx)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Icons.X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={loading || !selectedSucursal || !selectedEjecutivo}
                      className={`w-full py-3 text-base font-semibold rounded-xl transition-all duration-200 ${
                        darkMode
                          ? "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:from-slate-700 disabled:to-slate-700"
                          : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400"
                      }`}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Enviando...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <Icons.Send className="w-5 h-5" />
                          Enviar Reclamación
                        </span>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Summary Card */}
            <div
              className={`rounded-2xl border shadow-sm overflow-hidden ${
                darkMode ? "bg-slate-900/80 border-slate-700/50 backdrop-blur-sm" : "bg-white border-slate-200"
              }`}
            >
              <div className={`px-6 py-4 border-b ${darkMode ? "border-slate-700/50" : "border-slate-100"}`}>
                <h3
                  className={`text-sm font-semibold uppercase tracking-wider flex items-center gap-2 ${
                    darkMode ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  <Icons.FileText className={`w-5 h-5 ${darkMode ? "text-blue-400" : "text-blue-600"}`} />
                  Resumen
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <p
                    className={`text-xs font-medium uppercase tracking-wider ${darkMode ? "text-slate-500" : "text-slate-400"}`}
                  >
                    Sucursal
                  </p>
                  {selectedSucursal ? (
                    <Badge className="mt-1 text-white" style={{ backgroundColor: selectedSucursal.color }}>
                      {selectedSucursal.name}
                    </Badge>
                  ) : (
                    <p className={`text-sm ${darkMode ? "text-slate-500" : "text-slate-400"}`}>No seleccionada</p>
                  )}
                </div>
                <div>
                  <p
                    className={`text-xs font-medium uppercase tracking-wider ${darkMode ? "text-slate-500" : "text-slate-400"}`}
                  >
                    Ejecutivo
                  </p>
                  {selectedEjecutivo ? (
                    <p className={`text-sm font-medium mt-1 ${darkMode ? "text-white" : "text-slate-900"}`}>
                      {selectedEjecutivo.name} {selectedEjecutivo.lastname}
                    </p>
                  ) : (
                    <p className={`text-sm ${darkMode ? "text-slate-500" : "text-slate-400"}`}>No seleccionado</p>
                  )}
                </div>
              </div>
            </div>

            {/* Tips Card */}
            <div
              className={`rounded-2xl border shadow-sm overflow-hidden ${
                darkMode ? "bg-slate-900/80 border-slate-700/50 backdrop-blur-sm" : "bg-white border-slate-200"
              }`}
            >
              <div className={`px-6 py-4 border-b ${darkMode ? "border-slate-700/50" : "border-slate-100"}`}>
                <h3
                  className={`text-sm font-semibold uppercase tracking-wider flex items-center gap-2 ${
                    darkMode ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  <Icons.Lightbulb className={`w-5 h-5 ${darkMode ? "text-yellow-400" : "text-yellow-500"}`} />
                  Tips
                </h3>
              </div>
              <div className="p-6">
                <ul className={`space-y-3 text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                  <li className="flex items-start gap-2">
                    <Icons.Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>Describe el problema con fechas y evidencias.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icons.Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>Sube imágenes o documentos claros.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icons.Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>Selecciona sucursal y ejecutivo antes de enviar.</span>
                  </li>
                </ul>
                <div className={`mt-4 pt-4 border-t ${darkMode ? "border-slate-700" : "border-slate-100"}`}>
                  <div className="flex items-center gap-2">
                    <Icons.Clock className={`w-4 h-4 ${darkMode ? "text-slate-500" : "text-slate-400"}`} />
                    <span className={`text-xs ${darkMode ? "text-slate-500" : "text-slate-500"}`}>
                      Respuesta en 24-48h
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Claims Section */}
        {userData && (reclamaciones.length > 0 || searchTerm || filtroEstado) && (
          <section className="mt-12">
            <div className="mb-6">
              <h3 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>
                <Icons.FileText
                  className={`inline-block w-5 h-5 mr-2 ${darkMode ? "text-blue-400" : "text-blue-600"}`}
                />
                Listado de Reclamaciones
              </h3>
              <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                Historial de reclamos y su estado actual
              </p>
            </div>

            {/* Filters */}
            <div
              className={`rounded-xl shadow-sm border p-4 mb-6 transition-colors duration-300 ${
                darkMode ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"
              }`}
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Icons.Search
                    className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? "text-slate-400" : "text-slate-400"}`}
                  />
                  <Input
                    placeholder="Buscar por numero, nombre o asunto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`pl-10 ${darkMode ? "bg-slate-800 border-slate-700 text-slate-300" : ""}`}
                  />
                </div>
                <div className="sm:w-48">
                  <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                    <SelectTrigger className={darkMode ? "bg-slate-800 border-slate-700 text-slate-300" : ""}>
                      <SelectValue placeholder="Filtrar estado" />
                    </SelectTrigger>
                    <SelectContent className={darkMode ? "bg-slate-800 border-slate-700 text-slate-300" : ""}>
                      <SelectItem value="all">Todos los estados</SelectItem>
                      <SelectItem value="pendiente">Pendiente</SelectItem>
                      <SelectItem value="en_proceso">En Proceso</SelectItem>
                      <SelectItem value="resuelto">Resuelto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Claims Grid */}
            {loadingReclamaciones ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`rounded-xl shadow-sm border p-5 transition-colors duration-300 ${
                      darkMode ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 space-y-3">
                        <div
                          className={`h-5 w-1/4 rounded animate-pulse ${darkMode ? "bg-slate-700" : "bg-slate-200"}`}
                        />
                        <div
                          className={`h-6 w-1/2 rounded animate-pulse ${darkMode ? "bg-slate-700" : "bg-slate-200"}`}
                        />
                        <div
                          className={`h-4 w-3/4 rounded animate-pulse ${darkMode ? "bg-slate-700" : "bg-slate-200"}`}
                        />
                      </div>
                      <div className={`h-8 w-20 rounded animate-pulse ${darkMode ? "bg-slate-700" : "bg-slate-200"}`} />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredReclamaciones.length === 0 ? (
              <div
                className={`rounded-xl shadow-sm border p-12 text-center transition-colors duration-300 ${
                  darkMode ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"
                }`}
              >
                <Icons.FileText
                  className={`w-5 h-5 mx-auto mb-4 ${darkMode ? "text-slate-400" : "text-slate-300"}`}
                  style={{ minWidth: "20px" }}
                />
                <h4 className={`text-lg font-semibold mb-2 ${darkMode ? "text-white" : "text-slate-900"}`}>
                  No se encontraron reclamaciones
                </h4>
                <p className={darkMode ? "text-slate-400" : "text-slate-500"}>
                  {searchTerm || filtroEstado
                    ? "Intenta ajustar los filtros de busqueda"
                    : "Aun no hay reclamaciones registradas"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredReclamaciones.map((reclamacion) => (
                  <div
                    key={reclamacion.id}
                    className={`rounded-xl shadow-sm border p-5 hover:shadow-md transition-all duration-200 ${
                      darkMode
                        ? "bg-slate-900 border-slate-700 hover:border-slate-600"
                        : "bg-white border-slate-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1">
                        {/* Badges */}
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span
                            className={`inline-flex px-2 py-0.5 text-xs font-semibold font-mono rounded ${darkMode ? "bg-blue-500/20 text-blue-400" : "bg-blue-100 text-blue-600"}`}
                          >
                            {reclamacion.numero_reclamacion || `#${reclamacion.id}`}
                          </span>
                          <Badge variant={getEstadoBadge(reclamacion.estado)}>
                            {getEstadoTexto(reclamacion.estado)}
                          </Badge>
                        </div>

                        {/* Title */}
                        <h4 className={`text-lg font-semibold mb-2 ${darkMode ? "text-white" : "text-slate-900"}`}>
                          {reclamacion.asunto}
                        </h4>

                        {/* Meta */}
                        <p className={`text-sm mb-3 ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                          <strong>{reclamacion.nombre_completo}</strong> • {reclamacion.branch?.name} •{" "}
                          <span className="capitalize">{reclamacion.tipo_reclamo}</span>
                        </p>

                        {/* Executive */}
                        <div className="flex items-center gap-2 mb-3">
                          <img
                            src={`http://almacen.fastnetperu.com.pe/api/image_person/${reclamacion.ejecutive?.relative_id}/full`}
                            alt={reclamacion.ejecutive?.name}
                            className={`w-7 h-7 rounded-full object-cover border ${darkMode ? "border-slate-600" : "border-slate-200"}`}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.onerror = null // Prevent infinite loop
                              target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(reclamacion.ejecutive?.name + " " + reclamacion.ejecutive?.lastname)}&background=random&color=fff&size=28`
                            }}
                          />
                          <span className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                            Atendido por {reclamacion.ejecutive?.name} {reclamacion.ejecutive?.lastname}
                          </span>
                        </div>

                        {/* Description */}
                        <p className={`text-sm line-clamp-2 mb-2 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                          {reclamacion.descripcion}
                        </p>

                        {/* Date */}
                        <p
                          className={`text-xs flex items-center gap-1 ${darkMode ? "text-slate-500" : "text-slate-400"}`}
                        >
                          <Icons.Calendar className="w-3.5 h-3.5" />
                          {new Date(reclamacion.created_at || reclamacion.fecha_creacion || "").toLocaleDateString(
                            "es-ES",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </p>
                      </div>

                      {/* Action Button */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedReclamacion(reclamacion)}
                        className={darkMode ? "border-slate-600 text-slate-300 hover:bg-slate-800" : ""}
                      >
                        <Icons.Eye className="w-4 h-4 mr-1" />
                        {userData ? "Gestionar" : "Ver detalle"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={darkMode ? "border-slate-600 text-slate-300 hover:bg-slate-800" : ""}
                >
                  Anterior
                </Button>
                <span className={`px-4 py-2 text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                  Pagina {currentPage} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={darkMode ? "border-slate-600 text-slate-300 hover:bg-slate-800" : ""}
                >
                  Siguiente
                </Button>
              </div>
            )}
          </section>
        )}
      </main>

      {/* Modal */}
      {selectedReclamacion && (
        <Modal show={true} onClose={() => setSelectedReclamacion(null)} title="Detalle de Reclamacion" size="lg">
          {userData ? (
            <GestionReclamacionModal
              reclamacion={selectedReclamacion}
              onActualizar={() => {
                fetchReclamaciones()
                fetchEstadisticas()
                setSelectedReclamacion(null)
              }}
            />
          ) : (
            <DetalleReclamacionModal reclamacion={selectedReclamacion} />
          )}
        </Modal>
      )}

      <ChatbotWidget webhookUrl="https://paneln8n.fastnetperu.com.pe/webhook/reclamos" darkMode={darkMode} />
      {/* Add the Footer component */}
      <Footer darkMode={darkMode} />
    </div>
  )
}
