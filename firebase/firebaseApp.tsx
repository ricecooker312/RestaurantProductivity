import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: 'AIzaSyD4CTR6E1kHbaQF3suSssjwHIGaMWy275c',
  authDomain: 'restuarantproductivity-cf10a.firebaseapp.com',
  projectId: 'restaurantproductivity-cf10a',
  storageBucket: 'restaurantproductivity-cf10a.firebasestorage.app',
  messagingSenderId: '397207498914',
  appId: '1:397207498914:web:567f8f894b3014a173e7fb',
  measurementId: 'G-4GVQKPFLDB'
}

const app = initializeApp(firebaseConfig)
export const analytics = getAnalytics(app)
export const auth = getAuth()

export default app