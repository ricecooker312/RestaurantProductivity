import { View, Text, TouchableHighlight } from 'react-native'
import React from 'react'
import TabFooter from '@/components/TabFooter'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'

const profile = () => {
  const signOut = async () => {
    await AsyncStorage.removeItem('accessToken')
    router.navigate('/onboarding')
  }

  return (
    <View className='bg-dfbg w-screen h-screen flex justify-center items-center'>
      <TouchableHighlight 
        className='p-8 bg-primary rounded-xl'
        underlayColor={'#0014C7'}
        onPress={signOut}
    >
        <Text className='color-white text-xl'>Sign Out</Text>
      </TouchableHighlight>
      <TabFooter page='profile' />
    </View>
  )
}

export default profile