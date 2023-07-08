import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Button, Alert, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getFirestore, collection, onSnapshot, query, orderBy, doc, getDoc, updateDoc, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { FIREBASE_DB, FIREBASE_STORAGE } from '../../FirebaseConfig';
import * as DocumentPicker from 'expo-document-picker';
import { useNavigation } from '@react-navigation/native';
import { v4 as uuidv4 } from 'uuid';
import { Ionicons } from '@expo/vector-icons';
import ArtistMedia from './ArtistMedia';


export default function Profile({ route }) {

  const navigation = useNavigation();

  const { personId } = route.params;
  const [personName, setPersonName] = useState('');
  const [personSurname, setPersonSurname] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showMidia, setShowMidia] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedThumbnail, setSelectedThumbnail] = useState(null);
  const [thumbnailUri, setThumbnailUri] = useState(null);
  const [itemUri, setItemUri] = useState('');
  const [itemType, setItemType] = useState('');
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [activeButton, setActiveButton] = useState(''); // Initialize with the active button's key



  const pickAudio = async () => {
    try {
      const { uri, name } = await DocumentPicker.getDocumentAsync({ type: 'audio/*' });
      setItemType('audio');
      setItemUri({ uri });
      setSelectedAudio({ uri, name });

    } catch (error) {
      console.error('Erro ao escolher o áudio:', error);
    }
  };

  const pickVideo = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 1,
      });

      if (!result.canceled) {
        setItemType('video');
        setItemUri(result.uri);
      }
    } catch (error) {
      console.log('Error picking video:', error);
    }
  };

  const pickImage = async () => {

    try {
      const { uri, name } = await DocumentPicker.getDocumentAsync({ type: 'image/*' });
      setThumbnailUri({ uri });
      setSelectedThumbnail({ uri, name });
    } catch (error) {
      console.error('Erro ao escolher a thumbnail:', error);
    }
  }

  useEffect(() => {
    const fetchPersonData = async () => {
      try {
        const docRef = doc(FIREBASE_DB, 'pessoa', personId);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setPersonName(data.name);
          setPersonSurname(data.surname);
          setProfileImageUrl(data.imageUrl || null);
        }
      } catch (error) {
        console.log('Error fetching person data:', error);
      }
    };

    fetchPersonData();
  }, [personId]);

  const handleChangeProfilePicture = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        const selectedAsset = result.assets[0];
        const response = await fetch(selectedAsset.uri);
        const blob = await response.blob();

        // Generate a unique filename using a timestamp
        const filename = `${Date.now()}.jpg`;

        const storageRef = ref(FIREBASE_STORAGE, `profilePictures/${filename}`);
        const uploadTask = uploadBytes(storageRef, blob);

        await uploadTask;

        // Get the download URL of the uploaded image
        const downloadURL = await getDownloadURL(storageRef);

        // Delete the previous profile picture from the storage
        if (profileImageUrl) {
          const previousImageRef = ref(FIREBASE_STORAGE, getFilenameFromURL(profileImageUrl));
          try {
            await deleteObject(previousImageRef);
          } catch (error) {
            console.log('Error deleting previous profile picture:', error);
          }
        }

        // Update the profileImageUrl state with the new image URL
        setProfileImageUrl(downloadURL);

        // Update the profile image URL in the database
        const docRef = doc(FIREBASE_DB, 'pessoa', personId);
        await updateDoc(docRef, {
          imageUrl: downloadURL,
        });

        Alert.alert('Success', 'Foto de perfil actualizada!');
      }
    } catch (error) {
      console.log('Error changing profile picture:', error);
      Alert.alert('Error', 'Failed to change profile picture');
    }
  };

  const getFilenameFromURL = (url) => {
    const startIndex = url.lastIndexOf('/') + 1;
    return url.substring(startIndex);
  };

  const handleAudioSelection = async () => {
    try {
      await pickAudio();

    } catch (error) {
      console.error('Error selecting audio:', error);
    }
  };

  const handleVideoSelection = async () => {
    try {
      await pickVideo();

    } catch (error) {
      console.error('Error selecting video:', error);
    }
  };

  function handleItemSelection() {
    Alert.alert(
      'Escolha o tipo de mídia',
      'Escolha o tipo de mídia que quer postar:',
      [
        {
          text: 'Áudio',
          onPress: handleAudioSelection,
        },
        {
          text: 'Vídeo',
          onPress: handleVideoSelection,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  }



  const handleUploadNewItem = async () => {

    if (title && description && itemUri) {

      if (itemType === 'audio') {
        try {
          const audioStorageRef = ref(FIREBASE_STORAGE, `audios/${selectedAudio.name}`);
          const audioResponse = await fetch(selectedAudio.uri);
          const audioBlob = await audioResponse.blob();
          await uploadBytes(audioStorageRef, audioBlob);
          const url = await getDownloadURL(audioStorageRef);

          const thumbnailStorageRef = ref(FIREBASE_STORAGE, `thumbnails/${selectedThumbnail.name}`);
          const thumbnailResponse = await fetch(selectedThumbnail.uri);
          const thumbnailBlob = await thumbnailResponse.blob();
          await uploadBytes(thumbnailStorageRef, thumbnailBlob);
          const thumbnailURL = await getDownloadURL(thumbnailStorageRef);

          const audioData = {
            title: title,
            description: description,
            timestamp: new Date().toISOString(),
            url,
            thumbnailURL,
            artist: personId,
            artistName: personName.concat(" ", personSurname),
            type: 'audio',
          };

          const docRef = doc(FIREBASE_DB, 'pessoa', personId);
          await updateDoc(docRef, {
            uploaded: 'yes',
          });

          const audiosCollection = collection(FIREBASE_DB, 'audios');
          await addDoc(audiosCollection, audioData);

          console.log('Áudio enviado com sucesso!');
          alert('Áudio enviado com sucesso!');

        } catch (error) {
          console.error('Erro ao enviar o áudio:', error);
        }
      } else if (itemType === 'video') {

        try {

          const videoUri = itemUri;

          const videoResponse = await fetch(videoUri);
          const videoBlob = await videoResponse.blob();


          const videoExtension = videoUri.split('.').pop();
          const videoFilename = `${uuidv4()}.${videoExtension}`;

          const videoStorageRef = ref(FIREBASE_STORAGE, `videos/${videoFilename}`);
          const videoSnapshot = await uploadBytes(videoStorageRef, videoBlob);

          const url = await getDownloadURL(videoSnapshot.ref);

          const videoData = {
            title: title,
            description: description,
            videoPath: videoStorageRef.fullPath,
            url,
            createdAt: new Date(),
            artist: personId,
            artistName: personName.concat(" ", personSurname),
            type: 'video',
          };

          const videosCollection = collection(FIREBASE_DB, 'videos');
          await addDoc(videosCollection, videoData);

          const docRef = doc(FIREBASE_DB, 'pessoa', personId);
          await updateDoc(docRef, {
            uploaded: 'yes',
          });

          console.log('Video successfully uploaded to the database!');
          alert('Vídeo enviado com sucesso!');


        } catch (error) {
          console.log('Error uploading video to the database:', error);
          alert('Erro ao fazer upload de vídeo.')

        }

      }

    } else {
      Alert.alert('Formulário incompleto', 'Por favor preencha todos os campos e selecione um ficheiro e uma thumbnail.');
    }
  };

  function logout() {
    navigation.navigate('Login');

  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons style={styles.iconBack} name="chevron-back-outline" size={30} color="black" />
        </TouchableOpacity>

        <View >
          <Ionicons onPress={logout} name="log-out-outline" size={30} color="red" />
        </View>

      </View>

      <View style={styles.fundo}>
        <View style={styles.borderImage}>
          <TouchableOpacity onPress={handleChangeProfilePicture}>
            <Image source={{ uri: profileImageUrl }} style={styles.profileImage} />
          </TouchableOpacity>
        </View>
        <Text style={styles.label}>{personName} {personSurname}</Text>


        <View style={styles.options}>
          <TouchableOpacity
            style={[styles.button, activeButton === 'ver-meus-videos' && styles.activeButton]} 
            onPress={() => {
              setActiveButton('ver-meus-videos');
              setShowForm(false);
              setShowMidia(true);
            }}
          >
            <Text style={styles.buttonText}>Meus mídias</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, activeButton === 'criar-album' && styles.activeButton]} 
            onPress={() => {
              setActiveButton('criar-album');
              setShowForm(false);
              setShowMidia(false);
            }}
          >
            <Text style={styles.buttonText}>Criar álbum</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setActiveButton('postar-novo-midia');
              setShowForm(true);
              setShowMidia(false);

            }}
            style={[styles.button, activeButton === 'postar-novo-midia' && styles.activeButton]}
          >
            <Text style={styles.buttonText}>Novo mídia</Text>
          </TouchableOpacity>
        </View>
      </View>

      {showMidia && (
        <View style={styles.formContainer}>

          <ArtistMedia artistId={personId} />

        </View>

      )}


      {showForm && (
        <View style={styles.formContainer}>

          <Text style={styles.info}>Forneça as informacões do mídia: </Text>

          <TextInput
            style={styles.input}
            placeholder="Título"
            value={title}
            placeholderTextColor={'white'}
            onChangeText={setTitle}
          />

          <TextInput
            style={styles.input}
            placeholder="Descrição"
            placeholderTextColor={'white'}
            value={description}
            onChangeText={setDescription}
          />

          <TouchableOpacity style={styles.thumbnailButton} onPress={pickImage}>
            {thumbnailUri ? (
              <Text style={{ color: 'green' }}>Thumbnail selecionada</Text>
            ) : (
              <Text style={styles.thumbnailButtonText}>Selecionar Thumbnail</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.itemButton} onPress={handleItemSelection}>
            {itemUri ? (
              <Text style={styles.itemButtonText}>{itemType === 'audio' ? <Text style={{ color: 'green' }}>Audio selecionado</Text> : <Text style={{ color: 'green' }}>Video selecionado</Text>}</Text>
            ) : (
              <Text style={styles.itemButtonText}>Selecionar Item</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.uploadButton} onPress={handleUploadNewItem}>
            <Text style={styles.uploadButtonText}>Upload</Text>
          </TouchableOpacity>

        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'white',
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: "10%",
  },
  options: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  info: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'grey',
  },
  button: {
    backgroundColor: 'pink',
    borderRadius: 25,
    padding: 10,
    margin: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  formContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  input: {
    width: 200,
    height: 35,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
    backgroundColor: 'pink',
    color: 'white',
    fontWeight: 'bold',

  },
  thumbnailButton: {
    backgroundColor: 'pink',
    width: 200,
    height: 35,
    borderRadius: 5,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 5,
  },
  thumbnailButtonText: {
    color: 'white',
  },
  itemButton: {
    backgroundColor: 'pink',
    width: 200,
    height: 35,
    borderRadius: 5,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
  },
  itemButtonText: {
    color: 'white',
  },
  uploadButton: {
    backgroundColor: 'pink',
    width: '80%',
    height: 40,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadButtonText: {
    color: 'white',
    fontWeight: 'bold',
    padding: 10,
  },
  activeButton: {
    backgroundColor: '#FE496C',
  },
  fundo: {
    justifyContent: "center",
    alignItems: "center",
    justifyContent: "center"
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  borderImage: {
    backgroundColor: "pink",
    width: 120,
    height: 120,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  }
});

