import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { ref, getDownloadURL } from 'firebase/storage';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { FIREBASE_STORAGE, FIREBASE_DB } from '../../FirebaseConfig';
import { useNavigation } from '@react-navigation/native';
import logo from '../assets/logo.jpg';
import backgroundImg from '../assets/image2.jpg';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation();

  function handleRegister() {
    navigation.navigate('Register');
  }

  const validateEmail = (email) => {
    const emailRegex = /^(19|20)\d{6}@isptec.co.ao$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    if (validateEmail(email)) {
      try {
        const q = query(
          collection(FIREBASE_DB, 'pessoa'),
          where('email', '==', email),
          where('password', '==', password)
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.size > 0) {
          const registeredPersonId = querySnapshot.docs[0].id;
          console.log('Entered with ID: ', registeredPersonId);
          navigation.navigate('Home', { personId: registeredPersonId });
        } else {
          Alert.alert('Conta inexistente', 'Por favor verifique os dados inseridos.');
        }
      } catch (error) {
        console.log('Error:', error);
        Alert.alert('Erro:', error);
      }
    } else {
      alert('Formato de e-mail inválido. Por favor introduza um e-mail do formato ISPTEC (Ex: 20230001@isptec.co.ao)');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.innerContainer}>
            <Image source={logo} style={styles.logo} />

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

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>LOGIN</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.register}>
              <Text style={{ color: 'white' }}>Não tem uma conta? </Text>
              <Text onPress={handleRegister} style={styles.registerText}>
                Registar
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
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
    fontSize: 16,

  },
  loginButton: {
    width: '25%',
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
  loginButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  registerText: {
    color: 'red',
    fontSize: 14.5,
    opacity: 0.7,
    fontWeight: 'bold',
  },
  register: {
    flexDirection: 'row',
  },
});
