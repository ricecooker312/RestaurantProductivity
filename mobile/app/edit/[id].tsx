import { View, Text, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { router, useLocalSearchParams } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Goal } from '@/components/FullGoalCard'

const edit = () => {
    const [accessToken, setAccessToken] = useState<string | undefined>()
    const [goal, setGoal] = useState<Goal>()

    const insets = useSafeAreaInsets()

    const { id } = useLocalSearchParams()

    useEffect(() => {
        const isAuthenticated = async () => {
            const useEffectToken = await AsyncStorage.getItem('accessToken')

            if (!useEffectToken) {
                router.navigate('/')
            } else {
                setAccessToken(useEffectToken)
            }
        }

        isAuthenticated()
    }, [])

    useEffect(() => {
        const fetchGoal = async () => {
            const goalPayload = {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            }

            const res = await fetch(`https://restaurantproductivity.onrender.com/api/goals/find/${id}`, goalPayload)
            const data = await res.json()

            if (data.error) {
                console.log(`One Goal Find Error: ${data.error}`)
            } else {
                setGoal(data)
            }
        }

        if (accessToken) fetchGoal()
    }, [accessToken])

    return (
        <View className='bg-light-200 flex-1'>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <SafeAreaView
                        style={{ 
                            flex: 1,
                            paddingTop: insets.top,
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
                            <View className='flex-1 items-center justify-start'>
                                <Text className='text-3xl font-bold'>Edit Goal</Text>
                                <Text>{goal?.title}</Text>
                            </View>
                        </ScrollView>
                    </SafeAreaView>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </View>
    )
}

export default edit