"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Badge } from "./ui/badge"
import DetalleReclamacion from "./DetalleReclamacion"

interface Reclamacion {
  id: number
  numero_reclamacion: string
  nombre_completo: string
  correo_electronico: string
  telefono: string
  zona: string
  branch: {
    id: number
    name: string
    correlative: string
  }
  ejecutive: {
    id: number
    name: string
    lastname: string
    relative_id: string
  }
  tipo_reclamo: string
  asunto: string
  descripcion: string
  estado: "pendiente" | "en_proceso" | "resuelto"
  created_at: string
  updated_at: string
  archivos?: {
    id: number
    nombre_original: string
    ruta: string
    tipo: "imagen" | "documento"
    fecha_creacion: string
  }[]
}

interface ListaReclamacionesProps {
  onVolver: () => void
}

// Icons
const Icons = {
  Search: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  ),
  Eye: ({ className = "w-5 h-5" }) => (
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
  ArrowLeft: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  ),
  FileText: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  ),
  Calendar: ({ className = "w-5 h-5" }) => (
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

export default function ListaReclamaciones({ onVolver }: ListaReclamacionesProps) {
  const [reclamaciones, setReclamaciones] = useState<Reclamacion[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroEstado, setFiltroEstado] = useState("all")
  const [selectedReclamacion, setSelectedReclamacion] = useState<Reclamacion | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchReclamaciones()
  }, [currentPage])

  const fetchReclamaciones = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/reclamaciones?page=${currentPage}`)
      const data = await response.json()
      setReclamaciones(data.data || [])
      setTotalPages(data.last_page || 1)
    } catch (error) {
      console.error("Error fetching reclamaciones:", error)
    } finally {
      setLoading(false)
    }
  }

  const getEstadoVariant = (estado: string): "pending" | "process" | "resolved" => {
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
    return textos[estado] || estado
  }

  const filteredReclamaciones = reclamaciones.filter((reclamacion) => {
    const term = searchTerm.toLowerCase()
    const ejecutivoNombre =
      `${reclamacion.ejecutive?.name ?? ""} ${reclamacion.ejecutive?.lastname ?? ""}`.toLowerCase()
    const matchesSearch =
      reclamacion.numero_reclamacion?.toLowerCase().includes(term) ||
      reclamacion.nombre_completo.toLowerCase().includes(term) ||
      ejecutivoNombre.includes(term) ||
      reclamacion.asunto.toLowerCase().includes(term)

    const matchesEstado = filtroEstado === "all" || reclamacion.estado === filtroEstado

    return matchesSearch && matchesEstado
  })

  if (selectedReclamacion) {
    return (
      <DetalleReclamacion
        reclamacion={selectedReclamacion}
        onVolver={() => setSelectedReclamacion(null)}
        onActualizar={fetchReclamaciones}
      />
    )
  }

  return (
    <div className="min-h-screen bg-[var(--surface-secondary)] p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Lista de Reclamaciones</h1>
            <p className="text-[var(--text-tertiary)]">Gestiona y revisa todas las reclamaciones recibidas</p>
          </div>
          <Button onClick={onVolver} variant="outline">
            <Icons.ArrowLeft className="w-4 h-4" />
            Volver al formulario
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                <Input
                  placeholder="Buscar por número, nombre o asunto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="sm:w-48">
                <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="pendiente">Pendiente</SelectItem>
                    <SelectItem value="en_proceso">En Proceso</SelectItem>
                    <SelectItem value="resuelto">Resuelto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-5">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 space-y-3">
                      <div className="h-5 w-1/4 bg-[var(--surface-tertiary)] rounded animate-pulse" />
                      <div className="h-6 w-1/2 bg-[var(--surface-tertiary)] rounded animate-pulse" />
                      <div className="h-4 w-3/4 bg-[var(--surface-tertiary)] rounded animate-pulse" />
                    </div>
                    <div className="h-8 w-24 bg-[var(--surface-tertiary)] rounded animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredReclamaciones.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Icons.FileText className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">No se encontraron reclamaciones</h3>
              <p className="text-[var(--text-tertiary)]">
                {searchTerm || filtroEstado !== "all"
                  ? "Intenta ajustar los filtros de búsqueda"
                  : "Aún no hay reclamaciones registradas"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredReclamaciones.map((reclamacion) => (
              <Card key={reclamacion.id} className="hover:border-[var(--brand-primary)] transition-colors">
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex-1">
                      {/* Badges */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="inline-flex px-2 py-0.5 text-xs font-semibold font-mono bg-[var(--brand-primary-light)] text-[var(--brand-primary)] rounded">
                          {reclamacion.numero_reclamacion}
                        </span>
                        <Badge variant={getEstadoVariant(reclamacion.estado)}>
                          {getEstadoTexto(reclamacion.estado)}
                        </Badge>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">{reclamacion.asunto}</h3>

                      {/* Meta */}
                      <p className="text-sm text-[var(--text-secondary)] mb-3">
                        <strong>{reclamacion.nombre_completo}</strong> • {reclamacion.branch?.name} •{" "}
                        <span className="capitalize">{reclamacion.tipo_reclamo}</span>
                      </p>

                      {/* Executive */}
                      <div className="flex items-center gap-2 mb-2">
                        <img
                          src={`http://almacen.fastnetperu.com.pe/api/image_person/${reclamacion.ejecutive?.relative_id}/full`}
                          alt={reclamacion.ejecutive?.name}
                          className="w-7 h-7 rounded-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(reclamacion.ejecutive?.name + " " + reclamacion.ejecutive?.lastname)}&background=random&color=fff&size=32`
                          }}
                        />
                        <span className="text-sm text-[var(--text-tertiary)]">
                          Atendido por {reclamacion.ejecutive?.name} {reclamacion.ejecutive?.lastname}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-[var(--text-tertiary)] line-clamp-2">{reclamacion.descripcion}</p>

                      {/* Attachments */}
                      {reclamacion.archivos && reclamacion.archivos.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {reclamacion.archivos.map((archivo) =>
                            archivo.tipo === "imagen" ? (
                              <a
                                key={archivo.id}
                                href={`/api/archivos/${archivo.id}?download=1`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <img
                                  src={`/api/archivos/${archivo.id}`}
                                  alt={archivo.nombre_original}
                                  className="w-14 h-14 object-cover rounded border border-[var(--border-default)]"
                                />
                              </a>
                            ) : (
                              <a
                                key={archivo.id}
                                href={`/api/archivos/${archivo.id}?download=1`}
                                className="text-sm text-[var(--brand-primary)] hover:underline"
                              >
                                {archivo.nombre_original}
                              </a>
                            ),
                          )}
                        </div>
                      )}

                      {/* Date */}
                      <p className="text-xs text-[var(--text-muted)] mt-3 flex items-center gap-1">
                        <Icons.Calendar className="w-3.5 h-3.5" />
                        {new Date(reclamacion.created_at).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>

                    {/* Action */}
                    <div className="sm:ml-4 flex-shrink-0">
                      <Button variant="outline" size="sm" onClick={() => setSelectedReclamacion(reclamacion)}>
                        <Icons.Eye className="w-4 h-4" />
                        Ver detalle
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <span className="px-4 py-2 text-sm text-[var(--text-tertiary)]">
              Página {currentPage} de {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
