import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";
// import dotenv from "dotenv";
import "dotenv/config";

// let path;

// switch (process.env.NODE_ENV) {
//   case "prod":
//     path = `${process.cwd()}/.env.prod`;
//     break;
//   case "dev":
//     path = `${process.cwd()}/.env.dev`;
//     break;
//   default:
//     path = `${process.cwd()}/.env.local`;
// }

// dotenv.config({
//   path,
// });

export const supabase = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: false,
      detectSessionInUrl: true,
    },
  }
);
