import React from 'react';
import { Image, View, TouchableOpacity, Text, TextInput, Alert, StatusBar, StyleSheet } from 'react-native'
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
            user: { email: 'gasalazaror@gmail.com', password: '12345' }
        }

        props.user.token ? this.props.navigation.replace('Home') : console.log('');
    }

    componentDidMount() {
        SplashScreen.hide();
    }

    onLogin = () => {
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

        console.log("sdsds", responseJson.user.persona.es_empleado)
        console.log("sdsds", responseJson.user.persona.es_cliente)

        if (responseJson.user.persona.es_empleado && !responseJson.user.persona.es_cliente) {
            this.props.navigation.replace('Home')
        }

        if (!responseJson.user.persona.es_empleado && responseJson.user.persona.es_cliente) {
            this.props.navigation.replace('Home')
        }
        this.props.add(responseJson);

    }

    renderLogin = () => {
        return (

            <View>
                <View style={styles.loginContainer}>
                    <Text style={{ fontFamily: 'Roboto-Medium', fontSize: hp('3'), color: '#FFFFFF' }}>INGRESA TUS DATOS:</Text>

                    <View style={{ paddingVertical: hp('3') }}>
                        <Input
                            containerStyle={{ backgroundColor: '#ffffff', borderRadius: wp('2') }}
                            value={this.state.user.email}
                            onChangeText={(value) => this.setState({ user: { email: value, password: this.state.user.password } })}
                            placeholder='Correo electrónico'
                            textContentType='emailAddress'
                            returnKeyType={"next"}
                            onSubmitEditing={() => { this.secondTextInput.focus(); }}
                            blurOnSubmit={false}
                        />
                    </View>

                    <View style={{ paddingBottom: hp('7.5') }}>
                        <Input
                            containerStyle={{ backgroundColor: '#ffffff', borderRadius: wp('2') }}
                            value={this.state.user.password}
                            onChangeText={(value) => this.setState({ user: { password: value, email: this.state.user.email } })}
                            textContentType='password'
                            secureTextEntry={true}
                            ref={(input) => { this.secondTextInput = input; }}
                            placeholder='Contraseña'
                            onSubmitEditing={() => { this.onLogin() }}
                        />
                    </View>

                    <View style={{ alignItems: 'center', paddingBottom: hp('7.5') }}>
                        <Text style={{ fontFamily: 'Roboto', fontSize: hp(2.5), color: '#34D6B7' }}>OLVIDASTE TU CONTRASEÑA?</Text>
                    </View>


                </View>

                <Button
                    onPress={() => this.onLogin()}
                    buttonStyle={{ width: wp('100'), height: hp('7.7'), backgroundColor: '#407BFC', borderRadius: 0 }}
                    titleStyle={{ fontFamily: 'Roboto', marginRight: wp('2'), fontSize: hp('3'), color: '#ffffff' }}

                    title="CONTINUAR"
                    iconContainerStyle={{ marginLeft: wp('2'), }}
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

        )
    }

    renderSignIn = () => {
        return (

            <View>
                <View style={styles.signContainer}>
                    <Text style={{ fontFamily: 'Roboto-Medium', fontSize: hp('3'), color: '#FFFFFF' }}>CREA TU CUENTA:</Text>

                    <View style={{ paddingVertical: hp('3') }}>
                        <Input
                            containerStyle={{ backgroundColor: '#ffffff', borderRadius: wp('2') }}
                            placeholder='mtuerca2@hotmail.com'
                        />
                    </View>

                    <View style={{ paddingBottom: hp('7.5') }}>
                        <Input
                            containerStyle={{ backgroundColor: '#ffffff', borderRadius: wp('2') }}
                            placeholder='XXXXXX'
                        />
                    </View>

                    <View style={{ alignItems: 'center' }}>

                        <Button
                            title={'ENVIAR'}
                            containerStyle={{ width: wp('23'), height: hp('6.5'), paddingBottom: hp('30') }}
                            buttonStyle={{ backgroundColor: '#D43539', width: wp('23'), height: hp('8'), borderRadius: wp('2') }}
                            titleStyle={{ fontSize: hp('2.5'), fontFamily: 'Roboto-Medium', }}
                        />



                    </View>



                </View>





            </View>

        )
    }

    render() {
        return (

            <View>
                <ScrollView>
                    <View style={styles.logoContainer}>
                        <AutoHeightImage width={wp('54')} source={require('../../../../assets/images/logo.png')} ></AutoHeightImage>
                    </View>
                    <View style={styles.buttonsContainer}>
                        <Button
                            onPress={() => this.setState({ selected: 0 })}
                            buttonStyle={{ width: wp('50'), height: hp('7'), borderBottomWidth: 0 }}
                            titleStyle={{ fontFamily: 'Roboto', fontSize: hp('3'), color: this.state.selected == 0 ? '#2E4056' : '#959DAD' }}
                            title="Login"
                            type="outline"
                        />

                        <Button
                            onPress={() => this.setState({ selected: 1 })}
                            buttonStyle={{ width: wp('50'), height: hp('7'), borderBottomWidth: 0 }}
                            titleStyle={{ fontFamily: 'Roboto', fontSize: hp('3'), color: this.state.selected == 1 ? '#2E4056' : '#959DAD' }}
                            title="Registrarse"
                            type="outline"
                        />

                    </View>

                    <View style={styles.buttonsContainer}>

                        {
                            this.state.selected == 0 ?

                                <View style={{ width: wp('50'), flexDirection: 'row' }}>
                                    <View style={{ height: hp('1.15'), width: wp('12.5'), backgroundColor: '#665EFF' }}>

                                    </View>

                                    <View style={{ height: hp('1.15'), width: wp('12.5'), backgroundColor: '#5773FF' }}>

                                    </View>

                                    <View style={{ height: hp('1.15'), width: wp('12.5'), backgroundColor: '#3497FD' }}>

                                    </View>
                                    <View style={{ height: hp('1.15'), width: wp('12.5'), backgroundColor: '#3ACCE1' }}>

                                    </View>

                                </View> :

                                <View style={{ width: wp('50'), flexDirection: 'row' }}>

                                </View>

                        }

                        {
                            this.state.selected == 1 ?

                                <View>

                                    <View style={{ width: wp('50'), flexDirection: 'row' }}>

                                    </View>

                                    <View style={{ width: wp('50'), flexDirection: 'row' }}>
                                        <View style={{ height: hp('1.15'), width: wp('12.5'), backgroundColor: '#665EFF' }}>

                                        </View>

                                        <View style={{ height: hp('1.15'), width: wp('12.5'), backgroundColor: '#5773FF' }}>

                                        </View>

                                        <View style={{ height: hp('1.15'), width: wp('12.5'), backgroundColor: '#3497FD' }}>

                                        </View>
                                        <View style={{ height: hp('1.15'), width: wp('12.5'), backgroundColor: '#3ACCE1' }}>

                                        </View>

                                    </View>

                                </View>



                                : null

                        }
                    </View>

                    {
                        this.state.selected == 0 ? this.renderLogin() : this.renderSignIn()
                    }
                </ScrollView>







            </View>
        )
    }
}

const styles = StyleSheet.create({
    logoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: hp('30')
    },
    buttonsContainer: {
        flexDirection: 'row'
    },
    loginContainer: {
        backgroundColor: '#2E4056',
        paddingHorizontal: wp('8'),
        paddingTop: hp('7.5'),
    },
    signContainer: {
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