import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Interview {
  id: string;
  user_id: string;
  job_role: string;
  experience_level: string;
  questions: Array<{
    question: string;
    expected_answer: string;
    key_points: string[];
    scoring_criteria: {
      max: number;
      criteria: string[];
    };
  }>;
  answers: Array<{
    question_index: number;
    answer: string;
    evaluation: {
      score: number;
      feedback: string;
      improvements: string[];
    };
  }>;
  video_url?: string;
  overall_score?: number;
  feedback?: {
    strengths: string[];
    improvements: string[];
    general_feedback: string;
  };
  created_at: string;
}

export async function saveInterview(interviewData: Omit<Interview, 'id' | 'user_id' | 'created_at'>) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError || !userData.user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('interviews')
    .insert([
      {
        ...interviewData,
        user_id: userData.user.id
      }
    ])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function getUserInterviews() {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError || !userData.user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('interviews')
    .select('*')
    .eq('user_id', userData.user.id)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data as Interview[];
}

export async function getInterviewById(id: string) {
  const { data, error } = await supabase
    .from('interviews')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }

  return data as Interview;
}

export async function updateInterview(id: string, updates: Partial<Interview>) {
  const { data, error } = await supabase
    .from('interviews')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Interview;
}