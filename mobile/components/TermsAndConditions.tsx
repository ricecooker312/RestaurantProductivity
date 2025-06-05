import React from "react";
import { ScrollView, Text } from "react-native";
import Modal from 'react-native-modal'

interface TermsAndConditionsProps {
    termsAndConditions: boolean,
    setTermsAndConditions: (value: boolean) => void
}

export default function TermsAndConditions ({ termsAndConditions, setTermsAndConditions }: TermsAndConditionsProps) {
    const removeTacModal = () => {
        setTermsAndConditions(false)
    }
    
    return (
        <Modal
            isVisible={termsAndConditions}
            onBackdropPress={removeTacModal}
        >
            <ScrollView 
                className="flex-1 bg-white mt-[15vh] mb-[15vh] rounded-3xl" 
                contentContainerClassName="items-center justify-center p-8"
            >
                <Text className="font-bold color-dark-heading my-4 text-3xl">Terms and Conditions</Text>
                <Text>Effective Date: 5/10/2025</Text>

                <Text className="font-bold color-dark-heading my-4 text-2xl">1. Eligibility</Text>
                <Text>
                    You must be at least 13 years old to use this App. If you are under 18, you must have permission from a parent 
                    or legal guardian.
                </Text>

                <Text className="font-bold color-dark-heading my-4 text-2xl">2. Use of the App</Text>
                <Text>
                    You may use the App to set screen time goals, limit app usage, play minigames, track streaks, earn XP, and 
                    interact with friends through features like restaurant sharing and deep breathing sessions. You agree to use 
                    the App lawfully and respectfully.
                </Text>

                <Text className="font-bold color-dark-heading my-4 text-2xl">3. User Accounts</Text>
                <Text>
                    Some features require an account. You are responsible for your login information and any activity under 
                    your account.
                </Text>

                <Text className="font-bold color-dark-heading my-4 text-2xl">4. User Content</Text>
                <Text>
                    You retain ownership of content you post but grant us permission to use it within the App to improve user 
                    experience.
                </Text>

                <Text className="font-bold color-dark-heading my-4 text-2xl">5. Privacy</Text>
                <Text>
                    We respect your privacy. Please see our Privacy Policy for more information about data collection and use.
                </Text>

                <Text className="font-bold color-dark-heading my-4 text-2xl">6. Intellectual Property</Text>
                <Text>
                    All app content is owned by us or our licensors. You may not copy or distribute it without permission.
                </Text>

                <Text className="font-bold color-dark-heading my-4 text-2xl">7. Prohibited Conduct</Text>
                <Text>
                    You agree not to use the app illegally, upload offensive content, or manipulate the app through 
                    unauthorized means.
                </Text>

                <Text className="font-bold color-dark-heading my-4 text-2xl">8. Third-Party Services</Text>
                <Text>
                    Some features may use third-party tools. We are not responsible for their actions or content.
                </Text>

                <Text className="font-bold color-dark-heading my-4 text-2xl">9. Termination</Text>
                <Text>
                    We may terminate or suspend access if you violate these terms. You can delete your account at any time.
                </Text>

                <Text className="font-bold color-dark-heading my-4 text-2xl">10. Limitation of Liability</Text>
                <Text>
                    The app is provided “as is.” We are not liable for damages resulting from your use of the app.
                </Text>

                <Text className="font-bold color-dark-heading my-4 text-2xl">11. Changes to These Terms</Text>
                <Text>
                    We may update these Terms. We will notify you of significant changes. Continued use means you accept 
                    the new terms.
                </Text>

                <Text className="font-bold color-dark-heading my-4 text-2xl">12. Contact Us</Text>
                <Text>
                    If you have questions, contact us at: saihanr161@gmail.com
                </Text>
            </ScrollView>
        </Modal>
    )
}