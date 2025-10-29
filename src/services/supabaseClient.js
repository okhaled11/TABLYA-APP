import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://hzqeraiapeyyerkvdiod.supabase.co";
const supabaseAnonKey ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6cWVyYWlhcGV5eWVya3ZkaW9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2Njk4ODUsImV4cCI6MjA3NzI0NTg4NX0.uknwknbJ-mg2OCfhnDDQoX_q2eN0CcOm5p4RCbk7h3Y";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
