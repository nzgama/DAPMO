import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();

export default function AppStack() {
    return (
        // Estas rutas sólo se muestran mientras Firebase tiene un usuario autenticado.
        <Stack.Navigator>
            <Stack.Screen
                name="Home"
                component={HomeScreen}
            />
            <Stack.Screen
                name="Profile"
                component={ProfileScreen}
            />
        </Stack.Navigator>
    );
}
