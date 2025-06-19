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
    const [noUser, setNoUser] = useState('')

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

    useEffect(() => {
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
    }, [email])

    useEffect(() => {
        setEmailError('')
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
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    email: email
                })
            }

            const res = await fetch('https://restaurantproductivity.onrender.com/api/users/search', findUserEmailPayload)
            const data = await res.json()

            if (data.error) {
                if (data.error)

                Alert.alert(data.error)    
            } else {
                setFoundUser({
                    _id: data._id,
                    email: data.email,
                    coins: data.coins
                })
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

                    <View className='relative w-10/12 ml-auto mr-auto'>
                        <TextInput
                            placeholder='Email'
                            placeholderTextColor={'#292929'}
                            value={email}
                            onChangeText={setEmail}
                            className={`py-4 pl-4 border-2 rounded-xl w-full mt-8 mb-6 ${emailError && 'border-error'}`}
                            onSubmitEditing={searchEmail}
                        />
                        {emailError && (
                            <Text className='absolute bottom-0 color-error'>{emailError}</Text>
                        )}
                    </View>

                    {foundUser._id && (
                        <View className='m-6 p-4 mt-0'>
                            <View className='bg-light-200 mt-0 p-2 rounded-lg flex flex-row items-center justify-between'>
                                <Text className='ml-4 text-lg'>{foundUser.email}</Text>
                                <TouchableOpacity className='bg-button-warning p-4 rounded-lg'>
                                    <Image source={icons.addfriend} className='size-8' />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </ScrollView>
            </SafeAreaView>
        </View>
    )
}

export default search