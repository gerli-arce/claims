import type { Reclamacion } from "../types"
import { Badge } from "./ui/badge"

interface DetalleReclamacionModalProps {
  reclamacion: Reclamacion
}

export default function DetalleReclamacionModal({ reclamacion }: DetalleReclamacionModalProps) {
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

  const formatEstado = (estado: string) => {
    return estado.replace("_", " ").charAt(0).toUpperCase() + estado.replace("_", " ").slice(1)
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

      {/* Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Cliente */}
        <div className="p-4 bg-[var(--surface-secondary)] rounded-xl">
          <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1">Cliente</p>
          <p className="text-base font-semibold text-[var(--text-primary)]">{reclamacion.nombre_completo}</p>
        </div>

        {/* Correo */}
        <div className="p-4 bg-[var(--surface-secondary)] rounded-xl">
          <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1">Correo</p>
          <p className="text-base text-[var(--text-primary)]">{reclamacion.correo_electronico}</p>
        </div>

        {/* Teléfono */}
        <div className="p-4 bg-[var(--surface-secondary)] rounded-xl">
          <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1">Teléfono</p>
          <p className="text-base text-[var(--text-primary)]">{reclamacion.telefono}</p>
        </div>

        {/* Sucursal */}
        <div className="p-4 bg-[var(--surface-secondary)] rounded-xl">
          <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1">Sucursal</p>
          <p className="text-base text-[var(--text-primary)]">{reclamacion.branch?.name}</p>
        </div>

        {/* Tipo */}
        <div className="p-4 bg-[var(--surface-secondary)] rounded-xl">
          <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1">
            Tipo de Reclamo
          </p>
          <p className="text-base text-[var(--text-primary)] capitalize">{reclamacion.tipo_reclamo}</p>
        </div>

        {/* Fecha */}
        <div className="p-4 bg-[var(--surface-secondary)] rounded-xl">
          <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1">
            Fecha de Creación
          </p>
          <p className="text-base text-[var(--text-primary)]">
            {new Date(reclamacion.created_at || reclamacion.fecha_creacion || "").toLocaleDateString("es-ES", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
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
            className="w-12 h-12 rounded-full object-cover border-2 border-[var(--brand-primary)]"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                reclamacion.ejecutive?.name + " " + reclamacion.ejecutive?.lastname,
              )}&background=random&color=fff&size=48`
            }}
          />
          <div>
            <p className="font-semibold text-[var(--text-primary)]">
              {reclamacion.ejecutive?.name} {reclamacion.ejecutive?.lastname}
            </p>
            <p className="text-sm text-[var(--text-tertiary)]">Ejecutivo de atención</p>
          </div>
        </div>
      </div>

      {/* Asunto */}
      <div className="p-4 bg-[var(--surface-secondary)] rounded-xl">
        <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1">Asunto</p>
        <p className="text-base font-semibold text-[var(--text-primary)]">{reclamacion.asunto}</p>
      </div>

      {/* Descripción */}
      <div className="p-4 bg-[var(--surface-secondary)] rounded-xl">
        <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Descripción</p>
        <p className="text-base text-[var(--text-primary)] whitespace-pre-wrap leading-relaxed">
          {reclamacion.descripcion}
        </p>
      </div>

      {/* Archivos */}
      {reclamacion.archivos && reclamacion.archivos.length > 0 && (
        <div className="p-4 bg-[var(--surface-secondary)] rounded-xl">
          <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
            Archivos Adjuntos
          </p>
          <div className="flex flex-wrap gap-3">
            {reclamacion.archivos.map((archivo) =>
              archivo.tipo === "imagen" ? (
                <a
                  key={archivo.id}
                  href={`/api/archivos/${archivo.id}?download=1`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <img
                    src={`/api/archivos/${archivo.id}`}
                    alt={archivo.nombre_original}
                    className="w-20 h-20 object-cover rounded-lg border-2 border-[var(--border-default)] group-hover:border-[var(--brand-primary)] transition-colors"
                  />
                </a>
              ) : (
                <a
                  key={archivo.id}
                  href={`/api/archivos/${archivo.id}?download=1`}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-[var(--surface-tertiary)] border border-[var(--border-default)] rounded-lg text-sm text-[var(--brand-primary)] hover:bg-[var(--brand-primary-light)] transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  {archivo.nombre_original}
                </a>
              ),
            )}
          </div>
        </div>
      )}

      {/* Respuesta */}
      {reclamacion.respuesta && (
        <div className="p-4 bg-[rgba(16,185,129,0.1)] border border-[var(--accent-success)] rounded-xl">
          <p className="text-xs font-semibold text-[var(--accent-success)] uppercase tracking-wider mb-2">
            Respuesta del Ejecutivo
          </p>
          <p className="text-base text-[var(--text-primary)] whitespace-pre-wrap">{reclamacion.respuesta}</p>
          {reclamacion.fecha_respuesta && (
            <p className="text-xs text-[var(--text-tertiary)] mt-2">
              Respondido el{" "}
              {new Date(reclamacion.fecha_respuesta).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
