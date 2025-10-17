import {ErrorBoundaryProps} from "expo-router";
import {StyleSheet, View} from "react-native";

export function MapError({ error, retry }: ErrorBoundaryProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Ошибка загрузки карты</Text>
            <Text onPress={retry} styles={styles.button}>Попробовать еще раз</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fca631',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 40,
        textAlign: "center"
    },
    button: {
        marginTop: 100,
        fontSize: 25,
        color: '#ffffff',
        textDecorationLine: "underline"
    },
});
