import React, { useEffect, useState } from 'react'
import { 
    Keyboard,
    Text,
    TouchableWithoutFeedback, 
    TouchableHighlight,
    View,
    KeyboardAvoidingView,
    Platform,
    ScrollView, 
    Image
} from 'react-native'
import { AdvancedCheckbox } from 'react-native-advanced-checkbox'

import FormInput from '@/components/FormInput'
import TermsAndConditions from '@/components/TermsAndConditions'
import PrivacyPolicy from '@/components/PrivacyPolicy'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Link, router } from 'expo-router'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

import { icons } from '@/constants/icons'

const SignupModal = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [checkbox, setCheckbox] = useState<string | boolean>(false)
    const [noCheckBox, setNoCheckBox] = useState(false)
    const [tacModal, setTacModal] = useState(false)
    const [privPolModal, setPrivPolModal] = useState(false)
    const [emptyEmail, setEmptyEmail] = useState(false)
    const [invalidEmail, setInvalidEmail] = useState(false)
    const [emailExists, setEmailExists] = useState(false)
    const [emptyPassword, setEmptyPassword] = useState(false)
    const [passwordNotMatch, setPasswordNotMatch] = useState(false)

    const insets = useSafeAreaInsets()

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
        if (!checkbox) setNoCheckBox(true)
            else setNoCheckBox(false)
    }, [checkbox])

    useEffect(() => {
        setEmptyEmail(false)
        setInvalidEmail(false)
        setEmptyPassword(false)
        setPasswordNotMatch(false)
        setNoCheckBox(false)
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

        if (!checkbox) {
            setNoCheckBox(true)
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

            const res = await fetch(`https://restaurantproductivity.onrender.com/api/users/register`, signupPayload)
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
                            <View className='flex-1 items-center justify-center w-full'>
                                <Image source={icons.logo} className='w-16 h-16' />

                                <Text className='font-bold color-dark-heading text-5xl mt-6'>Sign Up</Text>
                
                                <View className='w-full mt-12 flex items-center'>
                                    {emptyEmail ? (
                                        <Text className='w-10/12 color-errorDark'>Email cannot be empty</Text>
                                    ) : emailExists ? (
                                        <Text className='w-10/12 color-errorDark'>Email already exists</Text>
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
                                            ${emptyEmail || invalidEmail || emailExists ? (
                                                'border-errorDark'
                                            ) : 'border-primary'}
                                        `}
                                    />
                                </View>
                
                                <View className='flex w-full items-center mt-6'>
                                    {emptyPassword ? (
                                        <Text className='w-10/12 color-errorDark'>Password cannot be empty</Text>
                                    ) : <Text></Text>}
                                    <FormInput
                                        placeholder='Password'
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry
                                        placeholderTextColor='black'
                                        className={`
                                            mt-2
                                            ${emptyPassword ? (
                                                'border-errorDark'
                                            ) : 'border-primary'}    
                                        `}
                                    />
                                </View>

                                <View className='flex w-full items-center mt-6'>
                                    {passwordNotMatch ? (
                                        <Text className='w-10/12 color-errorDark'>Passwords do not match</Text>
                                    ) : <Text></Text>}
                                    <FormInput
                                        placeholder='Confirm Password'
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                        secureTextEntry
                                        placeholderTextColor='black'
                                        className={`
                                            mt-2
                                            ${passwordNotMatch ? (
                                                'border-errorDark'
                                            ) : 'border-primary'}    
                                        `}
                                    />
                                </View>

                                <View className="w-[85vw] mt-6 flex-row items-center px-2">
                                    {noCheckBox ? (
                                        <AdvancedCheckbox
                                            value={checkbox}
                                            onValueChange={setCheckbox}
                                            containerStyle={{ borderColor: 'red', borderWidth: 2, borderRadius: 5 }}
                                        />
                                    ) : (
                                        <AdvancedCheckbox
                                            value={checkbox}
                                            onValueChange={setCheckbox}
                                        />
                                    )}
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
                                    className='mt-12 bg-primary w-1/2 py-4 rounded-xl'
                                    underlayColor='#0014C7'
                                    onPress={signInUser}
                                >
                                    <Text className='text-center color-white text-xl'>Sign Up</Text>
                                </TouchableHighlight>

                                <Text className='mt-[10%]'>
                                    Already have an account? Log in{' '}
                                    <Link className='color-primary' href={'/login'}>here</Link>
                                </Text>
                            </View>
                        </ScrollView>
                    </SafeAreaView>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
            <TermsAndConditions termsAndConditions={tacModal} setTermsAndConditions={setTacModal} />
            <PrivacyPolicy privacyPolicy={privPolModal} setPrivacyPolicy={setPrivPolModal} />
        </View>
    )
}

export default SignupModal