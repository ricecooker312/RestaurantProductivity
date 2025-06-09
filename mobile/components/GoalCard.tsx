import { View, Text, Image } from 'react-native'
import React, { useEffect, useState } from 'react'

import { AdvancedCheckbox } from 'react-native-advanced-checkbox'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'

interface GoalCardProps {
    id: string,
    completed: boolean,
    name: string,
    priority: string,
    completeGoal: (id: string) => void
}

const GoalCard = ({ id, completed, name, priority, completeGoal }: GoalCardProps) => {
    const [checked, setChecked] = useState<string | boolean>(completed)
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

    if (priority === 'low') {
        border = 'border-button-good'
    }
    else if (priority === 'medium') {
        border = 'border-button-warning'
    }
    else if (priority === 'high') {
        border = 'border-button-error'
    }

    if (checked) {
        completeGoal(id)
    }
    
    return (
        <View className={`bg-light-100 m-4 p-4 py-6 pl-6 flex flex-row items-center rounded-xl border-4 ${border}`}>
            <AdvancedCheckbox 
                value={checked}
                onValueChange={setChecked}
            />
            <Text className='ml-4 text-lg'>{name}</Text>
        </View>
    )
}

export default GoalCard