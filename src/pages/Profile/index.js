import React, { useContext, useState } from 'react';
import { View, StyleSheet, StatusBar, Text, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header2 from '../../components/Header2'
import { Avatar, Divider, Button, TextInput } from 'react-native-paper';
import { Feather, Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../contexts/auth'
import firebase from '../../../services/firebase';


export default function Profile() {

    const { user } = useContext(AuthContext)
    const navigation = useNavigation()

    const [bio1, setBio1] = useState(user.bio);
    const [formacao1, setFormacao1] = useState(user.formacao);
    const [show, setShow] = useState(true);
    const [modal, setModal] = useState(false);

    const changeShow = () => {
        setShow(previousState => !previousState);
    }

    function addedOrPart() {
        if (user.tipo == 'Professor') {
            return (
                <TouchableOpacity onPress={() => {  navigation.navigate('MyProjects') }} style={styles.button}>
                    <Text style={{ marginTop: '1%', fontWeight: 'bold', color: 'white' }}>Projetos que cadastrei</Text>
                </TouchableOpacity>
            )
        } else {
            return (
                <TouchableOpacity onPress={() => { navigation.navigate('MyProjects')}} style={styles.button}>
                    <Text style={{ marginLeft: '1%', fontWeight: 'bold', color: 'white' }}>Projetos que me inscrevi</Text>
                </TouchableOpacity>
            )
        }
    }

    const alterarInfo = () => {
        if (bio1 !== '' && formacao1 !== '') {
            firebase
                .database()
                .ref("users")
                .once("value", (snapshot) => {
                    snapshot.forEach((usuario) => {

                        if (user.id === usuario.val().uid) {
                            firebase.database().ref(`users/${user.id}`).update({
                                bio: bio,
                                formacao: formacao
                            });
                            alert(`DADOS ATUALIZADOS ${user.nome}`)
                        }
                    });
                })
            changeShow();
        } else {
            alert('Preencha todos os campos')
        }
    }

    return (
        <View style={styles.container}>
            <StatusBar
                backgroundColor={'#420680'}
            />
            <Header2 titulo={user.nome} />
            <ScrollView style={styles.scroll}>
                <View style={styles.personContainer}>
                    <Avatar.Image size={100} source={{ uri: user.url }} />
                    <View style={{ marginLeft: '5%' }}>
                        <Text style={styles.name}>{user.nome}</Text>
                        <Text style={styles.user}>{user.usuario}</Text>
                    </View>
                    <TouchableOpacity onPress={() => { setModal(!modal) }} style={{ backgroundColor: '#6d0ad6', padding: 10, borderRadius: 40, marginLeft: '20%' }}>
                        <Feather name="edit" size={14} color="white" />
                    </TouchableOpacity>
                </View>
                <Modal
                    visible={modal}
                    animationType={'slide'}

                >
                    <View style={styles.header}>
                        <Text style={styles.texto}>Editando o perfil</Text>
                    </View>
                    <Divider style={styles.divisor} />

                    <Text style={styles.txt4}>Sua Bio:</Text>

                    <TextInput
                        mode='outlined'
                        theme={{ colors: { primary: 'black', underlineColor: 'transparent', } }}
                        style={styles.TextInt}
                        placeholder="Bio"
                        placeholderTextColor="black"
                        autoCorrect={false}
                        autoCapitalize="none"
                        value={bio1}
                        disabled={show}
                        onChangeText={(text) => setBio1(text)}
                    />


                    <Text style={styles.txt5}>Áreas de formação:</Text>



                    <TextInput
                        mode='outlined'
                        theme={{ colors: { primary: 'black', underlineColor: 'transparent', } }}
                        style={styles.TextInt2}
                        placeholder="Formação"
                        placeholderTextColor="black"
                        autoCorrect={false}
                        autoCapitalize="none"
                        value={formacao1}
                        disabled={show}
                        onChangeText={(text) => setFormacao1(text)}
                    />

                    <Button styles={'color:black;'} mode="outlined" style={styles.btn} onPress={() => changeShow()}>
                        <Text style={styles.txt6}>Editar</Text>
                    </Button>

                    <Button styles={'color:black;'} mode="outlined" style={styles.btn2} onPress={() => alterarInfo()}>
                        <Text style={styles.txt6}>Salvar</Text>
                    </Button>

                    <Divider style={styles.divisor3} />
                    <TouchableOpacity onPress={() => { setModal(!modal) }} style={styles.closeButton}>
                        <Feather name="x" size={24} color="white" />
                    </TouchableOpacity>
                </Modal>
                <View style={styles.bioContainer}>
                    <Text style={{ marginRight: '93%', fontWeight: 'bold', fontSize: 16, color: '#6d0ad6' }}>Bio:</Text>
                    <Text style={{ textAlign: 'justify' }}>{user.bio}</Text>
                </View>
                <View style={{
                    borderBottomWidth: 1.5,
                    borderBottomColor: '#6d0ad6',
                    paddingBottom: 10
                }}>
                    <Text style={{ margin: '3%', fontWeight: 'bold', fontSize: 16, color: '#6d0ad6' }}>Campus atuante e contato:</Text>
                    <TouchableOpacity style={styles.info} onPress={() => Linking.openURL('mailto:' + user.email + '?subject=&body=')}>
                        <Ionicons color={'#6d0ad6'} name="mail-outline" size={25} />
                        <Text style={{ marginLeft: '1%', fontWeight: 'bold' }}>{user.email}</Text>
                    </TouchableOpacity>
                    <View style={styles.info}>
                        <Ionicons name="school-outline" color={'#6d0ad6'} size={25} />
                        <Text style={{ marginLeft: '1%', fontWeight: 'bold' }}>{user.escola}</Text>
                    </View>
                </View>
                {addedOrPart()}
            </ScrollView>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 2,
        alignItems: 'center',
        backgroundColor: 'white',
        justifyContent: 'space-around'
    },
    scroll: {
        display: 'flex',
        flex: 1,
        width: '100%'
    },
    personContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1.5,
        borderBottomColor: '#6d0ad6',
        padding: '5%'
    }, name: {
        fontWeight: 'bold',
        fontSize: 24,
        color: '#6d0ad6'
    }, user: {
        fontSize: 16,
        fontStyle: 'italic',
        color: 'black'
    }, info: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: '3%'
    }, bioContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderBottomWidth: 1.5,
        borderBottomColor: '#6d0ad6',
        padding: '5%'
    }, closeButton: {
        backgroundColor: '#6d0ad6',
        padding: 10,
        borderRadius: 40,
        marginLeft: '20%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '60%'
    },
    header: {
        width: "100%",
        flexDirection: 'row',
        backgroundColor: '#6d0ad6',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    texto: {
        fontSize: 24,
        textAlign: 'center',
        margin: '3%',
        color: '#fff',
        fontWeight: 'bold'
    }, button: {
        backgroundColor: '#6d0ad6',
        padding: 10,
        borderRadius: 40,
        marginTop: '5%',
        marginLeft: '20%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '60%'
    }
})