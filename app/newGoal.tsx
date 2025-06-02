import { View, Text, Image, TouchableHighlight, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { icons } from '@/constants/icons'
import { router } from 'expo-router'
import FormInput from '@/components/FormInput'
import DropDownPicker from 'react-native-dropdown-picker'
import AsyncStorage from '@react-native-async-storage/async-storage'

const newGoal = () => {
    const [accessToken, setAccessToken] = useState<string | null>(null)
    const [title, setTitle] = useState("")
    const [typeDropdown, setTypeDropdown] = useState(false)
    const [typeValue, setTypeValue] = useState(null)
    const [typeItems, setTypeItems] = useState([
        { label: 'Goal', value: 'goal' },
        { label: 'Habit', value: 'habit' }
    ])
    const [description, setDescription] = useState("")
    const [priority, setPriority] = useState('')
    const [difficulty, setDifficulty] = useState('')
    const [errors, setErrors] = useState<string[]>([])

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
        if (!title) {
            setErrors(prevErrors => [...prevErrors, 'title'])
        } else {
            setErrors(prevErrors => prevErrors.filter(err => err !== 'title'))
        }
    }, [title])

    useEffect(() => {
        if (!typeValue) {
            setErrors(prevErrors => [...prevErrors, 'type'])
        } else {
            setErrors(prevErrors => prevErrors.filter(err => err !== 'type'))
        }
    }, [typeValue])

    useEffect(() => {
        if (!description) {
            setErrors(prevErrors => [...prevErrors, 'description'])
        } else {
            setErrors(prevErrors => prevErrors.filter(err => err !== 'description'))
        }
    }, [description])

    useEffect(() => {
        if (!priority) {
            setErrors(prevErrors => [...prevErrors, 'priority'])
        } else {
            setErrors(prevErrors => prevErrors.filter(err => err != 'priority'))
        }
    }, [priority])

    useEffect(() => {
        if (!difficulty) {
            setErrors(prevErrors => [...prevErrors, 'difficulty'])
        } else {
            setErrors(prevErrors => prevErrors.filter(err => err !== 'difficulty'))
        }
    }, [difficulty])
    
    useEffect(() => {
        setErrors(prevErrors => prevErrors.filter(err => err !== 'title'))
        setErrors(prevErrors => prevErrors.filter(err => err !== 'type'))
        setErrors(prevErrors => prevErrors.filter(err => err !== 'description'))
        setErrors(prevErrors => prevErrors.filter(err => err !== 'priority'))
        setErrors(prevErrors => prevErrors.filter(err => err !== 'difficulty'))
    }, [])

    const setGoal = async () => {
        const newErrors: string[] = []

        if (!title) {
            newErrors.push('title')
        }

        if (!typeValue) {
            newErrors.push('type')
        }
        
        if (!description) {
            newErrors.push('description')
        }

        if (!priority) {
            newErrors.push('priority')
        }

        if (!difficulty) {
            newErrors.push('difficulty')
        }

        setErrors(newErrors)

        if (newErrors.length === 0) {
            const newGoalPayload = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    title: title,
                    description: description,
                    completed: false,
                    type: typeValue,
                    priority: priority,
                    difficulty: difficulty
                })
            }

            const res = await fetch('http://192.168.1.204:3000/api/goals/new', newGoalPayload)
            const data = await res.json()

            if (data.error) {
                console.log(data.error)
            } else {
                router.navigate('/goals')
            }
        }
    }

    return (
        <ScrollView className='bg-dfbg w-screen h-screen border-2'>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View className='flex flex-row flex-wrap mt-12 items-center justify-center relative'>
                    <TouchableWithoutFeedback onPress={() => router.navigate('/goals')}>
                        <Image source={icons.backicon} className='w-[2.875rem] h-[2.875rem] m-8 mr-auto' />
                    </TouchableWithoutFeedback>

                    <Text className='color-dark-heading text-3xl font-bold ml-auto mr-auto -translate-x-1/4'>Make a New Goal</Text>

                    <View className='flex flex-col w-[95vw] h-[80vh] rounded-lg items-center'>
                        <View className='flex-row flex-wrap justify-around items-center w-full mt-2'>
                            <View className='w-[60%]'>
                                {errors.find(error => error === 'title') ? (
                                    <Text className='color-errorDark'>Title cannot be empty</Text>
                                ) : <Text></Text>}
                                <FormInput
                                    placeholder='Title'
                                    value={title}
                                    onChangeText={setTitle}
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
                                value={description}
                                onChangeText={setDescription}
                                multiline={true}
                                className={`mt-2 w-[95%] h-48 align-text-top ${errors.find(error => error === 'description') && (
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
                            <TouchableWithoutFeedback onPress={() => setPriority('low')}>
                                <View 
                                    className={`
                                        flex-row 
                                        bg-button-good 
                                        p-4 
                                        w-24 
                                        justify-around 
                                        gap-1 
                                        ml-2
                                        ${priority === 'low' && (
                                            'border-2 border-primary'
                                        )}
                                    `}
                                >
                                    <Text>Low</Text>
                                    <Image source={icons.lowpriority} />
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={() => setPriority('medium')}>
                                <View 
                                    className={`
                                            flex-row 
                                            bg-button-warning 
                                            p-4 
                                            w-30 
                                            justify-around 
                                            gap-1 
                                            ml-4
                                            ${priority === 'medium' && (
                                                'border-2 border-primary'
                                            )}
                                        `}
                                    >
                                    <Text>Medium</Text>
                                    <Image source={icons.mediumpriority} />
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={() => setPriority('high')}>
                                <View 
                                    className={`
                                        flex-row 
                                        bg-button-error 
                                        p-4 
                                        w-24 
                                        justify-around 
                                        gap-1 
                                        ml-4
                                        ${priority === 'high' && (
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
                            <TouchableWithoutFeedback onPress={() => setDifficulty('easy')}>
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
                                        ${difficulty === 'easy' && (
                                            'border-2 border-primary'
                                        )}
                                    `}
                                >
                                    <Text className=''>Easy</Text>
                                    <Image source={icons.easydifficulty} className='translate-y-2' />
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={() => setDifficulty('medium')}>
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
                                        ${difficulty === 'medium' && (
                                            'border-2 border-primary'
                                        )}
                                    `}
                                >
                                    <Text>Medium</Text>
                                    <Image source={icons.mediumdifficulty} className='translate-y-2' />
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={() => setDifficulty('hard')}>
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
                                        ${difficulty === 'hard' && (
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
                            onPress={setGoal}
                        >
                            <Text className='text-center text-xl color-white'>Set Goal</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </ScrollView>
    )
}

export default newGoal