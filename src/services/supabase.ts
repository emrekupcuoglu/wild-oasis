import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";
export const supabaseUrl = "https://tzocmpsvbdhjihgejtvx.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6b2NtcHN2YmRoamloZ2VqdHZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3OTA4MDAsImV4cCI6MjA1NDM2NjgwMH0.hKJPXbw3f6guCcslxJ1iXj4o76wjOvXxS81HlZcogv4";
const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export default supabase;
