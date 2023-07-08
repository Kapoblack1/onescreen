import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  TextInput,
} from 'react-native';
import {
  collection,
  getDocs,
  query,
  getFirestore,
  where,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_STORAGE } from '../../FirebaseConfig';

const MediaItem = ({ item, onEdit }) => {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description);

  const handleSaveChanges = async () => {
    try {
      const editedMedia = { ...item, title, description };
      await updateMediaItem(editedMedia);
      setEditing(false);
    } catch (error) {
      console.error('Erro ao salvar as alterações:', error);
    }
  };

  const updateMediaItem = async (media) => {
    try {
      const audiosCollection = collection(getFirestore(), 'audios');
      const mediaDocRef = doc(audiosCollection, media.id);

      await updateDoc(mediaDocRef, media);
    } catch (error) {
      console.error('Erro ao atualizar o item:', error);
    }
  };

  return (
    <View style={{ marginBottom: 10 }}>
      <View style={styles.options}>
        <TouchableOpacity>
          <Image source={{ uri: item.thumbnailURL }} style={styles.item} />
        </TouchableOpacity>

        <View style={styles.separate}>
          {editing ? (
            <View style={styles.editForm}>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
              />
              <TextInput
                style={styles.input}
                value={description}
                onChangeText={setDescription}
              />
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveChanges}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.same}>
              <Text style={styles.horizontalTitle}>{item.title}</Text>
              <Text style={styles.horizontalArtist}>{item.description}</Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setEditing(!editing)}
          >
            <Text style={styles.uploadButtonText}>
              {editing ? 'Cancel' : 'Editar'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default function AudioListScreen({ artistId }) {
  const [audios, setAudios] = useState([]);

  useEffect(() => {
    fetchAudios();
  }, []);

  const fetchAudios = async () => {
    try {
      const audiosCollection = collection(getFirestore(), 'audios');
      const querySnapshot = await getDocs(query(audiosCollection, where('artist', '==', artistId)));
  
      const audiosData = querySnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
      setAudios(audiosData);
    } catch (error) {
      console.error('Erro ao buscar os áudios:', error);
    }
  };
  

  return (
    <View style={styles.container}>
      <FlatList
        data={audios}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => <MediaItem item={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '73%',
  },
  options: {
    flexDirection: 'row',
    borderWidth: 1.5,
    borderColor: 'pink',
    borderRadius: 10,
    width: 320,
  },
  uploadButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  same:{
    width: '75%',

  },
  item: {
    width: 90,
    height: 90,
    borderRadius: 10,
  },
  horizontalTitle: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginLeft: 10,
  },
  horizontalArtist: {
    fontSize: 14,
    color: 'black',
    marginLeft: 10,
  },
  editButton: {
    backgroundColor: 'pink',
    borderRadius: 5,
    width: '25%',
    height: '30%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  separate: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '68%',
  },
  editForm: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 5,
  },
  saveButton: {
    backgroundColor: 'pink',
    borderRadius: 5,
    width: 60,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
