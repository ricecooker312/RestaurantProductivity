import { View, Text, TouchableOpacity, Image, Alert } from 'react-native'
import React from 'react'
import { User } from '@/types/userTypes'
import { icons } from '@/constants/icons'

interface FriendCardProps {
    friend: User,
    removeFriend: (value: User) => void
}

const FriendCard = ({ friend, removeFriend }: FriendCardProps) => {
    return (
        <View className='
        m-6 
        bg-light-100 
        p-4 flex 
        flex-col
        justify-center 
        rounded-md 
        items-between
        '>
            <Text className='text-lg ml-4 mt-2'>{friend.email}</Text>

            <View className='flex flex-row gap-2 ml-4 my-4'>
                <TouchableOpacity className='bg-button-warning p-4 rounded-lg'>
                    <Image source={icons.restauranttab} className='size-8' />
                </TouchableOpacity>
                <TouchableOpacity className='bg-primaryLight p-4 rounded-lg'>
                    <Image source={icons.profiletab} className='size-8' />
                </TouchableOpacity>
                <TouchableOpacity 
                    className='bg-button-error p-4 rounded-lg'
                    onPress={() => {
                        Alert.alert(
                            'Remove Friend',
                            `Are you sure you want to unfriend ${friend.email}?`,
                            [
                                {
                                    text: 'Cancel',
                                    style: 'cancel'
                                },
                                {
                                    text: 'Unfriend',
                                    onPress: () => removeFriend(friend)
                                }
                            ]
                        )
                    }}
                >
                    <Image source={icons.removefriend} className='size-8' /> 
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default FriendCard