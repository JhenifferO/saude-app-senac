import React, { useState } from 'react'
import {
    Modal,
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    TouchableOpacity,
} from 'react-native'
import { PartialConsultas } from './consultaCard'
import { MaterialIcons, Fontisto } from "@expo/vector-icons"
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import AntDesign from '@expo/vector-icons/AntDesign';

type PopupEdicaoProps = {
    visible: boolean
    onClose: () => void
    onSubmit: () => void
    consulta: PartialConsultas
    setConsulta: React.Dispatch<React.SetStateAction<PartialConsultas>>
}

export default function PopupEdicao({ visible, onClose, onSubmit, consulta, setConsulta }: PopupEdicaoProps) {
    const [showTimePicker, setShowTimePicker] = useState(false)
    const [showDataPicker, setShowDataPicker] = useState(false)

    const handleTime = (e: DateTimePickerEvent, value: Date) => {
        if (e.type === 'set') {
            setShowTimePicker(false)
            setConsulta({ ...consulta, hora: value || new Date })
            return
        }
        setShowTimePicker(false)
    }

    const handleDate = (e: DateTimePickerEvent, value: Date) => {
        if (e.type === 'set') {
            setShowDataPicker(false)
            setConsulta({ ...consulta, data: value || new Date })
            return
        }
        setShowDataPicker(false)
    }
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
                        <View style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                            <TouchableOpacity onPress={() => onClose()}>
                                <AntDesign name="closecircleo" size={24} color="black" />
                            </TouchableOpacity>
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Paciente"
                            value={`Paciente: ${consulta.paciente_nome}`}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Médico"
                            value={`Médico: ${consulta.medico_nome}`}
                        />
                        <View style={{ borderBottomWidth: 1, borderColor: '#ccc', padding: 10, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity onPress={() => setShowDataPicker(true)}>
                                <View style={styles.dateTimeContainer}>
                                    <Fontisto name="date" size={20} color="black" />
                                    <Text>{new Date(consulta.data).toLocaleDateString()}</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setShowTimePicker(true)}>
                                <View style={styles.dateTimeContainer}>
                                    <MaterialIcons name="schedule" size={24} color="black" />
                                    <Text>{new Date(consulta.hora).toLocaleTimeString()}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <Button color={'#000'} title={'Concluir'} onPress={() => onSubmit()} />
                        </View>
                        {
                            showDataPicker &&
                            <DateTimePicker
                                textColor="black"
                                value={new Date(consulta.data)}
                                mode="date"
                                onChange={(e, date) => handleDate(e, date!)}
                            />
                        }
                        {
                            showTimePicker &&
                            <DateTimePicker
                                textColor="black"
                                value={new Date(consulta.hora)}
                                mode="time"
                                onChange={(e, time) => handleTime(e, time!)}
                            />
                        }

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
        justifyContent: 'space-between'
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


