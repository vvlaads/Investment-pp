import { Image, StyleSheet, TextInput, View } from "react-native";
import { useRef, useState } from "react";
import { useApp } from "../utils/AppProvider";
import searchIcon from '../assets/icons/gray/search.png';
import { fontSizes } from "../theme/typography";

export default function Search({ style, onSearch }) {
    const { theme } = useApp();
    const s = styles(theme);

    const [value, setValue] = useState('');

    const timeout = useRef(null);

    const handleChange = (text) => {
        setValue(text);

        if (timeout.current) {
            clearTimeout(timeout.current);
        }

        timeout.current = setTimeout(() => {
            onSearch?.(text);
        }, 300);
    };

    return (
        <View style={[s.container, style]}>
            <Image source={searchIcon} style={s.icon} />

            <TextInput
                style={s.input}
                placeholder="Поиск..."
                placeholderTextColor={theme.secondaryText}
                value={value}
                onChangeText={handleChange}
            />
        </View>
    );
}

const styles = (theme) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.hover,
        borderRadius: 20,
        paddingHorizontal: 12,
        height: 40,
    },

    icon: {
        width: 24,
        height: 24,
        marginRight: 8,
        tintColor: theme.secondaryText,
    },

    input: {
        flex: 1,
        fontSize: fontSizes.default,
        color: theme.primaryText,
        outlineStyle: 'none',
    },
});