import { View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native'
import React, { Dispatch, SetStateAction } from 'react'

import NewItem from './NewItem'
import { Restaurant, RestaurantItem } from '@/types/restaurantTypes'

interface NewItemModalProps {
    open: boolean,
    setOpen: (value: boolean) => void,
    items: RestaurantItem[],
    setItems: Dispatch<SetStateAction<RestaurantItem[]>>
    setUnowned: Dispatch<SetStateAction<RestaurantItem[]>>,
    coins: string,
    setCoins: Dispatch<SetStateAction<string>>,
    setRestaurant: Dispatch<SetStateAction<Restaurant>>
}

const NewItemModal = ({ open, setOpen, items, setItems, setUnowned, coins, setCoins, setRestaurant }: NewItemModalProps) => {
    return (
        <Modal
            animationType='fade'
            transparent={true}
            visible={open}
        >
            <View className='flex-1 justify-center items-center'>
                <ScrollView 
                    style={{ padding: 15, margin: 20, maxHeight: '70%' }} 
                    className='bg-light-100 rounded-lg w-10/12 border-2'
                    contentContainerClassName='items-center'
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                >
                    <View className='p-6 z-50 w-full m-0'>
                        <TouchableOpacity
                            className='absolute top-0 left-0'
                            onPress={() => setOpen(false)}
                        >
                            <Text className='text-3xl'>&times;</Text>
                        </TouchableOpacity>
                        <Text className='text-3xl font-bold text-center'>New Item</Text>
                    </View>

                    {items.map(item => (
                        <NewItem 
                            key={item._id} 
                            item={item} 
                            setItems={setItems} 
                            setOpen={setOpen} 
                            setUnowned={setUnowned} 
                            coins={coins}
                            setCoins={setCoins}
                            setRestaurant={setRestaurant}
                        />
                    ))}
                </ScrollView>
            </View>
        </Modal>
    )
}

export default NewItemModal