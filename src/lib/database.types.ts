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
      perfumes: {
        Row: {
          id: string
          name: string
          category: 'Homme' | 'Femme' | 'Unisexe'
          size: string
          price: number
          image_url: string
          description: string
          in_stock: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          category: 'Homme' | 'Femme' | 'Unisexe'
          size: string
          price: number
          image_url: string
          description?: string
          in_stock?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: 'Homme' | 'Femme' | 'Unisexe'
          size?: string
          price?: number
          image_url?: string
          description?: string
          in_stock?: boolean
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_reference: string
          customer_name: string
          customer_phone: string
          delivery_address: string
          delivery_note: string
          total_amount: number
          status: 'pending' | 'confirmed' | 'delivered' | 'cancelled'
          created_at: string
        }
        Insert: {
          id?: string
          order_reference: string
          customer_name: string
          customer_phone: string
          delivery_address: string
          delivery_note?: string
          total_amount: number
          status?: 'pending' | 'confirmed' | 'delivered' | 'cancelled'
          created_at?: string
        }
        Update: {
          id?: string
          order_reference?: string
          customer_name?: string
          customer_phone?: string
          delivery_address?: string
          delivery_note?: string
          total_amount?: number
          status?: 'pending' | 'confirmed' | 'delivered' | 'cancelled'
          created_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          perfume_id: string
          quantity: number
          unit_price: number
          is_gift_bouquet_item: boolean
          gift_message: string
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          perfume_id: string
          quantity: number
          unit_price: number
          is_gift_bouquet_item?: boolean
          gift_message?: string
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          perfume_id?: string
          quantity?: number
          unit_price?: number
          is_gift_bouquet_item?: boolean
          gift_message?: string
          created_at?: string
        }
      }
    }
  }
}
