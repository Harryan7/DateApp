import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase yapılandırma bilgileri
// NOT: Gerçek bir uygulamada bu bilgiler .env dosyasına taşınmalıdır
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "tinder-clone-xxx.firebaseapp.com",
  projectId: "tinder-clone-xxx",
  storageBucket: "tinder-clone-xxx.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Firebase uygulamasını başlat
const app = initializeApp(firebaseConfig);

// Authentication servisi
export const auth = getAuth(app);

// Firestore database 
export const db = getFirestore(app);

// Storage servisi (profil resimleri vb. için)
export const storage = getStorage(app);

export default app; 