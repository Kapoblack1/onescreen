import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { getFirestore, collection, onSnapshot, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../FirebaseConfig';
import profileImage from '../assets/logo.jpg';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


export default function Home({ route }) {
    const { personId } = route.params;
    const [personName, setPersonName] = useState('');
    const [surname, setSurname] = useState('');
    const [profileImageUrl, setProfileImageUrl] = useState('');
    const [tvs, setTvs] = useState([]);
    const [title, setTitle] = useState('');
    const navigation = useNavigation();

    useEffect(() => {
        const fetchPersonName = async () => {
            try {
                const docRef = doc(FIREBASE_DB, 'pessoa', personId);
                const docSnapshot = await getDoc(docRef);

                if (docSnapshot.exists()) {
                    const data = docSnapshot.data();
                    setPersonName(data.name);
                    setSurname(data.surname);
                    setProfileImageUrl(data.imageUrl);
                }
            } catch (error) {
                console.log('Error fetching person name:', error);
            }
        };

        fetchPersonName();
    }, [personId]);

    useEffect(() => {
        const fetchTvs = async () => {
            try {
                const q = query(collection(FIREBASE_DB, 'tvs'), orderBy('title'));

                const unsubscribe = onSnapshot(q, (snapshot) => {
                    const tvsData = snapshot.docs.map((doc) => {
                        const data = doc.data();

                        return {
                            id: doc.id,
                            title: data.title,
                            image: { uri: data.image },
                            description: data.description,
                        };
                    });
                    setTvs(tvsData);
                });

                return () => unsubscribe();
            } catch (error) {
                console.log('Error fetching TVs:', error);
            }
        };

        fetchTvs();
    }, []);

    const handleItemPress = (itemTitle) => {
        const registeredPersonId = personId;
        navigation.navigate('Categoria', { title: itemTitle, personId: registeredPersonId });
    };

    function goToProfilePage() {
        const registeredPersonId = personId;
        navigation.navigate('ProfilePage', { personId: registeredPersonId });
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.label}>Olá, {personName}!</Text>
                <Ionicons style={styles.iconSearch} name="search" size={40} color="red" />
                <TouchableOpacity onPress={goToProfilePage}>
                    <Image
                        style={styles.profileImage}
                        source={profileImageUrl ? { uri: profileImageUrl } : require('../assets/loading.jpg')}
                    />
                </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>TVs</Text>

            <ScrollView style={styles.content}>
                <View style={styles.categoryContainer}>
                    <FlatList
                        data={tvs}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.categoryItem}
                                onPress={() => handleItemPress(item.title)}
                            >
                                <Image source={item.image} style={styles.categoryImage} />
                                <View style={styles.categoryContent}>
                                    <Text style={styles.categoryTitle}>{item.title}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                        numColumns={2}
                    />
                </View>
            </ScrollView>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    content: {
        marginBottom: '20%',
    },
    header: {
        flexDirection: 'row',
        marginTop: '15%',
        justifyContent: 'space-between',
    },
    iconSearch: {
        marginLeft: '20%',
        marginTop: 15,
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 40,
        marginRight: '3%',
        marginTop: '3%',
    },
    label: {
        fontWeight: 'bold',
        fontSize: 25,
        color: 'white',
        paddingTop: 15,
        paddingLeft: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        marginLeft: 10,
        marginBottom: 5,
        marginTop: 30,
    },
    categoryContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15,
    },
    categoryItem: {
        margin: 10,
    },
    categoryImage: {
        width: 180,
        height: 200,
        borderRadius: 10,
    },
    categoryContent: {
        marginTop: 5,
    },
    categoryTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    categoryDescription: {
        fontSize: 14,
        color: 'grey',
    },
});
