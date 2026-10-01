import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

const imageOptions = {
    mediaTypes: ['images'],
    allowsEditing: true,
    quality: 1
};

// Devuelve el primer archivo elegido; si se cancela o falla, devuelve null.
const getImage = async ({ requestPermission, openPicker, permissionMessage }) => {
    try {
        const permission = await requestPermission();

        if (!permission.granted) {
            Alert.alert('Permiso necesario', permissionMessage);
            return null;
        }

        const result = await openPicker(imageOptions);

        // En una cancelación, Expo no incluye assets; por eso comprobamos ambas cosas.
        return result.canceled ? null : result.assets?.[0] ?? null;
    } catch {
        Alert.alert('No se pudo obtener la imagen', 'Inténtalo de nuevo.');
        return null;
    }
};

// Abre la galería y solicita permiso de lectura de fotos si hace falta.
export const pickImage = () => getImage({
    requestPermission: ImagePicker.requestMediaLibraryPermissionsAsync,
    openPicker: ImagePicker.launchImageLibraryAsync,
    permissionMessage: 'Necesitamos acceso a tus imágenes.'
});

// Abre la cámara y solicita su permiso independiente del permiso de galería.
export const takeImage = () => getImage({
    requestPermission: ImagePicker.requestCameraPermissionsAsync,
    openPicker: ImagePicker.launchCameraAsync,
    permissionMessage: 'Necesitamos acceso a la cámara.'
});
