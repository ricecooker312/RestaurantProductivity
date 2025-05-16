import { View, Text, Image, TouchableOpacity, TouchableHighlight, TouchableWithoutFeedback, Alert, ScrollView } from 'react-native'
import React, { useEffect } from 'react'
import { Link, router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { icons } from '@/constants/icons'
import { images } from '@/constants/images'
import TabFooter from '@/components/TabFooter'

const index = () => {
  useEffect(() => {
    const isAuthenticated = async () => {
      if (!await AsyncStorage.getItem('accessToken')) {
        router.navigate('/onboarding')
      }
    }

    isAuthenticated()
  }, [])

  return (
    <>
      <ScrollView className='bg-dfbg w-screen h-screen'>
        <View className='flex flex-row flex-wrap mt-12 items-center justify-center'>

          <TouchableWithoutFeedback onPress={() => Alert.alert('you clicked!')}>
            <Image source={icons.logo} className='w-[3.875rem] h-[2.9375rem] m-4 ml-8' />
          </TouchableWithoutFeedback>

          <View className='flex-row items-center mx-[1rem]'>
            <Image source={icons.streak} className='w-[4rem] h-[4rem]' />
            <Text className='text-xl'>6</Text>
          </View>

          <TouchableHighlight
            className='p-4 px-8 bg-primary justify-self-end ml-auto mr-8 rounded-xl'
            underlayColor={'#0014C7'}
            onPress={() => {}}
          >
            <Text className='color-white text-lg'>Set a New Goal</Text>
          </TouchableHighlight>

          <Image source={icons.clock} className='m-4' />

          <View className='flex-col mb-[1px]'>
            <Text className='color-dark-heading font-bold text-3xl m-4 mt-0'>8 hours 36 minutes</Text>
            <TouchableOpacity className='ml-4' activeOpacity={0.55}>
              <Text className='text-lg color-link'>See your historic screen time</Text>
            </TouchableOpacity>
          </View>

          <View className='flex-col items-center w-[85vw] p-4 pt-8 pb-8 mt-12 bg-light-100 rounded-3xl border-2'>
            <Image source={images.restuarant} className='w-full' />
            <TouchableHighlight 
              className='bg-primary w-9/12 rounded-2xl mt-8 h-16 flex flex-row items-center'
              underlayColor={'#0014C7'}
              onPress={() => {}}
            >
              <Text className='w-full text-center color-white text-xl'>Visit your Restaurant</Text>
            </TouchableHighlight>
          </View>
        </View>

        <View className='border-2'>
          <Text>Goals</Text>
        </View>
      </ScrollView>
      <TabFooter page='home' />
    </>
  )
}

export default index