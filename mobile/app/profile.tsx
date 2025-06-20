import { View, Text, ScrollView, TouchableHighlight, Alert, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'

import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import TabFooter from '@/components/TabFooter'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'
import FormInput from '@/components/FormInput'

const profile = () => {
    const [accessToken, setAccessToken] = useState('')
    const [email, setEmail] = useState('')
    const [edit, setEdit] = useState(false)
    const [emailError, setEmailError] = useState('')

    const [totalItems, setTotalItems] = useState<number | null>()
    const [completedGoals, setCompletedGoals] = useState<number | null>()

    const insets = useSafeAreaInsets()

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
            const userInfoPayload = {
                headers: {
                    'Content-Type': "application/json",
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            }

            const emailRes = await fetch('https://restaurantproductivity.onrender.com/api/users/find', userInfoPayload)
            const emailData = await emailRes.json()

            if (emailData.error) {
                if (emailData.error === 'That user does not exist') {
                    await AsyncStorage.removeItem('coins')
                    await AsyncStorage.removeItem('accessToken')

                    router.navigate('/onboarding')
                } else {
                    Alert.alert(emailData.error)
                }
            } else {
                setEmail(emailData.email)
            }
        }

        if (accessToken) getUserInfo()
    }, [accessToken])

    useEffect(() => {
        const getItems = async () => {
            const totalItemsPayload = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            }

            const itemsRes = await fetch('https://restaurantproductivity.onrender.com/api/items/user/find/all', totalItemsPayload)
            const itemsData = await itemsRes.json()

            if (itemsData.error) {
                Alert.alert(itemsData.error)
            } else {
                setTotalItems(itemsData.length)
            }
        }

        if (accessToken) getItems()
    }, [accessToken])

    useEffect(() => {
        const getGoals = async () => {
            const completedGoalsPayload = {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            }

            const goalsRes = await fetch('https://restaurantproductivity.onrender.com/api/goals/find/complete', completedGoalsPayload)
            const goalsData = await goalsRes.json()

            if (goalsData.error) {
                Alert.alert(goalsData.error)
            } else {
                setCompletedGoals(goalsData.length)
            }
        }

        if (accessToken) getGoals()
    }, [accessToken])

    useEffect(() => {
        if (edit && accessToken) {
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
        }
    }, [email])

    const signOut = async () => {
        if (accessToken) {
            await AsyncStorage.removeItem('accessToken')
            await AsyncStorage.removeItem('coins')

            router.navigate('/onboarding')
        }
    }

    const deleteAccount = async () => {
        if (accessToken) {
            const deleteAccPayload = {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            }

            const res = await fetch('https://restaurantproductivity.onrender.com/api/users/delete', deleteAccPayload)
            const data = await res.json()

            if (data.error) {
                Alert.alert(data.error)
            } else {
                await AsyncStorage.removeItem('accessToken')
                await AsyncStorage.removeItem('coins')

                router.navigate('/onboarding')
            }
        }
    }

    const updateUser = async () => {
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
            const updatePayload = {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    email: email
                })
            }

            const res = await fetch('https://restaurantproductivity.onrender.com/api/users/update', updatePayload)
            const data = await res.json()

            if (data.error) {
                setEmailError(data.error)
            } else {
                setEdit(false)
            }
        }
    }

    if ((!email && !edit) || !accessToken || totalItems === null || completedGoals === null) {
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
                        <Text className='font-bold text-3xl color-dark-heading p-6 mr-auto'>Profile</Text>

                        <ActivityIndicator className='p-4' size='large' color='#292626' />
                    </ScrollView>
                </SafeAreaView>
                <TabFooter page='profile' />
            </View>
        )
    } else {
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
                        style={{ marginBottom: 40 }}
                        keyboardShouldPersistTaps='handled'
                        showsVerticalScrollIndicator={false}
                    >
                        <Text className='color-dark-heading text-3xl p-6 mr-auto font-bold'>Profile</Text>

                        <View className='p-6 bg-white m-6 rounded-lg'>
                            <Text className='font-bold color-dark-heading text-xl'>User Info</Text>

                            {edit ? (
                                <>
                                    <View className='flex flex-row flex-wrap mt-12 items-center gap-2'>
                                        <Text className='font-bold'>Email: </Text>
                                        <View className='w-10/12 relative'>  
                                            {emailError && (
                                                <Text className='text-left color-error absolute -top-[1.75rem]'>{emailError}</Text>
                                            )} 
                                            <FormInput
                                                placeholder=''
                                                value={email}
                                                onChangeText={setEmail}
                                                noMargin
                                                className={`
                                                    ${emailError ? 'border-error' : 'border-primary'}
                                                    w-full
                                                `}
                                            />
                                        </View>
                                    </View>

                                    <TouchableHighlight 
                                        className='w-1/2 mr-auto bg-primary rounded-lg mt-6 p-4'
                                        underlayColor={'#0014C7'}
                                        onPress={updateUser}
                                    >
                                        <Text className='color-white text-lg text-center'>Update</Text>
                                    </TouchableHighlight>
                                </>
                            ) : (
                                <View className='flex flex-row mt-6 items-center'>
                                    <Text className='font-bold'>Email:{' '}</Text>
                                    <Text className='font-normal'>{email}</Text>
                                </View>
                            )}

                        </View>

                        <View className='flex flex-row flex-wrap m-6 gap-3'>
                            <View className='flex flex-col flex-1 rounded-lg bg-white w-1/2 p-4'>
                                <Text className='font-bold text-center'>Lifetime Goals</Text>
                                <Text className='text-center text-5xl font-bold p-6'>{completedGoals}</Text>
                                <Text className='text-center text-sm font-light'>
                                    {completedGoals === 1 ? 'goal completed' : 'goals completed'}
                                </Text>
                            </View>
                            <View className='flex flex-col flex-1 rounded-lg bg-white w-1/2 p-4'>
                                <Text className='font-bold text-center'>Total Items</Text>
                                <Text className='text-center text-5xl font-bold p-6'>{totalItems}</Text>
                                <Text className='text-center text-sm font-light'>
                                    {totalItems === 1 ? 'item owned' : 'items owned'}
                                </Text>
                            </View>
                        </View>

                        <View className='bg-white m-6 rounded-lg p-6'>
                            <Text className='font-bold text-xl'>Account Actions</Text>

                            <TouchableHighlight 
                                underlayColor={'#0014C7'}
                                className='p-4 mt-6 bg-primary rounded-lg w-1/2'
                                onPress={() => setEdit(true)}
                            >
                                <Text className='color-white text-center text-lg'>Edit Account</Text>
                            </TouchableHighlight>

                            <TouchableHighlight 
                                underlayColor={'#0014C7'}
                                className='p-4 mt-6 bg-primary rounded-lg w-1/2'
                                onPress={signOut}
                            >
                                <Text className='color-white text-center text-lg'>Sign Out</Text>
                            </TouchableHighlight>

                            <TouchableHighlight 
                                underlayColor={'#D74042'}
                                className='p-4 mt-6 bg-error rounded-lg w-1/2'
                                onPress={() => {
                                    Alert.alert(
                                        'Delete Account',
                                        'Are you sure you want to delete your account?',
                                        [
                                            {
                                                text: 'Cancel',
                                                style: 'cancel'
                                            },
                                            {
                                                text: 'Delete',
                                                onPress: deleteAccount
                                            }
                                        ],
                                        { cancelable: true }
                                    )
                                }}
                            >
                
                                <Text className='color-white text-center text-lg'>Delete Account</Text>
                            </TouchableHighlight>
                        </View>
                    </ScrollView>
                </SafeAreaView>
                <TabFooter page='profile' />
            </View>
        )
    }
}

export default profile