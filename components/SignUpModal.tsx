import React, { useEffect, useState } from 'react'
import { 
    Keyboard,
    Text,
    TouchableWithoutFeedback, 
    TouchableHighlight,
    View, 
} from 'react-native'
import Modal from 'react-native-modal'
import { AdvancedCheckbox } from 'react-native-advanced-checkbox'

import FormInput from './FormInput'
import TermsAndConditions from './TermsAndConditions'
import PrivacyPolicy from './PrivacyPolicy'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'

const closeModal = (
    setSignupModal: (value: boolean) => void
) => {
    setSignupModal(false)
}
interface SignupModalProps {
    signupModal: boolean,
    setSignupModal: (value: boolean) => void
}


const SignupModal = ({ signupModal, setSignupModal }: SignupModalProps) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [checkbox, setCheckbox] = useState<string | boolean>(false)
    const [tacModal, setTacModal] = useState(false)
    const [privPolModal, setPrivPolModal] = useState(false)
    const [emptyEmail, setEmptyEmail] = useState(false)
    const [invalidEmail, setInvalidEmail] = useState(false)
    const [emailExists, setEmailExists] = useState(false)
    const [emptyPassword, setEmptyPassword] = useState(false)
    const [passwordNotMatch, setPasswordNotMatch] = useState(false)

    useEffect(() => {
        if (!email) setEmptyEmail(true)
        else {
            setEmptyEmail(false)
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(email)) setInvalidEmail(true)
                else setInvalidEmail(false)
        }
    }, [email])

    useEffect(() => {
        if (!password) setEmptyPassword(true)
            else setEmptyPassword(false)
    }, [password])

    useEffect(() => {
        if (confirmPassword) {
            if (confirmPassword !== password) setPasswordNotMatch(true)
                else setPasswordNotMatch(false)
        } else setPasswordNotMatch(false)
    }, [password, confirmPassword])

    useEffect(() => {
        setEmptyEmail(false)
        setInvalidEmail(false)
        setEmptyPassword(false)
        setPasswordNotMatch(false)
    }, [])

    const signInUser = async () => {
        let errors = false;

        if (!email) {
            setEmptyEmail(true)
            errors = true
        }

        if (!password) {
            setEmptyPassword(true)
            errors = true
        }

        if (confirmPassword && confirmPassword !== password) {
            setPasswordNotMatch(true)
            errors = true
        }

        if (!errors) {
            const signupPayload = {
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

            const res = await fetch(`http://192.168.1.204:3000/api/users/register`, signupPayload)
            const data = await res.json()

            if (data.emailError) {
                setEmailExists(true)
            } else {
                const accessToken = data.accessToken
                AsyncStorage.setItem('accessToken', accessToken)
                router.navigate('/')
            }
        }
    }

    return (
        <Modal
            isVisible={signupModal}
            swipeDirection={tacModal ? undefined : 'down'}
            onSwipeComplete={() => closeModal(setSignupModal)}
            onBackdropPress={() => closeModal(setSignupModal)}
            backdropOpacity={0}
            useNativeDriver
            hideModalContentWhileAnimating
            useNativeDriverForBackdrop
            style={{ margin: 0 }}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View className='bg-white w-full mt-[15vh] rounded-3xl flex-1 items-center relative'>
                    <Text className='color-dark-heading text-5xl font-bold text-center absolute top-0 mt-16'>Sign Up</Text>
                    <View className='absolute top-0 mt-32 w-screen h-screen items-center'>
                            {emptyEmail ? (
                                <Text className='absolute top-[1.8rem] left-[2.75rem] color-error'>Email cannot be empty</Text>
                            ) : invalidEmail ? (
                                <Text className='absolute top-[1.8rem] left-[2.75rem] color-error'>Invalid email</Text>
                            ) : emailExists && (
                                <Text className='absolute top-[1.8rem] left-[2.75rem] color-error'>That email already exists</Text>
                            )}
                            <FormInput 
                                placeholder='Email' 
                                value={email} 
                                onChangeText={(text) => setEmail(text)} 
                                className={`
                                    ${emptyEmail || invalidEmail || emailExists ? (
                                        'border-error'
                                    ) : 'border-primary'}
                                `}
                            />

                            {emptyPassword && (
                                <Text className='absolute top-[9.5rem] left-[2.75rem] color-error'>Password cannot be empty</Text>
                            )}
                            <FormInput
                                placeholder='Password'
                                value={password}
                                onChangeText={(text) => setPassword(text)}
                                secureTextEntry
                                className={`
                                    ${emptyPassword ? (
                                        'border-error'
                                    ) : 'border-primary'}
                                `}
                            />

                            {passwordNotMatch && (
                                <Text className='absolute top-[17.2rem] left-[2.75rem] color-error'>The passsords do not match</Text>
                            )}
                            <FormInput
                                placeholder='Confirm Password'
                                value={confirmPassword}
                                onChangeText={(text) => setConfirmPassword(text)}
                                secureTextEntry
                                className={`
                                    ${passwordNotMatch ? (
                                        'border-error'
                                    ) : 'border-primary'}
                                `}
                            />

                            <View className="w-[85vw] mt-12 flex-row items-center px-2">
                                <AdvancedCheckbox
                                    value={checkbox}
                                    onValueChange={setCheckbox}
                                />
                                <Text className="ml-3">
                                    I agree with the{' '}
                                    <Text
                                    style={{ color: '#6A4DFF' }}
                                    onPress={() => setTacModal(true)}
                                    >
                                    Terms of Service
                                    </Text>{' '}
                                    and{' '}
                                    <Text
                                    style={{ color: '#6A4DFF' }}
                                    onPress={() => setPrivPolModal(true)}
                                    >
                                    Privacy Policy
                                    </Text>
                                </Text>
                                </View>

                            <TouchableHighlight
                                className='mt-12 bg-primary w-1/2 py-4 rounded-xl items-center'
                                underlayColor='#0014C7'
                                onPress={signInUser}
                            >
                                <Text className='color-white text-center text-xl'>Sign Up</Text>
                            </TouchableHighlight>
                    </View>
                </View>
            </TouchableWithoutFeedback>
            <TermsAndConditions termsAndConditions={tacModal} setTermsAndConditions={setTacModal} />
            <PrivacyPolicy privacyPolicy={privPolModal} setPrivacyPolicy={setPrivPolModal} />
        </Modal>
    )
}

export default SignupModal