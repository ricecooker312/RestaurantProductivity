import React from "react";
import { ScrollView, Text } from "react-native";
import Modal from 'react-native-modal'

interface PrivacyPolicyProps {
    privacyPolicy: boolean,
    setPrivacyPolicy: (value: boolean) => void
}

export default function PrivacyPolicy ({ privacyPolicy, setPrivacyPolicy }: PrivacyPolicyProps) {
    const removeTacModal = () => {
        setPrivacyPolicy(false)
    }
    
    return (
        <Modal
            isVisible={privacyPolicy}
            onBackdropPress={removeTacModal}
        >
            <ScrollView 
                className="flex-1 bg-white mt-[15vh] mb-[15vh] rounded-3xl" 
                contentContainerClassName="items-center justify-center p-8"
            >
                <Text className="font-bold color-dark-heading my-4 text-3xl">Privacy Policy</Text>
                <Text>Effective Date: 5/10/2025</Text>

                <Text className="font-bold color-dark-heading my-4 text-2xl">1. Information We Collect</Text>

                <Text className="font-bold color-dark-heading mb-2 text-xl">a. Information You Provide Directly</Text>
                <Text>
                    - Account details (e.g. username, email address, password)
                    {"\n"}- Profile settings and preferences
                    {"\n"}- Feedback, messages, or other submissions you voluntarily make
                </Text>

                <Text className="font-bold color-dark-heading my-2 text-xl text-center">b. Automatically Collected Information</Text>
                <Text>
                    - Screen time usage data (if permissions are granted)
                    {"\n"}- App interaction data (e.g. completed goals, XP earned, game scores)
                    {"\n"}- Device and app version information
                    {"\n"}- IP address, device type, operating system
                </Text>

                <Text className="font-bold color-dark-heading my-2 text-xl">c. Optional Social Features</Text>
                <Text>
                    If you use social features, we may collect:
                    {"\n"}- Friend usernames or codes
                    {"\n"}- User-generated content (e.g. restaurant layout, public messages)
                </Text>

                <Text className="font-bold color-dark-heading my-4 text-2xl">2. How We Use Your Information</Text>
                <Text>
                    - Enable core app features
                    {"\n"}- Personalize your experience
                    {"\n"}- Provide rewards, feedback, and insights
                    {"\n"}- Facilitate social features
                    {"\n"}- Analyze and improve the app
                    {"\n"}- Communicate updates or changes
                </Text>

                <Text className="font-bold color-dark-heading my-4 text-2xl">3. How We Share Your Information</Text>
                <Text>
                    We do not sell your personal data. We may share it:
                    {"\n"}- With service providers (e.g. cloud services)
                    {"\n"}- If legally required
                    {"\n"}- With your explicit consent
                </Text>

                <Text className="font-bold color-dark-heading my-4 text-2xl">4. Data Retention</Text>
                <Text>
                    We retain your data only as long as needed to provide our services and meet legal obligations. You can request deletion anytime.
                </Text>

                <Text className="font-bold color-dark-heading my-4 text-2xl">5. Children’s Privacy</Text>
                <Text>
                    We do not knowingly collect data from children under 13 without parental consent. Contact us if you believe a child is using the app without permission.
                </Text>

                <Text className="font-bold color-dark-heading my-4 text-2xl">6. Your Rights and Choices</Text>
                <Text>
                    Depending on your region, you may:
                    {"\n"}- Access or correct your data
                    {"\n"}- Delete your account
                    {"\n"}- Opt-out of analytics
                    {"\n"}- Request a copy of your data
                </Text>

                <Text className="font-bold color-dark-heading my-4 text-2xl">7. Data Security</Text>
                <Text>
                    We use standard encryption and security practices. No system is 100% secure.
                </Text>

                <Text className="font-bold color-dark-heading my-4 text-2xl">8. Changes to This Policy</Text>
                <Text>
                    We may update this Privacy Policy. Continued use after updates means you accept the changes.
                </Text>

                <Text className="font-bold color-dark-heading my-4 text-2xl">9. Contact Us</Text>
                <Text>
                    If you have questions, contact us at: saihanr161@gmail.com
                </Text>
            </ScrollView>
        </Modal>
    )
}