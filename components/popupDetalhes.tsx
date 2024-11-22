import React, { useState } from 'react'
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native'
import { PartialConsultas } from './consultaCard'
import AntDesign from '@expo/vector-icons/AntDesign';


type PopupEdicaoProps = {
    visible: boolean
    onClose: () => void
    consulta: PartialConsultas
    onSubmit: () => void
}

export default function PopupDetalhes({ visible, onClose, consulta, onSubmit }: PopupEdicaoProps) {

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContent}>
                    <View style={styles.container}>
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontWeight: '500', fontSize: 20, marginBottom: 20 }}>Detalhes da Consulta</Text>
                            <TouchableOpacity onPress={() => onClose()}>
                                <AntDesign name="closecircleo" size={24} color="black" />
                            </TouchableOpacity>
                        </View>
                        <Text style={{ fontWeight: '700', fontSize: 18, marginBottom: 30 }}>{consulta.paciente_nome}</Text>
                        <Text>Data: {new Date(consulta.data).toLocaleDateString()} às {new Date(consulta.hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</Text>
                        <View>
                            <TouchableOpacity style={styles.botao_login} onPress={() => onSubmit()}>
                                <Text style={{ color: '#fff', textAlign: 'center' }}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    )
}
const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    botao_login: {
        backgroundColor: '#000',
        padding: 8,
        borderRadius: 5,
        width: 140,
        marginTop: 40,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    container: {
        marginTop: 20,
        height: 260,
        display: 'flex',
        flexDirection: 'column',
    },
    dropdownButtonStyle: {
        height: 40,
        borderRadius: 4,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
        borderColor: '#ccc',
        borderBottomWidth: 1
    },
    dropdownButtonTxtStyle: {
        flex: 1,
        color: '#151E26',
    },
    dropdownButtonArrowStyle: {
        fontSize: 28,
    },
    dropdownButtonIconStyle: {
        fontSize: 28,
        marginRight: 8,
    },
    dropdownMenuStyle: {
        backgroundColor: '#E9ECEF',
        borderRadius: 8,
    },
    dropdownItemStyle: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
    },
    dropdownItemTxtStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '500',
        color: '#151E26',
    },
    dropdownItemIconStyle: {
        fontSize: 28,
        marginRight: 8,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        paddingHorizontal: 8,
        borderRadius: 4,
        borderBottomWidth: 1
    },
    dateTimeContainer: {
        display: 'flex',
        flexDirection: 'row',
        width: 120,
        justifyContent: 'space-between',
        alignItems: 'center'
    }
});


