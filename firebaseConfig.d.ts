declare module '@/firebaseConfig' {
  import { initializeApp } from 'firebase/app';
  import { getAuth } from 'firebase/auth';
  import { getFirestore } from 'firebase/firestore';

  export const firebaseConfig: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };

  export const app: ReturnType<typeof initializeApp>;
  export const auth: ReturnType<typeof getAuth>;
  export const db: ReturnType<typeof getFirestore>;
} 