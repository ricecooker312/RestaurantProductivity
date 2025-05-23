import { View, Text, TouchableHighlight, TouchableWithoutFeedback, TouchableOpacity, Image, Alert, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'

import { icons } from '@/constants/icons'
import { images } from '@/constants/images'
import TabFooter from '@/components/TabFooter'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'

const goals = () => {
    const [currentGoals, setCurrentGoals] = useState()

    useEffect(() => {
        const isAuthenticated = async () => {
            const accessToken = await AsyncStorage.getItem('accessToken')

            if (!accessToken) {
                router.navigate('/onboarding')
                return null;
            } else {
                return accessToken
            }
        }

        const accessToken = isAuthenticated()

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

        fetchGoals()

        console.log(currentGoals)
    }, [])
    
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

                <View className='flex flex-row flex-wrap'>
                    <Text className='font-bold color-dark-heading text-3xl p-6'>Today's Goals</Text>
                </View>
            </ScrollView>
            <TabFooter page='goals' />
        </>
    )
}

export default goals