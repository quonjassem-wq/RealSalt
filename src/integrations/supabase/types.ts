export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      ad_sessions: {
        Row: {
          consumed_at: string | null
          created_at: string
          hwid: string | null
          ip: string | null
          key_issued: string | null
          token: string
        }
        Insert: {
          consumed_at?: string | null
          created_at?: string
          hwid?: string | null
          ip?: string | null
          key_issued?: string | null
          token: string
        }
        Update: {
          consumed_at?: string | null
          created_at?: string
          hwid?: string | null
          ip?: string | null
          key_issued?: string | null
          token?: string
        }
        Relationships: []
      }
      bans: {
        Row: {
          banned_at: string
          banned_by: string | null
          expires_at: string | null
          id: string
          reason: string
          type: Database["public"]["Enums"]["ban_type"]
          value: string
        }
        Insert: {
          banned_at?: string
          banned_by?: string | null
          expires_at?: string | null
          id?: string
          reason?: string
          type: Database["public"]["Enums"]["ban_type"]
          value: string
        }
        Update: {
          banned_at?: string
          banned_by?: string | null
          expires_at?: string | null
          id?: string
          reason?: string
          type?: Database["public"]["Enums"]["ban_type"]
          value?: string
        }
        Relationships: []
      }
      ip_logs: {
        Row: {
          created_at: string
          hwid: string | null
          id: number
          ip: string | null
          path: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          hwid?: string | null
          id?: number
          ip?: string | null
          path?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          hwid?: string | null
          id?: number
          ip?: string | null
          path?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      keys: {
        Row: {
          created_at: string
          expires_at: string | null
          first_used_at: string | null
          hwid: string | null
          ip: string | null
          key: string
          revoked: boolean
          source: Database["public"]["Enums"]["key_source"]
          tier: Database["public"]["Enums"]["key_tier"]
          user_id: string | null
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          first_used_at?: string | null
          hwid?: string | null
          ip?: string | null
          key: string
          revoked?: boolean
          source?: Database["public"]["Enums"]["key_source"]
          tier: Database["public"]["Enums"]["key_tier"]
          user_id?: string | null
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          first_used_at?: string | null
          hwid?: string | null
          ip?: string | null
          key?: string
          revoked?: boolean
          source?: Database["public"]["Enums"]["key_source"]
          tier?: Database["public"]["Enums"]["key_tier"]
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          discord_id: string | null
          id: string
          username: string | null
        }
        Insert: {
          created_at?: string
          discord_id?: string | null
          id: string
          username?: string | null
        }
        Update: {
          created_at?: string
          discord_id?: string | null
          id?: string
          username?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      ban_type: "ip" | "hwid"
      key_source: "ad" | "paid" | "admin"
      key_tier: "24h" | "week" | "month" | "perm"
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
  public: {
    Enums: {
      app_role: ["admin", "user"],
      ban_type: ["ip", "hwid"],
      key_source: ["ad", "paid", "admin"],
      key_tier: ["24h", "week", "month", "perm"],
    },
  },
} as const
