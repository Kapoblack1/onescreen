import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { getFirestore, collection, onSnapshot, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../FirebaseConfig';
import profileImage from '../assets/logo.jpg';
import AudioListScreen from './AudioListScreen.jsx';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import PlayListSongs from './PlayListSongs.jsx';


export default function Home({ route }) {

    const { personId } = route.params;
    const [personName, setPersonName] = useState('');
    const [profileImageUrl, setProfileImageUrl] = useState('');

    const navigation = useNavigation();

    useEffect(() => {
        const fetchPersonName = async () => {
            try {
                const docRef = doc(FIREBASE_DB, 'pessoa', personId);
                const docSnapshot = await getDoc(docRef);

                if (docSnapshot.exists()) {
                    const data = docSnapshot.data();
                    setPersonName(data.name);
                    setProfileImageUrl(data.imageUrl);
                }
            } catch (error) {
                console.log('Error fetching person name:', error);
            }
        };

        fetchPersonName();
    }, [personId]);

    function goHome() {
        const registeredPersonId = personId;
        navigation.navigate('Home', { personId: registeredPersonId });
    }

    function goToRadio() {
        const registeredPersonId = personId;
        navigation.navigate('Radio', { personId: registeredPersonId });
    }

    function goToVideos() {
        const registeredPersonId = personId;
        navigation.navigate('Videos', { personId: registeredPersonId });
    }

    function goToProfilePage() {
        const registeredPersonId = personId;
        navigation.navigate('ProfilePage', { personId: registeredPersonId });
    }


    return (

        <>
            <ScrollView style={styles.container}>

                <View style={styles.header}>
                    <Text style={styles.label}>Músicas</Text>
                    <TouchableOpacity onPress={goToProfilePage}>
                        <Image
                            style={styles.profileImage}
                            source={profileImageUrl ? { uri: profileImageUrl } : require('../assets/loading.jpg')}
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.content}>

                    <Text style={styles.sectionTitle}>Músicas Favoritas</Text>
                    <PlayListSongs />

                    <Text style={styles.sectionTitle}>Músicas</Text>
                    <PlayListSongs />

                </View>


            </ScrollView>


            <View style={styles.bottomNav}>
                <TouchableOpacity onPress={goHome}>
                    <Ionicons name="home-outline" size={30} color="pink" />
                </TouchableOpacity>

                <TouchableOpacity onPress={goToVideos}>
                    <Ionicons name="film-outline" size={30} color="pink" />
                </TouchableOpacity>

                <TouchableOpacity>
                    <View style={styles.circleContainer} >
                        <Image source={profileImage} style={styles.circleImage} />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity >
                    <Ionicons name="musical-notes-outline" size={30} color="purple" />
                </TouchableOpacity>

                <TouchableOpacity onPress={goToRadio}>
                    <Ionicons name="radio-outline" size={30} color="pink" />
                </TouchableOpacity>
            </View>


        </>

    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    content: {
        marginBottom: 70,
    },
    header: {
        flexDirection: 'row',
        marginTop: 45,
        justifyContent: 'space-between',
    },
    iconSearch: {
        marginRight: 5,
        marginTop: 15,
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 40,
        marginRight: 10,
    },
    label: {
        fontWeight: 'bold',
        fontSize: 25,
        color: 'grey',
        opacity: 0.5,
        paddingTop: 15,
        paddingLeft: 10,
    },
    scrollContainer: {
        marginTop: 5,
        marginBottom: 5,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 10,
        marginBottom: 5,
        marginTop: 30,
    },
    horizontalItem: {
        marginLeft: 10,
    },
    rectangularCover: {
        marginTop: 10,
        width: 150,
        height: 150,
        borderRadius: 0,
    },
    circularCover: {
        marginTop: 10,
        width: 100,
        height: 100,
        borderRadius: 75,
    },
    horizontalTitle: {
        marginTop: 5,
        fontSize: 16,
        fontWeight: 'bold',
    },
    horizontalArtist: {
        fontSize: 14,
        color: 'grey',
    },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 60,
        backgroundColor: 'white',
        borderTopWidth: 2,
        borderTopColor: 'pink',
        marginBottom: 0,
    },
    circleContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'pink',
        overflow: 'hidden',
    },
    circleImage: {
        width: '100%',
        height: '100%',
    },
});

