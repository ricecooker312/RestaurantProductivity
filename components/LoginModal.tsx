import { View, Text, TouchableWithoutFeedback, Keyboard } from 'react-native'
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
                <View className='bg-white flex-1 flex-col mt-[15vh] rounded-3xl items-center justify-start'>
                    <Text className='mt-[20%] font-bold color-dark-heading text-5xl'>Login</Text>

                    <View className='w-full content-between items-center border-2 flex gap-0 flex-col'>
                        <Text className='border-2'>Email cannot be empty</Text>
                        <FormInput
                            placeholder='Email'
                            value={email}
                            onChangeText={setEmail}
                            className=''
                        />
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}

export default LoginModal