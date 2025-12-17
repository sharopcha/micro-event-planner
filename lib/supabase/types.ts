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
      addon_category:
        | "decor"
        | "food"
        | "drinks"
        | "activities"
        | "music"
        | "photography"
        | "extras"
      budget_tag: "cheap" | "standard" | "premium"
      event_status: "draft" | "ready" | "paid"
      event_type: "baby_shower" | "birthday_party" | "picnic" | "proposal"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      addon_category: [
        "decor",
        "food",
        "drinks",
        "activities",
        "music",
        "photography",
        "extras",
      ],
      budget_tag: ["cheap", "standard", "premium"],
      event_status: ["draft", "ready", "paid"],
      event_type: ["baby_shower", "birthday_party", "picnic", "proposal"],
    },
  },
} as const

