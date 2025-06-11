import { View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'

import NewItem from './NewItem'
import { images } from '@/constants/images'

interface NewItemModalProps {
    open: boolean,
    setOpen: (value: boolean) => void,
    itemType: string
}

const NewItemModal = ({ open, setOpen, itemType }: NewItemModalProps) => {
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

                    <NewItem item='Sofa' image={images.lvloneburger} features={[{ feature: 'fdslij', amount: 'fdjsk' }]} price='20' />
                    <NewItem item='Sofa' image={images.lvloneburger} features={[{ feature: 'fdslij', amount: 'fdjsk' }]} price='20' />
                    <NewItem item='Sofa' image={images.lvloneburger} features={[{ feature: 'fdslij', amount: 'fdjsk' }]} price='20' />
                    <NewItem item='Sofa' image={images.lvlonechair} features={[{ feature: 'fdslij', amount: 'fdjsk' }]} price='20' />
                </ScrollView>
            </View>
        </Modal>
    )
}

export default NewItemModal