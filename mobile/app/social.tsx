import { View, Text, ScrollView, TouchableHighlight, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import Header from '@/components/Header'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'
import TabFooter from '@/components/TabFooter'
import { icons } from '@/constants/icons'
import { User } from '@/types/userTypes'

const social = () => {
    const [accessToken, setAccessToken] = useState('')
    const [coins, setCoins] = useState('')
    const [friends, setFriends] = useState<User[]>([])

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

                    <View className='flex flex-row items-center justify-between mt-6'>
                        <Text className='text-3xl color-dark-heading m-6 font-bold'>Friends</Text>
                        <TouchableHighlight 
                            className='px-8 p-4 m-6 bg-primary rounded-lg'
                            underlayColor={'#0014C7'}
                            onPress={() => router.navigate('/search')}
                        >
                            <Text className='color-white text-center text-lg'>Search</Text>
                        </TouchableHighlight>
                    </View>

                    <View className='m-6 bg-light-100 p-4 flex flex-row items-center rounded-md justify-between'>
                        <Text className='text-lg ml-4'>Sarah</Text>

                        <View className='flex flex-row gap-2'>
                            <TouchableOpacity className='bg-button-warning p-4 rounded-lg'>
                                <Image source={icons.restauranttab} className='size-8' />
                            </TouchableOpacity>
                            <TouchableOpacity className='bg-primaryLight p-4 rounded-lg'>
                                <Image source={icons.profiletab} className='size-8' />
                            </TouchableOpacity>
                            <TouchableOpacity className='bg-button-error p-4 rounded-lg'>
                                <Image source={icons.removefriend} className='size-8' /> 
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
            <TabFooter page='social' />
        </View>
    )
}

export default social