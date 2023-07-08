import React, { useState } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { FIREBASE_APP } from '../../FirebaseConfig';

const UploadScreen = () => {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      const source = { uri: result.assets[0].uri };
      console.log(source);
      setImage(source);
    }
  };

  const uploadImage = async () => {
    if (!image) {
      Alert.alert('Error', 'No image selected');
      return;
    }
    setUploading(true);
    const response = await fetch(image.uri);
    const blob = await response.blob();
    const filename = image.uri.substring(image.uri.lastIndexOf('/') + 1);
    var ref = FIREBASE_APP.storage().ref().child(filename);
    try {
      await ref.put(blob);
    } catch (e) {
      console.log(e);
    }
    setUploading(false);
    Alert.alert('Success', 'Photo uploaded!');
    setImage(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.selectButton} onPress={pickImage}>
        <Text style={styles.btnText}>Pick an Image</Text>
      </TouchableOpacity>
      <View style={styles.imageContainer}>
        {image && <Image source={{ uri: image.uri }} style={{ width: 300, height: 300 }} />}
        <TouchableOpacity style={styles.uploadButton} onPress={uploadImage}>
          <Text style={styles.btnText}>Upload Image</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  btnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
});

export default UploadScreen;
