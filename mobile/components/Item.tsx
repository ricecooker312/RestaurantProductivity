import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'

import { images } from '@/constants/images'
import ItemModal from './ItemModal'
import { Restaurant, RestaurantItem } from '@/types/restaurantTypes'

const imagesMap = {
    'lvlonechair.png': require('../assets/images/lvlonechair.png')
}

interface ItemProps {
    item: RestaurantItem,
    setItems?: Dispatch<SetStateAction<RestaurantItem[]>>,
    setUnowned?: Dispatch<SetStateAction<RestaurantItem[]>>,
    setRestaurant: Dispatch<SetStateAction<Restaurant>>,
    setCoins?: (value: string) => void,
    className?: string
}

const Item = ({ item, setItems, setUnowned, setRestaurant, setCoins, className }: ItemProps) => {
    const [open, setOpen] = useState(false)

    return (
        <>
            <TouchableOpacity 
                className={`${className && className} border-2 bg-light-100 rounded-lg w-24 h-24`}
                onPress={() => setOpen(true)}
            >
                <Image source={{ uri: item.image[item.level - 1] }} className='size-full' />
            </TouchableOpacity>
            <ItemModal 
                open={open} 
                setOpen={setOpen} 
                item={item}
                setItems={setItems}
                setUnowned={setUnowned}
                setRestaurant={setRestaurant}
                setCoins={setCoins}
            />
        </>
    )
}

export default Item