"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Badge } from "./ui/badge"
import { Search, Eye, Filter } from "lucide-react"
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
    tipo: 'imagen' | 'documento'
    fecha_creacion: string
  }[]
}

interface ListaReclamacionesProps {
  onVolver: () => void
}

export default function ListaReclamaciones({ onVolver }: ListaReclamacionesProps) {
  const [reclamaciones, setReclamaciones] = useState<Reclamacion[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroEstado, setFiltroEstado] = useState("pendiente") // Updated default value
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

  const getEstadoBadge = (estado: string) => {
    const variants = {
      pendiente: "bg-yellow-100 text-yellow-800",
      en_proceso: "bg-blue-100 text-blue-800",
      resuelto: "bg-green-100 text-green-800",
    }
    return variants[estado as keyof typeof variants] || "bg-gray-100 text-gray-800"
  }

  const getEstadoTexto = (estado: string) => {
    const textos = {
      pendiente: "Pendiente",
      en_proceso: "En Proceso",
      resuelto: "Resuelto",
    }
    return textos[estado as keyof typeof textos] || estado
  }

  const filteredReclamaciones = reclamaciones.filter((reclamacion) => {
    const term = searchTerm.toLowerCase()
    const ejecutivoNombre = `${reclamacion.ejecutive?.name ?? ""} ${reclamacion.ejecutive?.lastname ?? ""}`.toLowerCase()
    const matchesSearch =
      reclamacion.numero_reclamacion.toLowerCase().includes(term) ||
      reclamacion.nombre_completo.toLowerCase().includes(term) ||
      ejecutivoNombre.includes(term) ||
      reclamacion.asunto.toLowerCase().includes(term)

    const matchesEstado = filtroEstado === "" || reclamacion.estado === filtroEstado

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
    <div className="space-y-6">
      {/* Header con botón volver */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lista de Reclamaciones</h1>
          <p className="text-gray-600">Gestiona y revisa todas las reclamaciones recibidas</p>
        </div>
        <Button onClick={onVolver} variant="outline">
          ← Volver al formulario
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por número, nombre o asunto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendiente">Todos los estados</SelectItem>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="en_proceso">En Proceso</SelectItem>
                  <SelectItem value="resuelto">Resuelto</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de reclamaciones */}
      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredReclamaciones.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron reclamaciones</h3>
            <p className="text-gray-600">
              {searchTerm || filtroEstado
                ? "Intenta ajustar los filtros de búsqueda"
                : "Aún no hay reclamaciones registradas"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredReclamaciones.map((reclamacion) => (
            <Card key={reclamacion.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-sm text-gray-600">{reclamacion.numero_reclamacion}</span>
                      <Badge className={getEstadoBadge(reclamacion.estado)}>{getEstadoTexto(reclamacion.estado)}</Badge>
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{reclamacion.asunto}</h3>
                    <p className="text-gray-600 mb-2">
                      <strong>{reclamacion.nombre_completo}</strong> •  {reclamacion.branch?.name} • {reclamacion.tipo_reclamo}
                    </p>
                     <div className="flex items-center gap-2 mb-2">
                      <img
                        src={`http://almacen.fastnetperu.com.pe/api/image_person/${reclamacion.ejecutive?.relative_id}/full`}
                        alt={reclamacion.ejecutive?.name}
                        className="w-8 h-8 rounded-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(reclamacion.ejecutive?.name + ' ' + reclamacion.ejecutive?.lastname)}&background=random&color=fff&size=32`
                        }}
                      />
                      <span className="text-sm text-gray-500">
                        Atendido por {reclamacion.ejecutive?.name} {reclamacion.ejecutive?.lastname}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm line-clamp-2">{reclamacion.descripcion}</p>
                 {reclamacion.archivos && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {reclamacion.archivos.map((archivo) => (
                          archivo.tipo === 'imagen' ? (
                          <a
                              key={archivo.id}
                              href={`/api/archivos/${archivo.id}?download=1`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <img
                                src={`/api/archivos/${archivo.id}`}
                                alt={archivo.nombre_original}
                                className="w-16 h-16 object-cover rounded border"
                              />
                            </a>
                          ) : (
                          <a
                              key={archivo.id}
                              href={`/api/archivos/${archivo.id}?download=1`}
                              className="text-blue-600 underline text-sm"
                            >
                              {archivo.nombre_original}
                            </a>
                          )
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      Creado:{" "}
                      {new Date(reclamacion.created_at).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedReclamacion(reclamacion)}
                      className="flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Ver detalle
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <span className="flex items-center px-4 py-2 text-sm text-gray-600">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  )
}
