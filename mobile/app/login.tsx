import { 
    View, 
    Text, 
    Image,
    TouchableWithoutFeedback, 
    Keyboard, 
    TouchableHighlight, 
    KeyboardAvoidingView, 
    Platform, 
    ScrollView, 
    TouchableOpacity
} from 'react-native'
import Modal from 'react-native-modal'
import FormInput from '@/components/FormInput'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router, Link } from 'expo-router'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { icons } from '@/constants/icons'

const LoginModal = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [emptyEmail, setEmptyEmail] = useState(false)
    const [invalidEmail, setInvalidEmail] = useState(false)
    const [emptyPassword, setEmptyPassword] = useState(false)
    const [invalidDetails, setInvalidDetails] = useState(false)

    const insets = useSafeAreaInsets()

    useEffect(() => {
        setError(false)
        setErrorMessage('')

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
        setError(false)
        setErrorMessage('')

        if (!password)
            setEmptyPassword(true)
        else
            setEmptyPassword(false)
    }, [password])
    
    useEffect(() => {
        setError(false)
        setErrorMessage('')
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

            const res = await fetch('https://restaurantproductivity.onrender.com/api/users/login', loginPayload)
            const data = await res.json()

            if (data.error) {
                setError(true)
                setErrorMessage(data.error)
            } else if (data.accessToken) {
                await AsyncStorage.setItem('accessToken', data.accessToken)
                await AsyncStorage.setItem('coins', data.coins)
                router.navigate('/')
            }
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
                            paddingLeft: insets.left,
                            paddingRight: insets.right
                        }}
                    >
                        <ScrollView
                            contentContainerStyle={{ flexGrow: 1 }}
                            keyboardShouldPersistTaps='handled'
                            showsVerticalScrollIndicator={false}
                        >
                            <View className='flex-1 flex-col items-center justify-center'>
                                <Image source={icons.logo} className='w-16 h-16' />

                                <Text className='font-bold color-dark-heading text-5xl mt-6'>Login</Text>

                                <View className='w-full mt-12 flex items-center'>
                                    {emptyEmail ? (
                                        <Text className='w-10/12 color-errorDark'>Email cannot be empty</Text>
                                    ) : error ? (
                                        <Text className='w-10/12 color-errorDark'>{errorMessage}</Text>
                                    ) : invalidEmail ? (
                                        <Text className='w-10/12 color-errorDark'>Invalid email</Text>
                                    ) : <Text></Text>}
                                    <FormInput
                                        placeholder='Email'
                                        value={email}
                                        onChangeText={setEmail}
                                        placeholderTextColor='black'
                                        className={`
                                            mt-2 
                                            ${emptyEmail || invalidEmail || error ? (
                                                'border-errorDark'
                                            ) : 'border-primary'}
                                        `}
                                    />
                                </View>

                                <View className='flex w-full items-center mt-6'>
                                    {emptyPassword ? (
                                        <Text className='w-10/12 color-errorDark'>Password cannot be empty</Text>
                                    ) : error ? (
                                        <Text className='w-10/12 color-errorDark'>{errorMessage}</Text>
                                    ): <Text></Text>}
                                    <FormInput
                                        placeholder='Password'
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry
                                        placeholderTextColor='black'
                                        className={`
                                            mt-2
                                            ${emptyPassword || error ? (
                                                'border-errorDark'
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

                                <View className='mt-[10%] p-4 flex flex-row items-center'>
                                    <Text>Don't have an account? Sign up{' '}</Text>
                                    <TouchableOpacity className='py-4' onPress={() => router.navigate('/signup')}>
                                        <Text className='color-primary'>here</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ScrollView>
                    </SafeAreaView>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </View>
    )
}

export default LoginModal