export interface Organization {
  id: string;
  name: string;
  code: string; // A unique, shareable code for joining
  website: string;
  mobile: string;
  address: string;
  country: string;
  status: 'pending' | 'approved' | 'rejected';
}

export enum UserRole {
  TEACHER = 'teacher',
  STUDENT = 'student',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  TRUE_FALSE = 'true_false',
  DRAG_AND_DROP = 'drag_and_drop',
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  middleName: string;
  lastName:string;
  role: UserRole;
  organizationId?: string; // Every user belongs to an organization, except super admin
  classIds?: string[]; // For students
  points?: number; // For student leaderboard
  lastActivity?: number; // For teacher/admin tracking
}

export interface Question {
  id:string;
  questionText: string;
  type: QuestionType;
  // For MC/TF
  options?: string[];
  correctAnswerIndex?: number; // 0 for A, 1 for B, etc.
  // For Drag and Drop
  items?: string[];
  targets?: string[];
  correctMapping?: { [itemIndex: number]: number }; // itemIndex -> targetIndex
}

export interface Quiz {
  id: string;
  title: string;
  teacherId: string;
  organizationId: string; // Quizzes belong to an organization
  questions: Question[];
  isArchived?: boolean;
  isDeleted?: boolean;
}

export interface Class {
  id: string;
  name: string;
  teacherId: string;
  organizationId: string; // Classes belong to an organization
  code: string;
  studentIds: string[];
  isArchived?: boolean;
  isDeleted?: boolean;
}

export interface Assignment {
  id: string;
  quizId: string;
  classId: string;
  availableFrom: number; // Timestamp for scheduled assignments
}

export enum Gesture {
  THUMBS_UP = 'THUMBS_UP', // A
  OPEN_PALM = 'OPEN_PALM', // B
  PEACE_SIGN = 'PEACE_SIGN', // C
  FIST = 'FIST', // D
  UNKNOWN = 'UNKNOWN',
}

// Types for creating new data
export type NewQuestion = Omit<Question, 'id'>;

export type NewQuiz = {
  title: string;
  questions: NewQuestion[];
};

// --- New Types for Analytics ---

export interface AnswerRecord {
  questionId: string;
  // For MC/TF
  selectedAnswerIndex?: number;
  isCorrect?: boolean;
  // For Drag & Drop
  mapping?: { [itemIndex: number]: number };
}

export interface QuizAttempt {
  id:string;
  quizId: string;
  studentId: string;
  organizationId: string; // Attempts are scoped to an organization
  score: number;
  maxScore: number;
  completedAt: number; // timestamp
  answers: AnswerRecord[];
}

// --- New Type for Notifications ---
export interface Notification {
  id: string;
  userId: string; // The user who receives the notification
  title: string;
  message: string;
  link: string; // URL to navigate to on click
  isRead: boolean;
  createdAt: number; // timestamp
}