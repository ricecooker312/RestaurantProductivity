import { 
  Text, 
  View, 
  Image, 
  TouchableOpacity, 
  TextInput, 
  Keyboard,
  KeyboardTypeOptions, 
  InputModeOptions, 
  TouchableWithoutFeedback
} from 'react-native'
import React, { useState } from 'react'
import { router } from 'expo-router'
import { images } from '@/constants/images'
import SignUpModal from '@/components/SignUpModal';

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
