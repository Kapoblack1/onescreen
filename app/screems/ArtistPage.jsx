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


export default function ArtistPage({ route }) {

    const navigation = useNavigation();

    const { personId } = route.params;
    const [personName, setPersonName] = useState('');
    const [personSurname, setPersonSurname] = useState('');
    const [profileImageUrl, setProfileImageUrl] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [showMidia, setShowMidia] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [thumbnailUri, setThumbnailUri] = useState(null);
    const [itemUri, setItemUri] = useState('');
    const [itemType, setItemType] = useState('');
    const [activeButton, setActiveButton] = useState(''); // Initialize with the active button's key


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



    return (
        <View style={styles.container}>
            <View style={styles.header}>

                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons style={styles.iconBack} name="chevron-back-outline" size={30} color="black" />
                </TouchableOpacity>


            </View>

            <View style={styles.fundo}>
                <View style={styles.borderImage}>
                    <TouchableOpacity >
                        <Image source={{ uri: profileImageUrl }} style={styles.profileImage} />
                    </TouchableOpacity>
                </View>
                <Text style={styles.label}>{personName} {personSurname}</Text>

                <View style={styles.options}>
                    <TouchableOpacity
                        style={[styles.button, activeButton === 'ver-meus-videos' && styles.activeButton]} // Apply activeButton style if activeButton is 'ver-meus-videos'
                        onPress={() => {
                            setActiveButton('ver-meus-videos');
                            setShowForm(false);
                            setShowMidia(true);
                        }}
                    >
                        <Text style={styles.buttonText}>Ver meus mídias</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            setActiveButton('postar-novo-midia');
                            setShowForm(true);
                            setShowMidia(false);

                        }}
                        style={[styles.button, activeButton === 'postar-novo-midia' && styles.activeButton]}
                    >
                        <Text style={styles.buttonText}>Postar novo mídia</Text>
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

