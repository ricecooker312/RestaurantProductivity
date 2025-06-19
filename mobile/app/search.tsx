import { View, Text, ScrollView, Image, TouchableWithoutFeedback, TouchableOpacity, TextInput } from 'react-native'
import React from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { icons } from '@/constants/icons'
import { router } from 'expo-router'

const search = () => {
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
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps='handled'
                    showsHorizontalScrollIndicator={false}
                >
                    <View 
                        className='relative flex flex-row items-center justify-center pb-6 border-b-2 border-zinc-400'
                    >
                        <TouchableWithoutFeedback onPress={() => router.navigate('/social')}>
                            <View className='absolute left-6 top-0'>
                                <Image source={icons.secondbackicon} className='size-8' />
                            </View>
                        </TouchableWithoutFeedback>
                        
                        <Text className='color-dark-heading text-center text-2xl font-bold'>Search</Text>
                    </View>

                    <TextInput
                        placeholder='Search'
                        className='p-4 border-2 rounded-xl m-6'
                    />

                    <View className='m-6 p-4 mt-0'>
                        <View className='bg-light-200 mt-0 p-4 rounded-lg flex flex-row items-center justify-between'>
                            <Text>Sarah</Text>
                            <TouchableOpacity className='bg-button-warning p-4 rounded-lg'>
                                <Image source={icons.restauranttab} className='size-8' />
                            </TouchableOpacity>
                        </View>
                        <View className='bg-light-200 mt-4 p-4 rounded-lg'>
                            <Text>Sarah</Text>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    )
}

export default search