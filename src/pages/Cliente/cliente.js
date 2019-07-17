import React from 'react';
import { Image, View, Text, StyleSheet, StatusBar, TouchableOpacity } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AutoHeightImage from 'react-native-auto-height-image';



import { ScrollView } from 'react-native-gesture-handler';
import apiController from '../../controllers/api-controller';
import { connect } from 'react-redux';
import { addUser } from '../../redux/actions/user';
import firebase from 'react-native-firebase'

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selected: 0,
            user: { email: 'gasalazaror5@gmail.com', password: '12345' }
        }


    }

    componentDidMount() {

    }








    render() {
        return (

            <View style={{  backgroundColor: '#F2B544',}}>
                <StatusBar backgroundColor="#282C40" barStyle="light-content" />

      

                <ScrollView>
                    <View style={styles.logoContainer}>
                        <AutoHeightImage width={wp('54')} source={require('../../../assets/images/logo.png')} ></AutoHeightImage>
                    </View>

                    <View style={{  backgroundColor: '#F2B544', height: hp(70)}}>
                    <View style={styles.loginContainer}>
                        <TouchableOpacity onPress={()=> this.props.navigation.navigate('Tareas')} style={{width: wp(100)/3, alignItems: 'center'}}>
                            <AutoHeightImage width={wp(20)} source={require('../../../assets/images/car.png')}></AutoHeightImage>
                            <Text style={{paddingTop: hp(2),color:'#282C40', fontSize: hp(2.5), fontFamily: 'Roboto-Medium'}}>Mis vehículos</Text>
                        </TouchableOpacity>

                        <View style={{width: wp(100)/3, alignItems: 'center'}}>
                            <AutoHeightImage width={wp(20)} source={require('../../../assets/images/car.png')}></AutoHeightImage>
                            <Text style={{paddingTop: hp(2),color:'#282C40', fontSize: hp(2.5), fontFamily: 'Roboto-Medium'}}>MiS servicios</Text>
                        </View>

                        <View style={{width: wp(100)/3, alignItems: 'center'}}>
                            <AutoHeightImage width={wp(13)} source={require('../../../assets/images/plus.png')}></AutoHeightImage>
                            <Text style={{paddingTop: hp(2),color:'#282C40', fontSize: hp(2.5), fontFamily: 'Roboto-Medium'}}>Solicitar servicio</Text>
                        </View>

                    </View>

                    <View style={styles.loginContainer}>
                        <View style={{width: wp(100)/3, alignItems: 'center'}}>
                            <AutoHeightImage width={wp(11)} source={require('../../../assets/images/profile.png')}></AutoHeightImage>
                            <Text style={{paddingTop: hp(2),color:'#282C40', fontSize: hp(2.5), fontFamily: 'Roboto-Medium'}}>Mi cuenta</Text>
                        </View>

                        <View style={{width: wp(100)/3, alignItems: 'center'}}>
                            <AutoHeightImage width={wp(11)} source={require('../../../assets/images/notification.png')}></AutoHeightImage>
                            <Text style={{paddingTop: hp(2),color:'#282C40', fontSize: hp(2.5), fontFamily: 'Roboto-Medium'}}>Notificaciones</Text>
                        </View>

                        <View style={{width: wp(100)/3, alignItems: 'center'}}>
                            <AutoHeightImage width={wp(13)} source={require('../../../assets/images/close.png')}></AutoHeightImage>
                            <Text style={{paddingTop: hp(2),color:'#282C40', fontSize: hp(2.5), fontFamily: 'Roboto-Medium'}}>Salir</Text>
                        </View>

                    </View>

                    </View>

                  


                    



                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    logoContainer: {
        justifyContent: 'center',
  
        alignItems: 'center',
        height: hp('30'),
        backgroundColor: '#282C40'
    },
    buttonsContainer: {
        flex: 1,
        flexDirection: 'row'
    },
    loginContainer: {
        flexDirection: 'row',
        backgroundColor: '#F2B544',
  
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