import { View, Text, Image, TouchableOpacity, TouchableHighlight, TouchableWithoutFeedback, Alert, ScrollView, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { icons } from '@/constants/icons'
import TabFooter from '@/components/TabFooter'
import GoalCard from '@/components/GoalCard'
import { Goal } from '@/types/goalTypes'

import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { images } from '@/constants/images'

const screenWidth = Dimensions.get('window').width

const index = () => {
    const [accessToken, setAccessToken] = useState<string | undefined>()
    const [currentGoals, setCurrentGoals] = useState<Goal[]>([])
    const [aspect, setAspect] = useState(1)
    const [streak, setStreak] = useState(0)

    const insets = useSafeAreaInsets()

    useEffect(() => {
      const isAuthenticated = async () => {
        const useEffectToken = await AsyncStorage.getItem('accessToken')

        if (!useEffectToken) {
          await AsyncStorage.removeItem('coins')
          await AsyncStorage.removeItem('streak')
          router.navigate('/onboarding')
        } else {
          setAccessToken(useEffectToken)
        }
      }

      isAuthenticated()
    }, [])

    useEffect(() => {
      const { width, height } = Image.resolveAssetSource(images.starting_restaurant)
      setAspect(width / height)
    }, [])

    useEffect(() => {
      const fetchGoals = async () => {
        const goalsPayload = {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        }

        const res = await fetch('https://restaurantproductivity.onrender.com/api/goals/find/incomplete', goalsPayload)
        const data = await res.json()

        if (data.error) {
          console.log(data.error)
        } else {
          setCurrentGoals(data.goals)
          
          await AsyncStorage.setItem('streak', `${data.streak}`)
        }
      }

      if (accessToken) fetchGoals()
    }, [accessToken])

    useEffect(() => {
      const findStreak = async () => {
        const fStreak = await AsyncStorage.getItem('streak')
        
        if (!fStreak) {
          await AsyncStorage.removeItem('accessToken')
          await AsyncStorage.removeItem('coins')
          router.navigate('/onboarding')
        } else {
          console.log(fStreak)
          setStreak(parseInt(fStreak))
        }
      }

      if (accessToken) findStreak()
    }, [accessToken])

    const completeGoal = async (id: string) => {
      const completePayload = {
          method: 'PATCH',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Bearer ${accessToken}`
          }
      }

      const res = await fetch(`https://restaurantproductivity.onrender.com/api/goals/${id}/complete`, completePayload)
      const data = await res.json()

      if (data.error) {
          console.log(data.error)
      } else {
        setCurrentGoals(cGoals => cGoals.filter(goal => goal._id !== id))
      }
    }

    return (
      <View className='flex-1 bg-dfbg'>
        <SafeAreaView style={{
          flex: 1,
          paddingTop: Math.max(insets.top - 50, 0),
          paddingBottom: insets.bottom,
          paddingRight: insets.right,
          paddingLeft: insets.left
        }}>
          <ScrollView 
            contentContainerStyle={{ flexGrow: 1 }} 
            keyboardShouldPersistTaps='handled'
            showsVerticalScrollIndicator={false}
          >
            <View className='flex flex-row items-center justify-center'>

              <TouchableWithoutFeedback onPress={() => Alert.alert('you clicked!')}>
                <Image source={icons.logo} className='w-[3.875rem] h-[2.9375rem] m-4 ml-8' />
              </TouchableWithoutFeedback>

              <View className='flex-row items-center mx-[1rem]'>
                <Image source={icons.streak} className='w-[4rem] h-[4rem]' />
                <Text className='text-xl'>{streak}</Text>
              </View>

              <TouchableHighlight
                className='p-4 px-8 bg-primary justify-self-end ml-auto mr-8 rounded-xl'
                underlayColor={'#0014C7'}
                onPress={() => router.navigate('/newGoal')}
              >
                <Text className='color-white text-lg'>Set a New Goal</Text>
              </TouchableHighlight>

            </View>

            <View className='m-4 mt-8 self-center' style={{
              width: screenWidth * 0.9,
              aspectRatio: aspect
            }}>
              <Image source={images.starting_restaurant} resizeMode='contain' className='w-full h-full' />
            </View>

            <View className='flex flex-row items-center'>
              <Text className='font-bold color-dark-heading text-3xl p-6'>Goals</Text>
            </View>

            <View className=''>
              {currentGoals.map(goal => (
                <GoalCard 
                  key={goal._id} 
                  goal={goal}
                  completeGoal={completeGoal}
                />
              ))}

              <TouchableOpacity 
                className='p-4 py-6 pl-6 border-2 border-dashed mx-6 mt-4 rounded-lg' 
                onPress={() => router.navigate('/newGoal')}
                >
                <View className='flex flex-row items-center justify-center gap-5'>
                  <Image source={icons.addicon} />
                  <Text>Add New Goal</Text>
                </View>
              </TouchableOpacity>
            </View> 

            <View className='m-6'>
              <Text className='text-xl color-dark-heading font-bold'>Suggested Goals</Text>

              <View className='border-button-good p-6 bg-light-100 flex flex-row items-center justify-between rounded-lg mt-4'>
                <Text>Walk for 20 Minutes</Text>
                <TouchableOpacity className='h-full'>
                  <Text className='color-primary'>Add Goal</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className='m-6 mb-24'>
              <Text className='text-3xl color-dark-heading font-bold'>Upgrades</Text>

              <View className='flex flex-row flex-wrap mt-6 gap-3 '>
                <View className='bg-light-100 rounded-lg p-6 flex-1'>
                  <Text className='text-xl font-bold color-dark-heading text-center'>Chair</Text>
                  <Text className='color-dark-green mt-4'>+15 minutes of customer stay time</Text>
                  <TouchableOpacity className='bg-primary mt-6 p-4 rounded-lg'>
                    <Text className='text-center color-white text-md'>Upgrade</Text>
                  </TouchableOpacity>
                </View>
                <View className='bg-light-100 rounded-lg p-6 flex-1'>
                  <Text className='text-xl font-bold color-dark-heading text-center'>Table</Text>
                  <Text className='color-dark-green mt-4'>+5 customers</Text>
                  <TouchableOpacity className='bg-primary mt-6 p-4 rounded-lg'>
                    <Text className='text-center color-white text-md'>Upgrade</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
          <TabFooter page='home' />
        </SafeAreaView>
      </View>
    )
}

export default index