
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { GestureHandlerRootView, TextInput } from 'react-native-gesture-handler'
import { MaterialIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useEffect, useMemo, useState } from 'react'
import SelectDropdown from 'react-native-select-dropdown'
import axios from 'axios'
import { useUser } from '@/context/userContext'
import Loader from '@/components/Loader'
import Toast from 'react-native-toast-message';

type Login = {
    email: string
    senha: string
}

type credenciaisObrigatoriasType = {
    email: boolean
    senha: boolean
}

type Cadastro = {
    email: string
    senha: string
    nome: string
    type: number | null
    categoria?: number | null
}

export type MedicosCategorias = {
    id: number
    nome: string
}

export default function Login() {

    const router = useRouter()
    const { user, setUser } = useUser()

    const [isLogin, setIsLogin] = useState(true)
    const [loading, setLoading] = useState(false)
    const [credenciaisInvalidas, setCredenciaisInvalidas] = useState(false)
    const [cadastroCamposObrigatorios, setCadastroCamposObrigatorios] = useState(false)
    const [credenciaisObrigatorias, setCredenciaisObrigatorias] = useState<credenciaisObrigatoriasType>({
        email: false,
        senha: false
    })
    const [medicosCategorias, setMedicosCategorias] = useState<MedicosCategorias[]>([])

    const [login, setLogin] = useState<Login>({
        email: '',
        senha: ''
    })

    const [cadastro, setCadastro] = useState<Cadastro>({
        email: '',
        senha: '',
        nome: '',
        type: null,
        categoria: null
    })

    const categorias = useMemo(() => {
        if (!medicosCategorias.length) return
        return medicosCategorias.map((item) => ({ id: item.id, title: item.nome }))
    }, [medicosCategorias])

    const checkCredenciais = () => {
        if (!login.email && !login.senha) {
            setCredenciaisObrigatorias({
                email: true,
                senha: true
            })
            return false
        }

        if (!login.email && login.senha) {
            setCredenciaisObrigatorias({
                email: true,
                senha: false
            })
            return false
        }

        if (login.email && !login.senha) {
            setCredenciaisObrigatorias({
                email: false,
                senha: true
            })
            return false
        }
        return true
    }

    useEffect(() => {
        setTimeout(() => {
            setCredenciaisObrigatorias((_credenciaisObrigatorias) => {
                return {
                    email: false,
                    senha: false
                }
            })
        }, 4000)
    }, [credenciaisObrigatorias])

    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

    const handleLogin = async () => {

        const proceed = checkCredenciais()

        if (!proceed) return

        setLoading(true)

        await delay(1000)

        try {
            const { data } = await axios({
                url: 'http://192.168.18.41:3000/login',
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                data: login
            })
            setLoading(false)
            setUser(data)
            setLogin({
                email: '',
                senha: ''
            })

            Toast.show({
                type: 'success',
                text1: `Bem vindo, ${user?.nome}`,
                visibilityTime: 1000,
                autoHide: true
            })

            router.push('/(tabs)/')


        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Não foi realizar o login',
                visibilityTime: 1000,
                autoHide: true
            })
            setCredenciaisInvalidas(true)
            console.log('Usuário não encontrado')
        }
        setLoading(false)
    }

    const checkCredenciaisCadastro = () => {
        if ((!cadastro.email || !cadastro.nome || !cadastro.senha || !cadastro.type) || (cadastro.type === 2 && !cadastro.categoria)) {
            setCadastroCamposObrigatorios(true)
            return false
        }
        return true
    }

    const handleCadastro = async () => {
        const proceed = checkCredenciaisCadastro()

        if (!proceed) return

        setLoading(true)

        await delay(1000)

        try {
            const { data } = await axios({
                url: 'http://192.168.18.41:3000/usuarios',
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                data: {
                    type: cadastro.type,
                    login: cadastro.email,
                    senha: cadastro.senha
                }
            })

            await axios({
                url: cadastro.type === 1 ? 'http://192.168.18.41:3000/pacientes' : 'http://192.168.18.41:3000/medicos',
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                data: cadastro.type === 1 ? {
                    user_id: data.id,
                    nome: cadastro.nome,
                }
                    :
                    {
                        user_id: data.id,
                        nome: cadastro.nome,
                        categoria: cadastro.categoria
                    }
            })

            setIsLogin(true)
            setLoading(false)
            setCadastro({
                email: '',
                senha: '',
                nome: '',
                type: null,
                categoria: null
            })
            Toast.show({
                type: 'success',
                text1: 'Cadastro criado com sucesso',
                visibilityTime: 1000,
                autoHide: true
            })
        } catch (error) {
            setLoading(false)
            console.log(error)
            Toast.show({
                type: 'error',
                text1: 'Não foi possível realizar o cadastro',
                visibilityTime: 1000,
                autoHide: true
            })
        }

    }

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

    useEffect(() => {
        getMedicosCategorias()
    }, [])

    useEffect(() => {
        if (credenciaisInvalidas) {
            setTimeout(() => {
                setCredenciaisInvalidas(false)
            }, 3000)
            return
        }
        return
    }, [credenciaisInvalidas])

    useEffect(() => {
        if (cadastroCamposObrigatorios) {
            setTimeout(() => {
                setCadastroCamposObrigatorios(false)
            }, 4000)
            return
        }
        return
    }, [cadastroCamposObrigatorios])

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={styles.container}>
                <Toast />
                <Loader visible={loading} />
                {
                    isLogin ?
                        <View style={styles.box}>
                            <View style={styles.titleContainer}>
                                <MaterialIcons name="health-and-safety" size={36} color="black" />
                                <Text style={styles.title}>HealthMen</Text>
                            </View>
                            <TextInput
                                style={credenciaisObrigatorias.email ? styles.input_fail : styles.input}
                                placeholder="Nome de usuário"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                placeholderTextColor={'#D8D8DD'}
                                value={login.email}
                                onChangeText={(value) => setLogin((_login) => ({ ..._login, email: value }))}
                            />
                            <TextInput
                                style={credenciaisObrigatorias.senha ? styles.input_fail : styles.input}
                                placeholder="Senha"
                                secureTextEntry
                                placeholderTextColor={'#D8D8DD'}
                                value={login.senha}
                                onChangeText={(value) => setLogin((_login) => ({ ..._login, senha: value }))}
                            />
                            {
                                credenciaisInvalidas ?
                                    <Text style={{ fontSize: 11, color: 'red', textAlign: 'center' }}>Email ou senha inválidos</Text>
                                    :
                                    null
                            }
                            <Text style={styles.forgotPassword}>Esqueceu a senha?</Text>
                            <TouchableOpacity style={styles.botao_login} onPress={() => handleLogin()}>
                                <Text style={styles.texto_botao}>Entrar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setIsLogin(false)}>
                                <Text style={styles.registerText}>Não tem uma conta? Cadastrar</Text>
                            </TouchableOpacity>
                        </View>
                        :
                        <View style={styles.box}>
                            <View style={styles.titleContainer}>
                                <MaterialIcons name="health-and-safety" size={36} color="black" />
                                <Text style={styles.title}>HealthMen</Text>
                            </View>
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                placeholderTextColor={'#D8D8DD'}
                                value={cadastro.email}
                                onChangeText={(value) => setCadastro((_cadastro) => ({ ..._cadastro, email: value }))}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Senha"
                                secureTextEntry
                                placeholderTextColor={'#D8D8DD'}
                                value={cadastro.senha}
                                onChangeText={(value) => setCadastro((_cadastro) => ({ ..._cadastro, senha: value }))}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Nome completo"
                                placeholderTextColor={'#D8D8DD'}
                                autoCapitalize="none"
                                onChangeText={(value) => setCadastro((_cadastro) => ({ ..._cadastro, nome: value }))}
                            />
                            <View style={{ marginBottom: 15 }}>
                                <SelectDropdown
                                    data={[{ id: 1, title: 'Paciente' }, { id: 2, title: 'Médico' }]}
                                    onSelect={(selectedItem, index) => {
                                        setCadastro((_cadastro) => ({ ..._cadastro, type: selectedItem.id }))
                                    }}
                                    renderButton={(selectedItem) => {
                                        return (
                                            <View style={styles.dropdownButtonStyle}>
                                                <Text style={styles.dropdownButtonTxtStyle}>
                                                    {(selectedItem && selectedItem.title) || 'Tipo de usuário'}
                                                </Text>
                                            </View>
                                        );
                                    }}
                                    renderItem={(item, index, isSelected) => {
                                        return (
                                            <View style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                                                <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
                                            </View>
                                        )
                                    }}
                                    showsVerticalScrollIndicator={false}
                                    dropdownStyle={styles.dropdownMenuStyle}
                                />
                            </View>
                            {
                                cadastro.type === 2 &&
                                <View style={{ marginBottom: 15 }}>
                                    <SelectDropdown
                                        data={categorias || []}
                                        onSelect={(selectedItem, index) => {
                                            setCadastro((_cadastro) => ({ ..._cadastro, categoria: selectedItem.id }))
                                        }}
                                        renderButton={(selectedItem) => {
                                            return (
                                                <View style={styles.dropdownButtonStyle}>
                                                    <Text style={styles.dropdownButtonTxtStyle}>
                                                        {(selectedItem && selectedItem.title) || 'Especialidade'}
                                                    </Text>
                                                </View>
                                            );
                                        }}
                                        renderItem={(item, index, isSelected) => {
                                            return (
                                                <View style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                                                    <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
                                                </View>
                                            )
                                        }}
                                        showsVerticalScrollIndicator={false}
                                        dropdownStyle={styles.dropdownMenuStyle}
                                    />
                                </View>

                            }
                            {
                                cadastroCamposObrigatorios ?
                                    <Text style={{ fontSize: 11, color: 'red', textAlign: 'center', marginBottom: 10 }}>Todos os campos são obrigatórios</Text>
                                    :
                                    <></>
                            }

                            <TouchableOpacity style={styles.botao_login} onPress={() => handleCadastro()}>
                                <Text style={styles.texto_botao}>Cadastrar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setIsLogin(true)}>
                                <Text style={styles.registerText}>Login</Text>
                            </TouchableOpacity>
                        </View>
                }
            </SafeAreaView>
        </GestureHandlerRootView>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    box: {
        width: '100%',
        maxWidth: 400,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    input: {
        height: 40,
        borderColor: '#D8D8DD',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        paddingHorizontal: 10,
    },
    input_fail: {
        borderColor: 'red',
        height: 40,
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        paddingHorizontal: 10,
    },
    forgotPassword: {
        marginVertical: 10,
        textAlign: 'right',
        color: '#000',
    },
    registerText: {
        marginTop: 15,
        textAlign: 'center',
        color: '#000',
    },
    titleContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'center',
        padding: 40
    },
    title: {
        fontSize: 30
    },
    botao_login: {
        backgroundColor: '#000',
        padding: 10,
        borderRadius: 5,
    },
    texto_botao: {
        color: '#fff',
        textAlign: 'center'
    },
    dropdownButtonStyle: {
        height: 40,
        borderRadius: 4,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
        borderColor: '#ccc',
        borderWidth: 1
    },
    dropdownButtonTxtStyle: {
        flex: 1,
        color: '#ccc',
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
        borderColor: '#D8D8DD',
        borderRadius: 8,
        marginBottom: 15,
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
})
