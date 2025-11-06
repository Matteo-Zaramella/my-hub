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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      allenamenti: {
        Row: {
          created_at: string | null
          data: string
          esercizio: string
          id: number
          note: string | null
          peso: number | null
          ripetizioni: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          data: string
          esercizio: string
          id?: number
          note?: string | null
          peso?: number | null
          ripetizioni?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          data?: string
          esercizio?: string
          id?: number
          note?: string | null
          peso?: number | null
          ripetizioni?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      appointments: {
        Row: {
          completato: boolean | null
          created_at: string | null
          data_ora: string
          descrizione: string | null
          id: number
          luogo: string | null
          pubblico: boolean | null
          titolo: string
          user_id: number | null
        }
        Insert: {
          completato?: boolean | null
          created_at?: string | null
          data_ora: string
          descrizione?: string | null
          id?: number
          luogo?: string | null
          pubblico?: boolean | null
          titolo: string
          user_id?: number | null
        }
        Update: {
          completato?: boolean | null
          created_at?: string | null
          data_ora?: string
          descrizione?: string | null
          id?: number
          luogo?: string | null
          pubblico?: boolean | null
          titolo?: string
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      current_location: {
        Row: {
          attivo: boolean | null
          created_at: string | null
          data_fine: string | null
          data_inizio: string | null
          google_maps_link: string | null
          id: number
          immagine_url: string | null
          indirizzo: string | null
          nome_luogo: string
          note: string | null
          orario: string | null
          user_id: number | null
        }
        Insert: {
          attivo?: boolean | null
          created_at?: string | null
          data_fine?: string | null
          data_inizio?: string | null
          google_maps_link?: string | null
          id?: number
          immagine_url?: string | null
          indirizzo?: string | null
          nome_luogo: string
          note?: string | null
          orario?: string | null
          user_id?: number | null
        }
        Update: {
          attivo?: boolean | null
          created_at?: string | null
          data_fine?: string | null
          data_inizio?: string | null
          google_maps_link?: string | null
          id?: number
          immagine_url?: string | null
          indirizzo?: string | null
          nome_luogo?: string
          note?: string | null
          orario?: string | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "current_location_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      game_challenges: {
        Row: {
          challenge_number: number
          created_at: string | null
          description: string | null
          end_date: string | null
          id: number
          instructions: string | null
          location: string | null
          points: number | null
          start_date: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          challenge_number: number
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: number
          instructions?: string | null
          location?: string | null
          points?: number | null
          start_date?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          challenge_number?: number
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: number
          instructions?: string | null
          location?: string | null
          points?: number | null
          start_date?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      game_clues: {
        Row: {
          challenge_id: number
          clue_number: number
          clue_text: string
          created_at: string | null
          id: number
          revealed_date: string | null
        }
        Insert: {
          challenge_id: number
          clue_number: number
          clue_text: string
          created_at?: string | null
          id?: number
          revealed_date?: string | null
        }
        Update: {
          challenge_id?: number
          clue_number?: number
          clue_text?: string
          created_at?: string | null
          id?: number
          revealed_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "game_clues_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "game_challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      game_prize_config: {
        Row: {
          created_at: string | null
          description: string | null
          end_date: string | null
          game_name: string | null
          id: number
          start_date: string | null
          total_challenges: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          game_name?: string | null
          id?: number
          start_date?: string | null
          total_challenges?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          game_name?: string | null
          id?: number
          start_date?: string | null
          total_challenges?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      game_user_completions: {
        Row: {
          challenge_id: number
          completed_date: string | null
          created_at: string | null
          id: number
          user_id: number
        }
        Insert: {
          challenge_id: number
          completed_date?: string | null
          created_at?: string | null
          id?: number
          user_id: number
        }
        Update: {
          challenge_id?: number
          completed_date?: string | null
          created_at?: string | null
          id?: number
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "game_user_completions_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "game_challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_user_completions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      game_user_scores: {
        Row: {
          awarded_date: string | null
          challenge_id: number
          created_at: string | null
          id: number
          points: number
          user_id: number
        }
        Insert: {
          awarded_date?: string | null
          challenge_id: number
          created_at?: string | null
          id?: number
          points: number
          user_id: number
        }
        Update: {
          awarded_date?: string | null
          challenge_id?: number
          created_at?: string | null
          id?: number
          points?: number
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "game_user_scores_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "game_challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_user_scores_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      game_winner_reveal: {
        Row: {
          created_at: string | null
          id: number
          revealed: boolean | null
          revealed_date: string | null
          updated_at: string | null
          winner_user_id: number | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          revealed?: boolean | null
          revealed_date?: string | null
          updated_at?: string | null
          winner_user_id?: number | null
        }
        Update: {
          created_at?: string | null
          id?: number
          revealed?: boolean | null
          revealed_date?: string | null
          updated_at?: string | null
          winner_user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "game_winner_reveal_winner_user_id_fkey"
            columns: ["winner_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      matched_betting: {
        Row: {
          bookmaker_back: string
          bookmaker_lay: string | null
          created_at: string | null
          data_evento: string | null
          evento: string
          id: number
          mercato: string | null
          note: string | null
          offerta: string | null
          profitto: number | null
          quota_back: number | null
          quota_lay: number | null
          rating: string | null
          stake_back: number | null
          stake_lay: number | null
          user_id: number | null
        }
        Insert: {
          bookmaker_back: string
          bookmaker_lay?: string | null
          created_at?: string | null
          data_evento?: string | null
          evento: string
          id?: number
          mercato?: string | null
          note?: string | null
          offerta?: string | null
          profitto?: number | null
          quota_back?: number | null
          quota_lay?: number | null
          rating?: string | null
          stake_back?: number | null
          stake_lay?: number | null
          user_id?: number | null
        }
        Update: {
          bookmaker_back?: string
          bookmaker_lay?: string | null
          created_at?: string | null
          data_evento?: string | null
          evento?: string
          id?: number
          mercato?: string | null
          note?: string | null
          offerta?: string | null
          profitto?: number | null
          quota_back?: number | null
          quota_lay?: number | null
          rating?: string | null
          stake_back?: number | null
          stake_lay?: number | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "matched_betting_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      pasti: {
        Row: {
          created_at: string | null
          data: string
          descrizione: string
          id: number
          tipo_pasto: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          data: string
          descrizione: string
          id?: number
          tipo_pasto: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          data?: string
          descrizione?: string
          id?: number
          tipo_pasto?: string
          user_id?: string | null
        }
        Relationships: []
      }
      task_lavoro: {
        Row: {
          completed_at: string | null
          created_at: string | null
          deadline: string | null
          descrizione: string | null
          id: number
          priorita: string | null
          stato: string | null
          titolo: string
          user_id: number | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          deadline?: string | null
          descrizione?: string | null
          id?: number
          priorita?: string | null
          stato?: string | null
          titolo: string
          user_id?: number | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          deadline?: string | null
          descrizione?: string | null
          id?: number
          priorita?: string | null
          stato?: string | null
          titolo?: string
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "task_lavoro_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      task_privati: {
        Row: {
          completed_at: string | null
          created_at: string | null
          deadline: string | null
          descrizione: string | null
          id: number
          priorita: string | null
          ricorrente: boolean | null
          stato: string | null
          titolo: string
          user_id: number | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          deadline?: string | null
          descrizione?: string | null
          id?: number
          priorita?: string | null
          ricorrente?: boolean | null
          stato?: string | null
          titolo: string
          user_id?: number | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          deadline?: string | null
          descrizione?: string | null
          id?: number
          priorita?: string | null
          ricorrente?: boolean | null
          stato?: string | null
          titolo?: string
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "task_privati_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          dark_mode: boolean | null
          id: number
          language: string | null
          notifications: boolean | null
          updated_at: string | null
          user_id: number
        }
        Insert: {
          dark_mode?: boolean | null
          id?: number
          language?: string | null
          notifications?: boolean | null
          updated_at?: string | null
          user_id: number
        }
        Update: {
          dark_mode?: boolean | null
          id?: number
          language?: string | null
          notifications?: boolean | null
          updated_at?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          id: number
          password: string
          username: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          password: string
          username: string
        }
        Update: {
          created_at?: string | null
          id?: number
          password?: string
          username?: string
        }
        Relationships: []
      }
      wishlist_items: {
        Row: {
          acquistato: boolean | null
          acquistato_da: string | null
          acquistato_data: string | null
          created_at: string | null
          descrizione: string | null
          id: number
          immagine_url: string | null
          link: string | null
          nome: string
          prezzo: number | null
          priorita: string | null
          pubblico: boolean | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          acquistato?: boolean | null
          acquistato_da?: string | null
          acquistato_data?: string | null
          created_at?: string | null
          descrizione?: string | null
          id?: number
          immagine_url?: string | null
          link?: string | null
          nome: string
          prezzo?: number | null
          priorita?: string | null
          pubblico?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          acquistato?: boolean | null
          acquistato_da?: string | null
          acquistato_data?: string | null
          created_at?: string | null
          descrizione?: string | null
          id?: number
          immagine_url?: string | null
          link?: string | null
          nome?: string
          prezzo?: number | null
          priorita?: string | null
          pubblico?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      wishlist_tags: {
        Row: {
          created_at: string | null
          id: number
          item_id: number | null
          tag: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          item_id?: number | null
          tag: string
        }
        Update: {
          created_at?: string | null
          id?: number
          item_id?: number | null
          tag?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_tags_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "wishlist_items"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_exercises: {
        Row: {
          esercizio: string
          id: number
          note: string | null
          peso: number | null
          ripetizioni: number | null
          serie_numero: number | null
          session_id: number | null
        }
        Insert: {
          esercizio: string
          id?: number
          note?: string | null
          peso?: number | null
          ripetizioni?: number | null
          serie_numero?: number | null
          session_id?: number | null
        }
        Update: {
          esercizio?: string
          id?: number
          note?: string | null
          peso?: number | null
          ripetizioni?: number | null
          serie_numero?: number | null
          session_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "workout_exercises_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "workout_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_sessions: {
        Row: {
          completato: boolean | null
          created_at: string | null
          data: string
          id: number
          note: string | null
          user_id: string | null
          workout_type: string
        }
        Insert: {
          completato?: boolean | null
          created_at?: string | null
          data: string
          id?: number
          note?: string | null
          user_id?: string | null
          workout_type: string
        }
        Update: {
          completato?: boolean | null
          created_at?: string | null
          data?: string
          id?: number
          note?: string | null
          user_id?: string | null
          workout_type?: string
        }
        Relationships: []
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
    Enums: {},
  },
} as const
