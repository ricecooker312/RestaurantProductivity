import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'

import { images } from '@/constants/images'
import ItemModal from './ItemModal'
import { Feature, RestaurantItem } from '@/types/restaurantTypes'

const imagesMap = {
    'lvlonechair.png': require('../assets/images/lvlonechair.png')
}

interface ItemProps {
    name: string,
    image: string,
    level: number,
    maxLevel: number,
    features: Feature[]
}

const Item = ({ name, image, maxLevel, level, features }: ItemProps) => {
    const [open, setOpen] = useState(false)

    return (
        <>
            <TouchableOpacity 
                className='border-2 bg-light-100 rounded-lg w-24 h-24'
                onPress={() => setOpen(true)}
            >
                <Image source={{ uri: image }} className='size-full' />
            </TouchableOpacity>
            <ItemModal 
                open={open} 
                setOpen={setOpen} 
                item={name}
                image={image} 
                level={level}
                features={features}
            />
        </>
    )
}

export default Item