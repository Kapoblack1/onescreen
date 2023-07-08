import React, { useEffect, useState } from 'react';
import { Text, View, Button, StyleSheet, Image, FlatList } from 'react-native';
import { FIREBASE_DB } from '../../FirebaseConfig';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
import { Audio } from 'expo-av';

const RadioListScreen = () => {
  const [radios, setRadios] = useState([]);

  useEffect(() => {
    const fetchRadios = async () => {
      try {
        const radiosCollection = collection(FIREBASE_DB, 'radios');
        const unsubscribe = onSnapshot(radiosCollection, (snapshot) => {
          const radioList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            isPlaying: false,
            soundObject: null,
            isLoading: false,
          }));
          setRadios(radioList);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Erro ao buscar as rádios:', error);
      }
    };

    fetchRadios();
  }, []);

  const handlePlayRadio = async (radio) => {
    try {
      if (radio.isLoading) {
        return; // Evita que o botão seja pressionado várias vezes enquanto o áudio está carregando
      }

      radio.isLoading = true;
      setRadios([...radios]);

      if (radio.isPlaying) {
        if (radio.soundObject) {
          await radio.soundObject.pauseAsync();
          radio.isPlaying = false;
        }
      } else {
        if (radio.soundObject) {
          await radio.soundObject.playAsync();
          radio.isPlaying = true;
        } else {
          const soundObject = new Audio.Sound();
          await soundObject.loadAsync({ uri: radio.frequency });
          await soundObject.playAsync();
          radio.soundObject = soundObject;
          radio.isPlaying = true;
        }
      }

      radio.isLoading = false;
      setRadios([...radios]);
    } catch (error) {
      console.error('Erro ao reproduzir o áudio:', error);
      radio.isLoading = false;
      setRadios([...radios]);
    }
  };

  return (
    <View>

      <FlatList 
        data={radios}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View key={item.id}>
            <Image source={{ uri: item.thumbnailURL }} style={styles.item} />
            <Text>{item.name}</Text>
            <Button style={styles.button}
              title={item.isLoading ? 'Carregando' : item.isPlaying ? 'Pause' : 'Play'}
              disabled={item.isLoading}
              onPress={() => handlePlayRadio(item)}
            />
          </View>
        )}
        horizontal
        showsHorizontalScrollIndicator={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    width: 100,
    height: 100,
    padding: 10,
    margin: 10,
  },
  button: {
    marginBottom: 700,
    color:  'pink',

  }
});

export default RadioListScreen;
