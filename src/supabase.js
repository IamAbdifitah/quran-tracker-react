import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://fekzwbcebtrngitcxxcc.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZla3p3YmNlYnRybmdpdGN4eGNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5MzYxMjgsImV4cCI6MjA4MTUxMjEyOH0.4QdR4XkDHAd1x47hGoIIE81v6raogv8IqMsdhtZ1bOY";

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);
