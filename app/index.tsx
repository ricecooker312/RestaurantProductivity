import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { Link, router } from 'expo-router'

const index = () => {
  useEffect(() => {
    router.replace('/onboarding')
  }, [])

  return (
    <View className='flex-1 items-center justify-center bg-white'>
      <TouchableOpacity onPress={() => router.replace('/onboarding')}>
        <Text className='p-4 px-16 text-xl rounded-lg bg-sky-500'>Go to onboarding</Text>
      </TouchableOpacity>
    </View>
  )
}

export default index