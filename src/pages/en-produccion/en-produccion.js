import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import apiController from '../../controllers/api-controller';
import { connect } from 'react-redux';
import moment from 'moment'
import { ListItem, Card, Slider } from 'react-native-elements'
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import CircularProgress from './ciurcular';
import ProgressCircle from 'react-native-progress-circle'


class Produccion extends React.Component {

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
                element.fromNow = this.obtenerTiempoTranscurrido(element.hora_inicio_real, element.tiempo_estandar)
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

    obtenerTiempoTranscurrido = (inicio, estandar) => {
    
     
        var now = moment(Date.now());
        var expiration = moment.unix(inicio / 1000).utc();

      

        var fin = moment.unix(inicio / 1000).utc().add(estandar,'seconds');
      

        const diff = fin.diff(now);

        //express as a duration
        const diffDuration = moment.duration(diff);

        

        // display




        return diffDuration.hours() + ':' + diffDuration.minutes() + ':' + diffDuration.seconds()


    }

    renderItem = ({item, index}) => {
        console.log(index)

        return (
            <Card
                titleNumberOfLines={1}

                title={item.producto}
                containerStyle={{ borderRadius: widthPercentageToDP('4') }}>

                <TouchableOpacity onPress={()=> this.setState({seleccionado : this.state.seleccionado == index ? -1 : index})}>
                    <View style={{ flexDirection: 'row', }}>
                        <View style={{ justifyContent: 'center', width: widthPercentageToDP('50') }}>
                            <Text style={{ fontFamily: 'Roboto' }}>Tiempo Restante</Text>
                            <Text style={{ fontFamily: 'Roboto-Black', fontSize: heightPercentageToDP('3') }}>{item.fromNow}</Text>
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
                    
                    this.state.seleccionado == index ?

                        <Text>Seleccionado</Text> :
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
                <FlatList
                    extraData={this.state}
                    onRefresh={() => this.onRefresh()}
                    refreshing={this.state.isFetching}
                    renderItem={(item, index)=>this.renderItem(item, index)}
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