import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Consultas } from '@/app/(tabs)';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { MedicosCategorias } from '@/app';
import PopupEdicao from './popupEdicao';
import PopupDetalhes from './popupDetalhes';
import Loader from './Loader';
import Entypo from '@expo/vector-icons/Entypo';

type ConsultaCard = {
    data: Consultas[]
    isMedico: boolean
    getConsultas: () => void
    isHome: boolean
}

export type PartialConsultas = Pick<Consultas, 'id' | 'hora' | 'data' | 'paciente_nome' | 'medico_nome'>

export default function ConsultaCard({ isHome, data, isMedico, getConsultas }: any) {
    const [loading, setLoading] = useState(false)
    const [medicosCategorias, setMedicosCategorias] = useState<MedicosCategorias[]>([])
    const [openModal, setOpenModal] = useState(false)
    const [openDetails, setOpenDetails] = useState(false)
    const [consulta, setConsulta] = useState<PartialConsultas>({
        id: data.id,
        data: data.data,
        hora: data.hora,
        paciente_nome: data.paciente_nome,
        medico_nome: data.medico_nome
    })

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

    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

    const editarConsulta = async () => {

        setLoading(true)
        await delay(1000)
        try {
            await axios({
                url: `http://192.168.18.41:3000/consultas/${consulta.id}`,
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                data: {
                    data: consulta.data,
                    hora: consulta.hora
                }
            })

            getConsultas()
            setOpenModal(false)
        } catch (error) {
            console.log(error)
        }
        setLoading(false)
    }

    const deletarConsulta = async () => {
        setLoading(true)
        await delay(1000)
        try {
            await axios({
                url: `http://192.168.18.41:3000/consultas/${consulta.id}`,
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            })
            setOpenDetails(false)
            getConsultas()

        } catch (error) {
            console.log(error)
        }
        setLoading(false)
    }

    useEffect(() => {
        getMedicosCategorias()
    }, [])

    return (
        <View style={styles.container}>
            <Loader visible={loading} />
            <View style={styles.details}>
                <FontAwesome5 name="book-medical" size={24} color="black" />
                {
                    isMedico ?
                        <View>
                            <Text style={styles.text}>{data.paciente_nome} - {new Date(data.data).toLocaleDateString('pt-BR')} - {new Date(data.hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</Text>
                        </View>
                        :
                        <View>
                            <Text style={styles.text}>{data.medico_nome}</Text>
                            <Text style={styles.text}>{medicosCategorias.find((_) => _.id === data.categoria_medico)?.nome} - {new Date(data.data).toLocaleDateString('pt-BR')} - {new Date(data.hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</Text>
                        </View>
                }
            </View>
            {
                isHome ?
                    null
                    : <>
                        {
                            isMedico ?
                                <TouchableOpacity style={styles.botao_login} onPress={() => setOpenDetails(true)}>
                                    <Text style={styles.texto_botao}>Detalhes</Text>
                                </TouchableOpacity>
                                :
                                <View style={styles.button_actions}>
                                    <TouchableOpacity onPress={() => setOpenModal(true)}>
                                        <Entypo name="edit" size={24} color="black" />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => deletarConsulta()}>
                                        <FontAwesome name="trash" size={24} color="black" />
                                    </TouchableOpacity>

                                </View>
                        }
                    </>
            }
            {
                openModal ?
                    <PopupEdicao
                        visible={openModal}
                        onClose={() => setOpenModal(false)}
                        onSubmit={editarConsulta}
                        consulta={consulta}
                        setConsulta={setConsulta}
                    />
                    :
                    null
            }

            {
                openDetails ?
                    <PopupDetalhes
                        onSubmit={deletarConsulta}
                        visible={openDetails}
                        onClose={() => setOpenDetails(false)}
                        consulta={consulta}
                    />
                    :
                    null
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 20,
        backgroundColor: '#D3D3D3',
        padding: 16,
        borderRadius: 5
    },
    details: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    botao_login: {
        backgroundColor: '#000',
        padding: 8,
        borderRadius: 5,
        width: 80
    },
    texto_botao: {
        color: '#fff',
        textAlign: 'center'
    },
    text: {
        marginLeft: 15,
        fontWeight: '600'
    },
    button_actions: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        width: 60,
        justifyContent: 'space-between',
        alignContent: 'center'
    }
})
