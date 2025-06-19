"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Badge } from "./ui/badge"
import { ArrowLeft, Save, Mail, Phone, MapPin, Calendar, User, Signal, Wifi, Tv } from "./ui/icons"

interface Reclamacion {
  id: number
  numero_reclamacion?: string
  nombre_completo: string
  correo_electronico: string
  telefono: string
  zona: string
  tipo_reclamo: string
  asunto: string
  descripcion: string
  estado: string
  respuesta?: string
  fecha_respuesta?: string
  created_at?: string
  updated_at?: string
  fecha_creacion?: string
}

interface DetalleReclamacionProps {
  reclamacion: Reclamacion
  onVolver: () => void
  onActualizar: () => void
}

export default function DetalleReclamacion({ reclamacion, onVolver, onActualizar }: DetalleReclamacionProps) {
  const [estado, setEstado] = useState(reclamacion.estado)
  const [respuesta, setRespuesta] = useState(reclamacion.respuesta || "")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const getEstadoBadge = (estado: string) => {
    const variants = {
      pendiente: "bg-yellow-100 text-yellow-800 border-yellow-200",
      en_proceso: "bg-blue-100 text-blue-800 border-blue-200",
      resuelto: "bg-green-100 text-green-800 border-green-200",
    }
    return variants[estado.toLowerCase() as keyof typeof variants] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  const getEstadoTexto = (estado: string) => {
    const textos = {
      pendiente: "Pendiente",
      en_proceso: "En Proceso",
      resuelto: "Resuelto",
    }
     return textos[estado.toLowerCase() as keyof typeof textos] || estado
  }

  const handleEstadoChange = (value: string) => {
    if (value === "pendiente" || value === "en_proceso" || value === "resuelto") {
      setEstado(value)
    }
  }

  const handleActualizar = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/reclamaciones/${reclamacion.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          estado,
          respuesta,
        }),
      })

      if (response.ok) {
        setSuccess(true)
        onActualizar()
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch (error) {
      console.error("Error updating reclamacion:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Header Profesional */}
      <header className="bg-white shadow-lg border-b-4 border-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg shadow-lg">
                <div className="flex space-x-1">
                  <Signal className="w-6 h-6" />
                  <Wifi className="w-6 h-6" />
                  <Tv className="w-6 h-6" />
                </div>
                <div className="border-l border-blue-300 pl-4">
                  <h1 className="text-2xl font-bold">TeleConnect</h1>
                  <p className="text-xs text-blue-100">TV • Internet • IPTV</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            onClick={onVolver}
            className="flex items-center gap-2 border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Detalle de Reclamación</h1>
            <p className="text-blue-600 font-mono text-lg">
              {reclamacion.numero_reclamacion || `#${reclamacion.id}`}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Información del cliente */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  Información del Cliente
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <User className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Nombre completo</p>
                      <p className="font-bold text-gray-900">{reclamacion.nombre_completo}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Correo electrónico</p>
                      <p className="font-bold text-gray-900">{reclamacion.correo_electronico}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Teléfono</p>
                      <p className="font-bold text-gray-900">{reclamacion.telefono}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Zona de servicio</p>
                      <p className="font-bold text-gray-900">{reclamacion.zona}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detalles de la reclamación */}
            <Card className="shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                    <Tv className="w-4 h-4 text-white" />
                  </div>
                  Detalles de la Reclamación
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700 font-medium mb-1">Tipo de reclamo</p>
                    <p className="font-bold text-blue-900 capitalize">{reclamacion.tipo_reclamo}</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700 font-medium mb-1">Estado actual</p>
                    <Badge className={`${getEstadoBadge(reclamacion.estado)} border font-semibold`}>
                      {getEstadoTexto(reclamacion.estado)}
                    </Badge>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 font-medium mb-2">Asunto</p>
                  <p className="font-bold text-gray-900 text-lg">{reclamacion.asunto}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 font-medium mb-2">Descripción</p>
                  <p className="text-gray-800 leading-relaxed">{reclamacion.descripcion}</p>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500 p-4 bg-blue-50 rounded-lg">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">
                    Creado el{" "}
                    {new Date(
                      reclamacion.created_at || reclamacion.fecha_creacion || ""
                    ).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Respuesta actual */}
            {reclamacion.respuesta && (
              <Card className="shadow-xl border-0">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
                  <CardTitle className="text-xl text-green-800">Respuesta Actual</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-green-800 leading-relaxed mb-4">{reclamacion.respuesta}</p>
                    {reclamacion.fecha_respuesta && (
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <Calendar className="w-4 h-4" />
                        <span className="font-medium">
                          Respondido el{" "}
                          {new Date(reclamacion.fecha_respuesta).toLocaleDateString("es-ES", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Panel de gestión */}
          <div className="space-y-6">
            <Card className="shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
                <CardTitle className="text-xl">Gestionar Reclamación</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Estado</label>
                  <Select value={estado} onValueChange={handleEstadoChange}>
                    <SelectTrigger className="border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendiente">Pendiente</SelectItem>
                      <SelectItem value="en_proceso">En Proceso</SelectItem>
                      <SelectItem value="resuelto">Resuelto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Respuesta</label>
                  <Textarea
                    value={respuesta}
                    onChange={(e) => setRespuesta(e.target.value)}
                    rows={6}
                    placeholder="Escribe la respuesta a la reclamación..."
                    className="border-gray-300"
                  />
                </div>

                {success && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 text-sm font-medium">✓ Reclamación actualizada exitosamente</p>
                  </div>
                )}

                <Button
                  onClick={handleActualizar}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 font-semibold shadow-lg"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? "Guardando..." : "Guardar cambios"}
                </Button>
              </CardContent>
            </Card>

            {/* Información adicional */}
            <Card className="shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 border-b">
                <CardTitle className="text-xl">Información del Sistema</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4 text-sm">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 font-medium">ID de reclamación</p>
                  <p className="font-mono font-bold text-gray-900">{reclamacion.id}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 font-medium">Última actualización</p>
                  <p className="font-bold text-gray-900">
                     {new Date(
                      reclamacion.created_at || reclamacion.fecha_creacion || ""
                    ).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
