export type CounselingType = 'peer' | 'professional' | 'test';

export type ReservationStatus = 'pending' | 'approved' | 'completed' | 'canceled';

export interface Reservation {
  id: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // HH:MM
  name: string;
  isAnonymous: boolean;
  grade: string; // '1' | '2' | '3'
  classGroup: string; // 반 (e.g., '1', '2', ...)
  contact: string; // 연락처 또는 카카오톡 ID
  type: CounselingType;
  message: string;
  status: ReservationStatus;
  counselorNotes?: string;
  createdAt: string;
  password?: string;
}

export interface DailyQuote {
  text: string;
  author: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface WeeClassSettings {
  workingHours: string[]; // e.g. ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00']
  breakTime: string; // e.g. '12:00'
  blackoutDates: string[]; // ['2026-06-03', ...] (e.g. exam periods)
  kakaoLink: string;
  location: string;
  counselorName: string;
}

export interface AdminConfig {
  announcement: string;
  heroTitle: string;
  heroSubtitle: string;
  dailyQuote: DailyQuote;
  faqList: FaqItem[];
  settings: WeeClassSettings;
}
