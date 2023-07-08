import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './app/screems/Login';
import Register from './app/screems/Register';
import Home from './app/screems/Home';
import ProfilePage from './app/screems/ProfilePage';
import Radio from './app/screems/Radio';
import Videos from './app/screems/Videos';
import Songs from './app/screems/Songs';
import MusicPage from './app/screems/MusicPage';
import ArtistPage from './app/screems/ArtistPage';
import PlaylistPage from './app/screems/PlaylistPage';
import Categoria from './app/screems/Categoria';

const Stack = createStackNavigator();


const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>

        <Stack.Screen name="ProfilePage"
          component={ProfilePage}
          options={{ headerShown: false }} />

        <Stack.Screen name="Login"
          component={Login}
          options={{ headerShown: false }} />

        <Stack.Screen name="Radio"
          component={Radio}
          options={{ headerShown: false }} />

        <Stack.Screen name="Videos"
          component={Videos}
          options={{ headerShown: false }} />

        <Stack.Screen name="Register"
          component={Register}
          options={{ headerShown: false }} />

        <Stack.Screen name="Home"
          component={Home}
          options={{ headerShown: false }} />

        <Stack.Screen name="Songs"
          component={Songs}
          options={{ headerShown: false }} />

        <Stack.Screen name="MusicPage"
          component={MusicPage}
          options={{ headerShown: false }} />

        <Stack.Screen name="ArtistPage"
          component={ArtistPage}
          options={{ headerShown: false }} />

        <Stack.Screen name="Categoria"
          component={Categoria}
          options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;