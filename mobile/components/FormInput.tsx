import React from "react";
import { TextInput } from "react-native";

interface FormInputProps {
    placeholder: string,
    value: string,
    onChangeText: (text: string) => void,
    placeholderTextColor?: string,
    className?: string
    secureTextEntry?: boolean,
    multiline?: boolean
}

export default function FormInput({ placeholder, value, onChangeText, className, placeholderTextColor, secureTextEntry = false, multiline = false }: FormInputProps) {
    return (
        <TextInput
            placeholder={placeholder}
            placeholderTextColor={placeholderTextColor ? placeholderTextColor : '#4A4A4A'}
            value={value}
            secureTextEntry={secureTextEntry}
            onChangeText={onChangeText}
            multiline={multiline}
            numberOfLines={6}
            className={`
                border-[3px]
                w-10/12
                py-4
                pl-4
                rounded-2xl
                text-xl
                mt-14
                ${className}
            `}
        />
    )
}