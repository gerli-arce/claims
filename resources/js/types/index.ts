export interface User {
  id: number
  name: string
  email: string
  email_verified_at: string
}

export interface Branch {
  id: number
  name: string
  correlative: string
  ubigeo: string
  address: string
  description: string | null
  color: string | null
  status: number
}

export interface Claim {
  id: number
  customer_name: string
  customer_email: string
  customer_phone?: string
  customer_zone: string
  claim_type: string
  claim_subject: string
  claim_description: string
  status: "pendiente" | "proceso" | "resuelto" | "rechazado"
  created_at: string
  branch?: {
    id: number
    name: string
    correlative: string
    color: string | null
  }
}

export interface ClaimFormData {
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_zone: string
  claim_type: string
  claim_subject: string
  claim_description: string
}

export interface Stats {
  total: number
  resolved: number
  pending: number
  processing: number
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
  auth: {
    user: User
  }
  flash: {
    success?: string
    error?: string
  }
}


export interface FormData {
  nombre_completo: string
  correo_electronico: string
  telefono: string
  zona: string
  tipo_reclamo: string
  asunto: string
  descripcion: string
  sucursal_id: string
  ejecutivo_id: string
}

export interface Estadisticas {
  total: number
  resueltos: number
  pendientes: number
  en_proceso: number
  tiempo_promedio: string
}

export interface Reclamacion {
  id: number
  numero_reclamacion: string
  nombre_completo: string
  correo_electronico: string
  telefono: string
  zona: string
  tipo_reclamo: string
  asunto: string
  descripcion: string
  estado: "pendiente" | "en_proceso" | "resuelto"
  created_at: string
  updated_at: string
}

export interface Sucursal {
  id: number
  name: string
  correlative: string
  ubigeo: string
  address: string
  description: string
  color: string
}

export interface Ejecutivo {
  id: number
  doc_type: string
  doc_number: string
  name: string
  lastname: string
  relative_id: string
  email: string
  phone: string
  address: string
  full_name: string
  image_url: string
  branch: {
    id: number
    name: string
    correlative: string
  }
}

export interface Window {
    sucursalesData: Sucursal[]
  }

