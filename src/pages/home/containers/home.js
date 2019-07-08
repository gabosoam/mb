import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import HomeIconWithBadge from './homeIconBadge';
import { View, Text, Button, StatusBar } from 'react-native'
import React from 'react';
import { Header } from 'react-native-elements'
import { heightPercentageToDP } from 'react-native-responsive-screen';
import EnEspera from '../../en-espera/en-espera';
import Finalizadas from '../../finalizadas/finalizadas';
import Produccion from '../../en-produccion/en-produccion';



export default createBottomTabNavigator(
    {
        Espera: EnEspera,
        Produccion: Produccion,
        Finalizadas: Finalizadas
    },
    {
        defaultNavigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ focused, horizontal, tintColor }) => {
                const { routeName } = navigation.state;
                let IconComponent = Ionicons;
                let iconName;
                if (routeName === 'Espera') {
                    iconName = 'ios-timer';
                    // Sometimes we want to add badges to some icons. 
                    // You can check the implementation below.
                    IconComponent = HomeIconWithBadge;
                } else if (routeName === 'Produccion') {
                    iconName = `ios-construct`;
                } else if (routeName === 'Finalizadas') {
                    iconName = 'ios-done-all';

                }

                // You can return any component that you like here!
                return <IconComponent name={iconName} size={25} color={tintColor} />;
            },
        }),
        tabBarOptions: {
            activeTintColor: '#000000',
            inactiveTintColor: '#A4AAB2',
            upperCaseLabel: true
        }
    }
);