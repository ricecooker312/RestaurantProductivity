import { 
    View, 
    Text, 
    Modal, 
    Image, 
    TouchableHighlight, 
    TouchableOpacity,
    Alert, 
} from 'react-native'
import React, { Dispatch, SetStateAction, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'

import { RestaurantItem } from '@/types/restaurantTypes'
import { icons } from '@/constants/icons'

interface ItemModalProps {
    open: boolean,
    setOpen: (value: boolean) => void,
    item: RestaurantItem,
    setItems?: Dispatch<SetStateAction<RestaurantItem[]>>,
    setUnowned?: Dispatch<SetStateAction<RestaurantItem[]>>,
    setCoins?: (value: string) => void
}

const ItemModal = ({ open, setOpen, item, setItems, setUnowned, setCoins }: ItemModalProps) => {
    const [accessToken, setAccessToken] = useState('')
    const [maxLevel, setMaxLevel] = useState(false)
    const [unlockedFullMax, setUnlockedFullMax] = useState(item.unlockedFullMax)

    useEffect(() => {
        const isAuthenticated = async () => {
            const useEffectToken = await AsyncStorage.getItem('accessToken')

            if (!useEffectToken) {
                router.navigate('/onboarding')
            } else {
                setAccessToken(useEffectToken)
                console.log(item)
                if (item.level >= item.maxLevel) setMaxLevel(true)
            }
        }

        isAuthenticated()
    }, [])

    const upgradeItem = async () => {
        console.log('is it maxLevel?')
        if (!maxLevel) {
            console.log('not maxLevel, going to upgrade!')
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
                if (data.error === 'Item is already at max level') {
                    setMaxLevel(true)
                    Alert.alert(data.error)
                }
            } else {
                console.log('do we setItems and setCoins?')
                if (setItems && setCoins) {
                    console.log('about to upgrade')
                    setItems(prevItems => prevItems.map(mItem => mItem._id === item._id ? { ...item, level: data.level } : mItem))
                    console.log('just upgraded!')

                    setCoins(`${data.coins}`)
                    await AsyncStorage.setItem('coins', `${data.coins}`)
                }
            }
        }
    }

    const sellItem = async () => {
        const res = await fetch('https://restaurantproductivity.onrender.com/api/items/user/sell', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                itemId: item._id
            })
        })

        const data = await res.json()

        if (data.error) {
            Alert.alert(data.error)
        } else {
            if (setItems && setCoins && setUnowned) {
                setItems(prevItems => prevItems.filter(fItem => fItem._id !== item._id))
                setUnowned(prevUnowned => [
                    ...prevUnowned,
                    item
                ])

                await AsyncStorage.setItem('coins', `${data.coins}`)
                setCoins(`${data.coins}`)

                setOpen(false)
            }
        }
    }

    const itemImage = item.image[item.level - 1]

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
                    <Image source={{ uri: itemImage }} className='size-36' />

                    {item.features.map(feature => (
                        <Text key={feature.feature} className='text-sm color-gray mr-auto'>{feature.feature}:{' '}
                            <Text className='font-bold'>{feature.amount} {feature.ending}</Text>
                        </Text>
                    ))}

                    {setItems && (
                        <>
                            <TouchableHighlight 
                                className={`p-4 m-4 mt-8 w-[90%] ${maxLevel ? 'bg-button-primaryDisabled' : 'bg-primary'} rounded-lg`}
                                underlayColor={`${maxLevel ? '' : '#0014C7'}`}
                                onPress={upgradeItem}
                            >
                                {maxLevel && unlockedFullMax ? (
                                    <Text className='text-lg color-white text-center'>Max Level</Text>
                                ) : maxLevel && !unlockedFullMax ? (
                                    <Text className='text-lg color-white text-center'>
                                        Upgrade your restaurant first
                                    </Text>
                                ) : (
                                    <View className='flex flex-row items-center justify-around'>
                                        <Text className='color-white text-lg text-center'>Upgrade</Text>

                                        <View className='flex flex-row items-center gap-3'>
                                            <Image source={icons.coins} className='size-8' />
                                            <Text className='color-white text-lg'>{item.price * item.level}</Text>
                                        </View>
                                    </View>
                                )}
                            </TouchableHighlight>

                            <TouchableHighlight
                                className='p-4 mx-4 my-2 w-[90%] bg-primary rounded-lg'
                                underlayColor={'#0014C7'}
                                onPress={sellItem}
                            >
                                <View className='flex flex-row items-center justify-around'>
                                    <Text className='color-white text-lg text-center'>Sell</Text>

                                    <View className='flex flex-row items-center gap-3'>
                                        <Image source={icons.coins} className='size-8' />
                                        <Text className='color-white text-lg'>{item.price}</Text>
                                    </View>
                                </View>
                            </TouchableHighlight>
                        </>
                    )}
                </View>
            </View>
        </Modal>
    )
}

export default ItemModal