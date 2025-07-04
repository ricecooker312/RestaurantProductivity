import {
    Text,
    View,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView
} from "react-native"
import React, { useEffect, useState } from "react"

import { icons } from "@/constants/icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { router } from "expo-router"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"

export default function onboarding() {
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

    const insets = useSafeAreaInsets()

    return (
        <View className="flex-1 bg-dfbg">
            <SafeAreaView style={{
                flex: 1,
                paddingTop: insets.top,
                paddingBottom: insets.bottom,
                paddingRight: insets.right,
                paddingLeft: insets.left
            }}>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                    keyboardShouldPersistTaps='handled'
                    showsVerticalScrollIndicator={false}
                >
                    <View className="flex items-center justify-center">
                        <Image source={icons.logo} className="size-32" />

                        <Text className="text-5xl font-bold color-dark-heading text-center p-4">Welcome to Mealstone!</Text>
                        <Text className="text-xl mx-4 text-center">Ready for a copmlete change in your productivity?</Text>

                        <TouchableOpacity
                            activeOpacity={0.38}
                            onPress={() => router.navigate('/signup')}
                            className="w-3/5 mt-16 p-5 bg-primary items-center rounded-xl"
                        >
                            <Text className="color-white text-xl">Get Started</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.38}
                            className="w-3/5 mt-4 p-5 bg-light-100 items-center rounded-xl"
                            onPress={() => router.navigate('/login')}
                        >
                            <Text className="text-xl">Login</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    )
}
