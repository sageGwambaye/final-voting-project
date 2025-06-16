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
      candidate: {
        Row: {
          created_at: string
          election_id: number | null
          id: number
          position: string | null
          user_id: number
        }
        Insert: {
          created_at?: string
          election_id?: number | null
          id?: number
          position?: string | null
          user_id: number
        }
        Update: {
          created_at?: string
          election_id?: number | null
          id?: number
          position?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "candidate_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      candidates: {
        Row: {
          created_at: string | null
          first_name: string
          id: string
          image_url: string | null
          last_name: string
          platform: string | null
          position_id: string
          video_url: string | null
        }
        Insert: {
          created_at?: string | null
          first_name: string
          id?: string
          image_url?: string | null
          last_name: string
          platform?: string | null
          position_id: string
          video_url?: string | null
        }
        Update: {
          created_at?: string | null
          first_name?: string
          id?: string
          image_url?: string | null
          last_name?: string
          platform?: string | null
          position_id?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "candidates_position_id_fkey"
            columns: ["position_id"]
            isOneToOne: false
            referencedRelation: "positions"
            referencedColumns: ["id"]
          },
        ]
      }
      elections: {
        Row: {
          created_at: string | null
          description: string | null
          end_date: string
          id: string
          start_date: string
          status: string
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_date: string
          id?: string
          start_date: string
          status?: string
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_date?: string
          id?: string
          start_date?: string
          status?: string
          title?: string
        }
        Relationships: []
      }
      feedback: {
        Row: {
          created_at: string | null
          feedback_text: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          feedback_text: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          feedback_text?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      positions: {
        Row: {
          created_at: string | null
          description: string | null
          election_id: string
          id: string
          max_votes: number
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          election_id: string
          id?: string
          max_votes?: number
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          election_id?: string
          id?: string
          max_votes?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "positions_election_id_fkey"
            columns: ["election_id"]
            isOneToOne: false
            referencedRelation: "elections"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          college: string
          created_at: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          role: string
          student_id: string
          voice_verified: boolean | null
        }
        Insert: {
          college: string
          created_at?: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          role?: string
          student_id: string
          voice_verified?: boolean | null
        }
        Update: {
          college?: string
          created_at?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          role?: string
          student_id?: string
          voice_verified?: boolean | null
        }
        Relationships: []
      }
      students: {
        Row: {
          bloodGroup: string | null
          college: string | null
          DoB: string | null
          email: string | null
          name: string | null
          password: string | null
          phone: number | null
          program: string | null
          regNumber: string
          room: string | null
          voiceSampleUrl: string | null
        }
        Insert: {
          bloodGroup?: string | null
          college?: string | null
          DoB?: string | null
          email?: string | null
          name?: string | null
          password?: string | null
          phone?: number | null
          program?: string | null
          regNumber: string
          room?: string | null
          voiceSampleUrl?: string | null
        }
        Update: {
          bloodGroup?: string | null
          college?: string | null
          DoB?: string | null
          email?: string | null
          name?: string | null
          password?: string | null
          phone?: number | null
          program?: string | null
          regNumber?: string
          room?: string | null
          voiceSampleUrl?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          college: string | null
          created_at: string
          dorm_block: string | null
          email: string | null
          id: number
          image: string | null
          name: string | null
          password: string | null
          role: string | null
          username: string
        }
        Insert: {
          college?: string | null
          created_at?: string
          dorm_block?: string | null
          email?: string | null
          id?: number
          image?: string | null
          name?: string | null
          password?: string | null
          role?: string | null
          username?: string
        }
        Update: {
          college?: string | null
          created_at?: string
          dorm_block?: string | null
          email?: string | null
          id?: number
          image?: string | null
          name?: string | null
          password?: string | null
          role?: string | null
          username?: string
        }
        Relationships: []
      }
      votes: {
        Row: {
          candidate_id: string
          created_at: string | null
          id: string
          position_id: string
          user_id: string
        }
        Insert: {
          candidate_id: string
          created_at?: string | null
          id?: string
          position_id: string
          user_id: string
        }
        Update: {
          candidate_id?: string
          created_at?: string | null
          id?: string
          position_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "votes_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_position_id_fkey"
            columns: ["position_id"]
            isOneToOne: false
            referencedRelation: "positions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_vote_results: {
        Args: Record<PropertyKey, never>
        Returns: {
          candidate_id: string
          candidate_name: string
          position_title: string
          vote_count: number
        }[]
      }
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
