export type Mood =
  | 'peaceful'
  | 'grateful'
  | 'hopeful'
  | 'motivated'
  | 'tired'
  | 'sad'
  | 'anxious'
  | 'reflective'

export interface Profile {
  id: string
  full_name: string | null
  email: string | null
  theme: string
  created_at: string
  updated_at: string
}

export interface JournalEntry {
  id: string
  user_id: string
  title: string | null
  content: string | null
  mood: Mood | null
  energy_level: number | null
  gratitude: string | null
  lessons_learned: string | null
  dua_requests: string | null
  is_draft: boolean
  created_at: string
  updated_at: string
}

export interface MoodLog {
  id: string
  user_id: string
  mood: Mood
  note: string | null
  logged_at: string
}

export interface Habit {
  id: string
  user_id: string
  name: string
  category: string
  icon: string
  is_active: boolean
  created_at: string
}

export interface HabitLog {
  id: string
  habit_id: string
  user_id: string
  completed_date: string
  created_at: string
}