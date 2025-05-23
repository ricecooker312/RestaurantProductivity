import { View, Text, Image, TouchableHighlight, TouchableWithoutFeedback } from 'react-native'
import React from 'react'
import { icons } from '@/constants/icons'
import { router } from 'expo-router'

const newGoal = () => {
    return (
        <View className='bg-dfbg w-screen h-screen'>
            <View className='flex flex-row flex-wrap mt-12 items-center justify-center relative'>
                <TouchableWithoutFeedback onPress={() => router.navigate('/goals')}>
                    <Image source={icons.backicon} className='w-[2.875rem] h-[2.875rem] m-8 mr-auto' />
                </TouchableWithoutFeedback>

                <Text className='color-dark-heading text-3xl font-bold ml-auto mr-auto -translate-x-1/4'>Make a New Goal</Text>
            </View>
        </View>
    )
}

export default newGoal