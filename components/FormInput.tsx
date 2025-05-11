import React from "react";
import { TextInput } from "react-native";

interface FormInputProps {
    placeholder: string,
    value: string,
    onChangeText: (text: string) => void,
    className?: string
    secureTextEntry?: boolean
}

export default function FormInput({ placeholder, value, onChangeText, className, secureTextEntry = false }: FormInputProps) {
    return (
        <TextInput
            placeholder={placeholder}
            placeholderTextColor='#4A4A4A'
            value={value}
            secureTextEntry={secureTextEntry}
            onChangeText={onChangeText}
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