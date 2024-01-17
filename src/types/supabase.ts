import { HotDealDataType } from "./types";

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
      category_keyword: {
        Row: {
          category: string | null;
          created_at: string;
          id: number;
          keyword: string | null;
        };
        Insert: {
          category?: string | null;
          created_at?: string;
          id?: number;
          keyword?: string | null;
        };
        Update: {
          category?: string | null;
          created_at?: string;
          id?: number;
          keyword?: string | null;
        };
        Relationships: [];
      };
      deal_list: {
        Row: {
          category: string | null;
          created_at: string | null;
          hit: number | null;
          is_soldout: boolean | null;
          num_reply: number | null;
          site: string | null;
          site_id: string;
          thumbnail_url: string | null;
          title: string | null;
          updated_at: string | null;
          uploaded_time: string | null;
          url: string | null;
        };
        Insert: {
          category?: string | null;
          created_at?: string | null;
          hit?: number | null;
          is_soldout?: boolean | null;
          num_reply?: number | null;
          site?: string | null;
          site_id: string;
          thumbnail_url?: string | null;
          title?: string | null;
          updated_at?: string | null;
          uploaded_time?: string | null;
          url?: string | null;
        };
        Update: {
          category?: string | null;
          created_at?: string | null;
          hit?: number | null;
          is_soldout?: boolean | null;
          num_reply?: number | null;
          site?: string | null;
          site_id?: string;
          thumbnail_url?: string | null;
          title?: string | null;
          updated_at?: string | null;
          uploaded_time?: string | null;
          url?: string | null;
        };
        Relationships: [];
      };
      deal_list_old: {
        Row: {
          category: string | null;
          created_at: string | null;
          hit: number | null;
          is_soldout: boolean | null;
          num_reply: number | null;
          site: string | null;
          site_id: string;
          thumbnail_url: string | null;
          title: string | null;
          updated_at: string | null;
          uploaded_time: string | null;
          url: string | null;
        };
        Insert: {
          category?: string | null;
          created_at?: string | null;
          hit?: number | null;
          is_soldout?: boolean | null;
          num_reply?: number | null;
          site?: string | null;
          site_id: string;
          thumbnail_url?: string | null;
          title?: string | null;
          updated_at?: string | null;
          uploaded_time?: string | null;
          url?: string | null;
        };
        Update: {
          category?: string | null;
          created_at?: string | null;
          hit?: number | null;
          is_soldout?: boolean | null;
          num_reply?: number | null;
          site?: string | null;
          site_id?: string;
          thumbnail_url?: string | null;
          title?: string | null;
          updated_at?: string | null;
          uploaded_time?: string | null;
          url?: string | null;
        };
        Relationships: [];
      };
      notice: {
        Row: {
          contents: string | null;
          created_at: string | null;
          id: number;
          title: string | null;
        };
        Insert: {
          contents?: string | null;
          created_at?: string | null;
          id?: number;
          title?: string | null;
        };
        Update: {
          contents?: string | null;
          created_at?: string | null;
          id?: number;
          title?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_top_3_by_category: {
        Args: Record<PropertyKey, never>;
        Returns: {
          site: string;
          site_id: string;
          thumbnail_url: string;
          category: string;
          title: string;
          is_soldout: boolean;
          num_reply: number;
          hit: number;
          uploaded_time: string;
          created_at: string;
          updated_at: string;
          url: string;
          row_num: number;
        }[];
      };
      get_unique_categories: {
        Args: Record<PropertyKey, never>;
        Returns: {
          categorylist: string;
        }[];
      };
      initial_category_deal_request: {
        Args: Record<PropertyKey, never>;
        Returns: {
          site: string;
          site_id: string;
          thumbnail_url: string;
          category: string;
          title: string;
          is_soldout: boolean;
          num_reply: number;
          hit: number;
          uploaded_time: string;
          created_at: string;
          updated_at: string;
          url: string;
          row_num: number;
        }[];
      };
      modify_food_category_to_health_category: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      move_old_data: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      update_category_with_keyword: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      update_deal_list: {
        Args: {
          item: HotDealDataType[];
        };
        Returns: undefined;
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
    : never = never
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
    : never = never
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
    : never = never
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
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never;
