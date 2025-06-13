import { 
    View, 
    Text, 
    ScrollView,
    TouchableWithoutFeedback,
    TouchableHighlight,
    Image,
    Alert,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { router } from 'expo-router'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

import { icons } from '@/constants/icons'
import TabFooter from '@/components/TabFooter'
import NewItemModal from '@/components/NewItemModal'
import Item from '@/components/Item'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { RestaurantItem } from '@/types/restaurantTypes'
import Header from '@/components/Header'

const restaurant = () => {
    const [newFurniture, setNewFurniture] = useState(false)
    const [newMenu, setNewMenu] = useState(false)
    const [newDecor, setNewDecor] = useState(false)
    const [accessToken, setAccessToken] = useState('')
    const [items, setItems] = useState<RestaurantItem[]>([])
    const [unowned, setUnowned] = useState<RestaurantItem[]>([])

    const insets = useSafeAreaInsets()

    useEffect(() => {
        const isAuthenticated = async () => {
            const useEffectToken = await AsyncStorage.getItem('accessToken')

            if (!useEffectToken) {
                router.navigate('/onboarding')
            } else {
                setAccessToken(useEffectToken)
            }
        }

        isAuthenticated()
    }, [])

    useEffect(() => {
        const getItems = async () => {
            const getItemPayload = {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            }

            const res = await fetch('https://restaurantproductivity.onrender.com/api/items/user/find/all', getItemPayload)
            const data = await res.json()

            if (data.error) {
                console.log(`All Items Find Error: ${data.error}`)
            } else {
                setItems(data)
            }
        }

        const getUnowned = async () => {
            const getUnownedPayload = {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            }

            const res = await fetch('https://restaurantproductivity.onrender.com/api/items/user/find/unowned/all', getUnownedPayload)
            const data = await res.json()

            if (data.error) {
                console.log(data.error)
            } else {
                setUnowned(data)
            }
        }


        if (accessToken) {
            getItems()
            getUnowned()
        }
    }, [accessToken])

    if (!accessToken || items.length + unowned.length !== 5) {
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
                        <Header />

                        <ActivityIndicator className='p-4' size={'large'} color={'#292626'} />
                    </ScrollView>
                </SafeAreaView>
            </View>
        )
    } else {
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
                        <Header />

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

                            {items.length > 0 && items.map(item => (
                                item.type === 'furniture' && (
                                    <Item 
                                        key={item._id} 
                                        item={item}
                                        setItems={setItems}
                                    />
                                )
                            ))}

                            {unowned.filter(item => item.type === 'furniture').length > 0 && (
                                <>
                                    <TouchableOpacity 
                                        className='border-2 border-dashed bg-light-100 rounded-lg items-center justify-center w-24 h-24'
                                        onPress={() => setNewFurniture(true)}
                                    >
                                        <Text className='text-5xl'>+</Text>
                                    </TouchableOpacity>
                                    <NewItemModal 
                                        open={newFurniture} 
                                        setOpen={setNewFurniture} 
                                        items={unowned.filter(item => item.type === 'furniture')} 
                                        setItems={setItems}
                                        setUnowned={setUnowned}
                                    />
                                </>
                            )}

                        </View>

                        <Text className='text-2xl font-bold color-dark-heading m-6'>Menu</Text>

                        <View className='flex flex-row flex-wrap m-6 mt-0 gap-5'>

                            {items.length > 0 && items.map(item => (
                                item.type === 'menu' && (
                                    <Item 
                                        key={item._id} 
                                        item={item}
                                        setItems={setItems}
                                    />
                                )
                            ))}
                            
                            {unowned.filter(item => item.type === 'menu').length > 0 && (
                                <>
                                    <TouchableOpacity 
                                        className='border-2 border-dashed bg-light-100 rounded-lg items-center justify-center w-24 h-24'
                                        onPress={() => setNewMenu(true)}
                                    >
                                        <Text className='text-5xl'>+</Text>
                                    </TouchableOpacity>
                                    <NewItemModal 
                                        open={newMenu} 
                                        setOpen={setNewMenu} 
                                        items={unowned.filter(item => item.type === 'menu')} 
                                        setItems={setItems}
                                        setUnowned={setUnowned}
                                    />
                                </>
                            )}

                        </View>

                        <Text className='text-2xl font-bold color-dark-heading m-6'>Decor</Text>

                        <View className='flex flex-row flex-wrap m-6 mt-0 gap-5 mb-16'>

                            {items.length > 0 && items.map(item => (
                                item.type === 'decor' && (
                                    <Item 
                                        key={item._id} 
                                        item={item}
                                        setItems={setItems}
                                    />
                                )
                            ))}

                            {unowned.filter(item => item.type === 'decor').length > 0 && (
                                <>
                                    <TouchableOpacity 
                                        className='border-2 border-dashed bg-light-100 rounded-lg items-center justify-center w-24 h-24'
                                        onPress={() => setNewDecor(true)}
                                    >
                                        <Text className='text-5xl'>+</Text>
                                    </TouchableOpacity>
                                    <NewItemModal 
                                        open={newDecor} 
                                        setOpen={setNewDecor} 
                                        items={unowned.filter(item => item.type === 'decor')} 
                                        setItems={setItems}
                                        setUnowned={setUnowned}
                                    />
                                </>
                            )}

                        </View>
                    </ScrollView>
                </SafeAreaView>
                <TabFooter page='restaurant' />
            </View>
        )
    }
}

export default restaurant