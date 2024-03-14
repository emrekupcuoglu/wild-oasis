import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";
export const supabaseUrl = "https://ghatmracppzfxazityie.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoYXRtcmFjcHB6Znhheml0eWllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDg3MTYyNDUsImV4cCI6MjAyNDI5MjI0NX0._RYJclWV4434aYgsP0uPWAH19J7tEYsCBgb7xu5iN98";
const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export default supabase;
