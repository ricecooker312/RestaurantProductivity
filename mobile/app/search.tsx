import { View, Text, ScrollView, Image, TouchableWithoutFeedback, TouchableOpacity, TextInput, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { icons } from '@/constants/icons'
import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { User } from '@/types/userTypes'

const search = () => {
    const [accessToken, setAccessToken] = useState('')
    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState('')
    const [foundUser, setFoundUser] = useState<User>({
        _id: '',
        email: '',
        coins: ''
    })

    const insets = useSafeAreaInsets()

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

    const searchEmail = async () => {
        if (!email) {
            setEmailError('Email cannot be empty')
        } else {
            setEmailError('')

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(email)) {
                setEmailError('Email is invalid')
            } else {
                setEmailError('')
            }
        }

        if (!emailError) {
            const findUserEmailPayload = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    
                },
                body: JSON.stringify({
                    email: email
                })
            }

            console.log('about to run!')
            const res = await fetch('https://restaurantproductivity.onrender.com/api/users/find/byEmail', findUserEmailPayload)
            console.log('finished res, about to get data!')
            const data = await res.json()
            console.log('finished running!')

            console.log(data)

            if (data.error) {
                Alert.alert(data.error)    
            } else {
                console.log(`data: ${data}`)
                setFoundUser(data)
            }
        }
    }

    return (
        <View className='flex-1 bg-light-100'>
            <SafeAreaView style={{
                flex: 1,
                paddingTop: Math.max(insets.top - 30, 0),
                paddingBottom: insets.bottom,
                paddingRight: insets.right,
                paddingLeft: insets.left
            }}>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps='handled'
                    showsHorizontalScrollIndicator={false}
                >
                    <View 
                        className='relative flex flex-row items-center justify-center pb-6 border-b-2 border-zinc-400'
                    >
                        <TouchableWithoutFeedback onPress={() => router.navigate('/social')}>
                            <View className='absolute left-6 top-0'>
                                <Image source={icons.secondbackicon} className='size-8' />
                            </View>
                        </TouchableWithoutFeedback>
                        
                        <Text className='color-dark-heading text-center text-2xl font-bold'>Search</Text>
                    </View>

                    <TextInput
                        placeholder='Email'
                        placeholderTextColor={'#292929'}
                        value={email}
                        onChangeText={setEmail}
                        className='p-4 border-2 rounded-xl m-6'
                        onSubmitEditing={searchEmail}
                    />
                    <Text>{emailError}</Text>

                    <View className='m-6 p-4 mt-0'>
                        <View className='bg-light-200 mt-0 p-2 rounded-lg flex flex-row items-center justify-between'>
                            <Text className='ml-4 text-lg'>Sarah</Text>
                            <TouchableOpacity className='bg-button-warning p-4 rounded-lg'>
                                <Image source={icons.addfriend} className='size-8' />
                            </TouchableOpacity>
                        </View>
                        <View className='bg-light-200 mt-4 p-2 rounded-lg flex flex-row items-center justify-between'>
                            <Text className='ml-4 text-lg'>Eric</Text>
                            <TouchableOpacity className='bg-button-warning p-4 rounded-lg'>
                                <Image source={icons.addfriend} className='size-8' />
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    )
}

export default search