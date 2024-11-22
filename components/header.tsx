import { MaterialIcons } from "@expo/vector-icons"
import { StyleSheet, Text, View } from "react-native"
import EvilIcons from '@expo/vector-icons/EvilIcons'

export default function Header() {
    return (
        <View style={styles.container}>
            <View>
                <MaterialIcons name="menu" size={24} color="black" />
            </View>
            <View>
                <Text style={styles.title}>HealthMen</Text>
            </View>
            <View style={styles.avatar}>
                <EvilIcons name="user" size={40} color="black" />
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 10,
        backgroundColor: '#fff',
        shadowColor: 'rgba(0,0,0,0.4)',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
    },
    title: {
        fontSize: 20,
    },
    avatar: {
        width: 34,
        height: 30,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
})