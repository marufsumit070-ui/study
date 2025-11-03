export type View = 'dashboard' | 'schedule' | 'exams' | 'assignments' | 'notes' | 'resources' | 'subjects';

export interface Subject {
  id: string;
  name: string;
  color: string;
}

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export const DAYS_OF_WEEK: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];


export interface ScheduleEntry {
  id: string;
  subjectId: string;
  day: DayOfWeek;
  startTime: string; // "HH:MM"
  endTime: string; // "HH:MM"
  location: string;
}

export interface Exam {
  id: string;
  subjectId: string;
  title: string;
  date: string; // "YYYY-MM-DD"
}

export interface Assignment {
  id: string;
  subjectId: string;
  title: string;
  dueDate: string; // "YYYY-MM-DD"
  completed: boolean;
}

export interface Note {
  id: string;
  subjectId: string;
  title: string;
  content: string;
  lastModified: number; // timestamp
}

export interface Resource {
  id: string;
  subjectId: string;
  title: string;
  url: string;
}

export type AidType = 'summarize' | 'quiz' | 'explain';
