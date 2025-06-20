import { View, Text, TouchableWithoutFeedback, Image } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { icons } from '@/constants/icons'
import { router } from 'expo-router'

const requests = () => {
    const [requests, setRequests] = useState()

    const insets = useSafeAreaInsets()

    return (
        <View className='flex-1 bg-light-100'>
            <SafeAreaView style={{
                flex: 1,
                paddingTop: Math.max(insets.top - 30, 0),
                paddingBottom: insets.bottom,
                paddingRight: insets.right,
                paddingLeft: insets.left
            }}>
                <View className='flex flex-row items-center justify-center pb-6 border-b-2 border-slate-950 relative'>
                    <TouchableWithoutFeedback onPress={() => router.navigate('/social')}>
                        <Image source={icons.secondbackicon} className='size-8 absolute top-0 left-0 ml-4' />
                    </TouchableWithoutFeedback>
                    <Text className='font-bold color-dark-heading text-center text-2xl'>Requests</Text>
                </View>
            </SafeAreaView>
        </View>
    )
}

export default requests