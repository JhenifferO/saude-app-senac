import { useEffect, useMemo, useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { TextInput } from "react-native-gesture-handler"
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import SelectDropdown from 'react-native-select-dropdown'
import { MaterialIcons, Fontisto } from "@expo/vector-icons"
import { useUser } from "@/context/userContext";
import { MedicosCategorias } from "@/app";
import axios from "axios";
import Loader from "./Loader";
import Toast from "react-native-toast-message";

type FormConsulta = {
    paciente_id: string,
    categoria: number | null,
    data: Date,
    hora: Date,
    medico_id: number | null
}

export type Medicos = {
    id: number,
    user_id: number,
    nome: string,
    categoria: number,
}

type ConsultaFormProps = {
    getConsultas: () => void
    setTab: React.Dispatch<React.SetStateAction<"nova" | "agendada">>
}

export default function ConsultaForm({ getConsultas, setTab }: ConsultaFormProps) {
    const { user } = useUser()
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState<FormConsulta>({
        paciente_id: user?.id,
        categoria: null,
        data: new Date,
        hora: new Date,
        medico_id: null
    })
    const [medicosCategorias, setMedicosCategorias] = useState<MedicosCategorias[]>([])
    const [medicos, setMedicos] = useState<Medicos[]>([])
    const [showTimePicker, setShowTimePicker] = useState(false)
    const [showDataPicker, setShowDataPicker] = useState(false)

    const getMedicosCategorias = async () => {

        try {
            const { data } = await axios({
                url: 'http://192.168.18.41:3000/medicos-categorias',
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            })

            setMedicosCategorias(data)
        } catch (error) {
            console.log(error)
        }
    }

    const getMedicos = async () => {

        try {
            const { data } = await axios({
                url: 'http://192.168.18.41:3000/medicos',
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            })

            setMedicos(data)
        } catch (error) {
            console.log(error)
        }
    }

    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

    const agendarConsultas = async () => {

        if (!form.categoria || !form.medico_id || !form.data || !form.hora) {
            Toast.show({
                type: 'info',
                text1: 'Preencha todos os campos',
                visibilityTime: 2000,
                autoHide: true
            })
            return
        }
        setLoading(true)
        await delay(1000)
        try {
            let { categoria, ...data } = form

            await axios({
                url: 'http://192.168.18.41:3000/consultas',
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                data: data
            })
            Toast.show({
                type: 'success',
                text1: 'Consulta agendada com sucesso',
                visibilityTime: 2000,
                autoHide: true
            })

            getConsultas()

            setForm({
                paciente_id: user?.id,
                categoria: 0,
                data: new Date,
                hora: new Date,
                medico_id: 0
            })

            setTab('agendada')

        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Não foi possível agendar a consulta',
                visibilityTime: 2000,
                autoHide: true
            })
            console.log(error)
        }
        setLoading(false)
    }

    useEffect(() => {
        getMedicosCategorias()
        getMedicos()
    }, [])

    const categorias = useMemo<{ id: number, title: string }[]>(() => {
        if (!medicosCategorias.length) return []
        return medicosCategorias.map((item) => ({ id: item.id, title: item.nome }))
    }, [medicosCategorias])

    const medicosPorCategoria = useMemo<{ id: number, title: string }[]>(() => {
        if (form.categoria === 0 || !medicos.length) return [{ id: 0, title: 'Escolha uma especialidade' }]

        const _medicos = medicos
            .filter((item) => item.categoria === form.categoria)
            .map((_) => ({ id: _.id, title: _.nome }))

        if (_medicos.length > 0) return _medicos
        return [{ id: 0, title: 'Sem médicos para essa especialidade' }]
    }, [medicos, form.categoria])

    const handleTime = (e: DateTimePickerEvent, value: Date) => {
        if (e.type === 'set') {
            setShowTimePicker(false)
            setForm({ ...form, hora: value || new Date })
            return
        }
        setShowTimePicker(false)
    }

    const handleDate = (e: DateTimePickerEvent, value: Date) => {
        if (e.type === 'set') {
            setShowDataPicker(false)
            setForm({ ...form, data: value || new Date })
            return
        }
        setShowDataPicker(false)
    }


    return (
        <View style={styles.container}>
            <Toast />
            <Loader visible={loading} />
            <TextInput
                style={styles.input}
                placeholder="Paciente"
                value={`Paciente: ${user?.nome}`}
            />
            <SelectDropdown
                data={categorias}
                onSelect={(selectedItem, index) => setForm({ ...form, categoria: selectedItem.id })}
                renderButton={(selectedItem) => {
                    return (
                        <View style={styles.dropdownButtonStyle}>
                            <Text style={styles.dropdownButtonTxtStyle}>
                                {(selectedItem && selectedItem.title) || 'Escolha uma especialidade'}
                            </Text>
                        </View>
                    );
                }}
                renderItem={(item, index, isSelected) => {
                    return (
                        <View style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                            <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
                        </View>
                    );
                }}
                showsVerticalScrollIndicator={false}
                dropdownStyle={styles.dropdownMenuStyle}
            />
            <SelectDropdown
                data={medicosPorCategoria}
                onSelect={(selectedItem, index) => {
                    setForm({ ...form, medico_id: selectedItem.id })
                }}
                renderButton={(selectedItem) => {
                    return (
                        <View style={styles.dropdownButtonStyle}>
                            <Text style={styles.dropdownButtonTxtStyle}>
                                {(selectedItem && selectedItem.title) || 'Escolha um médico'}
                            </Text>
                        </View>
                    );
                }}
                renderItem={(item, index, isSelected) => {
                    return (
                        <View style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                            <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
                        </View>
                    );
                }}
                showsVerticalScrollIndicator={false}
                dropdownStyle={styles.dropdownMenuStyle}
            />
            <View style={{ borderBottomWidth: 1, borderColor: '#ccc', padding: 10, display: 'flex', flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => setShowDataPicker(true)} style={{ marginRight: 300 }}>
                    <View style={styles.dateTimeContainer}>
                        <Fontisto name="date" size={20} color="black" />
                        <Text>{form.data.toLocaleDateString()}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowTimePicker(true)}>
                    <View style={styles.dateTimeContainer}>
                        <MaterialIcons name="schedule" size={24} color="black" />
                        <Text>{form.hora.toLocaleTimeString()}</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View>
                <Button color={'#000'} title={'Agendar'} onPress={() => agendarConsultas()} />
            </View>
            {
                showDataPicker &&
                <DateTimePicker
                    textColor="black"
                    value={form.data}
                    mode="date"
                    onChange={(e, date) => handleDate(e, date!)}
                />
            }
            {
                showTimePicker &&
                <DateTimePicker
                    textColor="black"
                    value={form.hora}
                    mode="time"
                    onChange={(e, time) => handleTime(e, time!)}
                />
            }

        </View>
    )
}

const styles = StyleSheet.create({
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
})