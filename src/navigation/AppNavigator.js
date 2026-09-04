import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

import AppStack from './AppStack';
import AuthStack from './AuthStack';

export default function AppNavigator() {
    // El estado de sesión ahora vive en AuthContext, compartido por toda la app.
    const { user, checkingSession } = useAuth();

    // Mientras Firebase revisa la sesión mostramos una carga.
    if (checkingSession) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2563eb" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            {/* NavigationContainer mantiene el estado de las rutas y habilita navigation.navigate. */}
            {/* Un usuario autenticado puede entrar a AppStack. */}
            {user ? <AppStack /> : <AuthStack />}
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    loadingContainer: { alignItems: 'center', backgroundColor: '#f8fafc', flex: 1, justifyContent: 'center' },
});
