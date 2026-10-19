export type Screen = 'home' | 'results' | 'survey' | 'subjects' | 'profile';

export interface Subject {
  id: string; // antes era number; ahora es el id real (UUID) que asigna el backend
  name: string;
  score: number;
}

export interface AppState {
  studentName: string;
  subjects: Subject[];
  surveyAnswers: number[];
  lastSurveyDate: string | null;
}
