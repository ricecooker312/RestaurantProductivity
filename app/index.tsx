import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

// import { auth } from "@/app/firebaseApp";
// import { onAuthStateChanged } from "firebase/auth";

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

export default function Index() {
  const [uid, setUid] = useState("")

  useEffect(() => {
    const checkLoggedIn = async () => {
      const loggedIn = await AsyncStorage.getItem('loggedIn')

      router.replace('/OnBoarding')
    }

    checkLoggedIn()
  }, [])

  // onAuthStateChanged(auth, (user) => {
  //   if (user) {
  //     console.log('user singed in')
  //     setUid(user.uid)
  //   }
  // })

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Link href={'/OnBoarding'}>go to onboarding</Link>
    </View>
  );
}
