import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";

export default function SearchBar() {
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder={'Procurar...'}
                placeholderTextColor={'#D8D8DD'}
            />
            <MaterialIcons name={'search'} size={24} color="#000" style={styles.icon} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#D8D8DD',
        borderRadius: 5,
        paddingLeft: 10,
        backgroundColor: 'white',
        marginTop: 20
    },
    icon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        height: 40,
    },
})
