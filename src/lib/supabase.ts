import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      homes: {
        Row: {
          id: string;
          name: string;
          description: string;
          owner_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string;
          owner_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          owner_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      home_members: {
        Row: {
          id: string;
          home_id: string;
          user_id: string;
          role: 'owner' | 'member';
          joined_at: string;
        };
        Insert: {
          id?: string;
          home_id: string;
          user_id: string;
          role?: 'owner' | 'member';
          joined_at?: string;
        };
        Update: {
          id?: string;
          home_id?: string;
          user_id?: string;
          role?: 'owner' | 'member';
          joined_at?: string;
        };
      };
      rooms: {
        Row: {
          id: string;
          name: string;
          home_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          home_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          home_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      items: {
        Row: {
          id: string;
          name: string;
          category: string;
          location: string;
          description: string;
          home_id: string;
          room_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category?: string;
          location?: string;
          description?: string;
          home_id: string;
          room_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string;
          location?: string;
          description?: string;
          home_id?: string;
          room_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      invitations: {
        Row: {
          id: string;
          home_id: string;
          email: string;
          invited_by: string;
          status: 'pending' | 'accepted' | 'rejected';
          created_at: string;
          expires_at: string;
        };
        Insert: {
          id?: string;
          home_id: string;
          email: string;
          invited_by: string;
          status?: 'pending' | 'accepted' | 'rejected';
          created_at?: string;
          expires_at?: string;
        };
        Update: {
          id?: string;
          home_id?: string;
          email?: string;
          invited_by?: string;
          status?: 'pending' | 'accepted' | 'rejected';
          created_at?: string;
          expires_at?: string;
        };
      };
    };
  };
};