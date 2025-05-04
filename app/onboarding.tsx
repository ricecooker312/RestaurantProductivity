import { 
  Text, 
  View, 
  Image, 
  TouchableOpacity, 
  TextInput, 
  Keyboard,
  KeyboardTypeOptions, 
  InputModeOptions, 
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native'
import BouncyCheckbox from "react-native-bouncy-checkbox";
import React, { Dispatch, SetStateAction, useState } from 'react'
import { router } from 'expo-router'
import { images } from '@/constants/images'
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context'
import Modal from 'react-native-modal'

interface SignupModalProps {
  signupModal: boolean,
  setSignupModal: (value: boolean) => void
}

interface FormInputProps {
  placeholder: string,
  keyboardType?: KeyboardTypeOptions | undefined,
  inputMode?: InputModeOptions | undefined,
  className?: string,
  secureTextEntry?: boolean
}

const FormInput = ({ placeholder, keyboardType, inputMode, className, secureTextEntry = false }: FormInputProps) => {
  return (
    <TextInput
      placeholder={placeholder}
      keyboardType={keyboardType ? keyboardType : 'default'}
      inputMode={inputMode ? inputMode : 'text'}
      className={className}
      placeholderTextColor='#4A4A4A'
      secureTextEntry={secureTextEntry}
    />
  )
}

const SignUpModal = ({ signupModal, setSignupModal }: SignupModalProps) => {
  const [selected, setSelected] = useState<boolean>(false)

  return (
    <SafeAreaProvider>
      <Modal
        isVisible={signupModal}
        onBackdropPress={() => setSignupModal(false)}
        swipeDirection="down"
        onSwipeComplete={() => setSignupModal(false)}
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
                <FormInput 
                  placeholder='Username' 
                  className='
                    bg-[#FFFFFF] 
                    py-4 
                    w-[85%] 
                    mt-12 
                    rounded-3xl 
                    pl-4 
                    text-xl 
                    border-[3px] 
                    border-solid
                    border-primary' 
                />
                <FormInput 
                  placeholder='Email' 
                  className='
                    bg-[#FFFFFF] 
                    py-4 
                    w-[85%] 
                    mt-12
                    rounded-3xl 
                    pl-4 
                    text-xl 
                    border-[3px] 
                    border-solid
                    border-primary' 
                />
                <FormInput 
                  placeholder='Password' 
                  className='
                    bg-[#FFFFFF] 
                    py-4
                    w-[85%] 
                    mt-12
                    rounded-3xl 
                    pl-4 
                    text-xl 
                    border-[3px] 
                    border-solid
                    border-primary' 
                  secureTextEntry
                />
                <FormInput 
                  placeholder='Confirm Password' 
                  className='
                    bg-[#FFFFFF] 
                    py-4 
                    w-[85%] 
                    mt-12
                    rounded-3xl 
                    pl-4 
                    text-xl 
                    border-[3px] 
                    border-solid
                    border-primary'
                  secureTextEntry
                />
                <TouchableOpacity 
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

const onboarding = () => {
  const [signupModal, setSignupModal] = useState<boolean>(false)

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className='flex-1 items-center justify-start bg-dfbg gap-1'>
        <Image source={images.logo} className='w-40 h-32 mt-48 p-4' />
        <Text className='font-bold text-5xl text-center p-4 color-dark-primary'>Welcome to Restaurant Productivity!</Text>
        <Text className='p-4 text-xl text-center'>Ready for a complete change in your productivity?</Text>
        <TouchableOpacity 
          activeOpacity={0.38} 
          className='w-3/5 h-42 mt-24 items-center justify-center' 
          onPress={() => setSignupModal(true)}
        >
          <Text className='color-white rounded-xl p-5 w-full text-center bg-primary text-xl'>Get Started</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          activeOpacity={0.38} 
          className='w-3/5 h-42 mt-4 items-center justify-center mb-24' 
        >
          <Text 
            className='color-black 
                      rounded-xl 
                      bg-light-100 
                      p-5 
                      w-full 
                      text-center 
                      corner-rounded 
                      text-xl'
            >Login</Text> 
        </TouchableOpacity>
        <SignUpModal signupModal={signupModal} setSignupModal={setSignupModal} />
      </View>
    </TouchableWithoutFeedback>
  )
}

export default onboarding
