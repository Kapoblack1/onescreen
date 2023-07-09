import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { getFirestore, collection, query, where, getDocs,doc, getDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../FirebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';



const Channel = ({ route }) => {
  const { title, personId } = route.params;
  const [categoryItems, setCategoryItems] = useState([]);
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

  useEffect(() => {
    const fetchCategoryItems = async () => {
      try {
        const q = query(collection(FIREBASE_DB, title));
        const querySnapshot = await getDocs(q);

        const items = querySnapshot.docs.map((doc) => {
          const data = doc.data();

          return {
            id: doc.id,
            title: data.title,
            image: { uri: data.image },
          };
        });

        setCategoryItems(items);
      } catch (error) {
        console.log('Error fetching category items:', error);
      }
    };

    fetchCategoryItems();
  }, [title]);

  function goToProfilePage() {
    const registeredPersonId = personId;
    navigation.navigate('ProfilePage', { personId: registeredPersonId });
}
const handleItemPress = (itemTitle) => {
  const registeredPersonId = personId;
  navigation.navigate('VideoPage', { title: itemTitle, personId: registeredPersonId });
};

  return (
    <View style={styles.container}>
       <View style={styles.header}>
                <Text style={styles.label}>{personName}!{}</Text>
                <Ionicons style={styles.iconSearch} name="search" size={40} color="red" />
                <TouchableOpacity onPress={goToProfilePage}>
                    <Image
                        style={styles.profileImage}
                        source={profileImageUrl ? { uri: profileImageUrl } : require('../assets/loading.jpg')}
                    />
                </TouchableOpacity>
            </View>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.categoryContainer}>
        <FlatList
          data={categoryItems}
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
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
    paddingBottom: 200,
},
  categoryItem: {
    flex: 1,
    margin: 5,
    borderRadius: 10,
    backgroundColor: 'black',
    padding: 10,
  },
  categoryImage: {
    width: '100%',
    height: 250,
    borderRadius: 10,
  },
  categoryContent: {
    marginTop: 20,
    
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
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
});

export default Channel;
