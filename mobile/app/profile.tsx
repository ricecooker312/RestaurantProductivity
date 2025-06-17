import { View, Text, ScrollView, TouchableHighlight, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'

import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import TabFooter from '@/components/TabFooter'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'

const profile = () => {
    const [accessToken, setAccessToken] = useState('')
    const [email, setEmail] = useState('')

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

    const signOut = async () => {
        if (accessToken) {
            await AsyncStorage.removeItem('accessToken')
            await AsyncStorage.removeItem('coins')

            router.navigate('/onboarding')
        } else {
            console.log(`accessToken: ${accessToken}`)
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
                        <Text className='font-bold mt-6'>Email: <Text className='font-light'>Email</Text></Text>
                    </View>

                    <View className='flex flex-row flex-wrap m-6 gap-3'>
                        <View className='flex flex-col flex-1 rounded-lg bg-white w-1/2 p-4'>
                            <Text className='font-bold text-center'>Lifetime Goals</Text>
                            <Text className='text-center text-5xl font-bold p-6'>32</Text>
                            <Text className='text-center text-sm font-light'>goals completed</Text>
                        </View>
                        <View className='flex flex-col flex-1 rounded-lg bg-white w-1/2 p-4'>
                            <Text className='font-bold text-center'>Total Items</Text>
                            <Text className='text-center text-5xl font-bold p-6'>9</Text>
                            <Text className='text-center text-sm font-light'>items owned</Text>
                        </View>
                    </View>

                    <View className='bg-white m-6 rounded-lg p-6'>
                        <Text className='font-bold text-xl'>Account Actions</Text>

                        <TouchableHighlight 
                            underlayColor={'#0014C7'}
                            className='p-4 mt-6 bg-primary rounded-lg w-1/2'
                            onPress={() => {}}
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

export default profile