import { 
    View, 
    Text, 
    TouchableWithoutFeedback, 
    Keyboard, 
    KeyboardAvoidingView, 
    Platform, 
    ScrollView,
    TouchableHighlight,
    Image 
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { router, useLocalSearchParams } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Goal } from '@/types/goalTypes'

import { icons } from '@/constants/icons'
import FormInput from '@/components/FormInput'

import DropDownPicker from 'react-native-dropdown-picker'

const edit = () => {
    const [accessToken, setAccessToken] = useState<string | undefined>()
    const [goal, setGoal] = useState<Goal>({
        _id: '',
        title: '',
        description: '',
        completed: false,
        type: '',
        priority: '',
        difficulty: '',
        userId: '',
        time: ''
    })
    const [errors, setErrors] = useState<string[]>([])
    const [typeDropdown, setTypeDropdown] = useState(false)
    const [typeValue, setTypeValue] = useState(goal.type)
    const [typeItems, setTypeItems] = useState([
        { label: 'Goal', value: 'goal' },
        { label: 'Habit', value: 'habit' }
    ])

    const insets = useSafeAreaInsets()

    const { id } = useLocalSearchParams()

    useEffect(() => {
        const isAuthenticated = async () => {
            const useEffectToken = await AsyncStorage.getItem('accessToken')

            if (!useEffectToken) {
                router.navigate('/')
            } else {
                setAccessToken(useEffectToken)
            }
        }

        isAuthenticated()
    }, [])

    useEffect(() => {
        const fetchGoal = async () => {
            const goalPayload = {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            }

            const res = await fetch(`https://restaurantproductivity.onrender.com/api/goals/find/${id}`, goalPayload)
            const data = await res.json()

            if (data.error) {
                console.log(`One Goal Find Error: ${data.error}`)
            } else {
                setGoal(data)
                setTypeValue(data.type)
            }
        }

        if (accessToken) fetchGoal()
    }, [accessToken])

    const updateGoal = async () => {
        const updateGoalPayload = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                title: goal.title,
                description: goal.description,
                completed: goal.completed,
                type: typeValue,
                priority: goal.priority,
                difficulty: goal.difficulty
            })
        }

        const res = await fetch(`https://restaurantproductivity.onrender.com/api/goals/${goal._id}/update`, updateGoalPayload)
        const data = await res.json()

        if (data.error) {
            console.log(`Goal Update Error: ${data.error}`)
        } else {
            router.navigate('/goals')
        }
    }

    return (
        <View className='bg-light-200 flex-1'>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <SafeAreaView
                        style={{ 
                            flex: 1,
                            paddingTop: insets.top,
                            paddingBottom: insets.bottom,
                            paddingRight: insets.right,
                            paddingLeft: insets.left
                        }}
                    >
                            <View className='flex flex-row flex-wrap mt-12 items-center justify-center relative'>
                                    <TouchableWithoutFeedback onPress={() => router.navigate('/goals')}>
                                        <Image source={icons.backicon} className='w-[2.875rem] h-[2.875rem] m-8 mr-auto' />
                                    </TouchableWithoutFeedback>
                
                                    <Text className='color-dark-heading text-3xl font-bold ml-auto mr-auto -translate-x-1/4'>Update Goal</Text>
                
                                    <View className='flex flex-col w-[95vw] h-[80vh] rounded-lg items-center'>
                                        <View className='flex-row flex-wrap justify-around items-center w-full mt-2'>
                                            <View className='w-[60%]'>
                                                {errors.find(error => error === 'title') ? (
                                                    <Text className='color-errorDark'>Title cannot be empty</Text>
                                                ) : <Text></Text>}
                                                <FormInput
                                                    placeholder='Title'
                                                    value={goal.title}
                                                    onChangeText={(text: string) => setGoal(cGoal => ({
                                                        ...cGoal,
                                                        title: text
                                                    }))}
                                                    className={`w-full mt-2 ${errors.find(error => error === 'title') && (
                                                        'border-2 border-errorDark'
                                                    )}`}
                                                    placeholderTextColor='black'
                                                />
                                            </View>
                                            <DropDownPicker
                                                open={typeDropdown}
                                                value={typeValue}
                                                items={typeItems}
                                                setOpen={setTypeDropdown}
                                                setValue={setTypeValue}
                                                setItems={setTypeItems}
                                                placeholder='Type'
                                                containerStyle={{
                                                    width: '30%',
                                                    backgroundColor: 'transparent',
                                                    
                                                }}
                                                style={{
                                                    backgroundColor: 'transparent',
                                                    borderWidth: 2,
                                                    borderColor: errors.find(error => error === 'type') ? '#D74042' : '',
                                                    marginTop: 30
                                                }}
                                                listItemContainerStyle={{
                                                    backgroundColor: 'transparent',
                                                }}
                                                dropDownContainerStyle={{
                                                    marginTop: 30,
                                                }}
                                            />
                                        </View>
                                        
                                        <View className='w-full mt-4 flex flex-col items-center'>
                                            {errors.find(error => error === 'description') ? (
                                                <Text className='mr-auto ml-2 color-errorDark'>Description cannot be empty</Text>
                                            ) : <Text className='mr-auto ml-2'></Text>}
                                            <FormInput
                                                placeholder='Description'
                                                value={goal.description}
                                                onChangeText={(text) => setGoal(cGoal => ({
                                                    ...cGoal,
                                                    description: text
                                                }))}
                                                multiline={true}
                                                className={`mt-2 w-[95%] align-text-top ${errors.find(error => error === 'description') && (
                                                    'border-2 border-errorDark'
                                                )}`}
                                                placeholderTextColor='black'
                                            />
                                        </View>
                
                                        <View 
                                            className={`
                                            w-[98vw]  
                                            flex-row 
                                            p-4 
                                            mt-16 
                                            items-center
                                            ${errors.find(error => error === 'priority') && 'border-2 border-errorDark'}
                                        `}>
                                            <Text>Priority: </Text>
                                            <TouchableWithoutFeedback onPress={() => setGoal(cGoal => ({
                                                ...cGoal,
                                                priority: 'low'
                                            }))}>
                                                <View 
                                                    className={`
                                                        flex-row 
                                                        bg-button-good 
                                                        p-4 
                                                        w-24 
                                                        justify-around 
                                                        gap-1 
                                                        ml-2
                                                        ${goal.priority === 'low' && (
                                                            'border-2 border-primary'
                                                        )}
                                                    `}
                                                >
                                                    <Text>Low</Text>
                                                    <Image source={icons.lowpriority} />
                                                </View>
                                            </TouchableWithoutFeedback>
                                            <TouchableWithoutFeedback onPress={() => setGoal(cGoal => ({
                                                ...cGoal,
                                                priority: 'medium'
                                            }))}>
                                                <View 
                                                    className={`
                                                            flex-row 
                                                            bg-button-warning 
                                                            p-4 
                                                            w-30 
                                                            justify-around 
                                                            gap-1 
                                                            ml-4
                                                            ${goal.priority === 'medium' && (
                                                                'border-2 border-primary'
                                                            )}
                                                        `}
                                                    >
                                                    <Text>Medium</Text>
                                                    <Image source={icons.mediumpriority} />
                                                </View>
                                            </TouchableWithoutFeedback>
                                            <TouchableWithoutFeedback onPress={() => setGoal(cGoal => ({
                                                ...cGoal,
                                                priority: 'high'
                                            }))}>
                                                <View 
                                                    className={`
                                                        flex-row 
                                                        bg-button-error 
                                                        p-4 
                                                        w-24 
                                                        justify-around 
                                                        gap-1 
                                                        ml-4
                                                        ${goal.priority === 'high' && (
                                                            'border-2 border-primary'
                                                        )}
                                                    `}
                                                >
                                                    <Text>High</Text>
                                                    <Image source={icons.highpriority} />
                                                </View>
                                            </TouchableWithoutFeedback>
                                        </View>
                
                                        <View 
                                            className={`
                                            w-[98vw] 
                                            flex-row 
                                            p-4 
                                            items-center 
                                            mt-4
                                            ${errors.find(error => error === 'difficulty') && 'border-2 border-errorDark'}
                                        `}>
                                            <Text>Difficulty: </Text>
                                            <TouchableWithoutFeedback onPress={() => setGoal(cGoal => ({
                                                ...cGoal,
                                                difficulty: 'easy'
                                            }))}>
                                                <View 
                                                    className={`
                                                        flex-row 
                                                        bg-button-good 
                                                        p-2 
                                                        w-24 
                                                        justify-around 
                                                        items-center 
                                                        gap-1 
                                                        ml-2
                                                        ${goal.difficulty === 'easy' && (
                                                            'border-2 border-primary'
                                                        )}
                                                    `}
                                                >
                                                    <Text className=''>Easy</Text>
                                                    <Image source={icons.easydifficulty} className='translate-y-2' />
                                                </View>
                                            </TouchableWithoutFeedback>
                                            <TouchableWithoutFeedback onPress={() => setGoal(cGoal => ({
                                                ...cGoal,
                                                difficulty: 'medium'
                                            }))}>
                                                <View 
                                                    className={`
                                                        flex-row 
                                                        bg-button-warning 
                                                        p-2 
                                                        w-30 
                                                        justify-around 
                                                        items-center 
                                                        gap-1 
                                                        ml-4
                                                        ${goal.difficulty === 'medium' && (
                                                            'border-2 border-primary'
                                                        )}
                                                    `}
                                                >
                                                    <Text>Medium</Text>
                                                    <Image source={icons.mediumdifficulty} className='translate-y-2' />
                                                </View>
                                            </TouchableWithoutFeedback>
                                            <TouchableWithoutFeedback onPress={() => setGoal(cGoal => ({
                                                ...cGoal,
                                                difficulty: 'hard'
                                            }))}>
                                                <View 
                                                    className={`
                                                        flex-row 
                                                        bg-button-error 
                                                        p-2 
                                                        w-24 
                                                        justify-around 
                                                        items-center 
                                                        gap-1 
                                                        ml-4
                                                        ${goal.difficulty === 'hard' && (
                                                            'border-2 border-primary'
                                                        )}
                                                    `}
                                                >
                                                    <Text>Hard</Text>
                                                    <Image source={icons.harddifficulty} className='translate-y-2' />
                                                </View>
                                            </TouchableWithoutFeedback>
                                        </View>
                
                                        <TouchableHighlight 
                                            className='mt-16 w-10/12 bg-primary p-4 rounded-2xl'
                                            underlayColor={'#0014C7'}
                                            onPress={updateGoal}
                                        >
                                            <Text className='text-center text-xl color-white'>Set Goal</Text>
                                        </TouchableHighlight>
                                    </View>
                                </View>
                    </SafeAreaView>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </View>
    )
}

export default edit