import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://waktyxmmvkzmzkagekcq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indha3R5eG1tdmt6bXprYWdla2NxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3ODI0NTAsImV4cCI6MjA2NDM1ODQ1MH0._FBlnWAP4wZHZhHlL4Fxufx1n3WFDAFv7hxlMH0ZPrs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);