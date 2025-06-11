import { View, Text, ImageSourcePropType, Image, TouchableHighlight} from 'react-native'
import React from 'react'

import { Feature } from '@/types/restaurantTypes'
import { icons } from '@/constants/icons'

interface NewItemProps {
    item: string,
    image: ImageSourcePropType,
    price: string,
    features: Feature[]
}

const NewItem = ({ item, image, price, features }: NewItemProps) => {
    return (
        <View className='bg-light-200 p-4 m-16 w-10/12'>
            <Text className='font-bold text-center text-2xl'>{item}</Text>
            
            <View className='w-full flex items-center'>
                <Image source={image} className='w-36 h-36' />
            </View>

            {features.map(feature => (
                <Text key={feature.amount} className='text-sm color-gray m-4'>{feature.feature}:{' '}
                    <Text className='font-bold'>{feature.amount}</Text>
                </Text>
            ))}

            <TouchableHighlight
                onPress={() => {}}
                underlayColor={'#0014C7'}
                className='bg-primary p-4 px-8 rounded-lg mt-6'
            >
                <View className='flex flex-row items-center justify-center'>
                    <Text className='color-white text-lg text-center mr-auto'>BUY</Text>

                    <View className='flex flex-row gap-3 items-center'>
                        <Text className='color-white text-lg'>{price}</Text>
                        <Image source={icons.coins} className='w-8 h-8' />
                    </View>
                </View>
            </TouchableHighlight>
        </View>
    )
}

export default NewItem