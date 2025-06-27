import { View, Image } from "react-native";
import React from "react";
import { icons } from "@/constants/icons";

const ReviewStars = ({ stars }: { stars: number }) => {
    return (
        <View className="flex flex-row items-center gap-3 m-6">
            {[...Array(stars)].map((_, i) => (
                <Image key={i} source={icons.filledstar} className="size-8" />
            ))}

            {stars < 5 && (
                [...Array(5 - stars)].map((_, i) => (
                    <Image key={i} source={icons.unfilledstar} className="size-8" />
                ))
            )}
        </View>
    )
}

export default ReviewStars