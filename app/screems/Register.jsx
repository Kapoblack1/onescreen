import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { FIREBASE_STORAGE, FIREBASE_DB } from '../../FirebaseConfig';
import { useNavigation } from '@react-navigation/native';
import logo from '../assets/logo.jpg';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^(19|20)\d{6}@isptec.co.ao$/;
    return emailRegex.test(email);
  };

  const navigation = useNavigation();

  function handleLogin() {
    navigation.navigate('Login');
  }

  const handleRegister = async () => {
    if (validateEmail(email)) {
      try {
        // Verifica se já existe um usuário com o mesmo nome de usuário e senha na base de dados
        const querySnapshot = await getDocs(
          query(
            collection(FIREBASE_DB, 'pessoa'),
            where('email', '==', email),
            where('password', '==', password)
          )
        );

        if (!querySnapshot.empty) {
          console.log('Usuário já existe na base de dados');
          alert('Esta conta já existe.');
          return;
        }

        const defaultImageRef = ref(FIREBASE_STORAGE, '/imagens/avatar.png');
        const defaultImageUrl = await getDownloadURL(defaultImageRef);

        // Cria um novo documento na coleção 'pessoa' com os dados fornecidos
        const docRef = await addDoc(collection(FIREBASE_DB, 'pessoa'), {
          name,
          surname,
          password,
          email,
          imageUrl: defaultImageUrl,
        });
        console.log('Nova pessoa criada com ID:', docRef.id);
        navigation.navigate('Login');
      } catch (error) {
        console.log('Erro ao criar uma nova pessoa:', error);
      }
    } else {
      alert('Formato de e-mail inválido. Por favor introduza um e-mail do formato ISPTEC.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.innerContainer}>
        <Image source={logo} style={styles.logo} />

        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholder="Nome"
            placeholderTextColor="#fff"
            value={name}
            onChangeText={(text) => setName(text)}
          />
        </View>

        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholder="Sobrenome"
            placeholderTextColor="#fff"
            value={surname}
            onChangeText={(text) => setSurname(text)}
          />
        </View>

        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholder="Email"
            placeholderTextColor="#fff"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholder="Password"
            placeholderTextColor="#fff"
            secureTextEntry
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
        </View>
        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>REGISTAR</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.register}>
          <Text style={{ color: 'white' }}>Já tem conta? </Text>
          <Text onPress={handleLogin} style={styles.registerText}>
            Faça login
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 250,
    height: 155,
    marginTop: 20,
    marginBottom: 50,
  },
  inputView: {
    width: 300,
    height: 50,
    borderBottomColor: 'red',
    borderBottomWidth: 1,
    marginBottom: 20,
    justifyContent: 'center',
    padding: 5,
  },
  inputText: {
    height: 50,
    color: 'white',
    fontSize: 18,

  },
  registerButton: {
    width: '30%',
    borderWidth: 1,
    borderColor: 'red',
    backgroundColor: 'black',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  registerButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  registerText: {
    color: 'red',
    fontSize: 14.5,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  register: {
    flexDirection: 'row',
  },
});
