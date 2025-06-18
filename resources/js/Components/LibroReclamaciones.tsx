"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Badge } from "./ui/badge"
import DetalleReclamacion from "./DetalleReclamacion"
import type { FormData, Estadisticas, Reclamacion, Sucursal,  Ejecutivo, Window} from "../types"

// Obtener sucursales desde window (pasadas desde PHP)
declare global {
    interface Window {
        sucursalesData: Sucursal[]
    }
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
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState<any>({})
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroEstado, setFiltroEstado] = useState("")
  const [selectedReclamacion, setSelectedReclamacion] = useState<Reclamacion | null>(null)

  useEffect(() => {
    // Cargar sucursales desde window (pasadas desde PHP)
    if (window.sucursalesData) {
      setSucursales(window.sucursalesData)
    }

    fetchEstadisticas()
    fetchReclamaciones()
  }, [])

  const fetchEjecutivos = async (sucursalId: number) => {
    setLoadingEjecutivos(true)
    try {
      const response = await fetch(`/api/ejecutivos/${sucursalId}`)
      const data = await response.json()
      if (data.status === 200) {
        setEjecutivos(data.data)
      } else {
        console.error("Error fetching ejecutivos:", data.message)
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
      const response = await fetch("/api/reclamaciones/estadisticas")
      const data = await response.json()
      setEstadisticas(data)
    } catch (error) {
      console.error("Error fetching estadisticas:", error)
    }
  }

  const fetchReclamaciones = async () => {
    setLoadingReclamaciones(true)
    try {
      const response = await fetch("/api/reclamaciones")
      const data = await response.json()
      setReclamaciones(data.data || [])
    } catch (error) {
      console.error("Error fetching reclamaciones:", error)
    } finally {
      setLoadingReclamaciones(false)
    }
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    if (errors[field]) {
      setErrors((prev: any) => ({
        ...prev,
        [field]: undefined,
      }))
    }
  }

  const handleSucursalSelect = (sucursal: Sucursal) => {
    setSelectedSucursal(sucursal)
    setSelectedEjecutivo(null) // Reset ejecutivo cuando cambia sucursal
    setEjecutivos([]) // Limpiar ejecutivos anteriores
    setFormData((prev) => ({
      ...prev,
      sucursal_id: sucursal.id.toString(),
      ejecutivo_id: "", // Reset ejecutivo_id
    }))

    // Cargar ejecutivos de la sucursal seleccionada
    fetchEjecutivos(sucursal.id)
  }

  const handleEjecutivoSelect = (ejecutivo: Ejecutivo) => {
    setSelectedEjecutivo(ejecutivo)
    setFormData((prev) => ({
      ...prev,
      ejecutivo_id: ejecutivo.id.toString(),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      const response = await fetch("/api/reclamaciones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
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
        fetchEstadisticas()
        fetchReclamaciones()
        setTimeout(() => setSuccess(false), 5000)
      } else {
        setErrors(data.errors || {})
      }
    } catch (error) {
      console.error("Error:", error)
      setErrors({ general: "Error al enviar la reclamación" })
    } finally {
      setLoading(false)
    }
  }

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return "pending"
      case "en_proceso":
        return "process"
      case "resuelto":
        return "resolved"
      default:
        return "primary"
    }
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
    const matchesSearch =
      reclamacion.numero_reclamacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reclamacion.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reclamacion.asunto.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesEstado = filtroEstado === "" || reclamacion.estado === filtroEstado

    return matchesSearch && matchesEstado
  })

  if (selectedReclamacion) {
    return (
      <DetalleReclamacion
        reclamacion={selectedReclamacion}
        onVolver={() => setSelectedReclamacion(null)}
        onActualizar={() => {
          fetchReclamaciones()
          fetchEstadisticas()
        }}
      />
    )
  }

  return (
    <div className="min-vh-100" style={{ background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)" }}>
      {/* Header Profesional */}
      <header className="custom-header">
        <div className="container-fluid">
          <div className="row justify-content-center py-4">
            <div className="col-auto">
              <div className="logo-container d-flex align-items-center">
                <div className="d-flex me-3">
                  <i className="bi bi-broadcast me-2 fs-4"></i>
                  <i className="bi bi-wifi me-2 fs-4"></i>
                  <i className="bi bi-tv fs-4"></i>
                </div>
                <div className="border-start border-light ps-3">
                  <h1 className="text-white mb-0 fs-3 fw-bold">FastNet Perú</h1>
                  <p className="text-white-50 mb-0 small">TV • Internet • IPTV</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container-fluid py-4">
        {/* Mensaje de éxito */}
        {success && (
          <div className="row justify-content-center mb-4">
            <div className="col-lg-8">
              <div className="alert alert-custom-success fade-in" role="alert">
                <div className="text-center">
                  <i className="bi bi-check-circle-fill fs-1 text-success mb-2"></i>
                  <h4 className="alert-heading">¡Reclamo enviado exitosamente!</h4>
                  <p className="mb-0">Hemos recibido su reclamo y será procesado en breve.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Título principal */}
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold text-dark mb-3">Libro de Reclamaciones</h1>
          <p className="lead text-muted">Registra tu reclamo sobre nuestros servicios de TV, Internet e IPTV</p>
        </div>

        {/* Botones de sucursales */}
        <div className="row justify-content-center mb-5">
          <div className="col-12">
            <div className="d-flex flex-wrap gap-3 justify-content-center">
              {sucursales.map((sucursal) => (
                <Button
                  key={sucursal.id}
                  variant={selectedSucursal?.id === sucursal.id ? "primary" : "outline"}
                  onClick={() => handleSucursalSelect(sucursal)}
                  className={`position-relative ${selectedSucursal?.id === sucursal.id ? "shadow" : ""}`}
                  style={{
                    borderColor: sucursal.color,
                    color: selectedSucursal?.id === sucursal.id ? "white" : sucursal.color,
                    backgroundColor: selectedSucursal?.id === sucursal.id ? sucursal.color : "transparent",
                  }}
                >
                  <span className="position-relative">{sucursal.correlative}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Información de sucursal seleccionada */}
        {selectedSucursal && (
          <div className="row justify-content-center mb-4">
            <div className="col-lg-8">
              <Card className="border-0" style={{ borderLeft: `4px solid ${selectedSucursal.color}` }}>
                <CardContent className="p-3">
                  <div className="row align-items-center">
                    <div className="col-md-8">
                      <h5 className="mb-1 fw-bold" style={{ color: selectedSucursal.color }}>
                        {selectedSucursal.name}
                      </h5>
                      <p className="text-muted mb-0 small">
                        <i className="bi bi-geo-alt me-1"></i>
                        {selectedSucursal.address}
                      </p>
                    </div>
                    <div className="col-md-4 text-md-end">
                      <span className="badge bg-light text-dark border">{selectedSucursal.ubigeo}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Ejecutivos de la sucursal seleccionada */}
        {selectedSucursal && (
          <div className="row justify-content-center mb-5">
            <div className="col-lg-10">
              <Card className="fade-in">
                <CardContent className="p-4">
                  <div className="d-flex align-items-center mb-4">
                    <div className="icon-circle icon-circle-primary me-3">
                      <i className="bi bi-people-fill"></i>
                    </div>
                    <div>
                      <h3 className="h5 mb-1 fw-bold">Ejecutivos de Atención</h3>
                      <p className="text-muted mb-0">Seleccione el ejecutivo que le atendió</p>
                    </div>
                  </div>

                  {loadingEjecutivos ? (
                    <div className="text-center py-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando ejecutivos...</span>
                      </div>
                      <p className="text-muted mt-2">Cargando ejecutivos...</p>
                    </div>
                  ) : ejecutivos.length === 0 ? (
                    <div className="text-center py-4">
                      <i className="bi bi-person-x text-muted" style={{ fontSize: "3rem" }}></i>
                      <h5 className="text-muted mt-3">No hay ejecutivos disponibles</h5>
                      <p className="text-muted">En esta sucursal no hay ejecutivos registrados</p>
                    </div>
                  ) : (
                    <div className="row g-3">
                      {ejecutivos.map((ejecutivo) => (
                        <div key={ejecutivo.id} className="col-md-6 col-lg-4">
                          <Card
                            className={`cursor-pointer h-100 ${
                              selectedEjecutivo?.id === ejecutivo.id ? "border-primary shadow" : ""
                            }`}
                            onClick={() => handleEjecutivoSelect(ejecutivo)}
                            style={{
                              borderColor: selectedEjecutivo?.id === ejecutivo.id ? selectedSucursal.color : undefined,
                              backgroundColor:
                                selectedEjecutivo?.id === ejecutivo.id ? `${selectedSucursal.color}10` : undefined,
                            }}
                          >
                            <CardContent className="p-3 text-center">
                              <div className="position-relative mb-3">
                                <img
                                  src={ejecutivo.image_url || "/placeholder.svg"}
                                  alt={ejecutivo.full_name}
                                  className="rounded-circle border border-3"
                                  style={{
                                    width: "80px",
                                    height: "80px",
                                    objectFit: "cover",
                                    borderColor:
                                      selectedEjecutivo?.id === ejecutivo.id ? selectedSucursal.color : "#e2e8f0",
                                  }}
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement
                                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(ejecutivo.full_name)}&background=random&color=fff&size=80`
                                  }}
                                />
                                {selectedEjecutivo?.id === ejecutivo.id && (
                                  <div
                                    className="position-absolute top-0 end-0 rounded-circle d-flex align-items-center justify-content-center"
                                    style={{
                                      width: "24px",
                                      height: "24px",
                                      backgroundColor: selectedSucursal.color,
                                      transform: "translate(25%, -25%)",
                                    }}
                                  >
                                    <i className="bi bi-check text-white" style={{ fontSize: "12px" }}></i>
                                  </div>
                                )}
                              </div>
                              <h6 className="fw-bold mb-1">{ejecutivo.full_name}</h6>
                              {/* <p className="text-muted small mb-2">
                                {ejecutivo.doc_type}: {ejecutivo.doc_number}
                              </p> */}
                              {/* {ejecutivo.phone && (
                                <p className="text-muted small mb-1">
                                  <i className="bi bi-telephone me-1"></i>
                                  {ejecutivo.phone}
                                </p>
                              )} */}
                              {/* {ejecutivo.email && (
                                <p className="text-muted small mb-0">
                                  <i className="bi bi-envelope me-1"></i>
                                  {ejecutivo.email}
                                </p>
                              )} */}
                            </CardContent>
                          </Card>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        <div className="row g-4 mb-5">
          {/* Formulario */}
          <div className="col-lg-8">
            <Card className="fade-in">
              <CardContent className="p-4">
                <div className="d-flex align-items-center mb-4">
                  <div className="icon-circle icon-circle-primary me-3">
                    <i className="bi bi-telephone-fill"></i>
                  </div>
                  <div>
                    <h2 className="h4 mb-1 fw-bold">Formulario de Reclamo</h2>
                    <p className="text-muted mb-0">Complete los datos para registrar su reclamo</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="row g-3 mb-4">
                    <div className="col-md-6">
                      <Label htmlFor="nombre_completo">Nombre Completo *</Label>
                      <Input
                        id="nombre_completo"
                        value={formData.nombre_completo}
                        onChange={(e) => handleInputChange("nombre_completo", e.target.value)}
                        className={errors.nombre_completo ? "is-invalid" : ""}
                        placeholder="Ingrese su nombre completo"
                      />
                      {errors.nombre_completo && <div className="invalid-feedback">{errors.nombre_completo[0]}</div>}
                    </div>

                    <div className="col-md-6">
                      <Label htmlFor="correo_electronico">Correo Electrónico *</Label>
                      <Input
                        id="correo_electronico"
                        type="email"
                        value={formData.correo_electronico}
                        onChange={(e) => handleInputChange("correo_electronico", e.target.value)}
                        className={errors.correo_electronico ? "is-invalid" : ""}
                        placeholder="ejemplo@correo.com"
                      />
                      {errors.correo_electronico && (
                        <div className="invalid-feedback">{errors.correo_electronico[0]}</div>
                      )}
                    </div>

                    <div className="col-md-6">
                      <Label htmlFor="telefono">Teléfono *</Label>
                      <Input
                        id="telefono"
                        value={formData.telefono}
                        onChange={(e) => handleInputChange("telefono", e.target.value)}
                        className={errors.telefono ? "is-invalid" : ""}
                        placeholder="999 999 999"
                      />
                      {errors.telefono && <div className="invalid-feedback">{errors.telefono[0]}</div>}
                    </div>

                    <div className="col-md-6">
                      <Label htmlFor="zona">Zona de Servicio *</Label>
                      <Select value={formData.zona} onValueChange={(value) => handleInputChange("zona", value)}>
                        <SelectTrigger className={errors.zona ? "is-invalid" : ""}>
                          <SelectValue placeholder="Seleccionar zona de servicio" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="zona1">Zona Centro</SelectItem>
                          <SelectItem value="zona2">Zona Norte</SelectItem>
                          <SelectItem value="zona3">Zona Sur</SelectItem>
                          <SelectItem value="zona4">Zona Este</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.zona && <div className="invalid-feedback d-block">{errors.zona[0]}</div>}
                    </div>

                    <div className="col-md-6">
                      <Label htmlFor="tipo_reclamo">Tipo de Reclamo *</Label>
                      <Select
                        value={formData.tipo_reclamo}
                        onValueChange={(value) => handleInputChange("tipo_reclamo", value)}
                      >
                        <SelectTrigger className={errors.tipo_reclamo ? "is-invalid" : ""}>
                          <SelectValue placeholder="Seleccionar tipo de reclamo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="internet">Problemas de Internet</SelectItem>
                          <SelectItem value="tv_cable">TV por Cable</SelectItem>
                          <SelectItem value="iptv">Servicio IPTV</SelectItem>
                          <SelectItem value="facturacion">Facturación</SelectItem>
                          <SelectItem value="atencion_cliente">Atención al Cliente</SelectItem>
                          <SelectItem value="instalacion">Instalación</SelectItem>
                          <SelectItem value="otros">Otros</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.tipo_reclamo && <div className="invalid-feedback d-block">{errors.tipo_reclamo[0]}</div>}
                    </div>

                    <div className="col-md-6">
                      <Label htmlFor="asunto">Asunto *</Label>
                      <Input
                        id="asunto"
                        value={formData.asunto}
                        onChange={(e) => handleInputChange("asunto", e.target.value)}
                        className={errors.asunto ? "is-invalid" : ""}
                        placeholder="Resumen del problema"
                      />
                      {errors.asunto && <div className="invalid-feedback">{errors.asunto[0]}</div>}
                    </div>
                  </div>

                  <div className="mb-4">
                    <Label htmlFor="descripcion">Descripción del Reclamo *</Label>
                    <Textarea
                      id="descripcion"
                      rows={4}
                      value={formData.descripcion}
                      onChange={(e) => handleInputChange("descripcion", e.target.value)}
                      className={errors.descripcion ? "is-invalid" : ""}
                      placeholder="Describe detalladamente el problema con nuestros servicios de telecomunicaciones..."
                    />
                    {errors.descripcion && <div className="invalid-feedback">{errors.descripcion[0]}</div>}
                  </div>

                  {errors.general && (
                    <div className="alert alert-custom-danger mb-4" role="alert">
                      {errors.general}
                    </div>
                  )}

                  <div className="d-grid">
                    <Button
                      type="submit"
                      disabled={loading || !selectedSucursal || !selectedEjecutivo}
                      variant="primary"
                      size="lg"
                    >
                      {loading ? (
                        <>
                          <span className="spinner-custom me-2"></span>
                          Enviando...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-send me-2"></i>
                          Enviar Reclamo
                        </>
                      )}
                    </Button>
                    {(!selectedSucursal || !selectedEjecutivo) && (
                      <small className="text-muted text-center mt-2">
                        * Seleccione una sucursal y un ejecutivo para continuar
                      </small>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Panel de estadísticas */}
          <div className="col-lg-4">
            <div className="row g-3">
              <div className="col-12">
                <Card className="fade-in">
                  <CardContent className="p-4">
                    <div className="d-flex align-items-center mb-4">
                      <div className="icon-circle icon-circle-secondary me-3">
                        <i className="bi bi-graph-up"></i>
                      </div>
                      <div>
                        <h3 className="h5 mb-1 fw-bold">Estadísticas</h3>
                        <p className="text-muted mb-0 small">Estado de reclamos</p>
                      </div>
                    </div>

                    <div className="row g-3">
                      <div className="col-6">
                        <div className="stats-card bg-danger bg-opacity-10 border-danger">
                          <div className="stats-number text-danger">{estadisticas.total}</div>
                          <div className="stats-label text-danger">Total</div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="stats-card bg-success bg-opacity-10 border-success">
                          <div className="stats-number text-success">{estadisticas.resueltos}</div>
                          <div className="stats-label text-success">Resueltos</div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="stats-card bg-warning bg-opacity-10 border-warning">
                          <div className="stats-number text-warning">{estadisticas.pendientes}</div>
                          <div className="stats-label text-warning">Pendientes</div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="stats-card bg-primary bg-opacity-10 border-primary">
                          <div className="stats-number text-primary">{estadisticas.en_proceso}</div>
                          <div className="stats-label text-primary">En Proceso</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="col-12">
                <Card className="fade-in">
                  <CardContent className="p-4">
                    <h4 className="h6 fw-bold mb-3 d-flex align-items-center">
                      <i className="bi bi-tv me-2 text-primary"></i>
                      Tiempo de Respuesta
                    </h4>
                    <div className="progress progress-custom mb-3">
                      <div
                        className="progress-bar progress-bar-custom"
                        role="progressbar"
                        style={{ width: "75%" }}
                        aria-valuenow={75}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      ></div>
                    </div>
                    <p className="small text-muted mb-0">
                      <strong>Promedio:</strong> {estadisticas.tiempo_promedio}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Información del ejecutivo seleccionado */}
              {selectedEjecutivo && (
                <div className="col-12">
                  <Card className="fade-in">
                    <CardContent className="p-4">
                      <h4 className="h6 fw-bold mb-3 d-flex align-items-center">
                        <i className="bi bi-person-check me-2 text-success"></i>
                        Ejecutivo Seleccionado
                      </h4>
                      <div className="text-center">
                        <img
                          src={selectedEjecutivo.image_url || "/placeholder.svg"}
                          alt={selectedEjecutivo.full_name}
                          className="rounded-circle border border-3 mb-2"
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "cover",
                            borderColor: selectedSucursal?.color || "#e2e8f0",
                          }}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedEjecutivo.full_name)}&background=random&color=fff&size=60`
                          }}
                        />
                        <h6 className="fw-bold mb-1">{selectedEjecutivo.full_name}</h6>
                        <p className="text-muted small mb-0">
                          {selectedEjecutivo.doc_type}: {selectedEjecutivo.doc_number}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Lista de Reclamaciones */}
        <div className="row">
          <div className="col-12">
            <div className="mb-4">
              <h2 className="h3 fw-bold text-dark mb-2">Reclamaciones Registradas</h2>
              <p className="text-muted">Historial de reclamos y su estado actual</p>
            </div>

            {/* Filtros */}
            <Card className="mb-4">
              <CardContent className="p-3">
                <div className="row g-3 align-items-end">
                  <div className="col-md-8">
                    <div className="position-relative">
                      <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                      <Input
                        placeholder="Buscar por número, nombre o asunto..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="ps-5"
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                      <SelectTrigger>
                        <i className="bi bi-funnel me-2"></i>
                        <SelectValue placeholder="Todos los estados" />
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

            {/* Lista de reclamaciones */}
            {loadingReclamaciones ? (
              <div className="row g-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="col-12">
                    <Card className="pulse">
                      <CardContent className="p-4">
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="flex-grow-1">
                            <div className="bg-light rounded mb-2" style={{ height: "20px", width: "25%" }}></div>
                            <div className="bg-light rounded mb-2" style={{ height: "24px", width: "50%" }}></div>
                            <div className="bg-light rounded" style={{ height: "16px", width: "75%" }}></div>
                          </div>
                          <div className="bg-light rounded" style={{ height: "32px", width: "80px" }}></div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            ) : filteredReclamaciones.length === 0 ? (
              <Card>
                <CardContent className="p-5 text-center">
                  <i className="bi bi-tv text-muted" style={{ fontSize: "4rem" }}></i>
                  <h3 className="h5 fw-bold text-dark mt-3 mb-2">No se encontraron reclamaciones</h3>
                  <p className="text-muted">
                    {searchTerm || filtroEstado
                      ? "Intenta ajustar los filtros de búsqueda"
                      : "Aún no hay reclamaciones registradas"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="row g-3">
                {filteredReclamaciones.map((reclamacion) => (
                  <div key={reclamacion.id} className="col-12">
                    <Card className="cursor-pointer">
                      <CardContent className="p-4">
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="flex-grow-1">
                            <div className="d-flex align-items-center gap-3 mb-3">
                              <span className="badge bg-primary bg-opacity-10 text-primary border border-primary font-monospace">
                                {reclamacion.numero_reclamacion}
                              </span>
                              <Badge variant={getEstadoBadge(reclamacion.estado)}>
                                {getEstadoTexto(reclamacion.estado)}
                              </Badge>
                            </div>
                            <h3 className="h5 fw-bold text-dark mb-2">{reclamacion.asunto}</h3>
                            <p className="text-muted mb-2">
                              <strong>{reclamacion.nombre_completo}</strong> • {reclamacion.zona} •{" "}
                              <span className="text-capitalize">{reclamacion.tipo_reclamo}</span>
                            </p>
                            <p className="text-muted small text-truncate-2 mb-3">{reclamacion.descripcion}</p>
                            <p className="text-muted small mb-0">
                              <i className="bi bi-calendar3 me-1"></i>
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
                          <div className="ms-3">
                            <Button variant="outline" size="sm" onClick={() => setSelectedReclamacion(reclamacion)}>
                              <i className="bi bi-eye me-1"></i>
                              Ver detalle
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
