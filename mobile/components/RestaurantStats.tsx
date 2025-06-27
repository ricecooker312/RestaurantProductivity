import { View, Text, Modal, TouchableWithoutFeedback, Image } from 'react-native'
import React from 'react'
import { icons } from '@/constants/icons'
import { Restaurant } from '@/types/restaurantTypes'

interface RestaurantStatsProps {
    open: boolean,
    setOpen: (value: boolean) => void,
    restaurant: Restaurant | undefined
}

const RestaurantStats = ({ open, setOpen, restaurant }: RestaurantStatsProps) => {
    console.log(restaurant)
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
                    <Text className='font-bold text-lg ml-6'>Level 1</Text>
                </View>
            </View>
        </Modal>
    )
}

export default RestaurantStats