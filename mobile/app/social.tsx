import { View, Text, ScrollView, TouchableHighlight, TouchableOpacity, Image, Alert, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import Header from '@/components/Header'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'
import TabFooter from '@/components/TabFooter'
import { icons } from '@/constants/icons'
import { User } from '@/types/userTypes'
import FriendCard from '@/components/FriendCard'

const social = () => {
    const [accessToken, setAccessToken] = useState('')
    const [friends, setFriends] = useState<User[]>([])
    const [requests, setRequests] = useState(0)

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
        const getRequests = async () => {
            const res = await fetch('https://restaurantproductivity.onrender.com/api/social/find/requested', {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            })

            const data = await res.json()

            if (data.error) {
                Alert.alert(data.error)
            } else {
                setRequests(data.length)
            }
        }

        if (accessToken) getRequests()
    }, [accessToken])

    useEffect(() => {
        const getFriends = async () => {
            const getFriendsPayload = {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            }

            const res = await fetch('https://restaurantproductivity.onrender.com/api/social/find/accepted', getFriendsPayload)
            const data = await res.json()

            if (data.error) {
                Alert.alert(data.error)
            } else {
                setFriends(data)
            }
        }

        if (accessToken) getFriends()
    }, [accessToken])

    const removeFriend = async (friend: User) => {
        if (accessToken) {
            const res = await fetch('https://restaurantproductivity.onrender.com/api/social/remove', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    friendId: friend._id
                })
            })

            const data = await res.json()

            if (data.error) {
                Alert.alert(data.error)
            } else {
                setFriends(prevFriends => prevFriends.filter(mFriend => mFriend._id !== friend._id))
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
                <View className='flex flex-row flex-wrap items-center justify-center'>
                
                    <View className='flex-row items-center mx-[1rem]'>
                        <Image source={icons.streak} className='w-[4rem] h-[4rem]' />
                        <Text className='text-xl'>6</Text>
                    </View>
        
                    <View className='flex-row items-center mx-[1rem] mr-0 relative'>
                        <TouchableOpacity
                            activeOpacity={0.4}
                            onPress={() => router.navigate('/requests')}
                        >
                            <Image source={icons.requestsicon} className='size-8' />
                        </TouchableOpacity>
                        {requests > 0 && (
                            <View style={{
                                position: 'absolute',
                                top: -10,
                                right: -10,
                                width: 20, 
                                height: 20,
                                borderRadius: 10,
                                backgroundColor: '#EF4444',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                                }}
                            >
                                <Text className='text-sm color-white'>{requests > 9 ? '9+' : requests}</Text>
                            </View>
                        )}
                    </View>
        
                    <TouchableHighlight
                        className='p-4 px-8 bg-primary justify-self-end ml-auto mr-8 rounded-xl'
                        underlayColor={'#0014C7'}
                        onPress={() => router.navigate('/newGoal')}
                    >
                        <Text className='color-white text-lg'>Set a New Goal</Text>
                    </TouchableHighlight>
                    
                </View>

                <View className='flex flex-row items-center justify-between p-6'>
                    <Text className='text-3xl color-dark-heading font-bold'>Friends</Text>
                    <TouchableHighlight 
                        className='px-8 p-4 bg-primary rounded-lg'
                        underlayColor={'#0014C7'}
                        onPress={() => router.navigate('/search')}
                    >
                        <Text className='color-white text-center text-lg'>Search</Text>
                    </TouchableHighlight>
                </View>

                <FlatList
                    data={friends}
                    keyExtractor={(friend) => friend._id}
                    renderItem={({ item }) => (
                        <FriendCard friend={item} removeFriend={removeFriend} />
                    )}
                />
            </SafeAreaView>
            <TabFooter page='social' />
        </View>
    )
}

export default social