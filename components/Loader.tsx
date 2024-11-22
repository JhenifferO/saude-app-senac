import React from 'react';
import { View, ActivityIndicator, StyleSheet, Modal } from 'react-native';

const Loader = ({ visible }: { visible: boolean }) => {
    return (
        <Modal transparent visible={visible}>
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#000" />
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
});

export default Loader;
