import {
    Text,
    View,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard
} from "react-native"
import React, { useEffect, useState } from "react"

import SignupModal from "@/components/SignupModal"

import { images } from '@/constants/images'

export default function onboarding() {
    const [signUpModal, setSignUpModal] = useState(false)
    const [logInModal, setLogInModal] = useState(false)
    const [signedIn, setSignedIn] = useState(false)
    const [signupModal, setSignupModal] = useState(false)

    useEffect(() => {
        
    }, [])

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="bg-dfbg flex-1 justify-start items-center gap-1">
                <Image source={images.logo} className="w-40 h-32 mt-48 p-4" />
                <Text className="font-bold text-5xl text-center p-4 color-dark-heading">Welcome to Restaurant Productivity!</Text>
                <Text className="p-4 text-xl text-center">Ready for a complete change in your productivity?</Text>
                <TouchableOpacity
                    activeOpacity={0.38}
                    onPress={() => setSignUpModal(true)}
                    className="w-3/5 mt-24 p-5 bg-primary items-center rounded-xl"
                >
                    <Text className="color-white text-xl">Get Started</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.38}
                    className="w-3/5 mt-4 p-5 bg-light-100 items-center rounded-xl"
                >
                    <Text className="text-xl">Login</Text>
                </TouchableOpacity>
                <SignupModal signupModal={signUpModal} setSignupModal={setSignUpModal} />
            </View>
        </TouchableWithoutFeedback>
    )
}