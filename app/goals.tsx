import { View, Text, TouchableHighlight, TouchableWithoutFeedback, TouchableOpacity, Image, Alert, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'

import { icons } from '@/constants/icons'
import { images } from '@/constants/images'
import TabFooter from '@/components/TabFooter'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'

type Goal = {
    _id: string,
    title: string,
    description: string,
    completed: boolean,
    type: string,
    priority: string,
    difficulty: string,
    userId: string,
    time: string
}

const goals = () => {
    const [accessToken, setAccessToken] = useState<string | null>(null)
    const [currentGoals, setCurrentGoals] = useState<Goal[]>([])

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

            const res = await fetch('http://192.168.1.204:3000/api/goals/find/all', goalPayload)
            const data = await res.json()

            setCurrentGoals(data)
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
                </View>

                <View className='flex flex-row flex-wrap justify-center mb-28'>
                    <Text className='font-bold color-dark-heading text-3xl p-6 mr-auto'>Today's Goals</Text>

                    {currentGoals.map(goal => (
                        <View key={goal._id} className='w-11/12 bg-light-100 rounded-lg mb-8'>
                            <View className='flex flex-row items-center'>
                                <Text className='font-bold text-2xl p-6'>{goal.title}</Text>
                                <Text 
                                    className={`
                                    ${goal.type === 'habit' ? 'bg-[#4EC47A]' : 'bg-[#4ED9FF]'} 
                                    w-20 
                                    p-2 
                                    text-center
                                `}>{goal.type.charAt(0).toUpperCase() + goal.type.slice(1)}</Text>
                            </View>
                            <Text className='p-6 color-[#4A4A4A]'>{goal.description}</Text> 
                            <View className='flex flex-row p-6 items-center'>
                                <Text className='color-[#4A4A4A]'>Priority: </Text>
                                {goal.priority === 'low' ? (
                                    <View className='flex flex-row gap-1 bg-button-good p-4 w-24 justify-around ml-2'>
                                        <Text>Low</Text>
                                        <Image source={icons.lowpriority} />
                                    </View>
                                ) : goal.priority === 'medium' ? (
                                    <View className='flex flex-row gap-1 bg-button-warning p-4 w-32 justify-around ml-2'>
                                        <Text>Medium</Text>
                                        <Image source={icons.mediumpriority} />
                                    </View>
                                ) : goal.priority === 'high' && (
                                    <View className='flex flex-row gap-1 bg-button-error p-4 w-24 justify-around ml-2'>
                                        <Text>High</Text>
                                        <Image source={icons.highpriority} />
                                    </View>
                                )}
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
            <TabFooter page='goals' />
        </>
    )
}

export default goals