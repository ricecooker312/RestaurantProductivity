import { View, Text, Image, TouchableOpacity, TouchableHighlight } from 'react-native'
import React from 'react'

import { icons } from '@/constants/icons'

export type Goal = {
    _id: string,
    title: string,
    description: string,
    completed: boolean,
    type: string,
    priority: string,
    difficulty: string,
    userId: string,
    time: string
}

const FullGoalCard = ({ goal }: { goal: Goal }) => {
    return (
        <View className='w-11/12 bg-light-100 rounded-lg mb-8 flex flex-row flex-wrap'>
            <View className='flex flex-row items-center'>
                <Text className='font-bold text-2xl p-6'>{goal.title}</Text>
                <Text 
                    className={`
                    ${goal.type === 'habit' ? 'bg-[#4EC47A]' : 'bg-[#4ED9FF]'} 
                    w-20 
                    p-2 
                    text-center
                `}>{goal.type.charAt(0).toUpperCase() + goal.type.slice(1)}</Text>
            </View>
            <Text className='px-6 pb-6 w-full'>{goal.description}</Text> 
            <View className='flex flex-row p-6 items-center w-full'>
                <Text className='color-[#4A4A4A]'>Priority: </Text>
                {goal.priority === 'low' ? (
                    <View className='flex flex-row gap-1 bg-button-good p-4 w-24 justify-around ml-2'>
                        <Text>Low</Text>
                        <Image source={icons.lowpriority} />
                    </View>
                ) : goal.priority === 'medium' ? (
                    <View className='flex flex-row gap-1 bg-button-warning p-4 w-32 justify-around ml-2'>
                        <Text>Medium</Text>
                        <Image source={icons.mediumpriority} />
                    </View>
                ) : goal.priority === 'high' && (
                    <View className='flex flex-row gap-1 bg-button-error p-4 w-24 justify-around ml-2'>
                        <Text>High</Text>
                        <Image source={icons.highpriority} />
                    </View>
                )}
            </View>
            <View className='p-6 flex flex-row items-center w-full'>
                <Text className='color-[#4A4A4A]'>Difficulty: </Text>
                {goal.difficulty === 'easy' ? (
                    <View className='bg-button-good flex flex-row justify-around ml-2 gap-1 p-4 w-28 items-center'>
                        <Text>Easy</Text>
                        <Image source={icons.easydifficulty} className='translate-y-2' />
                    </View>
                ) : goal.difficulty === 'medium' ? (
                    <View className='flex flex-row gap-1 bg-button-warning justify-around ml-2 p-4 w-[8.5rem] items-center'>
                        <Text>Medium</Text>
                        <Image source={icons.mediumdifficulty} className='translate-y-2' />
                    </View>
                ) : goal.difficulty === 'hard' && (
                    <View className='flex flex-row gap-1 bg-button-error justify-around ml-2 p-4 w-28 items-center'>
                        <Text>Hard</Text>
                        <Image source={icons.harddifficulty} className='translate-y-2' />
                    </View>
                )}
            </View>
            <TouchableHighlight 
                className='
                mr-auto 
                p-4 
                m-4 
                bg-primary 
                w-36 
                rounded-xl'
                underlayColor={'#0014C7'}
                onPress={() => {}}
            >
                <Text className='text-lg color-white text-center'>Complete</Text>
            </TouchableHighlight>
            <TouchableHighlight 
                className='
                ml-auto 
                p-4 
                m-4 
                bg-primary 
                w-36 
                rounded-xl'
                underlayColor={'#0014C7'}
                onPress={() => {}}
            >
                <Text className='text-lg color-white text-center'>Edit Goal</Text>
            </TouchableHighlight>
        </View>
    )
}

export default FullGoalCard