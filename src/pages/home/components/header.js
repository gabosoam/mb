import React from 'react';
import { View, StatusBar } from 'react-native'
import { Header,  } from 'react-native-elements';
import { heightPercentageToDP } from 'react-native-responsive-screen';

export default class HeaderComponent extends React.Component {
    render() {
        return (
            <View>
                <StatusBar backgroundColor="#282C40" barStyle="light-content" />
                <Header
                    containerStyle={{ backgroundColor: '#282C40' }}

                    centerComponent={{ text: this.props.title, style: { color: '#F2B544', fontFamily: 'Roboto-Black', fontSize: heightPercentageToDP(3) } }}
                    rightComponent={{ icon: 'person', color: '#F2B544' }}
                />

            </View>

        )
    }
}