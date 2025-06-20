import { View, Text, Image, TouchableWithoutFeedback, Alert } from 'react-native'
import React from 'react'

import { icons } from '@/constants/icons'
import { router } from 'expo-router'

const TabFooter = ({ page }: { page: "home" | "restaurant" | "goals" | "social" | "profile" }) => {
  return (
    <View className='absolute flex-1 flex-row items-center w-screen h-[10vh] left-0 bottom-0 z-50 bg-footerbg'>
      <View className={`h-full flex-1 items-center justify-center ${page === 'home' && 'bg-dark-footer'}`}>
        <TouchableWithoutFeedback onPress={() => router.navigate('/')}>
            <Image source={icons.hometab} className='size-12' />
        </TouchableWithoutFeedback>
      </View>
      <View className={`h-full flex-1 items-center justify-center ${page === 'restaurant' && 'bg-dark-footer'}`}>
        <TouchableWithoutFeedback onPress={() => router.navigate('/restaurant')}>
          <Image source={icons.restauranttab} className='size-12' />
        </TouchableWithoutFeedback>
      </View>
      <View className={`h-full flex-1 items-center justify-center ${page === 'goals' && 'bg-dark-footer'}`}>
        <TouchableWithoutFeedback onPress={() => router.navigate('/goals')}>
            <Image source={icons.goalstab} style={{ width: 55, height: 55 }} />
        </TouchableWithoutFeedback>
      </View>
      <View className={`h-full flex-1 items-center justify-center ${page === 'social' && 'bg-dark-footer'}`}>
        <TouchableWithoutFeedback onPress={() => router.navigate('/social')}>
          <Image source={icons.socialtab} className='size-12' />
        </TouchableWithoutFeedback>
      </View>
      <View className={`h-full flex-1 items-center justify-center ${page === 'profile' && 'bg-dark-footer'}`}>
        <TouchableWithoutFeedback onPress={() => router.navigate('/profile')}>
            <Image source={icons.profiletab} className='size-12' />
        </TouchableWithoutFeedback>
      </View>
    </View>
  )
}

export default TabFooter