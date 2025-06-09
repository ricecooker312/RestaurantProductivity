import { 
    View, 
    Text, 
    ScrollView,
    TouchableWithoutFeedback,
    TouchableHighlight,
    Image,
    Alert,
    TouchableOpacity
} from 'react-native'
import React, { useState } from 'react'
import { router } from 'expo-router'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

import { icons } from '@/constants/icons'
import TabFooter from '@/components/TabFooter'
import { images } from '@/constants/images'
import ItemModal from '@/components/ItemModal'

const restaurant = () => {
    const [chairModal, setChairModal] = useState(false)
    const [tableModal, setTableModal] = useState(false)

    const insets = useSafeAreaInsets()

    return (
        <View className='flex-1 bg-dfbg'>
            <SafeAreaView style={{
                flex: 1,
                paddingTop: Math.max(insets.top - 50, 0),
                paddingBottom: insets.bottom,
                paddingRight: insets.right,
                paddingLeft: insets.left
            }}>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps='handled'
                    showsVerticalScrollIndicator={false}
                >
                    <View className='flex flex-row flex-wrap items-center justify-center'>
                    
                        <TouchableWithoutFeedback onPress={() => Alert.alert('you clicked!')}>
                            <Image source={icons.logo} className='w-[3.875rem] h-[2.9375rem] m-4 ml-8' />
                        </TouchableWithoutFeedback>
    
                        <View className='flex-row items-center mx-[1rem]'>
                            <Image source={icons.streak} className='w-[4rem] h-[4rem]' />
                            <Text className='text-xl'>6</Text>
                        </View>
    
                        <TouchableHighlight
                            className='p-4 px-8 bg-primary justify-self-end ml-auto mr-8 rounded-xl'
                            underlayColor={'#0014C7'}
                            onPress={() => router.navigate('/newGoal')}
                        >
                            <Text className='color-white text-lg'>Set a New Goal</Text>
                        </TouchableHighlight>
                        
                    </View>

                    <Text className='font-bold color-dark-heading text-3xl p-6 mr-auto'>Restaurant</Text>
                    
                    <View className='w-screen items-center'>
                        <TouchableHighlight 
                            className='p-4 px-8 bg-primary w-[40%] rounded-lg'
                            underlayColor={'#0014C7'}
                            onPress={() => {}}
                        >
                            <Text className='color-white text-center text-lg'>Visit</Text>
                        </TouchableHighlight>
                    </View>

                    <Text className='text-2xl font-bold color-dark-heading p-6'>Furniture</Text>

                    <View className='flex flex-row flex-wrap m-6 mt-0 gap-5'>

                        <TouchableOpacity 
                            className='border-2 bg-light-100 rounded-lg w-24 h-24'
                            onPress={() => setChairModal(true)}
                        >
                            <Image source={images.lvlonechair} className='size-full' />
                        </TouchableOpacity>
                        <ItemModal 
                            open={chairModal} 
                            setOpen={setChairModal} 
                            item='Chair'
                            image={images.lvlonechair} 
                            level='1'
                            features={[
                                {
                                    feature: 'Average stay time',
                                    amount: '20 minutes'
                                },
                                {
                                    feature: 'Average profit',
                                    amount: '$20'
                                }
                            ]}
                        />

                        <TouchableOpacity 
                            className='border-2 bg-light-100 rounded-lg w-24 h-24'
                            onPress={() => setTableModal(true)}
                        >
                            <Image source={images.lvlonetable} className='size-full' />
                        </TouchableOpacity>
                        <ItemModal
                            open={tableModal}
                            setOpen={setTableModal}
                            item='Table'
                            image={images.lvlonetable}
                            level='1'
                            features={[
                                {
                                    feature: 'Average customers',
                                    amount: '1'
                                },
                                {
                                    feature: 'Average profit',
                                    amount: '$25'
                                }
                            ]}
                        />

                        <TouchableOpacity 
                            className='border-2 border-dashed bg-light-100 rounded-lg items-center justify-center w-24 h-24'
                            onPress={() => {}}
                        >
                            <Text className='text-5xl'>+</Text>
                        </TouchableOpacity>

                    </View>

                    <Text className='text-2xl font-bold color-dark-heading m-6'>Menu</Text>

                    <View className='flex flex-row flex-wrap m-6 mt-0 gap-5'>

                        <TouchableOpacity 
                            className='border-2 border-dashed bg-light-100 rounded-lg items-center justify-center w-24 h-24'
                            onPress={() => {}}
                        >
                            <Text className='text-5xl'>+</Text>
                        </TouchableOpacity>

                    </View>

                    <Text className='text-2xl font-bold color-dark-heading m-6'>Decor</Text>

                    <View className='flex flex-row flex-wrap m-6 mt-0 gap-5 mb-16'>

                        <TouchableOpacity 
                            className='border-2 border-dashed bg-light-100 rounded-lg items-center justify-center w-24 h-24'
                            onPress={() => {}}
                        >
                            <Text className='text-5xl'>+</Text>
                        </TouchableOpacity>

                    </View>
                </ScrollView>
            </SafeAreaView>
            <TabFooter page='restaurant' />
        </View>
    )
}

export default restaurant