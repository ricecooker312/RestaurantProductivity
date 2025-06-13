import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'

import { images } from '@/constants/images'
import ItemModal from './ItemModal'
import { RestaurantItem } from '@/types/restaurantTypes'

const imagesMap = {
    'lvlonechair.png': require('../assets/images/lvlonechair.png')
}

interface ItemProps {
    item: RestaurantItem,
    setItems: Dispatch<SetStateAction<RestaurantItem[]>>
}

const Item = ({ item, setItems }: ItemProps) => {
    const [open, setOpen] = useState(false)

    return (
        <>
            <TouchableOpacity 
                className='border-2 bg-light-100 rounded-lg w-24 h-24'
                onPress={() => setOpen(true)}
            >
                <Image source={{ uri: item.image }} className='size-full' />
            </TouchableOpacity>
            <ItemModal 
                open={open} 
                setOpen={setOpen} 
                item={item}
                setItems={setItems}
            />
        </>
    )
}

export default Item