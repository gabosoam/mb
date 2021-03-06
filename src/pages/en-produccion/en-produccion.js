import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native'
import apiController from '../../controllers/api-controller';
import { connect } from 'react-redux';
import moment from 'moment'
import { ListItem, Card, Slider, Button } from 'react-native-elements'
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import CircularProgress from './ciurcular';
import ProgressCircle from 'react-native-progress-circle'
import Header from '../home/components/header';

class Produccion extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            data: [],
            isFetching: false,
            seleccionado: -1,
            pausas: [],
            asignacion : -1
        }

        this.getData();
        this.getPausas();
    }

    getPausas = () => {


        apiController.get('motivo?estado=true')
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({ pausas: [] })
                var pausas = []
            
                responseJson.forEach(pausa => {
                    pausas.push({ text: pausa.descripcion, onPress: () => this.iniciarTarea( pausa.id, this.props.navigation.state.params) })
                });
                this.setState({ pausas: pausas })
            })
            .catch((error) => {
                console.log(error)


            });


    }

    confirmation = (id) => {

        Alert.alert(
            'Seleccionar motivo de la pausa',
            'Recuerda que al seleccionar un motivo la tarea se pausará',
            this.state.pausas,
            { cancelable: true },
        );
    }

    confirmationFinalizar = (id) => {

        Alert.alert(
            'Finalizar tarea',
            'Recuerda que al finalizar una tarea el jefe de taller tendrá que aprobar la labor realizada',
            [
                {
                    text: 'Cancelar',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: 'Iniciar', onPress: () => this.finalizarTarea(id) },
            ],
            { cancelable: true },
        );
    }

    iniciarTarea = ( motivo, item) => {


        apiController.get('asignacion/pausartarea?asignacion=' + this.state.asignacion + "&motivo=" + motivo)
            .then((response) => response.json())
            .then((responseJson) => {
                this.getData()
            })
            .catch((error) => {
                console.log(error)


            });
    }

    finalizarTarea = (asignacion) => {


        apiController.get('asignacion/finalizartarea?asignacion=' + asignacion)
            .then((response) => response.json())
            .then((responseJson) => {
                this.getData()
            })
            .catch((error) => {
                console.log(error)


            });
    }

    confirmationReanudar = (item) => {

        const secs = item.tiempo_estandar;

        const formatted = moment.utc(secs * 1000).format('HH:mm:ss');

        Alert.alert(
            '¿Seguro que deseas reinicar la tarea?',
            'El tiempo transcurrirá al presionar el botón Reanudar',
            [
                {
                    text: 'Cancelar',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: 'Reanudar', onPress: () => this.ReanudarTarea(item) },
            ],
            { cancelable: true },
        );
    }

    ReanudarTarea = (item) => {


        apiController.get('asignacion/reanudartarea?asignacion=' + item.id+"&pausa="+item.id_pausa)
            .then((response) => response.json())
            .then((responseJson) => {
                this.getData()
                
            })
            .catch((error) => {
                console.log(error)


            });
    }







    getData = () => {
        apiController.get('asignacion/vistalist?usuario=' + this.props.user.user.persona.id)
            .then((response) => response.json())
            .then((responseJson) => {

                console.log(responseJson.filter(item => item.estado ==3))

                responseJson.forEach(element => {
                    element.fromNow = ''
                    element.calendar = ''
                    element.color = ''

                });

                this.setState({
                    data: responseJson.filter(item => item.estado == 2 || item.estado == 3),
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
                element.color = this.obtenerColor(element)
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
        var expiration = moment.unix(element.hora_inicio_real / 1000).utc().add(element.tiempo_estandar, 'seconds');

        return expiration.fromNow()
    }

    obtenerCalendar = (element) => {
        var expiration = moment.unix(element.hora_inicio_real / 1000).utc().add(element.tiempo_estandar, 'seconds');
        return expiration.calendar()
    }

    obtenerColor = (element) => {
        var expiration = moment.unix(element.hora_inicio_real / 1000).utc().add(element.tiempo_estandar, 'seconds');
        var color = ''
        expiration.isBefore() ? color = '#A93331' : color = '#20A94B'
        return color
    }

    renderItem = ({ item, index }) => {


        return (
            <Card
                titleNumberOfLines={1}

                title={item.producto}
                containerStyle={{ borderRadius: widthPercentageToDP('4') }}>

                <TouchableOpacity onPress={() => this.setState({ seleccionado: this.state.seleccionado == index ? -1 : index, asignacion : item.id})}>
                    <View style={{ flexDirection: 'row', }}>
                        <View style={{ justifyContent: 'center', width: widthPercentageToDP('50') }}>
                            <Text style={{ fontFamily: 'Roboto' }}>{'Finalizar: ' + item.calendar}</Text>
                            <Text style={{ fontFamily: 'Roboto-Black', color: item.color, fontSize: heightPercentageToDP('3') }}>{item.fromNow}</Text>

                            <Text style={{ fontFamily: 'Roboto' }}>{'Estado: '}</Text>
                            <Text style={{ fontFamily: 'Roboto-Black', fontSize: heightPercentageToDP('3') }}>{item.estado == 2 ? 'En producción' : 'En pausa por: '+item.motivo_pausa}</Text>
                        </View>


                        <View style={{ alignItems: 'center', justifyContent: 'center', width: widthPercentageToDP('50') }}>
                            <ProgressCircle
                                percent={30}
                                radius={widthPercentageToDP('10')}
                                borderWidth={8}
                                color="#FF4861"
                                shadowColor="#EBEDF0"
                                bgColor="#fff"
                            >
                                <Text style={{ fontSize: 18 }}>{'30%'}</Text>
                            </ProgressCircle>
                        </View>

                    </View>

                </TouchableOpacity>



                {

                    this.state.seleccionado == index && item.estado == 2 ?

                        <View>
                            <View style={{ paddingTop: heightPercentageToDP('2'), }}>
                                <Button
                                    onPress={() => this.confirmation(item.id)}
                                    titleStyle={{ fontFamily: 'Roboto-Medium', }} buttonStyle={{ backgroundColor: '#3D527A', borderRadius: widthPercentageToDP('2') }} title={'Pausar Tarea'}></Button>
                            </View>
                            <View style={{ paddingTop: heightPercentageToDP('2'), }}>
                                <Button
                                    onPress={() => this.confirmationFinalizar(item.id)}
                                    titleStyle={{ fontFamily: 'Roboto-Medium', }} buttonStyle={{ backgroundColor: '#FF4861', borderRadius: widthPercentageToDP('2') }} title={'Finalizar Tarea'}></Button>
                            </View>
                        </View>

                        :
                        null
                }

                {

                    this.state.seleccionado == index && item.estado == 3 ?

                        <View>
                            <View style={{ paddingTop: heightPercentageToDP('2'), }}>
                                <Button
                                    onPress={() => this.confirmationReanudar(item)}
                                    titleStyle={{ fontFamily: 'Roboto-Medium', }} buttonStyle={{ backgroundColor: '#3D527A', borderRadius: widthPercentageToDP('2') }} title={'Reanudar Tarea'}></Button>
                            </View>

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
            <View style={{ backgroundColor: '#EBEDF0', height: '100%' }}>
                 <Header title="TAREAS EN PRODUCCIÓN" />
                <FlatList
                    extraData={this.state}
                    onRefresh={() => this.onRefresh()}
                    refreshing={this.state.isFetching}
                    renderItem={(item, index) => this.renderItem(item, index)}
                    data={this.state.data}
                    keyExtractor={(item, index) => item + index}
                />
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

export default connect(mapStateToProps, mapDispatchToProps)(Produccion)