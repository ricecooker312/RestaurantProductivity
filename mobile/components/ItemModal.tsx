import { View, Text, Modal, Image, TouchableHighlight, TouchableOpacity, ImageSourcePropType, ScrollView } from 'react-native'
import React from 'react'

import { Feature } from '@/types/restaurantTypes'

interface ItemModalProps {
    open: boolean,
    setOpen: (value: boolean) => void,
    item: string,
    image: ImageSourcePropType,
    level: string,
    features: Feature[]
}

const ItemModal = ({ open, setOpen, image, item, level, features }: ItemModalProps) => {
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
                        {item}{' '}
                        <Text className='color-primary'>Level {level}</Text>
                    </Text>
                    <Image source={image} className='size-36' />
                    
                    {features.map(feature => (
                        <Text key={feature.amount} className='text-sm color-gray'>{feature.feature}:{' '}
                            <Text className='font-bold'>{feature.amount}</Text>
                        </Text>
                    ))}

                    <TouchableHighlight 
                        className='p-4 m-4 mt-8 w-[90%] bg-primary rounded-lg'
                        underlayColor={'#0014C7'}
                        onPress={() => {}}
                    >
                        <Text className='color-white text-lg text-center'>Upgrade</Text>
                    </TouchableHighlight>
                </View>
            </View>
        </Modal>
    )
}

export default ItemModal