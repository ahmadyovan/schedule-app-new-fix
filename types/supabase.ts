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
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
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
      dosen: {
        Row: {
          created_at: string
          id: number
          nama: string
          prodi: number | null
          uid: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          nama: string
          prodi?: number | null
          uid?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          nama?: string
          prodi?: number | null
          uid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dosen_prodi_fkey"
            columns: ["prodi"]
            isOneToOne: false
            referencedRelation: "prodi"
            referencedColumns: ["id"]
          },
        ]
      }
      jadwal: {
        Row: {
          create_at: string
          hari: number | null
          id: number
          id_dosen: number | null
          id_kelas: number | null
          id_mata_kuliah: number
          id_waktu: number | null
          jam_akhir: string | null
          jam_mulai: string | null
        }
        Insert: {
          create_at?: string
          hari?: number | null
          id?: number
          id_dosen?: number | null
          id_kelas?: number | null
          id_mata_kuliah: number
          id_waktu?: number | null
          jam_akhir?: string | null
          jam_mulai?: string | null
        }
        Update: {
          create_at?: string
          hari?: number | null
          id?: number
          id_dosen?: number | null
          id_kelas?: number | null
          id_mata_kuliah?: number
          id_waktu?: number | null
          jam_akhir?: string | null
          jam_mulai?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jadwal_id_dosen_fkey"
            columns: ["id_dosen"]
            isOneToOne: false
            referencedRelation: "dosen"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jadwal_id_kelas_fkey"
            columns: ["id_kelas"]
            isOneToOne: false
            referencedRelation: "kelas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jadwal_id_mata_kuliah_fkey"
            columns: ["id_mata_kuliah"]
            isOneToOne: false
            referencedRelation: "mata_kuliah"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jadwal_id_waktu_fkey"
            columns: ["id_waktu"]
            isOneToOne: false
            referencedRelation: "waktu"
            referencedColumns: ["id"]
          },
        ]
      }
      kaprodi: {
        Row: {
          created_at: string
          id: number
          name: string
          prodi: number
          uid: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          prodi: number
          uid: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          prodi?: number
          uid?: string
        }
        Relationships: [
          {
            foreignKeyName: "kaprodi_prodi_fkey"
            columns: ["prodi"]
            isOneToOne: false
            referencedRelation: "prodi"
            referencedColumns: ["id"]
          },
        ]
      }
      kelas: {
        Row: {
          created_at: string
          id: number
          kode: string | null
          nama: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          kode?: string | null
          nama?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          kode?: string | null
          nama?: string | null
        }
        Relationships: []
      }
      mata_kuliah: {
        Row: {
          created_at: string
          id: number
          kode: number
          nama: string
          prodi: number
          semester: number
          sks: number
        }
        Insert: {
          created_at?: string
          id?: number
          kode: number
          nama: string
          prodi: number
          semester: number
          sks: number
        }
        Update: {
          created_at?: string
          id?: number
          kode?: number
          nama?: string
          prodi?: number
          semester?: number
          sks?: number
        }
        Relationships: []
      }
      prefMatkul: {
        Row: {
          created_at: string
          dosen: number
          id: number
          matkul: number
        }
        Insert: {
          created_at?: string
          dosen: number
          id?: number
          matkul: number
        }
        Update: {
          created_at?: string
          dosen?: number
          id?: number
          matkul?: number
        }
        Relationships: [
          {
            foreignKeyName: "prefMataKuliah_dosen_fkey"
            columns: ["dosen"]
            isOneToOne: false
            referencedRelation: "dosen"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prefMataKuliah_mataKuliah_fkey"
            columns: ["matkul"]
            isOneToOne: false
            referencedRelation: "mata_kuliah"
            referencedColumns: ["id"]
          },
        ]
      }
      prefWaktu: {
        Row: {
          created_at: string
          dosen: number | null
          id: number
          jumatMalam: boolean | null
          jumatPagi: boolean | null
          kamisMalam: boolean | null
          kamisPagi: boolean | null
          rabuMalam: boolean | null
          rabuPagi: boolean | null
          selasaMalam: boolean | null
          selasaPagi: boolean | null
          seninMalam: boolean | null
          seninPagi: boolean | null
        }
        Insert: {
          created_at?: string
          dosen?: number | null
          id?: number
          jumatMalam?: boolean | null
          jumatPagi?: boolean | null
          kamisMalam?: boolean | null
          kamisPagi?: boolean | null
          rabuMalam?: boolean | null
          rabuPagi?: boolean | null
          selasaMalam?: boolean | null
          selasaPagi?: boolean | null
          seninMalam?: boolean | null
          seninPagi?: boolean | null
        }
        Update: {
          created_at?: string
          dosen?: number | null
          id?: number
          jumatMalam?: boolean | null
          jumatPagi?: boolean | null
          kamisMalam?: boolean | null
          kamisPagi?: boolean | null
          rabuMalam?: boolean | null
          rabuPagi?: boolean | null
          selasaMalam?: boolean | null
          selasaPagi?: boolean | null
          seninMalam?: boolean | null
          seninPagi?: boolean | null
        }
        Relationships: []
      }
      prodi: {
        Row: {
          created_at: string
          id: number
          nama: string
        }
        Insert: {
          created_at?: string
          id?: number
          nama: string
        }
        Update: {
          created_at?: string
          id?: number
          nama?: string
        }
        Relationships: []
      }
      waktu: {
        Row: {
          created_at: string
          id: number
          nama: string
        }
        Insert: {
          created_at?: string
          id?: number
          nama: string
        }
        Update: {
          created_at?: string
          id?: number
          nama?: string
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
