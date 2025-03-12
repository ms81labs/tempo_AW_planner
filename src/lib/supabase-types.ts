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
      alliances: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          logo_url: string | null;
          name: string;
          tag: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          logo_url?: string | null;
          name: string;
          tag: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          logo_url?: string | null;
          name?: string;
          tag?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      attack_assignments: {
        Row: {
          battlegroup_id: string;
          champion_id: string | null;
          comment: string | null;
          created_at: string;
          id: string;
          node_number: number;
          updated_at: string;
          user_id: string;
          war_id: string;
        };
        Insert: {
          battlegroup_id: string;
          champion_id?: string | null;
          comment?: string | null;
          created_at?: string;
          id?: string;
          node_number: number;
          updated_at?: string;
          user_id: string;
          war_id: string;
        };
        Update: {
          battlegroup_id?: string;
          champion_id?: string | null;
          comment?: string | null;
          created_at?: string;
          id?: string;
          node_number?: number;
          updated_at?: string;
          user_id?: string;
          war_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "attack_assignments_battlegroup_id_fkey";
            columns: ["battlegroup_id"];
            isOneToOne: false;
            referencedRelation: "battlegroups";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "attack_assignments_champion_id_fkey";
            columns: ["champion_id"];
            isOneToOne: false;
            referencedRelation: "user_champions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "attack_assignments_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "attack_assignments_war_id_fkey";
            columns: ["war_id"];
            isOneToOne: false;
            referencedRelation: "wars";
            referencedColumns: ["id"];
          },
        ];
      };
      battlegroup_members: {
        Row: {
          battlegroup_id: string;
          created_at: string;
          id: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          battlegroup_id: string;
          created_at?: string;
          id?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          battlegroup_id?: string;
          created_at?: string;
          id?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "battlegroup_members_battlegroup_id_fkey";
            columns: ["battlegroup_id"];
            isOneToOne: false;
            referencedRelation: "battlegroups";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "battlegroup_members_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      battlegroups: {
        Row: {
          alliance_id: string;
          created_at: string;
          id: string;
          name: string;
          updated_at: string;
        };
        Insert: {
          alliance_id: string;
          created_at?: string;
          id?: string;
          name: string;
          updated_at?: string;
        };
        Update: {
          alliance_id?: string;
          created_at?: string;
          id?: string;
          name?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "battlegroups_alliance_id_fkey";
            columns: ["alliance_id"];
            isOneToOne: false;
            referencedRelation: "alliances";
            referencedColumns: ["id"];
          },
        ];
      };
      champions: {
        Row: {
          class: string;
          created_at: string;
          id: string;
          name: string;
          updated_at: string;
        };
        Insert: {
          class: string;
          created_at?: string;
          id?: string;
          name: string;
          updated_at?: string;
        };
        Update: {
          class?: string;
          created_at?: string;
          id?: string;
          name?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      defense_nodes: {
        Row: {
          assigned_by: string | null;
          assigned_champion_id: string | null;
          battlegroup_id: string;
          created_at: string;
          id: string;
          node_number: number;
          path_number: number;
          path_type: string;
          position: string;
          updated_at: string;
          war_id: string;
        };
        Insert: {
          assigned_by?: string | null;
          assigned_champion_id?: string | null;
          battlegroup_id: string;
          created_at?: string;
          id?: string;
          node_number: number;
          path_number: number;
          path_type: string;
          position: string;
          updated_at?: string;
          war_id: string;
        };
        Update: {
          assigned_by?: string | null;
          assigned_champion_id?: string | null;
          battlegroup_id?: string;
          created_at?: string;
          id?: string;
          node_number?: number;
          path_number?: number;
          path_type?: string;
          position?: string;
          updated_at?: string;
          war_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "defense_nodes_assigned_by_fkey";
            columns: ["assigned_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "defense_nodes_assigned_champion_id_fkey";
            columns: ["assigned_champion_id"];
            isOneToOne: false;
            referencedRelation: "user_champions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "defense_nodes_battlegroup_id_fkey";
            columns: ["battlegroup_id"];
            isOneToOne: false;
            referencedRelation: "battlegroups";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "defense_nodes_war_id_fkey";
            columns: ["war_id"];
            isOneToOne: false;
            referencedRelation: "wars";
            referencedColumns: ["id"];
          },
        ];
      };
      user_champions: {
        Row: {
          champion_id: string;
          created_at: string;
          id: string;
          rank: string;
          rarity: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          champion_id: string;
          created_at?: string;
          id?: string;
          rank: string;
          rarity: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          champion_id?: string;
          created_at?: string;
          id?: string;
          rank?: string;
          rarity?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_champions_champion_id_fkey";
            columns: ["champion_id"];
            isOneToOne: false;
            referencedRelation: "champions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_champions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      users: {
        Row: {
          alliance_id: string | null;
          avatar_url: string | null;
          created_at: string;
          id: string;
          role: string;
          updated_at: string;
          username: string;
        };
        Insert: {
          alliance_id?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          id: string;
          role: string;
          updated_at?: string;
          username: string;
        };
        Update: {
          alliance_id?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          id?: string;
          role?: string;
          updated_at?: string;
          username?: string;
        };
        Relationships: [
          {
            foreignKeyName: "users_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      war_seasons: {
        Row: {
          created_at: string;
          end_date: string;
          id: string;
          name: string;
          start_date: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          end_date: string;
          id?: string;
          name: string;
          start_date: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          end_date?: string;
          id?: string;
          name?: string;
          start_date?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      wars: {
        Row: {
          alliance_id: string;
          alliance_score: number | null;
          created_at: string;
          id: string;
          opponent_name: string;
          opponent_score: number | null;
          result: string | null;
          season_id: string;
          tier: number;
          updated_at: string;
          war_date: string;
        };
        Insert: {
          alliance_id: string;
          alliance_score?: number | null;
          created_at?: string;
          id?: string;
          opponent_name: string;
          opponent_score?: number | null;
          result?: string | null;
          season_id: string;
          tier: number;
          updated_at?: string;
          war_date: string;
        };
        Update: {
          alliance_id?: string;
          alliance_score?: number | null;
          created_at?: string;
          id?: string;
          opponent_name?: string;
          opponent_score?: number | null;
          result?: string | null;
          season_id?: string;
          tier?: number;
          updated_at?: string;
          war_date?: string;
        };
        Relationships: [
          {
            foreignKeyName: "wars_alliance_id_fkey";
            columns: ["alliance_id"];
            isOneToOne: false;
            referencedRelation: "alliances";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "wars_season_id_fkey";
            columns: ["season_id"];
            isOneToOne: false;
            referencedRelation: "war_seasons";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      handle_new_user: {
        Args: Record<PropertyKey, never>;
        Returns: unknown;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never;
