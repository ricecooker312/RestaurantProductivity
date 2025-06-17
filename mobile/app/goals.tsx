import { 
    View, 
    Text, 
    TouchableHighlight, 
    TouchableWithoutFeedback, 
    TouchableOpacity, 
    Image, 
    Alert, 
    ScrollView, 
    Dimensions,
    ActivityIndicator 
} from 'react-native'
import React, { useEffect, useState } from 'react'

import { icons } from '@/constants/icons'
import TabFooter from '@/components/TabFooter'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

import FullGoalCard from '@/components/FullGoalCard'
import { Goal } from '@/types/goalTypes'
import Header from '@/components/Header'

const screenWidth = Dimensions.get('window').width
const alertWidth = screenWidth * 0.9

const goals = () => {
    const [accessToken, setAccessToken] = useState<string | null>(null)
    const [currentGoals, setCurrentGoals] = useState<Goal[]>()
    const [goalCompleted, setGoalCompleted] = useState(false)
    const [completedGoalName, setCompletedGoalName] = useState('')
    const [coins, setCoins] = useState('')

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

    useEffect(() => {
        const getCoins = async () => {
            const gCoins = await AsyncStorage.getItem('coins')
            if (!gCoins) {
                await AsyncStorage.removeItem('accessToken')
                router.navigate('/onboarding')
            } else {
                setCoins(gCoins)
            }
        }

        if (accessToken) getCoins()
    }, [accessToken])

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
            if (completing) {
                setGoalCompleted(true)
                setCompletedGoalName(goal.title)
                setCoins(`${data.coins}`)
            } else {
                setGoalCompleted(false)
            }
        }
    }

    const insets = useSafeAreaInsets()

    if (!currentGoals) {
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
                        <Header coins={coins} />

                        <ActivityIndicator className='p-4' size={'large'} color={'#292626'} />
                    </ScrollView>
                </SafeAreaView>
            </View>
        )
    }
    
    return (
        <View className='flex-1 bg-dfbg relative'>
            <SafeAreaView
                style={{
                    flex: 1,
                    paddingTop: Math.max(insets.top - 50, 0),
                    paddingBottom: insets.bottom,
                    paddingRight: insets.right,
                    paddingLeft: insets.left
                }}
            >
                <ScrollView 
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps='handled'
                    showsVerticalScrollIndicator={false}
                >
                    <Header coins={coins} />

                    <View className='flex flex-row flex-wrap justify-center mb-28'>
                        <Text className='font-bold color-dark-heading text-3xl p-6 mr-auto'>Today's Goals</Text>

                        {currentGoals && currentGoals.map(goal => (
                            <FullGoalCard key={goal._id} goal={goal} completeGoal={completeGoal} />
                        ))}
                    </View>
                </ScrollView>
            </SafeAreaView>
            {goalCompleted && (
                <View 
                    className='absolute bottom-[15%] flex flex-row justify-center items-center bg-button-good p-4'
                    style={{
                        left: (screenWidth - alertWidth) / 2,
                        width: alertWidth
                    }}
                >
                    <TouchableOpacity className='absolute left-0 m-4' onPress={() => setGoalCompleted(false)}>
                        <Text className='text-3xl'>&times;</Text>
                    </TouchableOpacity>
                    <Text className='text-center text-lg'>You completed a goal:{' '}
                        <Text className='font-bold'>{completedGoalName}</Text>
                    !</Text>
                </View>
            )}
            <TabFooter page='goals' />
        </View>
    )
}

export default goals