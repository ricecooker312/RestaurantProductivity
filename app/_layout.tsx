import { Slot, router } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native';

import './global.css'

export default function RootLayout() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      const hasLaunched = await AsyncStorage.getItem('hasLaunched');

      if (!hasLaunched) {
        await AsyncStorage.setItem('hasLaunched', 'true');
        console.log("routing to /onboarding")
        router.replace('/OnBoarding');
      } else {
        setLoading(false);
      }
    };

    checkFirstLaunch();
  }, []);

  if (loading) return <ActivityIndicator className='flex-1 justify-center items-center'  size='large' color='#ffffff' />;

  return <Slot />;
}