import { Link } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { useEffect } from "react";

export default function Index() {
  useEffect(() => {
    router.replace('/onboarding')
  }, [])

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Link href={'/onboarding'}>go to onboarding</Link>
    </View>
  );
}
