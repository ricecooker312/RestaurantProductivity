import { View, Text, TouchableHighlight } from 'react-native'
import React from 'react'
import TabFooter from '@/components/TabFooter'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

const profile = () => {
  const signOut = async () => {
    await AsyncStorage.removeItem('accessToken')
    router.navigate('/onboarding')
  }

  const insets = useSafeAreaInsets()

  return (
    <View className='bg-dfbg flex-1'>
      <SafeAreaView
        style={{
          flex: 1,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingRight: insets.right,
          paddingLeft: insets.left
        }}
      >
        <View className='flex-1 justify-center items-center w-full'>
          <TouchableHighlight 
            className='p-8 bg-primary rounded-xl'
            underlayColor={'#0014C7'}
            onPress={signOut}
          >
            <Text className='color-white text-xl'>Sign Out</Text>
          </TouchableHighlight>
        </View>
        
        <TabFooter page='profile' />
      </SafeAreaView>
    </View>
  )
}

export default profile