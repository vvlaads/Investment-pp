import { StyleSheet } from 'react-native';

export const createCommonStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
    },

    header: {
        backgroundColor: theme.primary,
        flex: 1,
        padding: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },

    body: {
        padding: 20,
        backgroundColor: theme.background,
        paddingBottom: 200,
    },

    block: {
        borderRadius: 15,
        backgroundColor: theme.surface,
        padding: 20,
        marginBottom: 20,
    },
});