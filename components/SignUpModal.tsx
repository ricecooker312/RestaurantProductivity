import AsyncStorage from "@react-native-async-storage/async-storage"
import { router } from "expo-router"
import React, { Dispatch, SetStateAction, useEffect, useState } from "react"
import {
    InputModeOptions,
    Keyboard,
    KeyboardAvoidingView,
    KeyboardTypeOptions,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native"
import Modal from 'react-native-modal'
import { SafeAreaProvider } from "react-native-safe-area-context"

import { app } from "@/firebase/firebaseApp"
import { auth } from "@/firebase/firebaseApp"
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { addDoc, collection, getFirestore } from "firebase/firestore"

const db = getFirestore(app)

interface SignupModalProps {
  signupModal: boolean,
  setSignupModal: (value: boolean) => void,
  signedIn: boolean,
  setSignedIn: Dispatch<SetStateAction<boolean>>
}

interface FormInputProps {
  placeholder: string,
  keyboardType?: KeyboardTypeOptions | undefined,
  inputMode?: InputModeOptions | undefined,
  className?: string,
  value?: string | null,
  onChangeText?: (text: string) => void,
  secureTextEntry?: boolean
}

export const FormInput = ({ placeholder, keyboardType, inputMode, className, value, onChangeText, secureTextEntry = false }: FormInputProps) => {
  return (
    <TextInput
      placeholder={placeholder}
      value={value ? value : ''}
      keyboardType={keyboardType ? keyboardType : 'default'}
      inputMode={inputMode ? inputMode : 'text'}
      className={className}
      placeholderTextColor='#4A4A4A'
      secureTextEntry={secureTextEntry}
      onChangeText={onChangeText}
    />
  )
}

const closeModal = (
    setSignupModal: (value: boolean) => void,
    setPassword: Dispatch<SetStateAction<string>>, 
    setConfirmPassword: Dispatch<SetStateAction<string | null>>,
    setErrors: Dispatch<SetStateAction<string[]>>,
    setInvalidEmail: Dispatch<SetStateAction<boolean>>
) => {
    setSignupModal(false)
    setPassword("")
    setConfirmPassword("")
    setErrors([])
    setInvalidEmail(false)
}

const signInUser = async (
    username: string | null, 
    email: string, 
    password: string, 
    confirmPassword: string | null,
    setErrors: Dispatch<SetStateAction<string[]>>,
    setSignedIn: Dispatch<SetStateAction<boolean>>,
    setInvalidEmail: Dispatch<SetStateAction<boolean>>
) => {
    const errorArray: string[] = []

    if (!username) {
        errorArray?.includes('Username cannot be empty')
            ? errorArray
            : errorArray.push('Username cannot be empty')
    }
    if (!email) {
        errorArray?.includes('Email cannot be empty')
            ? errorArray
            : errorArray.push('Email cannot be empty')
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (email) {
        const isValidEmail = emailRegex.test(email)
        if (!isValidEmail) {
            setInvalidEmail(true)
        } else {
            setInvalidEmail(false)
        }
    }

    if (!password) {
        errorArray?.includes('Password cannot be empty')
            ? errorArray
            : errorArray.push('Password cannot be empty')
    }
    if (password !== confirmPassword) {
        errorArray?.includes('Password and confirm password do not match')
            ? errorArray
            : errorArray.push('Password and confirm password do not match')
    }

    setErrors(errorArray)

    if (errorArray?.length === 0) {
        setSignedIn(true)

        try {
            // const docRef = await addDoc(collection(db, "users"), {
            //     email: email,
            //     username: username
            // })

            // const newUser = await createUserWithEmailAndPassword(auth, email, password)
            // const user = newUser.user
        } catch (err) {
            console.log(`Firebase error: ${err}`)
        }
    }
}

const SignUpModal = ({ signupModal, setSignupModal, signedIn, setSignedIn }: SignupModalProps) => {
  const [username, setUsername] = useState<string | null>(null)
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [confirmPassword, setConfirmPassword] = useState<string | null>(null)
  const [errors, setErrors] = useState<string[]>([])
  const [usernameError, setUsernameError] = useState<boolean>(false)
  const [emailError, setEmailError] = useState<boolean>(false)
  const [invalidEmail, setInvalidEmail] = useState<boolean>(false)
  const [passwordError, setPasswordError] = useState<boolean>(false)
  const [confirmPasswordError, setConfirmPasswordError] = useState<boolean>(false)

  useEffect(() => {
    setUsernameError(errors.includes('Username cannot be empty'))
    setEmailError(errors.includes('Email cannot be empty'))
    setPasswordError(errors.includes('Password cannot be empty'))
    setConfirmPasswordError(errors.includes('Password and confirm password do not match'))

    const signInLocalStorage = async () => {
        const signIn = await AsyncStorage.setItem('loggedIn', 'true')
    }

    if (signedIn) {
        signInLocalStorage()
        router.replace('/')
    }
  }, [errors, email, signedIn])

  return (
    <SafeAreaProvider>
      <Modal
        isVisible={signupModal}
        swipeDirection="down"
        onSwipeComplete={() => closeModal(setSignupModal, setPassword, setConfirmPassword, setErrors, setInvalidEmail)}
        backdropOpacity={0.45}
        useNativeDriver
        style={{ margin: 0 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 justify-end">
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              className="bg-light-100 rounded-t-[2.78rem]"
            >
              <ScrollView
                contentContainerStyle={{ alignItems: 'center', paddingBottom: 40 }}
                keyboardShouldPersistTaps="handled"
              >
                <Text className='text-[2.5rem] font-bold mt-12 color-dark-heading'>Get Started</Text>
                <View className="w-[85%] relative mt-12">
                    {usernameError && (
                        <Text className="absolute top-0 border-black border-solid left-[12px] color-error">Username cannot be empty</Text>
                    )}
                    <FormInput 
                    placeholder='Username' 
                    value={username}
                    onChangeText={(text) => setUsername(text)}
                    className={`
                        bg-[#FFFFFF] 
                        py-4 
                        w-full 
                        rounded-3xl 
                        pl-4 
                        text-xl 
                        border-[3px] 
                        border-solid
                        ${usernameError ? (
                            'border-error'
                        ) : 'border-primary'}
                        mt-[1.8rem]`}
                    />
                </View>
                <View className="w-[85%] relative mt-6">
                    {emailError ? (
                        <Text className="absolute top-0 border-black border-solid left-[12px] color-error">Email cannot be empty</Text>
                    ) : (invalidEmail && (
                        <Text className="absolute top-0 border-black border-solid left-[12px] color-error">Invalid email</Text>
                    ))}
                    <FormInput 
                    placeholder='Email' 
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    className={`
                        bg-[#FFFFFF] 
                        py-4 
                        w-full 
                        rounded-3xl 
                        pl-4 
                        text-xl 
                        border-[3px] 
                        border-solid
                        ${emailError || invalidEmail ? (
                            'border-error'
                        ) : 'border-primary'}
                        mt-[1.8rem]`}
                    />
                </View>
                <View className="w-[85%] relative mt-6">
                    {passwordError && (
                        <Text className="absolute top-0 border-black border-solid left-[12px] color-error">Password cannot be empty</Text>
                    )}
                    <FormInput 
                    placeholder='Password' 
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    className={`
                        bg-[#FFFFFF] 
                        py-4 
                        w-full 
                        rounded-3xl 
                        pl-4 
                        text-xl 
                        border-[3px] 
                        border-solid
                        ${passwordError ? (
                            'border-error'
                        ) : 'border-primary'}
                        mt-[1.8rem]`} 
                    secureTextEntry
                    />
                </View>
                <View className="w-[85%] relative mt-6">
                    {confirmPasswordError && (
                        <Text className="absolute top-0 border-black border-solid left-[12px] color-error">Password and confirm do not match</Text>
                    )}
                    <FormInput 
                    placeholder='Confirm Password' 
                    value={confirmPassword}
                    onChangeText={(text) => setConfirmPassword(text)}
                    className={`
                        bg-[#FFFFFF] 
                        py-4 
                        w-full 
                        rounded-3xl 
                        pl-4 
                        text-xl 
                        border-[3px] 
                        border-solid
                        ${confirmPasswordError ? (
                            'border-error'
                        ) : 'border-primary'}
                        mt-[1.8rem]`}
                    secureTextEntry
                    />
                </View>
                <TouchableOpacity 
                  onPress={() => signInUser(username, email, password, confirmPassword, setErrors, setSignedIn, setInvalidEmail)}
                  className='
                  mt-12 
                  bg-primary 
                  py-4 
                  w-1/2 
                  flex-1 
                  justify-center 
                  items-center 
                  rounded-xl'
                  activeOpacity={0.45}
                >
                  <Text className='color-white text-xl'>Sign Up</Text>
                </TouchableOpacity>
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaProvider>
  )
}

export default SignUpModal