import ConsultaForm from '@/components/consultaForm'
import Header from '@/components/header'
import SearchBar from '@/components/searchBar'
import { useEffect, useState } from 'react'
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Consultas } from '.'
import { useUser } from '@/context/userContext'
import axios from 'axios'
import ConsultaCard from '@/components/consultaCard'

export default function ConsultasAgendadas() {
  const { user } = useUser()
  const [tab, setTab] = useState<'nova' | 'agendada'>(user?.type === 1 ? 'nova' : 'agendada')
  const [consulta, setConsultas] = useState<Consultas[]>([])

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

  useEffect(() => {
    getConsultas()
  }, [])

  const renderComponent = () => {
    switch (tab) {
      case 'nova':
        return <ConsultaForm setTab={setTab} getConsultas={getConsultas} />
      case 'agendada':
        return <>
          {
            consulta.length > 0 ?
              consulta.map((_, index) => (
                <ConsultaCard isHome={false} getConsultas={getConsultas} key={index} data={_} isMedico={user?.type == 1 ? false : true} />
              ))
              :
              <View>
                <Text>
                  Você não tem consultas agendadas...
                </Text>
              </View>
          }
        </>
      default: <><Text>Nova</Text></>
        break
    }
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <Header />
        <SearchBar />
        <View style={styles.tabs}>
          {
            user?.type === 1 ?
              <TouchableOpacity onPress={() => setTab('nova')} style={tab === 'nova' ? styles.activeTab : styles.tabButton}>
                <Text style={tab === 'nova' ? styles.activeText : styles.tabText}>Nova</Text>
              </TouchableOpacity>
              : null
          }
          <TouchableOpacity onPress={() => setTab('agendada')} style={tab === 'agendada' ? styles.activeTab : styles.tabButton}>
            <Text style={tab === 'agendada' ? styles.activeText : styles.tabText}>Agendadas</Text>
          </TouchableOpacity>
        </View>
        <View>
          {renderComponent()}
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
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
  },
  tabs: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 20,
  },
  tabButton: {
    backgroundColor: '#f2f2f2',
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#000',
    padding: 10,
    borderRadius: 10,
    width: 120
  },
  tabText: {
    color: '#000',
    textAlign: 'center'
  },
  activeText: {
    color: '#fff',
    textAlign: 'center'
  },
  activeTab: {
    backgroundColor: '#000',

    marginRight: 10,
    padding: 10,
    borderRadius: 10,
    width: 120,
  }
})
