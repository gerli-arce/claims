import React from "react"
import { Reclamacion } from "../types"
import { Badge } from "./ui/badge"

interface DetalleReclamacionModalProps {
  reclamacion: Reclamacion
}

export default function DetalleReclamacionModal({ reclamacion }: DetalleReclamacionModalProps) {
  const estadoClass = (estado: string) => {
    switch (estado.toLowerCase()) {
      case "pendiente":
        return "bg-warning-subtle border border-warning-subtle text-warning-emphasis"
      case "en_proceso":
        return "bg-info-subtle border border-info-subtle text-info-emphasis"
      case "resuelto":
        return "bg-success-subtle border border-success-subtle text-success-emphasis"
      default:
        return "bg-secondary-subtle border border-secondary-subtle text-secondary-emphasis"
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
                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      reclamacion.ejecutive?.name + " " + reclamacion.ejecutive?.lastname
                    )}&background=random&color=fff&size=32`
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
            <th>Estado</th>
            <td>
              <Badge className={estadoClass(reclamacion.estado)}>
                {reclamacion.estado.replace("_", " ")}
              </Badge>
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
                    <a
                        key={archivo.id}
                        href={`/api/archivos/${archivo.id}?download=1`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={`/api/archivos/${archivo.id}`}
                          alt={archivo.nombre_original}
                          style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                          className="border rounded"
                        />
                      </a>
                    ) : (
                      <a
                        key={archivo.id}
                        href={`/api/archivos/${archivo.id}?download=1`}
                        className="text-primary text-decoration-underline"
                      >
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
              {new Date(
                reclamacion.created_at || reclamacion.fecha_creacion || ""
              ).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </td>
          </tr>
          {reclamacion.respuesta && (
            <tr>
              <th>Respuesta</th>
              <td>{reclamacion.respuesta}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
