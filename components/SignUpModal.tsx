import React, { Dispatch, SetStateAction, useEffect, useState } from "react"
import { SafeAreaProvider } from "react-native-safe-area-context"
import Modal from 'react-native-modal'
import { 
    TouchableWithoutFeedback,
    View,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    ScrollView,
    Text,
    TouchableOpacity,
    TextInput,
    KeyboardTypeOptions,
    InputModeOptions
} from "react-native"

interface SignupModalProps {
  signupModal: boolean,
  setSignupModal: (value: boolean) => void
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
    setPassword: Dispatch<SetStateAction<string | null>>, 
    setConfirmPassword: Dispatch<SetStateAction<string | null>>,
    setErrors: Dispatch<SetStateAction<string[]>>
) => {
    setSignupModal(false)
    setPassword("")
    setConfirmPassword("")
    setErrors([])
}

const signInUser = (
    username: string | null, 
    email: string | null, 
    password: string | null, 
    confirmPassword: string | null, 
    errors: string[],
    setErrors: Dispatch<SetStateAction<string[]>>
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
}

const SignUpModal = ({ signupModal, setSignupModal }: SignupModalProps) => {
  const [username, setUsername] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [password, setPassword] = useState<string | null>(null)
  const [confirmPassword, setConfirmPassword] = useState<string | null>(null)
  const [errors, setErrors] = useState<string[]>([])
  const [usernameError, setUsernameError] = useState<boolean>(false)
  const [emailError, setEmailError] = useState<boolean>(false)
  const [passwordError, setPasswordError] = useState<boolean>(false)
  const [confirmPasswordError, setConfirmPasswordError] = useState<boolean>(false)

  useEffect(() => {
    setUsernameError(errors.includes('Username cannot be empty'))
    setEmailError(errors.includes('Email cannot be empty'))
    setPasswordError(errors.includes('Password cannot be empty'))
    setConfirmPasswordError(errors.includes('Password and confirm password do not match'))
  }, [errors])

  return (
    <SafeAreaProvider>
      <Modal
        isVisible={signupModal}
        onBackdropPress={() => closeModal(setSignupModal, setPassword, setConfirmPassword, setErrors)}
        swipeDirection="down"
        onSwipeComplete={() => closeModal(setSignupModal, setPassword, setConfirmPassword, setErrors)}
        backdropOpacity={0.45}
        hideModalContentWhileAnimating
        useNativeDriver
        useNativeDriverForBackdrop
        style={{ margin: 0 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 justify-end">
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{ borderTopLeftRadius: 30, borderTopRightRadius: 30, backgroundColor: '#f2f2f2' }}
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
                    {emailError && (
                        <Text className="absolute top-0 border-black border-solid left-[12px] color-error">Email cannot be empty</Text>
                    )}
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
                        ${emailError ? (
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
                  onPress={() => signInUser(username, email, password, confirmPassword, errors, setErrors)}
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