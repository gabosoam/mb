import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Alert,
    ScrollView,
    TextInput,
    FlatList,
    Image,
    Button
} from 'react-native';

import { Header } from 'react-native-elements'

import firebase from 'react-native-firebase';

import ImagePicker from 'react-native-image-picker';




export default class ChatScrean extends Component {

    constructor(props) {
        super(props);







       // this.ref = firebase.firestore().collection('Chat').doc(this.props.user.uid).collection('mensajes');
        this.unsubscribe = null;

        this.state = {


            textInput: '',

            loading: true,
            data: []
        };



    }

    componentDidMount() {
   /*      this.unsubscribe = this.ref.orderBy('date', 'desc').onSnapshot((collection) => {
            var newData = []
            collection.forEach(doc => {
                var data = doc.data()
                newData.push({ type: data.type, message: data.message, date: '09:00 ', imageUrl: this.obtenerUrl(data) })
            });
            this.setState({ data: newData })
        }, (error => {

        })); */

    }

    componentWillUnmount() {
     //   this.unsubscribe();
    }



    subirFoto(archivo) {


        firebase.storage().ref('/imagenes/' + archivo.filename).putFile(archivo.path)




            .on(
                'state_changed',
                snapshot => {



                },
                err => {
                    console.log(err);

                },
                uploadedFile => {
                    this.enviarImagen(uploadedFile.downloadURL)

                }
            );

    }

    enviarImagen(url) {


        this.ref.add({
            message: '',
            date: new Date(),
            type: 'out',
            imageUrl: url
        });

        this.setState({
            textInput: '',
        });

    }

    tomarFoto() {
        const options = {
            title: 'Select Avatar',
            customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };










        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {

                const source = { uri: response.uri, filename: response.fileName, path: response.path };
                this.subirFoto(source),





                    // You can also display the image using data:
                    // const source = { uri: 'data:image/jpeg;base64,' + response.data };

                    this.setState({
                        avatarSource: source,
                    });
            }
        })
    }




    addTodo() {





        this.ref.add({
            message: this.state.textInput,
            date: new Date(),
            type: 'out'
        });

        this.setState({
            textInput: '',
        });


    }

    CerrarSesion() {


        firebase.auth().signOut()
            .then(resultado => console.log(resultado))
            .catch(error => console.log(error))
    }

    obtenerChats() {





        this.ref.onSnapshot((snap) => {
            this.setState({ data: [] });


            const newData = []

            snap.forEach((doc) => {



                const { message, date } = doc;

                newData.push({
                    message: message,
                    date: date
                });

            })

            this.setState({ data: newData })




        }, erro => {


        })

    }

    obtenerUrl(item) {
        if (item.imageUrl) {
            return item.imageUrl;
        } else {
            return '';
        }


    }












    renderDate = (date) => {
        return (
            <Text style={styles.time}>
                {date}
            </Text>

        );
    }

    renderImage = (item) => {


        return item.imageUrl ? (
            <Image

                style={{ width: 350, height: 350 }}
                source={{ uri: item.imageUrl }}

            />


        )

            :

            null
    }

    render() {


        return (
            <View style={styles.container}>
                <Header
                    leftComponent={{ icon: 'menu', color: '#fff' }}
                    centerComponent={{ text: 'CHAT', style: { color: '#fff' } }}
                    rightComponent={{ icon: 'home', color: '#fff', onPress: () => this.CerrarSesion() }}


                />



                <FlatList style={styles.list}
                    data={this.state.data}
                    inverted={true}





                    keyExtractor={(item) => {
                        return item.id;
                    }}
                    renderItem={(message) => {
                        console.log(item);
                        const item = message.item;
                        let inMessage = item.type === 'in';
                        let itemStyle = inMessage ? styles.itemIn : styles.itemOut;
                        return (
                            <View style={[styles.item, itemStyle]}>
                                {!inMessage && this.renderDate(item.date)}
                                <View style={[styles.balloon]}>
                                    <Text>{item.message}</Text>

                                    {this.renderImage(item)}



                                </View>
                                {inMessage && this.renderDate(item.date)}
                            </View>
                        )
                    }} />
                <View style={styles.footer}>
                    <View style={styles.inputContainer}>
                        <TextInput style={styles.inputs}
                            placeholder="Write a message..."
                            defaultValue={this.state.textInput}
                            underlineColorAndroid='transparent'
                            onSubmitEditing={() => this.addTodo()}
                            autoFocus={true}


                            onChangeText={(message) => this.setState({ textInput: message })} />

                    </View>

                    <TouchableOpacity
                        style={styles.btnSend} onPress={() => this.tomarFoto()}



                    >

                        <Image source={{ uri: "https://png.icons8.com/small/75/ffffff/filled-sent.png" }} style={styles.iconSend} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    list: {
        paddingHorizontal: 17,
    },
    footer: {
        flexDirection: 'row',
        height: 60,
        backgroundColor: '#eeeeee',
        paddingHorizontal: 10,
        padding: 5,
    },
    btnSend: {
        backgroundColor: "#00BFFF",
        width: 40,
        height: 40,
        borderRadius: 360,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconSend: {
        width: 30,
        height: 30,
        alignSelf: 'center',
    },
    inputContainer: {
        borderBottomColor: '#F5FCFF',
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 10,
    },
    inputs: {
        height: 40,
        marginLeft: 16,
        borderBottomColor: '#FFFFFF',
        flex: 1,
    },
    balloon: {
        maxWidth: 250,
        padding: 15,

    },
    itemIn: {
        alignSelf: 'flex-start'
    },
    itemOut: {
        alignSelf: 'flex-end'
    },
    time: {
        alignSelf: 'flex-end',
        margin: 15,
        fontSize: 12,
        color: "#808080",
    },
    item: {
        marginVertical: 14,
        flex: 1,
        flexDirection: 'row',
        backgroundColor: "#eeeeee",

        padding: 5,
    },
});  