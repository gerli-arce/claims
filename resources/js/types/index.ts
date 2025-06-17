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
