import { initializeApp } from 'firebase/app'

const firebaseConfig = {
    apiKey: 'AIzaSyD4CTR6E1kHbaQF3suSssjwHIGaMWy275c',
    authDomain: 'restaurantproductivity-cf10a.firebaseapp.com',
    projectId: 'restaurantproductivity-cf10a',
    storageBucket: 'restaurantproductivity-cf10a.firebasestorage.app',
    messagingSenderId: '397207498914',
    appId: '1:397207498914:web:567f8f894b3014a173e7fb',
    measurementId: 'G-4GVQKPFLDB'
}

export const app = initializeApp(firebaseConfig)