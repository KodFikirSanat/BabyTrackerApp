import {jest} from '@jest/globals';

jest.mock('@react-native-firebase/app', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    // Add any app methods you use in your code
  })),
}));

jest.mock('@react-native-firebase/auth', () => ({
  __esModule: true,
  getAuth: jest.fn(() => ({})),
  onAuthStateChanged: jest.fn((auth, cb) => {
    // Immediately invoke callback with null user by default
    if (typeof cb === 'function') cb(null);
    return jest.fn();
  }),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock('@react-native-firebase/firestore', () => ({
  __esModule: true,
  getFirestore: jest.fn(() => ({})),
  collection: jest.fn((...args) => ({ __collectionArgs: args })),
  doc: jest.fn((...args) => ({ __docArgs: args })),
  setDoc: jest.fn(() => Promise.resolve()),
  addDoc: jest.fn(() => Promise.resolve({ id: 'mock-doc-id' })),
  onSnapshot: jest.fn((q, next) => {
    if (typeof next === 'function') next({ docs: [], empty: true });
    return jest.fn();
  }),
  query: jest.fn((...args) => ({ __queryArgs: args })),
  where: jest.fn(() => ({ __where: true })),
  orderBy: jest.fn(() => ({ __orderBy: true })),
  serverTimestamp: jest.fn(() => ({ __serverTimestamp: true })),
  Timestamp: { fromDate: jest.fn(date => ({ toDate: () => date })) },
  arrayUnion: jest.fn((...vals) => ({ __arrayUnion: vals })),
}));

jest.mock('@react-native-firebase/messaging', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    requestPermission: jest.fn(),
    getToken: jest.fn(() => Promise.resolve('mock-fcm-token')),
    onTokenRefresh: jest.fn(() => jest.fn()),
  })),
}));
