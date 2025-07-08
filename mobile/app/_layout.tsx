import { Slot, router } from 'expo-router'
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage"
import { ActivityIndicator } from "react-native";

import './global.css'
import { SafeAreaProvider } from 'react-native-safe-area-context';

import 'react-native-gesture-handler'

export default function RootLayout() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkFirstLaunch = async () => {
      const hasLaunched = await AsyncStorage.getItem('hasLaunched')

      if (!hasLaunched) {
        await AsyncStorage.setItem('hasLaunched', 'true')
        router.replace('/onboarding')
      } else {
        setLoading(false)
      }
    }

    checkFirstLaunch()
  }, [])

  if (loading) {
    return <ActivityIndicator className="flex-1 justify-center items-center mt-[25rem]" size={'large'} color={'#FFFFFF'} />
  }

  return (
    <SafeAreaProvider>
      <Slot />
    </SafeAreaProvider>
  )
}