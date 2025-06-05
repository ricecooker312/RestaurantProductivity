import {
    Text,
    View,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard
} from "react-native"
import React, { useEffect, useState } from "react"

import AsyncStorage from "@react-native-async-storage/async-storage"
import { router } from "expo-router"

export default function OnBoarding() {
    const [signUpModal, setSignUpModal] = useState(false)
    const [logInModal, setLogInModal] = useState(false)
    const [signedIn, setSignedIn] = useState(false)
    const [signupModal, setSignupModal] = useState(false)

    useEffect(() => {
        const isAuthenticated = async () => {
            if (await AsyncStorage.getItem('accessToken')) {
                router.navigate('/')
            }
        }

        isAuthenticated()
    }, [])

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="bg-dfbg flex-1 justify-start items-center gap-1">
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
                    onPress={() => setLogInModal(true)}
                >
                    <Text className="text-xl">Login</Text>
                </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>
    )
}