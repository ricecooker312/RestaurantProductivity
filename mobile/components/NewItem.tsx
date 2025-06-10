import { View, Text, ImageSourcePropType, Image, TouchableHighlight} from 'react-native'
import React from 'react'

import { Feature } from '@/types/restaurantTypes'

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
                <Text className='text-sm color-gray m-4'>{feature.feature}:{' '}
                    <Text className='font-bold'>{feature.amount}</Text>
                </Text>
            ))}

            <TouchableHighlight
                onPress={() => {}}
                underlayColor={'#0014C7'}
                className='bg-primary p-4 px-8 rounded-lg mt-6'
            >
                <Text className='color-white text-lg text-center'>Buy</Text>
            </TouchableHighlight>
        </View>
    )
}

export default NewItem