import { View, StyleSheet, Text } from 'react-native';
import { Link } from 'expo-router';

export default function NotFoundScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Произошла ошибка. Страница не найдена!</Text>
            <Link href="/" style={styles.button}>
                Вернутся на главную страницу
            </Link>
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
