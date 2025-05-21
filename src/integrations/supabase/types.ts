export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface TeacherRatings {
  id: string; // uuid
  teacher_id: string | null;
  student_id: string | null;
  rating: number | null;
  created_at: string | null; // timestamptz
  feedback: string | null;
  session_id: string | null;
}

export interface Database {
  public: {
    Tables: {
      teacher_ratings: {
        Row: TeacherRatings;
        Insert: {
          id?: string;
          teacher_id?: string | null;
          student_id?: string | null;
          rating?: number | null;
          created_at?: string | null;
          feedback?: string | null;
          session_id?: string | null;
        };
        Update: {
          id?: string;
          teacher_id?: string | null;
          student_id?: string | null;
          rating?: number | null;
          created_at?: string | null;
          feedback?: string | null;
          session_id?: string | null;
        };
      };
      // other tables can be added here as needed
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
}
