import { View, Text, Image } from 'react-native'
import React, { useEffect, useState } from 'react'

import { AdvancedCheckbox } from 'react-native-advanced-checkbox'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'
import { Goal } from '@/types/goalTypes'
import { icons } from '@/constants/icons'

interface GoalCardProps {
    goal: Goal,
    completeGoal: (id: string) => void
}

const GoalCard = ({ goal, completeGoal }: GoalCardProps) => {
    const [checked, setChecked] = useState<string | boolean>(goal.completed)
    const [accessToken, setAccessToken] = useState<string>('')

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

    let border

    if (goal.priority === 'low') {
        border = 'border-button-good'
    }
    else if (goal.priority === 'medium') {
        border = 'border-button-warning'
    }
    else if (goal.priority === 'high') {
        border = 'border-button-error'
    }

    if (checked) {
        completeGoal(goal._id)
    }
    
    return (
        <View className={`bg-light-100 mx-6 mt-4 p-4 py-6 pl-6 flex flex-row items-center rounded-xl border-4 ${border}`}>
            <AdvancedCheckbox 
                value={checked}
                onValueChange={setChecked}
            />
            <Text className='ml-4 text-lg'>{goal.title}</Text>
            <View className='mx-4 ml-auto flex flex-row gap-2 items-center'>
                <Image source={icons.coins} className='size-8' />
                <Text className='text-lg'>{goal.reward}</Text>
            </View>
        </View>
    )
}

export default GoalCard