"use client"

import { useState } from "react"
import type { Reclamacion } from "../types"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Badge } from "./ui/badge"
import { Label } from "./ui/label"

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
      const token = document.querySelector("meta[name='csrf-token']")?.getAttribute("content")
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

  const getEstadoVariant = (est: string): "pending" | "process" | "resolved" => {
    switch (est.toLowerCase()) {
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

  const formatEstado = (est: string) => {
    return est.replace("_", " ").charAt(0).toUpperCase() + est.replace("_", " ").slice(1)
  }

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-wrap items-center gap-3 pb-4 border-b border-[var(--border-default)]">
        <span className="inline-flex px-3 py-1 text-sm font-semibold font-mono bg-[var(--brand-primary-light)] text-[var(--brand-primary)] rounded-lg">
          {reclamacion.numero_reclamacion || `#${reclamacion.id}`}
        </span>
        <Badge variant={getEstadoVariant(reclamacion.estado)}>{formatEstado(reclamacion.estado)}</Badge>
      </div>

      {/* Details Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-3 bg-[var(--surface-secondary)] rounded-xl">
          <p className="text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Cliente</p>
          <p className="text-sm font-semibold text-[var(--text-primary)]">{reclamacion.nombre_completo}</p>
        </div>
        <div className="p-3 bg-[var(--surface-secondary)] rounded-xl">
          <p className="text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Sucursal</p>
          <p className="text-sm text-[var(--text-primary)]">{reclamacion.branch?.name}</p>
        </div>
        <div className="p-3 bg-[var(--surface-secondary)] rounded-xl">
          <p className="text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Correo</p>
          <p className="text-sm text-[var(--text-primary)]">{reclamacion.correo_electronico}</p>
        </div>
        <div className="p-3 bg-[var(--surface-secondary)] rounded-xl">
          <p className="text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Teléfono</p>
          <p className="text-sm text-[var(--text-primary)]">{reclamacion.telefono}</p>
        </div>
      </div>

      {/* Ejecutivo */}
      <div className="p-4 bg-[var(--surface-secondary)] rounded-xl">
        <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
          Ejecutivo Asignado
        </p>
        <div className="flex items-center gap-3">
          <img
            src={`http://almacen.fastnetperu.com.pe/api/image_person/${reclamacion.ejecutive?.relative_id}/full`}
            alt={reclamacion.ejecutive?.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-[var(--brand-primary)]"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                reclamacion.ejecutive?.name + " " + reclamacion.ejecutive?.lastname,
              )}&background=random&color=fff&size=40`
            }}
          />
          <span className="font-medium text-[var(--text-primary)]">
            {reclamacion.ejecutive?.name} {reclamacion.ejecutive?.lastname}
          </span>
        </div>
      </div>

      {/* Asunto y Descripción */}
      <div className="p-4 bg-[var(--surface-secondary)] rounded-xl">
        <p className="text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Asunto</p>
        <p className="font-semibold text-[var(--text-primary)] mb-3">{reclamacion.asunto}</p>
        <p className="text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Descripción</p>
        <p className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap">{reclamacion.descripcion}</p>
      </div>

      {/* Archivos */}
      {reclamacion.archivos && reclamacion.archivos.length > 0 && (
        <div className="p-4 bg-[var(--surface-secondary)] rounded-xl">
          <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
            Archivos Adjuntos
          </p>
          <div className="flex flex-wrap gap-2">
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
                    className="w-16 h-16 object-cover rounded-lg border border-[var(--border-default)] hover:border-[var(--brand-primary)] transition-colors"
                  />
                </a>
              ) : (
                <a
                  key={archivo.id}
                  href={`/api/archivos/${archivo.id}?download=1`}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-[var(--surface-tertiary)] rounded text-xs text-[var(--brand-primary)] hover:underline"
                >
                  {archivo.nombre_original}
                </a>
              ),
            )}
          </div>
        </div>
      )}

      {/* Gestión Section */}
      <div className="p-4 bg-[var(--brand-primary-light)] border border-[var(--brand-primary)] rounded-xl">
        <h4 className="text-sm font-bold text-[var(--brand-primary)] uppercase tracking-wider mb-4">
          Gestionar Reclamación
        </h4>

        {/* Estado Select */}
        <div className="mb-4">
          <Label className="text-[var(--text-primary)]">Estado</Label>
          <Select value={estado} onValueChange={setEstado}>
            <SelectTrigger className="mt-1.5 bg-[var(--surface-primary)]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pendiente">Pendiente</SelectItem>
              <SelectItem value="en_proceso">En Proceso</SelectItem>
              <SelectItem value="resuelto">Resuelto</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Respuesta Textarea */}
        <div className="mb-4">
          <Label className="text-[var(--text-primary)]">Respuesta</Label>
          <Textarea
            rows={4}
            value={respuesta}
            onChange={(e) => setRespuesta(e.target.value)}
            placeholder="Escribe la respuesta para el cliente..."
            className="mt-1.5 bg-[var(--surface-primary)]"
          />
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-3 bg-[rgba(16,185,129,0.1)] border border-[var(--accent-success)] rounded-lg text-[var(--accent-success)] text-sm font-medium flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Reclamación actualizada correctamente
          </div>
        )}

        {/* Submit Button */}
        <Button onClick={handleSubmit} disabled={loading} loading={loading} className="w-full">
          {loading ? "Guardando..." : "Guardar cambios"}
        </Button>
      </div>
    </div>
  )
}
