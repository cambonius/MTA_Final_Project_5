import React, { useState, useEffect, useRef } from 'react';
import { View, Alert, Image, Text, StyleSheet } from 'react-native'; // Added Text and StyleSheet
import { Camera } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from 'react-native-paper';

const GalleryPage = () => {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(status === 'granted');
    })();
  }, []);

  const handleTakePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      savePhoto(photo.uri);
    }
  };

  const handleCameraToggle = () => {
    setCameraType(
      cameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  const savePhoto = async (photoUri) => {
    try {
      const key = `photo_${Date.now()}`;
      await AsyncStorage.setItem(key, photoUri);
      Alert.alert('Success', 'Photo saved!');
      loadPhotos();
    } catch (error) {
      Alert.alert('Error', 'Failed to save photo: ' + error);
    }
  };

  const deletePhoto = async (key) => {
    try {
      await AsyncStorage.removeItem(key);
      Alert.alert('Success', 'Photo deleted!');
      loadPhotos();
    } catch (error) {
      Alert.alert('Error', 'Failed to delete photo: ' + error);
    }
  };

  const loadPhotos = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const photoKeys = keys.filter((key) => key.startsWith('photo_'));
      const photoURIs = await AsyncStorage.multiGet(photoKeys);
      const photos = photoURIs.map(([key, uri]) => ({ key, uri }));
      setPhotos(photos);
    } catch (error) {
      Alert.alert('Error', 'Failed to load photos: ' + error);
    }
  };

  useEffect(() => {
    loadPhotos();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.centeredTextContainer}>
        <Text style={styles.centeredText}>Capture Your Favorite MTA Moments!</Text>
      </View>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={styles.cameraContainer}>
            <Camera style={styles.camera} type={cameraType} ref={cameraRef} />
          </View>
        </View>
        <View style={styles.buttonsContainer}>
          <Button
            mode="contained"
            onPress={handleTakePhoto}
            style={styles.button}
          >
            Take Photo
          </Button>
          <Button
            mode="contained"
            onPress={handleCameraToggle}
            style={styles.button}
          >
            Switch Camera
          </Button>
        </View>
      </View>
      <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', padding: 10 }}>
        {photos.map((photo) => (
          <View key={photo.key}>
            <Image source={{ uri: photo.uri }} style={{ width: 100, height: 100, margin: 5 }} />
            <Button
              mode="contained"
              onPress={() => deletePhoto(photo.key)}
              style={{ margin: 5, backgroundColor: '#F44336' }}
            >
              Delete
            </Button>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cameraContainer: {
    width: '100%',
    height: '100%',
    aspectRatio: 1, // Set aspectRatio to 1 to maintain a square shape
  },
  camera: {
    flex: 1,
  },
  centeredTextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginBottom: 10, // Added marginBottom for spacing
  },
  centeredText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20, // Added marginBottom for spacing
  },
  button: {
    marginHorizontal: 10, // Adjust the horizontal margin as needed
    backgroundColor: '#2196F3',
  },
});

export default GalleryPage;
