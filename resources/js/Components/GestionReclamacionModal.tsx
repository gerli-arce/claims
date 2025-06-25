"use client"

import { useState } from "react"
import { Reclamacion } from "../types"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Badge } from "./ui/badge"

interface Props {
  reclamacion: Reclamacion
  onActualizar: () => void
}

export default function GestionReclamacionModal({ reclamacion, onActualizar }: Props) {
  const [estado, setEstado] = useState(reclamacion.estado)
  const [respuesta, setRespuesta] = useState(reclamacion.respuesta || "")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const token = document
        .querySelector("meta[name='csrf-token']")
        ?.getAttribute("content")
      const resp = await fetch(`/api/reclamaciones/${reclamacion.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-CSRF-TOKEN": token || "",
        },
        credentials: "same-origin",
        body: JSON.stringify({ estado, respuesta }),
      })
      if (resp.ok) {
        setSuccess(true)
        onActualizar()
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch (err) {
      console.error("Error updating reclamacion", err)
    } finally {
      setLoading(false)
    }
  }

  const badgeClass = (est: string) => {
    switch (est.toLowerCase()) {
      case "pendiente":
        return "bg-warning text-dark"
      case "en_proceso":
        return "bg-info text-dark"
      case "resuelto":
        return "bg-success"
      default:
        return "bg-secondary"
    }
  }

  return (
    <div className="table-responsive">
      <table className="table table-bordered align-middle">
        <tbody>
          <tr>
            <th>Número</th>
            <td>{reclamacion.numero_reclamacion || `#${reclamacion.id}`}</td>
          </tr>
          <tr>
            <th>Cliente</th>
            <td>{reclamacion.nombre_completo}</td>
          </tr>
          <tr>
            <th>Correo</th>
            <td>{reclamacion.correo_electronico}</td>
          </tr>
          <tr>
            <th>Teléfono</th>
            <td>{reclamacion.telefono}</td>
          </tr>
          <tr>
            <th>Sucursal</th>
            <td>{reclamacion.branch?.name}</td>
          </tr>
          <tr>
            <th>Ejecutivo</th>
            <td>
              <div className="d-flex align-items-center gap-2">
                <img
                  src={`http://almacen.fastnetperu.com.pe/api/image_person/${reclamacion.ejecutive?.relative_id}/full`}
                  alt={reclamacion.ejecutive?.name}
                  className="rounded-circle"
                  style={{ width: "32px", height: "32px", objectFit: "cover" }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(reclamacion.ejecutive?.name + " " + reclamacion.ejecutive?.lastname)}&background=random&color=fff&size=32`
                  }}
                />
                <span>{reclamacion.ejecutive?.name} {reclamacion.ejecutive?.lastname}</span>
              </div>
            </td>
          </tr>
          <tr>
            <th>Tipo</th>
            <td className="text-capitalize">{reclamacion.tipo_reclamo}</td>
          </tr>
          <tr>
            <th>Estado actual</th>
            <td>
              <Badge className={badgeClass(reclamacion.estado)}>{reclamacion.estado.replace("_", " ")}</Badge>
            </td>
          </tr>
          <tr>
            <th>Asunto</th>
            <td>{reclamacion.asunto}</td>
          </tr>
          <tr>
            <th>Descripción</th>
            <td>{reclamacion.descripcion}</td>
          </tr>
          {reclamacion.archivos && (
            <tr>
              <th>Archivos</th>
              <td>
                <div className="d-flex flex-wrap gap-2">
                  {reclamacion.archivos.map((archivo) => (
                    archivo.tipo === 'imagen' ? (
                      <a key={archivo.id} href={`/api/archivos/${archivo.id}?download=1`} target="_blank" rel="noopener noreferrer">
                        <img src={`/api/archivos/${archivo.id}`} alt={archivo.nombre_original} style={{ width: '60px', height: '60px', objectFit: 'cover' }} className="border rounded" />
                      </a>
                    ) : (
                      <a key={archivo.id} href={`/api/archivos/${archivo.id}?download=1`} className="text-primary text-decoration-underline">
                        {archivo.nombre_original}
                      </a>
                    )
                  ))}
                </div>
              </td>
            </tr>
          )}
          <tr>
            <th>Creado</th>
            <td>
              {new Date(reclamacion.created_at || reclamacion.fecha_creacion || "").toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </td>
          </tr>
        </tbody>
      </table>

      <div className="mb-3">
        <label className="form-label fw-bold">Estado</label>
        <Select value={estado} onValueChange={setEstado}>
          <SelectTrigger className="w-100">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pendiente">Pendiente</SelectItem>
            <SelectItem value="en_proceso">En Proceso</SelectItem>
            <SelectItem value="resuelto">Resuelto</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="mb-3">
        <label className="form-label fw-bold">Respuesta</label>
        <Textarea rows={5} value={respuesta} onChange={(e) => setRespuesta(e.target.value)} />
      </div>
      {success && <div className="alert alert-success">Reclamación actualizada</div>}
      <Button onClick={handleSubmit} disabled={loading} className="w-100">
        {loading ? "Guardando..." : "Guardar cambios"}
      </Button>
    </div>
  )
}
