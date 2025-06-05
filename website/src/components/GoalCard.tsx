import { View, Text, Image } from 'react-native'
import React, { useState } from 'react'

import { AdvancedCheckbox } from 'react-native-advanced-checkbox'
import { icons } from '@/constants/icons'

interface GoalCardProps {
    completed: boolean,
    name: string,
    priority: string
}

const GoalCard = ({ completed, name, priority }: GoalCardProps) => {
    const [checked, setChecked] = useState<string | boolean>(completed)

    let border

    if (priority === 'low') {
        border = 'border-button-good'
    }
    else if (priority === 'medium') {
        border = 'border-button-warning'
    }
    else if (priority === 'high') {
        border = 'border-button-error'
    }
    
    return (
        <View className={`bg-light-100 m-4 p-4 py-6 pl-6 flex flex-row items-center rounded-xl border-4 ${border}`}>
            <AdvancedCheckbox 
                value={checked}
                onValueChange={setChecked}
            />
            <Text className='ml-4 text-lg'>{name}</Text>
        </View>
    )
}

export default GoalCard