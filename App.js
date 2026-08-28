import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <>
      {/* Configura el color de los iconos de la barra de estado del dispositivo. */}
      <StatusBar style="dark" />
      {/* AppNavigator decide si se muestra la zona pública o privada de la app. */}
      <AppNavigator />
    </>
  );
}
