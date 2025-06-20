import { View, Text, TouchableWithoutFeedback, Image, Alert, FlatList, TouchableHighlight, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { icons } from '@/constants/icons'
import { RelativePathString, router } from 'expo-router'
import { User } from '@/types/userTypes'
import AsyncStorage from '@react-native-async-storage/async-storage'
import FriendCard from '@/components/FriendCard'

const requests = () => {
    const [accessToken, setAccessToken] = useState('')
    const [requests, setRequests] = useState<User[]>([])

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
                    'Accept': '*/*',
                    'Authorization': `Bearer ${accessToken}`
                }
            })

            const data = await res.json()

            if (data.error) {
                Alert.alert(data.error)
            } else {
                setRequests(data)
            }
        }

        if (accessToken) getRequests()
    }, [accessToken])

    const removeFriend = async (friend: User) => {
        const res = await fetch('https://restaurantproductivity.onrender.com/api/social/remove', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
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
            setRequests(prevRequests => prevRequests.filter(request => request._id !== friend._id))
        }
    }

    const acceptRequest = async (friend: User) => {
        const res = await fetch('https://restaurantproductivity.onrender.com/api/social/accept', {
            method: 'PATCH',
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
            setRequests(prevRequests => prevRequests.filter(request => request._id !== friend._id))
            router.navigate('/social')
        }
    }

    return (
        <View className='flex-1 bg-dfbg'>
            <SafeAreaView style={{
                flex: 1,
                paddingTop: Math.max(insets.top - 30, 0),
                paddingBottom: insets.bottom,
                paddingRight: insets.right,
                paddingLeft: insets.left
            }}>
                <View className='flex flex-row items-center justify-center pb-6 border-b-2 border-slate-950 relative'>
                    <TouchableWithoutFeedback onPress={() => router.navigate('/social')}>
                        <Image source={icons.secondbackicon} className='size-8 absolute top-0 left-0 ml-4' />
                    </TouchableWithoutFeedback>
                    <Text className='font-bold color-dark-heading text-center text-2xl'>Requests</Text>
                </View>

                <FlatList 
                    data={requests}
                    keyExtractor={item => item._id}
                    renderItem={({ item }) => (
                        <View className='m-6 p-6 bg-light-100 rounded-md'>
                            <Text className='text-lg'>{item.email}</Text>
                            <View className='flex flex-row justify-between my-4'>
                                <View className='flex flex-row gap-3'>
                                    <TouchableOpacity 
                                        className='rounded-lg bg-primaryLight p-4'
                                        onPress={() => router.navigate(`/profile/${item.email}` as RelativePathString)}
                                    >
                                        <Image source={icons.profiletab} className='size-8' />
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        className='rounded-lg bg-button-warning p-4'
                                        onPress={() => router.navigate(`/restaurant/${item._id}` as RelativePathString)}
                                    >
                                        <Image source={icons.restauranttab} className='size-8' />
                                    </TouchableOpacity>
                                </View>
                                <View className='flex flex-row gap-3'>
                                    <TouchableOpacity
                                        className='rounded-lg bg-button-good p-4'
                                        onPress={() => acceptRequest(item)}
                                    >
                                        <Image source={icons.addfriend} className='size-8' />
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        className='rounded-lg bg-button-error p-4'
                                        onPress={() => Alert.alert(
                                            'Delete Request',
                                            `Are you sure you want to delete this friend request from ${item.email}?`,
                                            [
                                                {
                                                    text: 'Cancel',
                                                    style: 'cancel'
                                                },
                                                {
                                                    text: 'Delete',
                                                    onPress: () => removeFriend(item)
                                                }
                                            ]
                                        )}
                                    >
                                        <Image source={icons.removefriend} className='size-8' />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    )}
                />
            </SafeAreaView>
        </View>
    )
}

export default requests