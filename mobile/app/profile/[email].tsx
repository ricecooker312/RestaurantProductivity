import { View, Text, TouchableWithoutFeedback, Image, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { router, useLocalSearchParams } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { icons } from '@/constants/icons'

const friendProfile = () => {
    const [accessToken, setAccessToken] = useState('')
    const [id, setId] = useState('')
    const [goalsCompleted, setGoalsCompleted] = useState(0)
    const [itemsOwned, setItemsOwned] = useState(0)

    const insets = useSafeAreaInsets()

    const { email } = useLocalSearchParams()

    useEffect(() => {
        const isAuthenticated = async () => {
            const useEffectToken = await AsyncStorage.getItem('accessToken')
            if (!useEffectToken) {
                await AsyncStorage.removeItem('coins')
                router.navigate('/onboarding')
            } else {
                setAccessToken(useEffectToken)
            }
        }

        isAuthenticated()
    }, [])

    useEffect(() => {
        const getUserInfo = async () => {
            const res = await fetch('https://restaurantproductivity.onrender.com/api/users/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    email: email
                })
            })

            const data = await res.json()

            if (data.error) {
                Alert.alert(data.error)
            } else {
                setId(data._id)
            }
        }

        if (accessToken) getUserInfo()
    }, [accessToken])

    useEffect(() => {
        const getItemsOwned = async () => {
            const res = await fetch('https://restaurantproductivity.onrender.com/api/items/user/find/all', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    friendId: id
                })
            })

            const data = await res.json()

            if (data.error) {
                Alert.alert(data.error)
            } else {
                setItemsOwned(data.length)
            }
        }

        if (accessToken && id) getItemsOwned()
    }, [id])

    return (
        <View className='flex-1 bg-dfbg'>
            <SafeAreaView style={{
                flex: 1,
                paddingTop: Math.max(insets.top - 30, 0),
                paddingBottom: insets.bottom,
                paddingRight: insets.right,
                paddingLeft: insets.left
            }}>
                <View className='flex flex-row relative items-center justify-center pb-6 border-b-2 border-slate-950'>
                    <TouchableWithoutFeedback onPress={() => router.navigate('/social')}>
                        <Image source={icons.secondbackicon} className='size-8 absolute top-0 left-0 ml-4' />
                    </TouchableWithoutFeedback>
                    <Text className='text-center text-2xl color-dark-heading font-bold'>Profile</Text>
                </View>

                <View className='p-6 m-6 bg-light-100 rounded-lg'>
                    <Text className='text-xl font-bold'>User Info</Text>
                    <Text className='font-bold mt-8'>Email: <Text className='font-normal'>{email}</Text></Text>
                </View>

                <View className='flex flex-row m-6'>
                    <View className='bg-light-100 rounded-lg flex-1 items-center justify-center p-4'>
                        <Text className='font-bold'>Total Items</Text>
                        <Text className='font-bold text-5xl p-6'>{itemsOwned}</Text>
                        <Text className='font-light'>items owned</Text>
                    </View>

                    <View className='bg-light-100 rounded-lg flex-1 items-center justify-center p-4'>
                        <Text className='font-bold'>Lifetime Goals</Text>
                        <Text className='font-bold text-5xl p-6'>{itemsOwned}</Text>
                        <Text className='font-light'>goals completed</Text>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    )
}

export default friendProfile