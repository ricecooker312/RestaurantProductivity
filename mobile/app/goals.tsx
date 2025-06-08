import { 
    View, 
    Text, 
    TouchableHighlight, 
    TouchableWithoutFeedback, 
    TouchableOpacity, 
    Image, 
    Alert, 
    ScrollView, 
    Dimensions 
} from 'react-native'
import React, { useEffect, useState } from 'react'

import { icons } from '@/constants/icons'
import TabFooter from '@/components/TabFooter'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'

import FullGoalCard, { Goal } from '@/components/FullGoalCard'

const screenWidth = Dimensions.get('window').width
const alertWidth = screenWidth * 0.8

const goals = () => {
    const [accessToken, setAccessToken] = useState<string | null>(null)
    const [currentGoals, setCurrentGoals] = useState<Goal[]>([])
    const [goalCompleted, setGoalCompleted] = useState(false)
    const [completedGoalName, setCompletedGoalName] = useState('')

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
    }, [accessToken, goalCompleted])

    const completeGoal = async (goal: Goal, completing: boolean) => {
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
            if (completing) {
                setGoalCompleted(true)
                setCompletedGoalName(goal.title)
            } else {
                setGoalCompleted(false)
            }
        }
    }
    
    return (
        <View className='flex-1 relative'>
            <ScrollView className='bg-dfbg' showsVerticalScrollIndicator={false}>
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
                        <FullGoalCard key={goal._id} goal={goal} completeGoal={completeGoal} />
                    ))}
                </View>
            </ScrollView>
            {goalCompleted && (
                <View 
                    className='absolute bottom-[15%] flex flex-row justify-center items-center bg-button-good p-4'
                    style={{
                        left: (screenWidth - alertWidth) / 2,
                        width: alertWidth
                    }}
                >
                    <TouchableOpacity className='absolute left-0 ml-4' onPress={() => setGoalCompleted(false)}>
                        <Text className='text-3xl'>&times;</Text>
                    </TouchableOpacity>
                    <Text className='text-center text-lg'>You completed a goal: 
                        <Text className='font-bold'>{completedGoalName}</Text>
                    !</Text>
                </View>
            )}
            <TabFooter page='goals' />
        </View>
    )
}

export default goals