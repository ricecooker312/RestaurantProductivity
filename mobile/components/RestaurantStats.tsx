import { View, Text, Modal, TouchableWithoutFeedback, FlatList, TouchableOpacity, TouchableHighlight } from 'react-native'
import React from 'react'
import { Restaurant } from '@/types/restaurantTypes'
import ReviewStars from './ReviewStars'


interface RestaurantStatsProps {
    open: boolean,
    setOpen: (value: boolean) => void,
    restaurant: Restaurant
}

const RestaurantStats = ({ open, setOpen, restaurant }: RestaurantStatsProps) => {
    if (restaurant.stats.length > 0) {
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
                        <Text className='font-bold text-lg ml-6'>Level {restaurant?.level}</Text>

                        {restaurant?.stats.length > 0 ? (
                            <FlatList 
                                data={restaurant.stats}
                                keyExtractor={item => item.feature}
                                renderItem={({ item, index }) => {
                                    if (item.feature === 'Average review') {
                                        return (
                                            <ReviewStars stars={parseInt(item.amount)} />
                                        )
                                    } else {
                                        return (
                                            <Text 
                                                className={`
                                                    ${index === 0 && 'mt-4'} 
                                                    ${index === restaurant.stats.length - 1 && 'mb-6'} 
                                                    ml-6 
                                                    font-normal`
                                                }>
                                                    {item.feature}:{' '}
                                                <Text className='font-bold'>{item.amount} {item.ending}</Text>
                                            </Text>
                                        )
                                    }
                                }}
                            />
                        ) : (
                            <>
                                <Text className='text-md m-6'>No items yet</Text>
                                <TouchableOpacity 
                                    className='p-4 mx-6 mb-6 border-2 border-dashed border-slate-950 rounded-lg'
                                    onPress={() => setOpen(false)}
                                >
                                    <Text className='text-md text-center'>Buy your first item</Text>
                                </TouchableOpacity>
                            </>
                        )}
                        <TouchableHighlight 
                            className='m-6 p-4 rounded-lg bg-primary'
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
}

export default RestaurantStats