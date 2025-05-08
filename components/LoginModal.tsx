import { 
    View, 
    Text, 
    TouchableWithoutFeedback, 
    KeyboardAvoidingView, 
    Keyboard,
    ScrollView,
    Platform,
    TouchableOpacity
} from 'react-native'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Modal from 'react-native-modal'
import { FormInput } from './SignUpModal'

interface LoginModalProps {
    loginModal: boolean,
    setLoginModal: Dispatch<SetStateAction<boolean>>
}

const loginUser = async () => {

}

const LoginModal = ({ loginModal, setLoginModal }: LoginModalProps) => {
  const [username, setUsername] = useState<string | null>(null)
  const [password, setPassword] = useState<string | null>(null)
  const [usernameError, setUsernameError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)

  useEffect(() => {
    if (!username) {
        setUsernameError(true)
    } else if (username) {
        setUsernameError(false)
    }
  }, [username])

  useEffect(() => {
    if (!password) {
        setPasswordError(true)
    } else if (password) {
        setPasswordError(false)
    }
  }, [password])

  useEffect(() => {
    setUsernameError(false)
    setPasswordError(false)
  }, [])

  return (
    <SafeAreaProvider>
        <Modal
            isVisible={loginModal}
            swipeDirection={'down'}
            onSwipeComplete={() => setLoginModal(false)}
            backdropOpacity={0.45}
            useNativeDriver
            style={{ margin: 0 }}
        >
            <TouchableWithoutFeedback 
                onPress={Keyboard.dismiss}
                className=''
            >
                <View className='flex-1 items-center justify-center bg-light-100 mt-[25vh] rounded-t-[2.78rem]'>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        className='h-full w-[85%]'
                    >
                        <ScrollView 
                            keyboardShouldPersistTaps='handled'
                            contentContainerClassName='pb-[40px] flex-1 mt-12 items-center justify-start'
                        >
                            <Text className='text-[2.5rem] font-bold color-dark-heading'>Log In</Text>
                            <View className='relative pt-4 w-full mt-12'>
                                {usernameError && (
                                    <Text className='
                                        color-error
                                        absolute
                                        top-0
                                        left-[12px]
                                    '>Username cannot be empty</Text>
                                )}
                                <FormInput
                                    placeholder='Username'
                                    value={username}
                                    onChangeText={(text) => setUsername(text)}
                                    className={`
                                        py-4
                                        pl-4
                                        rounded-3xl
                                        border-[3px]
                                        text-xl
                                        mt-[0.8rem]
                                        bg-white
                                        ${usernameError 
                                            ? 'border-error'
                                            : 'border-primary'
                                        }
                                    `}
                                />
                            </View>
                            <View className='relative pt-4 w-full mt-6'>
                                {passwordError && (
                                    <Text className='
                                        color-error
                                        absolute
                                        top-0
                                        left-[12px]
                                    '>Password cannot be empty</Text>
                                )}
                                <FormInput
                                    placeholder='Password'
                                    value={password}
                                    onChangeText={(text) => setPassword(text)}
                                    secureTextEntry
                                    className={`
                                        py-4
                                        pl-4
                                        border-[3px]
                                        rounded-3xl 
                                        bg-white
                                        text-xl
                                        mt-[0.8rem]
                                        ${passwordError
                                            ? 'border-error'
                                            : 'border-primary'
                                        }   
                                    `}
                                />
                            </View>
                            <TouchableOpacity 
                                className='mt-12 bg-primary w-1/2 py-4 rounded-xl' 
                                activeOpacity={0.45}
                                onPress={loginUser}
                            >
                                <Text className='color-white text-center text-xl'>Log In</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    </SafeAreaProvider>
  )
}

export default LoginModal