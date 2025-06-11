import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'

import { images } from '@/constants/images'
import ItemModal from './ItemModal'
import { RestaurantItem } from '@/types/restaurantTypes'

const imagesMap = {
    'lvlonechair.png': require('../assets/images/lvlonechair.png')
}

const Item = ({ itemId, accessToken }: { itemId: string, accessToken: string }) => {
    const [open, setOpen] = useState(false)
    const [item, setItem] = useState<RestaurantItem>({
        _id: '',
        name: '',
        image: '',
        type: '',
        price: '',
        maxLevel: 0,
        features: []
    })

    useEffect(() => {
        const getItem = async () => {
            console.log(accessToken, itemId)
            const getItemPayload = {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            }

            const res = await fetch(`https://restaurantproductivity.onrender.com/api/items/user/find/${itemId}`, getItemPayload)
            const data = await res.json()

            if (data.error) {
                console.log(`One Item Find Error: ${data.error}`)
            } else {
                console.log(data)
                setItem(data)
            }
        }

        getItem()
    }, [])

    const image = imagesMap[item.image as keyof typeof imagesMap]
    console.log(item)

    return (
        <>
            <TouchableOpacity 
                className='border-2 bg-light-100 rounded-lg w-24 h-24'
                onPress={() => setOpen(true)}
            >
                <Image source={image} className='size-full' />
            </TouchableOpacity>
            <ItemModal 
                open={open} 
                setOpen={setOpen} 
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
        </>
    )
}

export default Item