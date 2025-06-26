import { View, Text, TouchableWithoutFeedback, Image, TouchableHighlight, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'

import { icons } from '@/constants/icons'
import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Header = ({ coins, streak }: { coins: string, streak: number }) => {
    return (
        <View className='flex flex-row flex-wrap items-center justify-center'>

            <View className='flex-row items-center mx-[1rem]'>
                <Image source={icons.streak} className='w-[4rem] h-[4rem]' />
                <Text className='text-xl'>{streak}</Text>
            </View>

            <View className='flex-row items-center mx-[1rem]'>
                <Image source={icons.coins} style={{ width: 30, height: 30, marginRight: 10 }} />
                <Text className='text-xl'>{coins}</Text>
            </View>

            <TouchableHighlight
                className='p-4 px-8 bg-primary justify-self-end ml-auto mr-8 rounded-xl'
                underlayColor={'#0014C7'}
                onPress={() => router.navigate('/newGoal')}
            >
                <Text className='color-white text-lg'>Set a New Goal</Text>
            </TouchableHighlight>
            
        </View>
    )
}

export default Header