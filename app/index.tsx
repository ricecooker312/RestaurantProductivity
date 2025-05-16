import { View, Text, Image, TouchableOpacity, TouchableHighlight } from 'react-native'
import React, { useEffect } from 'react'
import { Link, router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { icons } from '@/constants/icons'

const index = () => {
  useEffect(() => {
    const isAuthenticated = async () => {
      if (!await AsyncStorage.getItem('accessToken')) {
        router.navigate('/onboarding')
      }
    }

    isAuthenticated()
  }, [])

  const signOut = async () => {
    await AsyncStorage.removeItem('accessToken')
    router.navigate('/onboarding')
  }

  return (
    <View className='bg-dfbg w-screen h-screen'>
      <View className='flex flex-row flex-wrap mt-12 items-center'>
        <Image source={icons.logo} className='w-[3.875rem] h-[2.9375rem] m-4 ml-8' />

        <View className='flex-row items-center mx-[1rem]'>
          <Image source={icons.streak} className='w-[4rem] h-[4rem]' />
          <Text className='text-xl'>6</Text>
        </View>

        <TouchableHighlight
          className='p-4 px-8 bg-primary justify-self-end ml-auto mr-8 rounded-xl'
          underlayColor={'#0014C7'}
          onPress={signOut}
        >
          <Text className='color-white text-lg'>Sign Out</Text>
        </TouchableHighlight>

        <Image source={icons.clock} className='m-4' />

        <View className='flex-col mb-[1px]'>
          <Text className='color-dark-heading font-bold text-3xl m-4 mt-0'>8 hours 36 minutes</Text>
          <TouchableOpacity className='ml-4' activeOpacity={0.55}>
            <Text className='text-lg color-link'>See your historic screen time</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default index