"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent } from "./ui/card"
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
// import DetalleReclamacion from "./DetalleReclamacion"
import ReactPaginate from "react-paginate"
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
//   const [success, setSuccess] = useState(false)
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

   const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    // Cargar sucursales desde window (pasadas desde PHP)
    if (window.sucursalesData) {
      setSucursales(window.sucursalesData)
    }

    fetchEstadisticas()
  }, [])

  // Obtener datos de usuario almacenados en localStorage si existen
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
    const stored = localStorage.getItem("bsTheme")
    if (stored === null) {
      setDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches)
    } else {
      setDarkMode(stored === "dark")
    }
  }, [])

   useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute("data-bs-theme", "dark")
    } else {
      document.documentElement.setAttribute("data-bs-theme", "light")
    }
    localStorage.setItem("bsTheme", darkMode ? "dark" : "light")
  }, [darkMode])

  useEffect(() => {
    fetchReclamaciones()
  }, [currentPage])


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

 const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    setImages((prev) => [...prev, ...files])
    setImagePreviews((prev) => [
      ...prev,
      ...files.map((f) => URL.createObjectURL(f)),
    ])
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

      const token = document.querySelector("meta[name=\"csrf-token\"]")?.getAttribute("content");

      const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => payload.append(key, value));
    images.forEach((f) => payload.append("images[]", f));
    documents.forEach((f) => payload.append("documents[]", f));

    try {
      const response = await fetch("/api/reclamaciones", {
        method: "POST",
        headers: {
          "X-CSRF-TOKEN": token || "",
        },
         credentials: "same-origin",
        body: payload,
      })

      const data = await response.json()
      if (response.ok) {
        // setSuccess(true)
        Swal.fire({
          icon: "success",
          title: "¡Reclamo enviado exitosamente!",
          text: data.message || "Reclamo enviado correctamente",
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
        // setTimeout(() => setSuccess(false), 5000)
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

  const getEstadoBadge = (estado: string) => {
     switch (estado.toLowerCase()) {
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
    return textos[estado.toLowerCase() as keyof typeof textos] || estado
  }

  const filteredReclamaciones = reclamaciones.filter((reclamacion) => {
    const term = searchTerm.toLowerCase()
    const ejecutivoNombre = `${reclamacion.ejecutive?.name ?? ""} ${reclamacion.ejecutive?.lastname ?? ""}`.toLowerCase()
    const matchesSearch =
    reclamacion.numero_reclamacion?.toLowerCase().includes(term) ||
    reclamacion.nombre_completo.toLowerCase().includes(term) ||
    ejecutivoNombre.includes(term) ||
    reclamacion.asunto?.toLowerCase().includes(term)

    const matchesEstado =
      filtroEstado === "" || reclamacion.estado.toLowerCase() === filtroEstado.toLowerCase()

    return matchesSearch && matchesEstado
  })

  console.log("Filtered Reclamaciones:", filteredReclamaciones)
//  if (selectedReclamacion && userData) {
//     return (
//       <DetalleReclamacion
//         reclamacion={selectedReclamacion}
//         onVolver={() => setSelectedReclamacion(null)}
//         onActualizar={() => {
//           fetchReclamaciones()
//           fetchEstadisticas()
//         }}
//       />
//     )
//   }

  return (
<div className="min-vh-100 bg-body">      {/* Header Profesional */}
        <header className="bg-primary text-white">
        <div className="container position-relative text-center py-4">
          <div className="d-inline-flex align-items-center">
            <div className="col-auto">
              <div className="logo-container d-flex align-items-center">
                {/* <div className="d-flex me-3">
                  <i className="bi bi-broadcast me-2 fs-4"></i>
                  <i className="bi bi-wifi me-2 fs-4"></i>
                  <i className="bi bi-tv fs-4"></i>
                </div> */}
                 <img
                  src="http://almacen.fastnetperu.com.pe/img/logo-light.png"
                  alt="FastNet Perú"
                  className="me-3"
                  style={{ height: "60px" }}
                />
                <div className="border-start border-light ps-3 text-start">
                    <h1 className="text-white mb-0 fs-3 fw-bold">FastNet Perú</h1>
                    <p className="text-white-50 mb-0 small">TV • Internet • IPTV</p>
                </div>
              </div>
              <button
                    className="btn mt-4 btn-sm btn-outline-light position-absolute top-0 end-0"
                    onClick={() => setDarkMode(!darkMode)}
                    type="button"
                >
                    {darkMode ? <i className="bi bi-sun-fill" /> : <i className="bi bi-moon-fill" />}
                </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container py-4">

        {/* Título principal */}
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold text-body mb-3">Libro de Reclamaciones</h1>
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
                        <span className="badge bg-body-secondary text-body border">{selectedSucursal.ubigeo}</span>                    </div>
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

                 <div className="mb-4">
                    <Label>Evidencia Fotográfica</Label>
                    <Input type="file" multiple accept="image/*" onChange={handleImageChange} />
                    <div className="mt-3 d-flex flex-wrap gap-2">
                      {imagePreviews.map((src, idx) => (
                        <div key={idx} className="position-relative">
                          <img
                            src={src}
                            alt={`img-${idx}`}
                            style={{ width: "80px", height: "80px", objectFit: "cover" }}
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="btn-close position-absolute top-0 end-0 bg-white rounded-circle"
                            style={{ transform: "translate(50%,-50%)" }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <Label>Documentos Adicionales</Label>
                    <Input type="file" multiple onChange={handleDocumentChange} />
                    <ul className="mt-2 list-unstyled">
                      {documents.map((doc, idx) => (
                        <li key={idx} className="d-flex align-items-center mb-1">
                          <span className="me-2">{doc.name}</span>
                          <button
                            type="button"
                            onClick={() => removeDocument(idx)}
                            className="btn-close"
                            aria-label="Eliminar"
                          ></button>
                        </li>
                      ))}
                    </ul>
                  </div>


                  {errors.general && (
                   <div className="alert alert-danger mb-4" role="alert">
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
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
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

                    <div className="row row-cols-2 g-3 text-center justify-content-center">
                      <div className="col-6">
                         <div className="border border-danger-subtle rounded bg-danger-subtle p-3">
                          <div className="fs-4 fw-bold text-danger-emphasis">{estadisticas.total}</div>
                          <div className="text-danger-emphasis">Total</div>
                        </div>
                      </div>
                      <div className="col-6">
                       <div className="border border-success-subtle rounded bg-success-subtle p-3">
                          <div className="fs-4 fw-bold text-success-emphasis">{estadisticas.resueltos}</div>
                          <div className="text-success-emphasis">Resueltos</div>
                        </div>
                      </div>
                      <div className="col-6">
                       <div className="border border-warning-subtle rounded bg-warning-subtle p-3">
                          <div className="fs-4 fw-bold text-warning-emphasis">{estadisticas.pendientes}</div>
                          <div className="text-warning-emphasis">Pendientes</div>
                        </div>
                      </div>
                      <div className="col-6">
                         <div className="border border-primary-subtle rounded bg-primary-subtle p-3">
                          <div className="fs-4 fw-bold text-primary-emphasis">{estadisticas.en_proceso}</div>
                          <div className="text-primary-emphasis">En Proceso</div>
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
                    <div className="progress mb-3">
                      <div
                        className="progress-bar"
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
                        {/* <p className="text-muted small mb-0">
                          {selectedEjecutivo.doc_type}: {selectedEjecutivo.doc_number}
                        </p> */}
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
              <h2 className="h3 fw-bold text-body mb-2">Reclamaciones Registradas</h2>
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
                            <div className="bg-body-secondary rounded mb-2" style={{ height: "20px", width: "25%" }}></div>
                            <div className="bg-body-secondary rounded mb-2" style={{ height: "24px", width: "50%" }}></div>
                            <div className="bg-body-secondary rounded" style={{ height: "16px", width: "75%" }}></div>
                          </div>
                        <div className="bg-body-secondary rounded" style={{ height: "32px", width: "80px" }}></div>                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            ) : filteredReclamaciones.length === 0 ? (
              <Card>
                <CardContent className="p-5 text-center">
                  <i className="bi bi-tv text-muted" style={{ fontSize: "4rem" }}></i>
                    <h3 className="h5 fw-bold text-body mt-3 mb-2">No se encontraron reclamaciones</h3>                  <p className="text-muted">
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
                                {reclamacion.numero_reclamacion || `#${reclamacion.id}`}
                              </span>
                              <Badge variant={getEstadoBadge(reclamacion.estado)}>
                                {getEstadoTexto(reclamacion.estado)}
                              </Badge>
                            </div>
                            <h3 className="h5 fw-bold text-body mb-2">{reclamacion.asunto}</h3>                            <p className="text-muted mb-2">
                              <strong>{reclamacion.nombre_completo}</strong> • {reclamacion.branch?.name} •{" "}
                              <span className="text-capitalize">{reclamacion.tipo_reclamo}</span>
                            </p>
                            <div className="d-flex align-items-center mb-2">
                              <img
                                src={`http://almacen.fastnetperu.com.pe/api/image_person/${reclamacion.ejecutive?.relative_id}/full`}
                                alt={reclamacion.ejecutive?.name}
                                className="rounded-circle me-2"
                                style={{ width: "32px", height: "32px", objectFit: "cover" }}
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(reclamacion.ejecutive?.name + ' ' + reclamacion.ejecutive?.lastname)}&background=random&color=fff&size=32`
                                }}
                              />
                              <small className="text-muted">
                                Atendido por {reclamacion.ejecutive?.name} {reclamacion.ejecutive?.lastname}
                              </small>
                            </div>
                            <p className="text-muted small text-truncate-2 mb-3">{reclamacion.descripcion}</p>
                            <p className="text-muted small mb-0">
                              <i className="bi bi-calendar3 me-1"></i>
                              Creado:{" "}
                               {new Date(
                                reclamacion.created_at || reclamacion.fecha_creacion || ""
                              ).toLocaleDateString("es-ES", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                           {reclamacion.respuesta && (
                              <div className="d-flex mt-3">
                                <img
                                  src={`http://almacen.fastnetperu.com.pe/api/image_person/${reclamacion.ejecutive?.relative_id}/thumb`}
                                  alt={reclamacion.ejecutive?.name}
                                  className="rounded-circle me-2"
                                  style={{ width: "32px", height: "32px", objectFit: "cover" }}
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement
                                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                      reclamacion.ejecutive?.name + " " + reclamacion.ejecutive?.lastname
                                    )}&background=random&color=fff&size=32`
                                  }}
                                />
                                <div>
                                    <div className="bg-body-secondary text-body rounded-3 p-2 shadow-sm">
                                    <p className="fw-bold small mb-1">
                                      {reclamacion.ejecutive?.name} {reclamacion.ejecutive?.lastname}
                                    </p>
                                    <p className="mb-0 small">{reclamacion.respuesta}</p>
                                  </div>
                                  {reclamacion.fecha_respuesta && (
                                    <small className="text-muted">
                                      {new Date(reclamacion.fecha_respuesta).toLocaleDateString("es-ES", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </small>
                                  )}
                                </div>
                              </div>
                            )}
                          <div className="ms-3">
                             <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedReclamacion(reclamacion)}
                            >
                              {userData ? (
                                <>
                                  <i className="bi bi-pencil me-1"></i>
                                  Gestionar
                                </>
                              ) : (
                                <>
                                  <i className="bi bi-eye me-1"></i>
                                  Ver detalle
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            )}
             {totalPages > 1 && (
              <div className="d-flex justify-content-center mt-4">
                <ReactPaginate
                  previousLabel="Anterior"
                  nextLabel="Siguiente"
                  breakLabel="..."
                  breakClassName="page-item"
                  breakLinkClassName="page-link"
                  pageCount={totalPages}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={3}
                  onPageChange={(e) => setCurrentPage(e.selected + 1)}
                  containerClassName="pagination"
                  pageClassName="page-item"
                  pageLinkClassName="page-link"
                  previousClassName="page-item"
                  previousLinkClassName="page-link"
                  nextClassName="page-item"
                  nextLinkClassName="page-link"
                  activeClassName="active"
                />
              </div>
            )}
          </div>
        </div>
      </div>
     {selectedReclamacion && (
        <Modal
          show={true}
          onClose={() => setSelectedReclamacion(null)}
          title="Detalle de Reclamación"
          size="lg"
        >
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
    </div>
  )
}
