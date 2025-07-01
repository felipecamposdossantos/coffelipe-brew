export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      brew_history: {
        Row: {
          brewed_at: string
          coffee_bean_id: string | null
          coffee_ratio: number | null
          grinder_brand: string | null
          grinder_clicks: number | null
          id: string
          paper_brand: string | null
          recipe_id: string
          recipe_name: string
          user_id: string
          water_ratio: number | null
          water_temperature: number | null
        }
        Insert: {
          brewed_at?: string
          coffee_bean_id?: string | null
          coffee_ratio?: number | null
          grinder_brand?: string | null
          grinder_clicks?: number | null
          id?: string
          paper_brand?: string | null
          recipe_id: string
          recipe_name: string
          user_id: string
          water_ratio?: number | null
          water_temperature?: number | null
        }
        Update: {
          brewed_at?: string
          coffee_bean_id?: string | null
          coffee_ratio?: number | null
          grinder_brand?: string | null
          grinder_clicks?: number | null
          id?: string
          paper_brand?: string | null
          recipe_id?: string
          recipe_name?: string
          user_id?: string
          water_ratio?: number | null
          water_temperature?: number | null
        }
        Relationships: []
      }
      coffee_beans: {
        Row: {
          brand: string
          created_at: string
          id: string
          name: string
          notes: string | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          brand: string
          created_at?: string
          id?: string
          name: string
          notes?: string | null
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          brand?: string
          created_at?: string
          id?: string
          name?: string
          notes?: string | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      filter_papers: {
        Row: {
          brand: string
          created_at: string
          id: string
          model: string
          name: string
          notes: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          brand: string
          created_at?: string
          id?: string
          model: string
          name: string
          notes?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          brand?: string
          created_at?: string
          id?: string
          model?: string
          name?: string
          notes?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_recipes: {
        Row: {
          coffee_bean_id: string | null
          coffee_ratio: number
          created_at: string
          description: string
          filter_paper_id: string | null
          grinder_brand: string | null
          grinder_clicks: number | null
          id: string
          name: string
          paper_brand: string | null
          steps: Json
          updated_at: string
          user_id: string
          water_ratio: number
          water_temperature: number | null
        }
        Insert: {
          coffee_bean_id?: string | null
          coffee_ratio: number
          created_at?: string
          description: string
          filter_paper_id?: string | null
          grinder_brand?: string | null
          grinder_clicks?: number | null
          id: string
          name: string
          paper_brand?: string | null
          steps: Json
          updated_at?: string
          user_id: string
          water_ratio: number
          water_temperature?: number | null
        }
        Update: {
          coffee_bean_id?: string | null
          coffee_ratio?: number
          created_at?: string
          description?: string
          filter_paper_id?: string | null
          grinder_brand?: string | null
          grinder_clicks?: number | null
          id?: string
          name?: string
          paper_brand?: string | null
          steps?: Json
          updated_at?: string
          user_id?: string
          water_ratio?: number
          water_temperature?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_recipes_coffee_bean_id_fkey"
            columns: ["coffee_bean_id"]
            isOneToOne: false
            referencedRelation: "coffee_beans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_recipes_filter_paper_id_fkey"
            columns: ["filter_paper_id"]
            isOneToOne: false
            referencedRelation: "filter_papers"
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
