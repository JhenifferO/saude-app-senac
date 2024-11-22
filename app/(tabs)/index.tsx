import ConsultaCard from '@/components/consultaCard'
import Header from '@/components/header'
import SearchBar from '@/components/searchBar'
import { useUser } from '@/context/userContext'
import axios from 'axios'
import { useFocusEffect } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import Toast from 'react-native-toast-message'
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry'

export type Consultas = {
  id: number
  paciente_id: number
  medico_id: number
  medico_nome: string
  paciente_nome: string
  data: Date,
  hora: Date,
  categoria_medico: number
}

export default function Home() {

  const { user } = useUser()

  const [consultas, setConsultas] = useState<Consultas[]>([])

  const getConsultas = async () => {

    if (!user || !user.type) return
    try {
      const { data } = await axios({
        url: user.type === 1 ? `http://192.168.18.41:3000/consultas-paciente/${user.id}` : `http://192.168.18.41:3000/consultas-medico/${user.id}`,
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })

      setConsultas(data)
    } catch (error) {
      console.log('Usuário não encontrado')
    }
  }

  useFocusEffect(
    useCallback(() => {
      getConsultas()
    }, [])
  )

  useEffect(() => {
    Toast.show({
      type: 'success',
      text1: `Bem vindo, ${user?.nome}`,
      visibilityTime: 1000,
      autoHide: true
    })

  })

  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView style={styles.container}>

          <Header />
          <SearchBar />
          <View style={styles.textBox}>
            <Text style={styles.text}>Próximas consultas</Text>
          </View>
          {
            consultas.length > 0 ?
              consultas.map((_, index) => (
                <ConsultaCard isHome={true} getConsultas={getConsultas} key={index} data={_} isMedico={user?.type == 1 ? false : true} />
              ))
              :
              <View>
                <Text>
                  Você não tem consultas agendadas...
                </Text>
              </View>
          }
        </SafeAreaView>
      </GestureHandlerRootView>

    </>

  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    margin: 10,
  },
  textBox: {
    marginTop: 20
  },
  text: {
    fontSize: 18,
    fontWeight: '700',
  }
})
