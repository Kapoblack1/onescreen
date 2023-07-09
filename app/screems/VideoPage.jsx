import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { getFirestore, collection, query, getDocs, doc, getDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../FirebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

export default function VideoPage({ route }) {

  const [videos, setVideos] = useState([]);
  const { title, personId } = route.params;
  const [personName, setPersonName] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);

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

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const q = query(collection(FIREBASE_DB, title));
        const querySnapshot = await getDocs(q);

        const videosData = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            videoUrl: data.videoUrl,
            thumbnail: data.thumbnail,
          };
        });

        setVideos(videosData);
      } catch (error) {
        console.log('Error fetching videos:', error);
      }
    };

    fetchVideos();
  }, [title]);

  const handleThumbnailPress = (video) => {
    setSelectedVideo(video);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
      </View>
      <Text style={styles.title}>{title}</Text>
      <ScrollView style={styles.container}>
        {videos.map((video) => (
          <View key={video.id} style={styles.videoContainer}>
            <TouchableOpacity onPress={() => handleThumbnailPress(video)}>
              <View style={styles.thumbnailContainer}>
                {selectedVideo && selectedVideo.id === video.id ? null : (
                  <Image source={{ uri: video.thumbnail }} style={styles.thumbnail} />
                )}
                {selectedVideo && selectedVideo.id === video.id ? null : (
                  <Ionicons name="play" size={50} color="white" style={styles.playIcon} />
                )}
              </View>
              {selectedVideo === null && (
              <>
              <View style={styles.titleContainer}>
                <Text style={styles.videoTitle}>{video.title}</Text>
              </View>   
              </>
            )}
              <View style={styles.titleContainer}>
                <Text style={styles.videoTitle}>{video.title}</Text>
              </View>
            </TouchableOpacity>
            {selectedVideo && selectedVideo.id === video.id && (
              <>
                <Video
                  source={{ uri: video.videoUrl }}
                  style={styles.video}
                  useNativeControls
                  resizeMode="contain"
                />
                <View style={styles.titleContainer}>
                  <Text style={styles.videoTitle}>{video.title}</Text>
                </View>
              </>
            )}

          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    marginTop: '15%',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 25,
    color: 'white',
    paddingTop: 15,
    paddingLeft: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  videoContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'red',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,

  },
  thumbnailContainer: {
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: 200,
  },
  playIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
  video: {
    width: '100%',
    height: 200,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    marginTop: 10,
    padding: 5,
  },
});
