import { View, Text, Image, TouchableHighlight, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useState } from 'react'
import { icons } from '@/constants/icons'
import { router } from 'expo-router'
import FormInput from '@/components/FormInput'
import DropDownPicker from 'react-native-dropdown-picker'

const newGoal = () => {
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

    return (
        <View className='bg-dfbg w-screen h-screen'>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View className='flex flex-row flex-wrap mt-12 items-center justify-center relative'>
                    <TouchableWithoutFeedback onPress={() => router.navigate('/goals')}>
                        <Image source={icons.backicon} className='w-[2.875rem] h-[2.875rem] m-8 mr-auto' />
                    </TouchableWithoutFeedback>

                    <Text className='color-dark-heading text-3xl font-bold ml-auto mr-auto -translate-x-1/4'>Make a New Goal</Text>

                    <View className='bg-light-100 flex flex-col w-[95vw] h-[80vh] rounded-lg items-center'>
                        <View className='flex-row flex-wrap justify-around items-center w-full'>
                            <FormInput
                                placeholder='Title'
                                value={title}
                                onChangeText={setTitle}
                                className='w-[60%]'
                            />
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
                                    borderWidth: 2
                                }}
                                listItemContainerStyle={{
                                    backgroundColor: 'transparent'
                                }}
                            />
                        </View>
                        <FormInput
                            placeholder='Description'
                            value={description}
                            onChangeText={setDescription}
                            multiline={true}
                            className='mt-4 w-[95%] h-48'
                        />

                        <View className='w-full flex-row p-4 mt-12 items-center'>
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

                        <View className='w-full flex-row p-4 items-center'>
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
                            className='mt-12 w-10/12 bg-primary p-4 rounded-2xl'
                            underlayColor={'#0014C7'}
                            onPress={() => {}}
                        >
                            <Text className='text-center text-xl color-white'>Set Goal</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </View>
    )
}

export default newGoal