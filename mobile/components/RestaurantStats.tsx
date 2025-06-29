import { View, Text, Modal, TouchableWithoutFeedback, FlatList, TouchableOpacity, TouchableHighlight, Image, Alert } from 'react-native'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Restaurant, RestaurantItem } from '@/types/restaurantTypes'
import ReviewStars from './ReviewStars'
import { icons } from '@/constants/icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'


interface RestaurantStatsProps {
    open: boolean,
    setOpen: (value: boolean) => void,
    restaurant: Restaurant,
    setRestaurant: Dispatch<SetStateAction<Restaurant>>,
    items: RestaurantItem[],
    setItems: Dispatch<SetStateAction<RestaurantItem[]>>,
    coins: string,
    setCoins: (value: string) => void
}

const RestaurantStats = ({ open, setOpen, restaurant, setRestaurant, items, setItems, coins, setCoins }: RestaurantStatsProps) => {
    const upgradeAmount = 220 * (restaurant.level + 1)
    const canAfford = parseInt(coins) >= upgradeAmount

    const [accessToken, setAccessToken] = useState('')

    useEffect(() => {
        const isAuthenticated = async () => {
            const useEffectToken = await AsyncStorage.getItem('accessToken')

            if (!useEffectToken) {
                await AsyncStorage.removeItem('coins')
                await AsyncStorage.removeItem('streak')

                router.navigate('/onboarding')
            } else {
                setAccessToken(useEffectToken)
            }
        }

        isAuthenticated()
    }, [])

    const upgradeRestaurant = async () => {
        if (canAfford) {
            const res = await fetch('https://restaurantproductivity.onrender.com/api/restaurants/upgrade', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            })

            const data = await res.json()

            if (data.error) {
                if (data.userNotExist) {
                    await AsyncStorage.removeItem('accessToken')
                    await AsyncStorage.removeItem('coins')
                    await AsyncStorage.removeItem('streak')

                    router.navigate('/onboarding')
                } else {
                    Alert.alert(data.error)
                }
            } else {
                await AsyncStorage.setItem('coins', `${data.coins}`)
                setRestaurant(prevRestaurant => ({
                    ...prevRestaurant,
                    level: prevRestaurant.level + 1
                }))

                setCoins(`${data.coins}`)
                setOpen(false)

                router.reload()
            }
        }
    }

    if (restaurant.stats.length > 0) {
        return (
            <Modal
                animationType='fade'
                transparent={true}
                visible={open}
            >
                <View className='flex-1 justify-center items-center'>
                    <View className='bg-light-100 border-2 w-11/12'>

                        <View className='p-6 z-50 w-full m-0 absolute'>
                            <TouchableWithoutFeedback 
                                className='absolute top-0 left-0'
                                onPress={() => setOpen(false)}
                            >
                                <Text className='text-3xl'>&times;</Text>
                            </TouchableWithoutFeedback>
                        </View>

                        <Text className='font-bold text-2xl m-8 text-center'>Stats</Text>
                        <Text className='font-bold text-lg ml-6'>Level {restaurant?.level}</Text>

                        {restaurant?.stats.length > 0 ? (
                            <FlatList 
                                data={restaurant.stats}
                                keyExtractor={item => item.feature}
                                renderItem={({ item, index }) => {
                                    if (item.feature === 'Average review') {
                                        return (
                                            <ReviewStars stars={parseInt(item.amount)} />
                                        )
                                    } else {
                                        return (
                                            <Text 
                                                className={`
                                                    ${index === 0 && 'mt-4'} 
                                                    ${index === restaurant.stats.length - 1 && 'mb-6'} 
                                                    ml-6 
                                                    font-normal`
                                                }>
                                                    {item.feature}:{' '}
                                                <Text className='font-bold'>{item.amount} {item.ending}</Text>
                                            </Text>
                                        )
                                    }
                                }}
                            />
                        ) : (
                            <>
                                <Text className='text-md m-6'>No items yet</Text>
                                <TouchableOpacity 
                                    className='p-4 mx-6 mb-6 border-2 border-dashed border-slate-950 rounded-lg'
                                    onPress={() => setOpen(false)}
                                >
                                    <Text className='text-md text-center'>Buy your first item</Text>
                                </TouchableOpacity>
                            </>
                        )}
                        <TouchableHighlight 
                            className={`
                                m-6 
                                p-4 
                                rounded-lg 
                                ${canAfford ? 'bg-primary' : 'bg-button-primaryDisabled'}`
                            }
                            underlayColor={canAfford ? '#0014C7' : '#A3ACFF'}
                            onPress={upgradeRestaurant}
                        >
                            <View className='flex flex-row justify-around items-center'>
                                <Text className='text-lg color-white'>Upgrade</Text>

                                <View className='flex flex-row items-center gap-3'>
                                    <Image source={icons.coins} className='size-8' style={{ opacity: canAfford ? 1 : 0.6 }} />
                                    <Text className='text-lg color-white'>{upgradeAmount}</Text>
                                </View>
                            </View>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
        )
    }
}

export default RestaurantStats