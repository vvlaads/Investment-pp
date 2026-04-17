import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { darkTheme } from '../theme/darkTheme';
import { lightTheme } from '../theme/lightTheme';

const AppContext = createContext();

const STORAGE_KEY = 'app_settings';

export function AppProvider({ children }) {
    const [settings, setSettings] = useState({
        isDark: false,
        notifications: true,
    });

    const [isLoaded, setIsLoaded] = useState(false);

    // Загрузка настроек при старте
    useEffect(() => {
        const load = async () => {
            try {
                const saved = await AsyncStorage.getItem(STORAGE_KEY);
                if (saved) {
                    setSettings(JSON.parse(saved));
                }
            } catch (e) {
                console.log('Load error', e);
            } finally {
                setIsLoaded(true);
            }
        };

        load();
    }, []);

    // Сохранение при любом изменении
    useEffect(() => {
        if (!isLoaded) return;

        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    }, [settings, isLoaded]);

    const toggleTheme = () => {
        setSettings(prev => ({ ...prev, isDark: !prev.isDark }));
    };

    const setNotifications = (value) => {
        setSettings(prev => ({ ...prev, notifications: value }));
    };

    const theme = settings.isDark ? darkTheme : lightTheme;

    if (!isLoaded) return null;

    return (
        <AppContext.Provider value={{
            theme,
            isDark: settings.isDark,
            notifications: settings.notifications,
            toggleTheme,
            setNotifications,
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    return useContext(AppContext);
}