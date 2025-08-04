// src/types/log.ts
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

export type DevelopmentLog = {
  id: string;
  category: 'development';
  type: 'weight' | 'height';
  value: number;
  createdAt: FirebaseFirestoreTypes.Timestamp;
  notes?: string;
};

export type RoutineLog = {
  id: string;
  category: 'routine';
  type: 'sleep' | 'feeding' | 'diaper';
  startTime?: FirebaseFirestoreTypes.Timestamp;
  endTime?: FirebaseFirestoreTypes.Timestamp;
  durationInMinutes?: number;
  notes?: string;
  createdAt: FirebaseFirestoreTypes.Timestamp;
};

export type HealthLog = {
  id: string;
  category: 'health';
  type: 'vaccination' | 'doctor_visit';
  eventName: string;
  eventDate: FirebaseFirestoreTypes.Timestamp;
  notes?: string;
  createdAt: FirebaseFirestoreTypes.Timestamp;
};

export type AnyLog = DevelopmentLog | RoutineLog | HealthLog;

export type Category = 'development' | 'routine' | 'health';
