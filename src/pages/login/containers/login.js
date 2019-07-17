import React from 'react';
import { Image, View, TouchableOpacity, Text, TextInput, Alert, StyleSheet, StatusBar } from 'react-native'
import SplashScreen from 'react-native-splash-screen'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AutoHeightImage from 'react-native-auto-height-image';
import { Button, Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ScrollView } from 'react-native-gesture-handler';
import apiController from '../../../controllers/api-controller';
import { connect } from 'react-redux';
import { addPlace, addUser } from '../../../redux/actions/user';
import { addResult } from '@jest/test-result';
import firebase from 'react-native-firebase'

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selected: 0,
            user: { email: 'gasalazaror5@gmail.com', password: '12345' }
        }

        props.user.token ? this.props.navigation.navigate('Cliente') : console.log('');
    }

    componentDidMount() {
        SplashScreen.hide();
    }

    onLogin = () => {
        console.log(this.state.user)
        console.log('llegue')
        apiController.post('login', this.state.user)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                responseJson.user ? this.saveSession(responseJson) : Alert.alert('Error', 'Contraseña incorrecta')
            })
            .catch((error) => {
                console.log(error)
                Alert.alert('Error', 'El usuario no existe')

            });
    }

    saveSession = (responseJson) => {

        firebase.messaging().getToken().then(token => {
            console.log(token)
            apiController.patch('usuario/' + responseJson.user.id, { fcm: token }, responseJson.token)
                .then((response) => response.json())
                .then((responseJson) => {
                    console.log(responseJson)
                })
                .catch((error) => {
                    console.log(error)


                });
        });

        this.props.add(responseJson);

        if (responseJson.user.persona.es_empleado && !responseJson.user.persona.es_cliente) {
            this.props.navigation.replace('Home')
        }

        if (!responseJson.user.persona.es_empleado && responseJson.user.persona.es_cliente) {
            this.props.navigation.navigate('Cliente')
        }


    }

    renderLogin = () => {
        return (

            <View>
                <View style={styles.loginContainer}>
                    <Text style={{ fontFamily: 'Roboto-Medium', fontSize: hp('3'), color: '#282C40' }}>INGRESA TUS DATOS:</Text>

                    <View style={{ paddingVertical: hp('3') }}>
                        <Input
                            containerStyle={{ backgroundColor: '#ffffff', borderRadius: wp('2') }}
                            inputContainerStyle={{ borderBottomWidth: 0 }}
                            value={this.state.user.email}
                            onChangeText={(value) => this.setState({ user: { email: value, password: this.state.user.password } })}
                            placeholder='Correo electrónico'
                            textContentType='emailAddress'
                            returnKeyType={"next"}
                            onSubmitEditing={() => { this.secondTextInput.focus(); }}
                            blurOnSubmit={false}
                        />
                    </View>

                    <View style={{ paddingBottom: hp('4') }}>
                        <Input
                            containerStyle={{ backgroundColor: '#ffffff', borderRadius: wp('2') }}
                            inputContainerStyle={{ borderBottomWidth: 0 }}
                            value={this.state.user.password}
                            onChangeText={(value) => this.setState({ user: { password: value, email: this.state.user.email } })}
                            textContentType='password'
                            secureTextEntry={true}
                            ref={(input) => { this.secondTextInput = input; }}
                            placeholder='Contraseña'
                            onSubmitEditing={() => { this.onLogin() }}
                        />
                    </View>

                    <View style={{ alignItems: 'center' }}>
                        <Button
                            onPress={() => this.onLogin()}
                            buttonStyle={{ width: wp('65'), paddingBottom: hp('4'), borderRadius: wp(2.5), height: hp('7.7'), backgroundColor: '#407BFC' }}
                            titleStyle={{ fontFamily: 'Roboto', marginRight: wp('2'), fontSize: hp('3'), color: '#ffffff' }}
                            containerStyle={{ paddingBottom: hp('4') }}
                            title="CONTINUAR"
                            iconContainerStyle={{ marginLeft: wp('2'), }}
                            buttonStyle={{ backgroundColor: '#282C40', borderRadius: wp(2.5), width: wp(75) }}
                            iconRight={true}
                            icon={
                                <Icon
                                    name="arrow-right"

                                    size={15}
                                    color="white"
                                />
                            }
                            type="outline"
                        />
                    </View>

                    <View style={{ alignItems: 'center', paddingBottom: hp('25') }}>
                        <Text style={{ fontFamily: 'Roboto', fontSize: hp(2.5), color: '#282C40' }}>OLVIDASTE TU CONTRASEÑA?</Text>
                    </View>


                </View>





            </View>

        )
    }



    render() {
        return (

            <View>
                <StatusBar backgroundColor="#282C40" barStyle="light-content" />
                <ScrollView>
                    <View style={styles.logoContainer}>
                        <AutoHeightImage width={wp('54')} source={require('../../../../assets/images/logo.png')} ></AutoHeightImage>
                    </View>


                    {
                        this.renderLogin()
                    }
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    logoContainer: {
        justifyContent: 'center',
        flex: 1,
        alignItems: 'center',
        height: hp('30'),
        backgroundColor: '#282C40'
    },
    buttonsContainer: {
        flex: 1,
        flexDirection: 'row'
    },
    loginContainer: {
        flex: 1,
        backgroundColor: '#F2B544',
        paddingHorizontal: wp('8'),
        paddingTop: hp('7.5'),
    },
    signContainer: {
        flex: 1,
        backgroundColor: '#407BFC',
        paddingHorizontal: wp('8'),
        paddingTop: hp('7.5'),
    }
})

const mapStateToProps = state => {
    return {
        user: state.user.user
    }
}

const mapDispatchToProps = dispatch => {
    return {
        add: (user) => {
            dispatch(addUser(user))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)