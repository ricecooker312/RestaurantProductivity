import { View, Text, TouchableOpacity, TouchableHighlight } from 'react-native'
import React, { useEffect } from 'react'
import { Link, router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const ipAddress = process.env.IP_ADDRESS

const index = () => {
  useEffect(() => {
    const isAuthenticated = async () => {
      if (!await AsyncStorage.getItem('accessToken')) {
        router.navigate('/onboarding')
      }
    }

    // isAuthenticated()
    router.replace('/onboarding')
  }, [])

  return (
    <View className='flex-1 items-center justify-center bg-white'>
      <TouchableOpacity onPress={() => router.replace('/onboarding')}>
        <Text className='p-4 px-16 text-xl rounded-lg bg-sky-500'>Go to onboarding</Text>
      </TouchableOpacity>
      <TouchableHighlight className='p-4 px-16 text-xl rounded-lg bg-sky-500 mt-12' underlayColor={'sky-100'} onPress={() => {}}>
        <Text>Sign Out</Text>
      </TouchableHighlight>
    </View>
  )
}

export default index