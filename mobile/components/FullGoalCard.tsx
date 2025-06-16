import { View, Text, Image, TouchableOpacity, TouchableHighlight } from 'react-native'
import React, { useState } from 'react'

import { icons } from '@/constants/icons'
import { Link, RelativePathString, router } from 'expo-router'
import { Goal } from '@/types/goalTypes'

interface FullGoalCardProps {
    goal: Goal,
    completeGoal: (goal: Goal, completing: boolean) => void
}

const FullGoalCard = ({ goal, completeGoal }: FullGoalCardProps) => {
    const [currentGoal, setCurrentGoal] = useState(goal)

    return (
        <View className='w-11/12 bg-light-100 rounded-lg mb-8 flex flex-row flex-wrap'>
            <View className='flex flex-row items-center'>
                <Text className='font-bold text-2xl p-6'>{currentGoal.title}</Text>
                <Text 
                    className={`
                    ${currentGoal.type === 'habit' ? 'bg-[#4EC47A]' : 'bg-[#4ED9FF]'} 
                    w-20 
                    p-2 
                    text-center
                `}>{currentGoal.type.charAt(0).toUpperCase() + currentGoal.type.slice(1)}</Text>
            </View>
            <Text className='px-6 pb-6 w-full'>{currentGoal.description}</Text> 
            <View className='flex flex-row p-6 items-center w-full'>
                <Text className='color-[#4A4A4A]'>Priority: </Text>
                {currentGoal.priority === 'low' ? (
                    <View className='flex flex-row gap-1 bg-button-good p-4 w-24 justify-around ml-2'>
                        <Text>Low</Text>
                        <Image source={icons.lowpriority} />
                    </View>
                ) : currentGoal.priority === 'medium' ? (
                    <View className='flex flex-row gap-1 bg-button-warning p-4 w-32 justify-around ml-2'>
                        <Text>Medium</Text>
                        <Image source={icons.mediumpriority} />
                    </View>
                ) : currentGoal.priority === 'high' && (
                    <View className='flex flex-row gap-1 bg-button-error p-4 w-24 justify-around ml-2'>
                        <Text>High</Text>
                        <Image source={icons.highpriority} />
                    </View>
                )}
            </View>
            <View className='p-6 flex flex-row items-center w-full'>
                <Text className='color-[#4A4A4A]'>Difficulty: </Text>
                {currentGoal.difficulty === 'easy' ? (
                    <View className='bg-button-good flex flex-row justify-around ml-2 gap-1 p-4 w-28 items-center'>
                        <Text>Easy</Text>
                        <Image source={icons.easydifficulty} className='translate-y-2' />
                    </View>
                ) : currentGoal.difficulty === 'medium' ? (
                    <View className='flex flex-row gap-1 bg-button-warning justify-around ml-2 p-4 w-[8.5rem] items-center'>
                        <Text>Medium</Text>
                        <Image source={icons.mediumdifficulty} className='translate-y-2' />
                    </View>
                ) : currentGoal.difficulty === 'hard' && (
                    <View className='flex flex-row gap-1 bg-button-error justify-around ml-2 p-4 w-28 items-center'>
                        <Text>Hard</Text>
                        <Image source={icons.harddifficulty} className='translate-y-2' />
                    </View>
                )}
            </View>
            <View className='flex flex-row absolute top-0 right-0 items-center gap-3 m-4'>
                <Image source={icons.coins} className='w-12 h-12' />
                <Text className='text-center text-lg'>{goal.reward}</Text>
            </View>
            {currentGoal.completed === false ? (
                <>
                    <TouchableHighlight 
                        className='
                        mr-auto 
                        p-4 
                        m-4 
                        bg-primary 
                        w-36 
                        rounded-xl'
                        underlayColor={'#0014C7'}
                        onPress={() => completeGoal(goal, true)}
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
                        onPress={() => router.navigate(`/edit/${currentGoal._id}` as RelativePathString)}
                    >
                        <Text className='text-lg color-white text-center'>Edit Goal</Text>
                    </TouchableHighlight>
                </>
            ) : (
                <Text className='text-center text-lg w-full p-4 bg-[#65FF65]'>
                    Goal is completed!{' '}
                    <Link href='/goals' onPress={() => completeGoal(goal, true)}>
                        <Text className='text-lg color-primary border-2'>Undo</Text>
                    </Link>
                </Text>
            )}
        </View>
    )
}

export default FullGoalCard