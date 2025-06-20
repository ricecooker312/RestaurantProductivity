import { View, Text, TouchableWithoutFeedback, Image, Alert, FlatList, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { router, useLocalSearchParams } from 'expo-router'
import { icons } from '@/constants/icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { RestaurantItem } from '@/types/restaurantTypes'
import Item from '@/components/Item'

const friendRestaurant = () => {
    const [accessToken, setAccessToken] = useState('')
    const [restaurant, setRestaurant] = useState<RestaurantItem[]>([])

    const insets = useSafeAreaInsets()

    const { id } = useLocalSearchParams()

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
        const getFriendRestaurant = async () => {
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
                setRestaurant(data)
            }
        }

        if (accessToken) getFriendRestaurant()
    }, [accessToken])

    return (
        <View className='flex-1 bg-dfbg'>
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
                    showsVerticalScrollIndicator={false}
                >
                    <View className='flex flex-row relative items-center justify-center pb-6 border-b-2 border-slate-950'>
                        <TouchableWithoutFeedback onPress={() => router.navigate('/social')}>
                            <Image source={icons.secondbackicon} className='size-8 absolute top-0 left-0 ml-4' />
                        </TouchableWithoutFeedback>
                        <Text className='text-center font-bold color-dark-heading text-2xl'>Restaurant</Text>
                    </View>

                    <Text className='m-6 text-xl font-bold color-dark-heading'>Furniture</Text>
                    <View style={{ flexShrink: 1 }}>
                        <FlatList
                            data={restaurant.filter(item => item.type === 'furniture')}
                            keyExtractor={item => item._id}
                            scrollEnabled={false}
                            numColumns={3}
                            renderItem={({ item, index }) => (
                                <Item item={item} className={`ml-6 ${index > 2 && 'mt-6'}`} />
                            )}
                        />
                    </View>

                    <Text className='m-6 mt-12 text-xl font-bold color-dark-heading'>Menu</Text>
                    <View style={{ flexShrink: 1 }}>
                        <FlatList
                            data={restaurant.filter(item => item.type === 'menu')}
                            keyExtractor={item => item._id}
                            scrollEnabled={false}
                            numColumns={3}
                            renderItem={({ item, index }) => (
                                <Item item={item} className={`ml-6 ${index > 2 && 'mt-6'}`} />
                            )}
                        />
                    </View>

                    <Text className='m-6 mt-12 text-xl font-bold color-dark-heading'>Decor</Text>
                    <View style={{ flexShrink: 1 }}>
                        <FlatList 
                            data={restaurant.filter(item => item.type === 'decor')}
                            keyExtractor={item => item._id}
                            scrollEnabled={false}
                            numColumns={3}
                            renderItem={({ item, index }) => (
                                <Item item={item} className={`ml-6 ${index > 2 && 'mt-6'}`} />
                            )}
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    )
}

export default friendRestaurant