import { View, Text, Image } from 'react-native'
import React, { useState } from 'react'

import { AdvancedCheckbox } from 'react-native-advanced-checkbox'
import { icons } from '@/constants/icons'

interface GoalCardProps {
    completed: boolean,
    name: string,
    priority: string,
    difficulty: string
}

const GoalCard = ({ completed, name, priority, difficulty }: GoalCardProps) => {
    const [checked, setChecked] = useState<string | boolean>(completed)

    let priorityBg = ''
    let priorityImg

    if (priority === 'low') {
        priorityBg = 'bg-button-good'
        priorityImg = icons.lowpriority
    }
    else if (priority === 'medium') {
        priorityBg = 'bg-button-warning'
        priorityImg = icons.mediumpriority
    }
    else if (priority === 'high') {
        priorityBg = 'bg-button-error'
        priorityImg = icons.highpriority
    }

    let difficultyBg
    let difficultyImg

    if (difficulty === 'easy') {
        difficultyBg = 'bg-button-good'
        difficultyImg = icons.easydifficulty
    } else if (difficulty === 'medium') {
        difficultyBg = 'bg-button-warning'
        difficultyImg = icons.mediumdifficulty
    } else if (difficulty === 'high') {
        difficultyBg = 'bg-button-error'
        difficultyImg = icons.harddifficulty
    }
    
    return (
        <View className='bg-light-200 m-4 p-4 py-6 pl-6 flex flex-row items-center rounded-xl'>
            <AdvancedCheckbox 
                value={checked}
                onValueChange={setChecked}
            />
            <Text className='ml-4 text-lg'>{name}</Text>
            <View className={`flex flex-row p-4 w-30 ${priorityBg} items-center justify-center ml-auto`}>
                <Text className=''>{priority.charAt(0).toUpperCase() + priority.slice(1)}</Text>
                <Image className='m-2 w-8 h-8' source={priorityImg} />
            </View>
            <View className={`flex flex-row p-4 w-30 ${difficultyBg} items-center justify-center ml-auto`}>
                <Text className=''>{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</Text>
                <Image className='m-2 w-8 h-8 translate-y-2' source={difficultyImg} />
            </View>
        </View>
    )
}

export default GoalCard