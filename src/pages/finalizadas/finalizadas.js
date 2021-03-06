import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native'
import apiController from '../../controllers/api-controller';
import { connect } from 'react-redux';
import moment from 'moment'
import { ListItem, Card, Slider, Button } from 'react-native-elements'
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import CircularProgress from './ciurcular';
import ProgressCircle from 'react-native-progress-circle'
import api from '../../controllers/api-controller'


import 'moment/locale/es'
import Header from '../home/components/header';
moment.locale('es')

class Finalizadas extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            data: [],
            isFetching: false,
            seleccionado: -1
        }


        this.getData();
    }

    getData = () => {
        apiController.get('asignacion/vistalist?usuario=' + this.props.user.user.persona.id)
            .then((response) => response.json())
            .then((responseJson) => {



                responseJson.forEach(element => {
                    element.fromNow = ''
                    element.calendar = ''
                    element.color = ''

                });
                console.log(responseJson.filter(item => item.estado == 4))

                this.setState({
                    data: responseJson.filter(item => item.estado == 4),
                    isFetching: false
                })

                this.actualizarTiempo()


            })
            .catch((error) => {
                console.log(error)


            });


    }

    actualizarTiempo() {
        this.interval = setInterval(() => {

            var newData = this.state.data
            newData.forEach(element => {
                element.fromNow = this.obtenerTiempoTranscurrido(element)
                element.calendar = this.obtenerCalendar(element)

            });

            this.setState({ data: newData })



        }

            , 1000);


    }

    renderEmplyItem = () => {
        return (
            <View style={{ alignItems: 'center' }}>
                <Text>No tienes tareas en esta sección</Text>
            </View>
        )
    }

    obtenerTiempoTranscurrido = (element) => {
        var expiration = moment(element.hora_inicio, 'YYYY-MM-DD hh:mm:ss');

        return expiration.fromNow()
    }

    obtenerCalendar = (element) => {
        var expiration = moment(element.hora_inicio, 'YYYY-MM-DD hh:mm:ss');
        return expiration.calendar()
    }


    confirmation = (id, item) => {

        const secs = item.tiempo_estandar;

        const formatted = moment.utc(secs * 1000).format('HH:mm:ss');

        Alert.alert(
            '¿Seguro que deseas iniciar la tarea?',
            'Tienes ' + formatted + ' para completar la tarea desde que presionas el botón iniciar',
            [
                {
                    text: 'Cancelar',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: 'Iniciar', onPress: () => this.iniciarTarea(id, item) },
            ],
            { cancelable: true },
        );
    }

    iniciarTarea = (asignacion, item) => {


        api.get('asignacion/iniciartarea?asignacion=' + asignacion)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)

            })
            .catch((error) => {
                console.log(error)


            });
    }


    renderItem = ({ item, index }) => {


        return (
            <Card
                titleNumberOfLines={1}
                featuredTitleStyle={{ backgroundColor: '#F2B544' }}

                title={item.producto}
                containerStyle={{ borderRadius: widthPercentageToDP('4'), }}>

                <TouchableOpacity onPress={() => this.setState({ seleccionado: this.state.seleccionado == index ? -1 : index })}>
                    <View style={{ flexDirection: 'row', }}>
                        <View style={{ justifyContent: 'center', width: widthPercentageToDP('50') }}>
                            <Text style={{ fontFamily: 'Roboto' }}>{'Estado: '}</Text>
                            <Text style={{ fontFamily: 'Roboto-Black', color: item.aprobado == 0 ? '#A93331' : '#20A94B', fontSize: heightPercentageToDP('3') }}>{item.aprobado == 0 ? 'Es espera de aprobación' : 'Aprobado'}</Text>
                        </View>
                        <View style={{ alignItems: 'center', justifyContent: 'center', width: widthPercentageToDP('50') }}>
                            <ProgressCircle
                                percent={item.eficiencia}
                                radius={widthPercentageToDP('10')}
                                borderWidth={8}
                                color={item.eficiencia >= 100 ? "#038C65" : "#FF4861"}
                                shadowColor="#EBEDF0"
                                bgColor="#fff"
                            >
                                <Text style={{ fontSize: 18 }}>{+item.eficiencia + '%'}</Text>
                            </ProgressCircle>
                        </View>

                    </View>

                </TouchableOpacity>



                {

                    this.state.seleccionado == index ?

                        <View style={{ paddingTop: heightPercentageToDP('2'), }}>
                            <Button
                                onPress={() => this.confirmation(item.id, item)}
                                titleStyle={{ fontFamily: 'Roboto-Medium', }} buttonStyle={{ backgroundColor: '#FF4861', borderRadius: widthPercentageToDP('2') }} title={'Iniciar Tarea'}></Button>
                        </View>

                        :
                        null
                }





            </Card>
        )
    }

    goToPage(estado, item) {
        switch (estado) {
            case 1:
                this.props.navigation.navigate('Details', { ...item })
                break;
            case 2:
                this.props.navigation.navigate('Production', { ...item })
                break;

            case 3:
                this.props.navigation.navigate('Pausa', { ...item })
                break;
            default:
                break;
        }
    }

    onRefresh() {
        this.setState({ isFetching: true }, function () { this.getData() });
    }



    render() {
        return (
            <View>
                <Header title="TAREAS FINALIZADAS" />
                <View style={{ backgroundColor: '#EBEDF0', height: '100%' }}>
                    <FlatList
                        extraData={this.state}
                        onRefresh={() => this.onRefresh()}
                        refreshing={this.state.isFetching}
                        renderItem={(item, index) => this.renderItem(item, index)}
                        data={this.state.data}
                        keyExtractor={(item, index) => item + index}
                    />
                </View>
            </View>

        );
    }
}

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

export default connect(mapStateToProps, mapDispatchToProps)(Finalizadas)