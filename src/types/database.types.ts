export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'admin' | 'viewer'
          password_hash: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          role?: 'admin' | 'viewer'
          password_hash: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'admin' | 'viewer'
          password_hash?: string
          created_at?: string
          updated_at?: string
        }
      }
      quotes: {
        Row: {
          id: string
          quote_number: string
          client_name: string
          client_email: string
          client_phone: string | null
          client_company: string | null
          service_type: string
          description: string | null
          subtotal: number
          tax: number
          total_amount: number
          status: 'pending' | 'approved' | 'rejected' | 'sent'
          pdf_url: string | null
          notes: string | null
          valid_until: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          quote_number: string
          client_name: string
          client_email: string
          client_phone?: string | null
          client_company?: string | null
          service_type: string
          description?: string | null
          subtotal?: number
          tax?: number
          total_amount?: number
          status?: 'pending' | 'approved' | 'rejected' | 'sent'
          pdf_url?: string | null
          notes?: string | null
          valid_until?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          quote_number?: string
          client_name?: string
          client_email?: string
          client_phone?: string | null
          client_company?: string | null
          service_type?: string
          description?: string | null
          subtotal?: number
          tax?: number
          total_amount?: number
          status?: 'pending' | 'approved' | 'rejected' | 'sent'
          pdf_url?: string | null
          notes?: string | null
          valid_until?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      quote_items: {
        Row: {
          id: string
          quote_id: string
          item_name: string
          description: string | null
          quantity: number
          unit: 'PZA' | 'SERV'
          unit_price: number
          total: number
          created_at: string
        }
        Insert: {
          id?: string
          quote_id: string
          item_name: string
          description?: string | null
          quantity?: number
          unit?: 'PZA' | 'SERV'
          unit_price?: number
          total?: number
          created_at?: string
        }
        Update: {
          id?: string
          quote_id?: string
          item_name?: string
          description?: string | null
          quantity?: number
          unit?: 'PZA' | 'SERV'
          unit_price?: number
          total?: number
          created_at?: string
        }
      }
      contacts: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          company: string | null
          service: string | null
          message: string
          status: 'new' | 'contacted' | 'closed'
          notes: string | null
          assigned_to: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          company?: string | null
          service?: string | null
          message: string
          status?: 'new' | 'contacted' | 'closed'
          notes?: string | null
          assigned_to?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          company?: string | null
          service?: string | null
          message?: string
          status?: 'new' | 'contacted' | 'closed'
          notes?: string | null
          assigned_to?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_quote_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
