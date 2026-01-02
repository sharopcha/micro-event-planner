export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      addons: {
        Row: {
          active: boolean | null
          budget_tag: Database["public"]["Enums"]["budget_tag"]
          category: Database["public"]["Enums"]["addon_category"]
          compatible_event_types: Database["public"]["Enums"]["event_type"][]
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          name: string
          price: number
        }
        Insert: {
          active?: boolean | null
          budget_tag: Database["public"]["Enums"]["budget_tag"]
          category: Database["public"]["Enums"]["addon_category"]
          compatible_event_types: Database["public"]["Enums"]["event_type"][]
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          price: number
        }
        Update: {
          active?: boolean | null
          budget_tag?: Database["public"]["Enums"]["budget_tag"]
          category?: Database["public"]["Enums"]["addon_category"]
          compatible_event_types?: Database["public"]["Enums"]["event_type"][]
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          price?: number
        }
        Relationships: []
      }
      event_addons: {
        Row: {
          added_at: string | null
          addon_id: string
          event_id: string
          id: string
          price_at_purchase: number
          quantity: number | null
        }
        Insert: {
          added_at?: string | null
          addon_id: string
          event_id: string
          id?: string
          price_at_purchase: number
          quantity?: number | null
        }
        Update: {
          added_at?: string | null
          addon_id?: string
          event_id?: string
          id?: string
          price_at_purchase?: number
          quantity?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "event_addons_addon_id_fkey"
            columns: ["addon_id"]
            isOneToOne: false
            referencedRelation: "addons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_addons_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          budget: number | null
          city: string | null
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string | null
          date: string | null
          event_type: Database["public"]["Enums"]["event_type"]
          guest_count: number | null
          id: string
          name: string | null
          paid_at: string | null
          status: Database["public"]["Enums"]["event_status"] | null
          stripe_payment_intent_id: string | null
          time: string | null
          total_price: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          budget?: number | null
          city?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          date?: string | null
          event_type: Database["public"]["Enums"]["event_type"]
          guest_count?: number | null
          id?: string
          name?: string | null
          paid_at?: string | null
          status?: Database["public"]["Enums"]["event_status"] | null
          stripe_payment_intent_id?: string | null
          time?: string | null
          total_price?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          budget?: number | null
          city?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          date?: string | null
          event_type?: Database["public"]["Enums"]["event_type"]
          guest_count?: number | null
          id?: string
          name?: string | null
          paid_at?: string | null
          status?: Database["public"]["Enums"]["event_status"] | null
          stripe_payment_intent_id?: string | null
          time?: string | null
          total_price?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      invitations: {
        Row: {
          ai_config: Json | null
          ai_generated_text: Json | null
          created_at: string | null
          custom_text: Json | null
          event_id: string
          id: string
          template_slug: string
          updated_at: string | null
        }
        Insert: {
          ai_config?: Json | null
          ai_generated_text?: Json | null
          created_at?: string | null
          custom_text?: Json | null
          event_id: string
          id?: string
          template_slug: string
          updated_at?: string | null
        }
        Update: {
          ai_config?: Json | null
          ai_generated_text?: Json | null
          created_at?: string | null
          custom_text?: Json | null
          event_id?: string
          id?: string
          template_slug?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invitations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: true
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      share_tokens: {
        Row: {
          created_at: string | null
          event_id: string
          expires_at: string | null
          id: string
          token: string
        }
        Insert: {
          created_at?: string | null
          event_id: string
          expires_at?: string | null
          id?: string
          token: string
        }
        Update: {
          created_at?: string | null
          event_id?: string
          expires_at?: string | null
          id?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "share_tokens_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: true
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      addon_category: "decor" | "food" | "drinks" | "activities" | "music" | "photography" | "extras" | "venue"
      budget_tag: "cheap" | "standard" | "premium"
      event_status: "draft" | "ready" | "paid"
      event_type: "baby_shower" | "birthday_party" | "picnic" | "proposal"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
