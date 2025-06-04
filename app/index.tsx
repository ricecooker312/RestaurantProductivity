import { View, Text, Image, TouchableOpacity, TouchableHighlight, TouchableWithoutFeedback, Alert, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Link, router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { icons } from '@/constants/icons'
import { images } from '@/constants/images'
import TabFooter from '@/components/TabFooter'
import GoalCard from '@/components/GoalCard'
import { Goal } from '@/components/FullGoalCard'

const index = () => {
  const [accessToken, setAccessToken] = useState<string | undefined>()
  const [currentGoals, setCurrentGoals] = useState<Goal[]>([])

  useEffect(() => {
    const isAuthenticated = async () => {
      const useEffectToken = await AsyncStorage.getItem('accessToken')

      if (!useEffectToken) {
        router.navigate('/onboarding')
      } else {
        setAccessToken(useEffectToken)
      }
    }

    isAuthenticated()
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

      const res = await fetch('https://restaurantproductivity.onrender.com/api/goals/find/all', goalsPayload)
      const data = await res.json()

      if (data.error) {
        console.log(data.error)
      } else {
        setCurrentGoals(data)
      }
    }

    if (accessToken) fetchGoals()
  }, [accessToken])

  return (
    <>
      <ScrollView className='bg-dfbg w-screen h-screen' showsVerticalScrollIndicator={false}>
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
            onPress={() => router.navigate('/newGoal')}
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

          <View className='flex-col items-center w-[85vw] p-4 pt-8 pb-8 mt-12 bg-light-100 rounded-3xl'>
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

        <View className='flex flex-row items-center'>
          <Text className='font-bold color-dark-heading text-3xl p-6'>Goals</Text>
          <TouchableHighlight 
            className='ml-auto p-4 m-6 bg-primary rounded-xl px-8'
            onPress={() => router.navigate('/goals')}
            underlayColor={'#0014C7'}
          >
            <Text className='color-white text-lg'>See All Goals</Text>
          </TouchableHighlight>
        </View>

        <View className='mb-28'>
          {currentGoals.map(goal => (
            <GoalCard key={goal._id} name={goal.title} completed={goal.completed} priority={goal.priority} />
          ))}
        </View>
      </ScrollView>
      <TabFooter page='home' />
    </>
  )
}

export default index