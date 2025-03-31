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
      alerts: {
        Row: {
          created_at: string
          created_by: string | null
          expires_at: string | null
          id: string
          is_read: boolean | null
          message: string
          severity: string
          target_role: Database["public"]["Enums"]["user_role"] | null
          title: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          severity: string
          target_role?: Database["public"]["Enums"]["user_role"] | null
          title: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          severity?: string
          target_role?: Database["public"]["Enums"]["user_role"] | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "alerts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bus_trips: {
        Row: {
          cancellation_reason: string | null
          created_at: string
          driver_id: string | null
          end_time: string | null
          id: string
          schedule_id: string | null
          start_time: string | null
          status: string
          updated_at: string
        }
        Insert: {
          cancellation_reason?: string | null
          created_at?: string
          driver_id?: string | null
          end_time?: string | null
          id?: string
          schedule_id?: string | null
          start_time?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          cancellation_reason?: string | null
          created_at?: string
          driver_id?: string | null
          end_time?: string | null
          id?: string
          schedule_id?: string | null
          start_time?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bus_trips_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bus_trips_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "schedules"
            referencedColumns: ["id"]
          },
        ]
      }
      buses: {
        Row: {
          assigned_driver: string | null
          bus_number: string
          capacity: number
          created_at: string
          id: string
          name: string
          route: string | null
          status: string
          updated_at: string
        }
        Insert: {
          assigned_driver?: string | null
          bus_number: string
          capacity?: number
          created_at?: string
          id?: string
          name: string
          route?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          assigned_driver?: string | null
          bus_number?: string
          capacity?: number
          created_at?: string
          id?: string
          name?: string
          route?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "buses_assigned_driver_fkey"
            columns: ["assigned_driver"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      complaints: {
        Row: {
          bus_id: string | null
          complaint_type: string
          coordinator_notes: string | null
          created_at: string
          description: string
          id: string
          resolved_at: string | null
          resolved_by: string | null
          status: string
          student_id: string | null
          trip_id: string | null
          updated_at: string
        }
        Insert: {
          bus_id?: string | null
          complaint_type: string
          coordinator_notes?: string | null
          created_at?: string
          description: string
          id?: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          student_id?: string | null
          trip_id?: string | null
          updated_at?: string
        }
        Update: {
          bus_id?: string | null
          complaint_type?: string
          coordinator_notes?: string | null
          created_at?: string
          description?: string
          id?: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          student_id?: string | null
          trip_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "complaints_bus_id_fkey"
            columns: ["bus_id"]
            isOneToOne: false
            referencedRelation: "buses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "complaints_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "complaints_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "complaints_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "bus_trips"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          profile_photo_url: string | null
          region: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          usn: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          name: string
          phone?: string | null
          profile_photo_url?: string | null
          region?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          usn?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          profile_photo_url?: string | null
          region?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          usn?: string | null
        }
        Relationships: []
      }
      route_stops: {
        Row: {
          created_at: string
          estimated_arrival_offset: number | null
          id: string
          route_id: string | null
          stop_name: string
          stop_order: number
        }
        Insert: {
          created_at?: string
          estimated_arrival_offset?: number | null
          id?: string
          route_id?: string | null
          stop_name: string
          stop_order: number
        }
        Update: {
          created_at?: string
          estimated_arrival_offset?: number | null
          id?: string
          route_id?: string | null
          stop_name?: string
          stop_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "route_stops_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
        ]
      }
      routes: {
        Row: {
          created_at: string
          description: string | null
          distance: number | null
          end_location: string
          estimated_duration: number | null
          id: string
          name: string
          start_location: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          distance?: number | null
          end_location: string
          estimated_duration?: number | null
          id?: string
          name: string
          start_location: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          distance?: number | null
          end_location?: string
          estimated_duration?: number | null
          id?: string
          name?: string
          start_location?: string
          updated_at?: string
        }
        Relationships: []
      }
      schedules: {
        Row: {
          bus_id: string | null
          created_at: string
          days_of_week: string[]
          departure_time: string
          id: string
          is_active: boolean | null
          route_id: string | null
          updated_at: string
        }
        Insert: {
          bus_id?: string | null
          created_at?: string
          days_of_week: string[]
          departure_time: string
          id?: string
          is_active?: boolean | null
          route_id?: string | null
          updated_at?: string
        }
        Update: {
          bus_id?: string | null
          created_at?: string
          days_of_week?: string[]
          departure_time?: string
          id?: string
          is_active?: boolean | null
          route_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedules_bus_id_fkey"
            columns: ["bus_id"]
            isOneToOne: false
            referencedRelation: "buses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedules_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
        ]
      }
      student_bus_subscriptions: {
        Row: {
          created_at: string
          id: string
          schedule_id: string | null
          student_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          schedule_id?: string | null
          student_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          schedule_id?: string | null
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_bus_subscriptions_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "schedules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_bus_subscriptions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      votes: {
        Row: {
          created_at: string
          id: string
          option_id: string | null
          student_id: string | null
          topic_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          option_id?: string | null
          student_id?: string | null
          topic_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          option_id?: string | null
          student_id?: string | null
          topic_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "votes_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: false
            referencedRelation: "voting_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "voting_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      voting_options: {
        Row: {
          created_at: string
          id: string
          option_text: string
          topic_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          option_text: string
          topic_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          option_text?: string
          topic_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "voting_options_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "voting_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      voting_topics: {
        Row: {
          created_at: string
          created_by: string | null
          description: string
          end_date: string
          id: string
          start_date: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description: string
          end_date: string
          id?: string
          start_date: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string
          end_date?: string
          id?: string
          start_date?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "voting_topics_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
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
      user_role: "student" | "driver" | "coordinator" | "admin"
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
