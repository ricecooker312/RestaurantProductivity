import { View, Text, Image, TouchableHighlight } from 'react-native'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'

import { Feature, RestaurantItem } from '@/types/restaurantTypes'
import { icons } from '@/constants/icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'

interface NewItemProps {
    item: RestaurantItem,
    setItems: Dispatch<SetStateAction<RestaurantItem[]>>,
    setOpen: (value: boolean) => void,
    setUnowned: Dispatch<SetStateAction<RestaurantItem[]>>,
    coins: string,
    setCoins: (value: string) => void
}

const NewItem = ({ item, setItems, setOpen, setUnowned, coins, setCoins }: NewItemProps) => {
    const [accessToken, setAccessToken] = useState('')

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

    const buyItem = async () => {
        if (item.price <= parseInt(coins)) {
            const buyPayload = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    itemId: item._id
                })
            }

            const res = await fetch('https://restaurantproductivity.onrender.com/api/items/user/buy', buyPayload)
            const data = await res.json()

            if (data.error) {
                console.log(data.error)
            } else {
                item.level = 1
                setItems(prevItems => [
                    ...prevItems,
                    item
                ])
                setOpen(false)
                setUnowned(unownedItem => unownedItem.filter(uItem => uItem !== item))
                setCoins(`${data.coins}`)
                await AsyncStorage.setItem('coins', `${data.coins}`)
            }
        }
    }

    return (
        <View className='bg-light-200 p-4 m-16 w-10/12'>
            <Text className='font-bold text-center text-2xl'>{item.name}</Text>
            
            <View className='w-full flex items-center'>
                <Image source={{ uri: item.image[0] }} className='w-36 h-36' />
            </View>

            {item.features.map(feature => (
                <Text key={feature.feature} className='text-sm color-gray m-4'>{feature.feature}:{' '}
                    <Text className='font-bold'>{feature.amount}</Text>
                </Text>
            ))}

            <TouchableHighlight
                onPress={buyItem}
                underlayColor={`${item.price > parseInt(coins) ? '' : '#0014C7'}`}
                className={`${item.price > parseInt(coins) ? 'bg-button-primaryDisabled' : 'bg-primary'} p-4 px-8 rounded-lg mt-6`}
            >
                <View className='flex flex-row items-center justify-center'>
                    <Text className='color-white text-lg text-center mr-auto'>BUY</Text>

                    <View className='flex flex-row gap-3 items-center'>
                        <Text className='color-white text-lg'>{item.price}</Text>
                        <Image source={icons.coins} className='w-8 h-8' />
                    </View>
                </View>
            </TouchableHighlight>
        </View>
    )
}

export default NewItem