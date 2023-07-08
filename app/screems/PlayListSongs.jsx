import React, { useEffect, useState } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { collection, getDocs, query, getFirestore } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_STORAGE } from '../../FirebaseConfig';
import { useNavigation } from '@react-navigation/native';

export default function PlayListSongs() {
  const [audios, setAudios] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    fetchAudios();
  }, []);

  const fetchAudios = async () => {
    try {
      const audiosCollection = collection(getFirestore(), 'audios');
      const querySnapshot = await getDocs(audiosCollection);
      const audiosData = querySnapshot.docs.map((doc) => doc.data());
      setAudios(audiosData);
    } catch (error) {
      console.error('Erro ao buscar os áudios:', error);
    }
  };

  function goToPlaylistPage(item) {
    console.log(item.url);
    navigation.navigate('PlaylistPage', { item });
  }

  return (
    <View>
      <FlatList
        data={audios}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <View >
            <TouchableOpacity onPress={() => goToPlaylistPage(item)}>
              <Image source={{ uri: item.thumbnailURL }} style={styles.item} />
            </TouchableOpacity>
            <Text style={styles.horizontalTitle}>{item.title}</Text>
            <Text style={styles.horizontalArtist}>{item.artistName}</Text>
          </View>
        )}
        horizontal
        showsHorizontalScrollIndicator={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    width: 150,
    height: 150,
    padding: 10,
    margin: 10,
    borderRadius: 10,
  },
  horizontalTitle: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'pink',
    marginLeft: 10,
  },
  horizontalArtist: {
    fontSize: 14,
    color: 'pink',
    marginLeft: 10,
  },
});
