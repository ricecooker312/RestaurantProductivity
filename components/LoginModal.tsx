import { View, Text, TouchableWithoutFeedback, Keyboard, TouchableHighlight } from 'react-native'
import Modal from 'react-native-modal'
import FormInput from './FormInput'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'

interface LoginModal {
    loginModal: boolean,
    setLoginModal: (value: boolean) => void
}

const LoginModal = ({ loginModal, setLoginModal }: LoginModal) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [emptyEmail, setEmptyEmail] = useState(false)
    const [invalidEmail, setInvalidEmail] = useState(false)
    const [emptyPassword, setEmptyPassword] = useState(false)
    const [invalidDetails, setInvalidDetails] = useState(false)

    useEffect(() => {
        const isAuthenticated = async () => {
            if (!await AsyncStorage.getItem('accessToken')) {
                router.navigate('/')
            }
        }

        // isAuthenticated()
    }, [])

    useEffect(() => {
        if (!email)
            setEmptyEmail(true)
        else {
            setEmptyEmail(false)

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(email))
                setInvalidEmail(true)
            else
                setInvalidEmail(false)
        }
    }, [email])

    useEffect(() => {
        if (!password)
            setEmptyPassword(true)
        else
            setEmptyPassword(false)
    }, [password])
    
    useEffect(() => {
        setEmptyEmail(false)
        setEmptyPassword(false)
        setInvalidEmail(false)
        setInvalidDetails(false)
    }, [])

    const loginUser = async () => {
        let errors = false

        if (!email) {
            errors = true
            setEmptyEmail(true)
        }

        if (!password) {
            errors = true
            setEmptyPassword(true)
        }

        if (!errors) {
            const loginPayload = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }

            const res = await fetch('http://192.168.1.204:3000/api/users/login', loginPayload)
            const data = await res.json()

            if (data.error) {
                setError(true)
                setErrorMessage(data.error)
            } else if (data.accessToken) {
                console.log(data.accessToken)
            }
        }
    }

    return (
        <Modal
            isVisible={loginModal}
            swipeDirection={'down'}
            onSwipeComplete={() => setLoginModal(false)}
            onBackdropPress={() => setLoginModal(false)}
            style={{ margin: 0 }}
            useNativeDriver
            useNativeDriverForBackdrop
            hideModalContentWhileAnimating
            backdropOpacity={0}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View className='bg-white flex flex-1 flex-col mt-[15vh] rounded-3xl items-center justify-start'>
                    <Text className='mt-[20%] font-bold color-dark-heading text-5xl'>Login</Text>

                    <View className='w-full mt-12 flex items-center'>
                        {emptyEmail ? (
                            <Text className='w-10/12 color-error'>Email cannot be empty</Text>
                        ) : error ? (
                            <Text className='w-10/12 color-error'>{errorMessage}</Text>
                        ) : invalidEmail && (
                            <Text className='w-10/12 color-error'>Invalid email</Text>
                        )}
                        <FormInput
                            placeholder='Email'
                            value={email}
                            onChangeText={setEmail}
                            className={`
                                mt-2 
                                bg-white
                                ${emptyEmail || invalidEmail || error ? (
                                    'border-error'
                                ) : 'border-primary'}
                            `}
                        />
                    </View>

                    <View className='flex w-full items-center mt-12'>
                        {emptyPassword ? (
                            <Text className='w-10/12 color-error'>Password cannot be empty</Text>
                        ) : error && (
                            <Text className='w-10/12 color-error'>{errorMessage}</Text>
                        )}
                        <FormInput
                            placeholder='Password'
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            className={`
                                mt-2
                                bg-white
                                ${emptyPassword || error ? (
                                    'border-error'
                                ) : 'border-primary'}    
                            `}
                        />
                    </View>

                    <TouchableHighlight
                        className='mt-12 bg-primary w-1/2 py-4 rounded-xl'
                        underlayColor='#0014C7'
                        onPress={loginUser}
                    >
                        <Text className='text-center color-white text-xl'>Login</Text>
                    </TouchableHighlight>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}

export default LoginModal