export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      schools: {
        Row: {
          id: number;
          name: string;
          website: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: number;
          name: string;
          website?: string | null;
          created_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["schools"]["Insert"]>;
        Relationships: [];
      };
      faculties: {
        Row: {
          id: number;
          name: string;
          school_id: number | null;
          created_at: string | null;
        };
        Insert: {
          id?: number;
          name: string;
          school_id?: number | null;
          created_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["faculties"]["Insert"]>;
        Relationships: [];
      };
      departments: {
        Row: {
          id: number;
          name: string;
          faculty_id: number | null;
          created_at: string | null;
        };
        Insert: {
          id?: number;
          name: string;
          faculty_id?: number | null;
          created_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["departments"]["Insert"]>;
        Relationships: [];
      };
      professors: {
        Row: {
          id: number;
          first_name: string;
          last_name: string;
          email: string | null;
          avatar_url: string | null;
          bio: string | null;
          school_id: number | null;
          created_at: string | null;
        };
        Insert: {
          id?: number;
          first_name: string;
          last_name: string;
          email?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          school_id?: number | null;
          created_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["professors"]["Insert"]>;
        Relationships: [];
      };
      courses: {
        Row: {
          id: number;
          course_code: string;
          name: string;
          description: string | null;
          department_id: number | null;
          created_at: string | null;
        };
        Insert: {
          id?: number;
          course_code: string;
          name: string;
          description?: string | null;
          department_id?: number | null;
          created_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["courses"]["Insert"]>;
        Relationships: [];
      };
      course_professors: {
        Row: {
          course_id: number | null;
          professor_id: number | null;
        };
        Insert: {
          course_id?: number | null;
          professor_id?: number | null;
        };
        Update: Partial<Database["public"]["Tables"]["course_professors"]["Insert"]>;
        Relationships: [];
      };
      tags: {
        Row: {
          id: number;
          name: string;
        };
        Insert: {
          id?: number;
          name: string;
        };
        Update: Partial<Database["public"]["Tables"]["tags"]["Insert"]>;
        Relationships: [];
      };
      course_tags: {
        Row: {
          course_id: number | null;
          tag_id: number | null;
        };
        Insert: {
          course_id?: number | null;
          tag_id?: number | null;
        };
        Update: Partial<Database["public"]["Tables"]["course_tags"]["Insert"]>;
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          username: string;
          first_name: string | null;
          last_name: string | null;
          avatar_url: string | null;
          current_year: number | null;
          type: "student" | "professor";
          role: "user" | "admin";
          school_id: number | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          username: string;
          first_name?: string | null;
          last_name?: string | null;
          avatar_url?: string | null;
          current_year?: number | null;
          type?: "student" | "professor";
          role?: "user" | "admin";
          school_id?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      user_tags: {
        Row: {
          user_id: string | null;
          tag_id: number | null;
        };
        Insert: {
          user_id?: string | null;
          tag_id?: number | null;
        };
        Update: Partial<Database["public"]["Tables"]["user_tags"]["Insert"]>;
        Relationships: [];
      };
      rooms: {
        Row: {
          id: number;
          name: string;
          course_id: number | null;
          creator_id: string | null;
          is_public: boolean | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: number;
          name: string;
          course_id?: number | null;
          creator_id?: string | null;
          is_public?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["rooms"]["Insert"]>;
        Relationships: [];
      };
      room_members: {
        Row: {
          user_id: string | null;
          room_id: number | null;
          role: "owner" | "mod" | "member";
          joined_at: string | null;
        };
        Insert: {
          user_id?: string | null;
          room_id?: number | null;
          role?: "owner" | "mod" | "member";
          joined_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["room_members"]["Insert"]>;
        Relationships: [];
      };
      access_codes: {
        Row: {
          id: string;
          code: string;
          max_uses: number | null;
          num_uses: number | null;
          expires_at: string | null;
          room_id: number | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          code: string;
          max_uses?: number | null;
          num_uses?: number | null;
          expires_at?: string | null;
          room_id?: number | null;
          created_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["access_codes"]["Insert"]>;
        Relationships: [];
      };
      messages: {
        Row: {
          id: number;
          text: string;
          room_id: number | null;
          author_id: string | null;
          parent_id: number | null;
          section: "main" | "resources";
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: number;
          text: string;
          room_id?: number | null;
          author_id?: string | null;
          parent_id?: number | null;
          section?: "main" | "resources";
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["messages"]["Insert"]>;
        Relationships: [];
      };
      attachments: {
        Row: {
          id: number;
          url: string;
          type: "image" | "video" | "audio" | "file" | null;
          mime_type: string | null;
          size: number | null;
          width: number | null;
          height: number | null;
          duration: number | null;
          thumbnail: string | null;
          message_id: number | null;
          created_at: string | null;
        };
        Insert: {
          id?: number;
          url: string;
          type?: "image" | "video" | "audio" | "file" | null;
          mime_type?: string | null;
          size?: number | null;
          width?: number | null;
          height?: number | null;
          duration?: number | null;
          thumbnail?: string | null;
          message_id?: number | null;
          created_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["attachments"]["Insert"]>;
        Relationships: [];
      };
      reviews: {
        Row: {
          id: number;
          rating: number;
          comment: string | null;
          professor_id: number | null;
          author_id: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: number;
          rating: number;
          comment?: string | null;
          professor_id?: number | null;
          author_id?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["reviews"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
