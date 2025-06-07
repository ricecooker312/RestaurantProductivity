import { View, Text, TouchableHighlight, TouchableWithoutFeedback, TouchableOpacity, Image, Alert, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'

import { icons } from '@/constants/icons'
import { images } from '@/constants/images'
import TabFooter from '@/components/TabFooter'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'

import FullGoalCard, { Goal } from '@/components/FullGoalCard'

const goals = () => {
    const [accessToken, setAccessToken] = useState<string | null>(null)
    const [currentGoals, setCurrentGoals] = useState<Goal[]>([])
    const [goalCompleted, setGoalCompleted] = useState(false)

    useEffect(() => {
        const isAuthenticated = async () => {
            const useEffectToken = await AsyncStorage.getItem('accessToken')

            if (!useEffectToken) {
                router.replace('/onboarding')
            } else {
                setAccessToken(useEffectToken)
            }
        }

        isAuthenticated()
    }, [])

    useEffect(() => {
        const fetchGoals = async () => {
            const goalPayload = {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }

            const res = await fetch('https://restaurantproductivity.onrender.com/api/goals/find/incomplete', goalPayload)
            const data = await res.json()

            setCurrentGoals(data)
        }

        if (accessToken) fetchGoals()
    }, [accessToken])

    const completeGoal = async (goal: Goal) => {
        const completeGoalPayload = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        }

        const res = await fetch(`https://restaurantproductivity.onrender.com/api/goals/${goal._id}/complete`, completeGoalPayload)
        const data = await res.json()

        if (data.error) {
            console.log(data.error)
        } else {
            console.log(data)
            setGoalCompleted(true)
        }
    }

    console.log('Goal copmleted: ', goalCompleted)
    
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
                </View>

                <View className='flex flex-row flex-wrap justify-center mb-28'>
                    <Text className='font-bold color-dark-heading text-3xl p-6 mr-auto'>Today's Goals</Text>

                    {currentGoals.map(goal => (
                        <FullGoalCard key={goal._id} goal={goal} completeGoal={() => completeGoal(goal)} />
                    ))}
                </View>

                {goalCompleted && (
                    <View className='p-4 bg-white'>
                        <Text>You completed a goal!</Text>
                    </View>
                )}
            </ScrollView>
            <TabFooter page='goals' />
        </>
    )
}

export default goals