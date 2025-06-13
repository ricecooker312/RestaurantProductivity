import { 
    View, 
    Text, 
    Modal, 
    Image, 
    TouchableHighlight, 
    TouchableOpacity, 
} from 'react-native'
import React, { Dispatch, SetStateAction, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'

import { RestaurantItem } from '@/types/restaurantTypes'

interface ItemModalProps {
    open: boolean,
    setOpen: (value: boolean) => void,
    item: RestaurantItem,
    setItems: Dispatch<SetStateAction<RestaurantItem[]>>
}

const ItemModal = ({ open, setOpen, item, setItems }: ItemModalProps) => {
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

    const upgradeItem = async () => {
        const upgradePayload = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                itemId: item._id
            })
        }

        const res = await fetch('https://restaurantproductivity.onrender.com/api/items/user/upgrade', upgradePayload)
        const data = await res.json()

        if (data.error) {
            console.log(data.error)
        } else {
            setItems(prevItems => prevItems.map(mItem => mItem._id === item._id ? { ...item, level: data.level } : mItem))
        }
    }

    return (
        <Modal
            animationType='fade'
            transparent={true}
            visible={open}
        >
            <View className='flex-1 justify-center items-center'>
                <View 
                    style={{ padding: 15, margin: 20 }} 
                    className='bg-light-200 items-center rounded-lg w-10/12 border-2'
                >
                    <TouchableOpacity
                        className='absolute top-0 left-0 m-4'
                        onPress={() => setOpen(false)}
                    >
                        <Text className='text-3xl'>&times;</Text>
                    </TouchableOpacity>

                    <Text className='text-left font-bold text-2xl color-dark-heading mb-8'>
                        {item.name}{' '}
                        <Text className='color-primary'>Level {item.level}</Text>
                    </Text>
                    <Image source={{ uri: item.image }} className='size-36' />

                    {item.features.map(feature => (
                        <Text key={feature.amount} className='text-sm color-gray mr-auto'>{feature.feature}:{' '}
                            <Text className='font-bold'>{feature.amount}</Text>
                        </Text>
                    ))}

                    <TouchableHighlight 
                        className='p-4 m-4 mt-8 w-[90%] bg-primary rounded-lg'
                        underlayColor={'#0014C7'}
                        onPress={upgradeItem}
                    >
                        <Text className='color-white text-lg text-center'>Upgrade</Text>
                    </TouchableHighlight>
                </View>
            </View>
        </Modal>
    )
}

export default ItemModal