import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { getFirestore, collection, onSnapshot, query, getDocs, orderBy, doc, getDoc, where } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

export default function ArtistListScreen() {

  const [artists, setArtists] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    try {
      const artistsCollection = collection(getFirestore(), 'pessoa');
      const querySnapshot = await getDocs(
        query(artistsCollection, where('uploaded', '==', 'yes'))
      );
      const artistsData = querySnapshot.docs.map((doc) => doc.data());
      setArtists(artistsData);
    } catch (error) {
      console.error('Erro ao buscar os artistas:', error);
    }
  };

  function goToArtistPage(item) {
    const registeredPersonId = personId;
    navigation.navigate('ArtistPage', { item });
  }



  return (
    <View style={{ flex: 1 }}>

      <FlatList
        data={artists}
        keyExtractor={(item) => item.email}
        renderItem={({ item }) => (

          <View style={styles.horizontalItem}>
            <TouchableOpacity onPress={() => goToArtistPage(item)}>
              <Image
                source={{ uri: item.imageUrl }}
                style={{ width: 100, height: 100, borderRadius: 50, margin: 10 }}
                resizeMode="cover"
                horizontal
                useNativeControls
              />
            </TouchableOpacity>
            <Text style={styles.horizontalTitle}>{item.name.concat(" ", item.surname)}</Text>
          </View>
        )
        }
        horizontal
        showsHorizontalScrollIndicator={true}
        indicatorStyle="pink"
      />
    </View >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    marginTop: 70,
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
    color: 'pink',

  },
  horizontalArtist: {
    fontSize: 14,
    color: 'pink',
  },
});

