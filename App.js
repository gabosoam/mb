import React from 'react';
import { StyleSheet, Platform, Image, Text, View, ScrollView } from 'react-native';
import { createStackNavigator, createAppContainer } from "react-navigation";
import firebase from 'react-native-firebase';
import SplashScreen from 'react-native-splash-screen'
import Home from './src/pages/home/containers/home';
import Login from './src/pages/login/containers/login'
import { fromRight, fromBottom, fadeIn } from 'react-navigation-transitions';
import Chat from './src/pages/chat/chat';
import Videochat from './src/pages/videochat/videochat';

const handleCustomTransition = ({ scenes }) => {

  const prevScene = scenes[scenes.length - 2];
  const nextScene = scenes[scenes.length - 1];


  if (prevScene
    && prevScene.route.routeName === 'Home'
    && nextScene.route.routeName === 'Chat'

  ) {
    return fromBottom();
  }

  if (prevScene
    && prevScene.route.routeName === 'Home'
    && nextScene.route.routeName === 'Videochat'

  ) {
    return fromBottom();
  }

  if (prevScene
    && prevScene.route.routeName === 'Chat'
    && nextScene.route.routeName === 'Videochat'

  ) {
    return fromRight();
  }


  return fromRight();
}



const AppNavigator = createStackNavigator(

  {
    Home: {
      screen: Home
    },

    Login: {
      screen: Login
    },
    Chat: {
      screen: Chat
    },
    Videochat: {
      screen: Videochat
    },
  },
  {
    initialRouteName: "Login",
    transitionConfig: (nav) => handleCustomTransition(nav),
    headerMode: 'none',
    //mode: 'modal',



  }
);



export default createAppContainer(AppNavigator)