import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { getFirestore, collection, onSnapshot, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../FirebaseConfig';
import { Video } from 'expo-av';

export default function VideoListScreen() {

  const [videos, setVideos] = useState([]);
  const [artist, setArtist] = useState({});



  useEffect(() => {
    subscribeToVideos();
  }, []);

  const subscribeToVideos = () => {
    const videosCollection = collection(FIREBASE_DB, 'videos');
    const artists = collection(FIREBASE_DB, 'pessoas');

    const videosQuery = query(videosCollection, orderBy('createdAt', 'desc'));

    onSnapshot(videosQuery, (snapshot) => {
      const videosData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setVideos(videosData);
    });
  };


  return (
    <View style={{ flex: 1 }}>


      <FlatList
        data={videos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.horizontalItem}>
            <Video
              source={{ uri: item.url }}
              style={{ width: 300, height: 200, borderRadius: 10, margin: 10 }}
              resizeMode="cover"
              horizontal
              useNativeControls
            />
            <Text style={styles.horizontalTitle}>{item.title}</Text>
            <Text style={styles.horizontalArtist}>{item.artistName}</Text>

          </View>
        )}
        horizontal
        showsHorizontalScrollIndicator={true}
        indicatorStyle="pink"
      />
    </View>
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

