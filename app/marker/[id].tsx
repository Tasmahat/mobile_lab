import React, {useState} from 'react';
import {Text, Button, ScrollView, Alert, StyleSheet} from "react-native";
import {router, useLocalSearchParams} from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import ImageList from "../../components/ImageList";

export default function userMarker() {
    const marker = useLocalSearchParams()
    const [imageUris, setImageUris] = useState([])

    const deleteImage = (imageToDelete) => {
        Alert.alert('Удаление', 'Вы действительно хотите удалить данное фото?', [
            {
                text: 'Нет!',
                onPress: () => alert("Изображение не было удалено!"),
                style: "destructive",
            },
            {
                text: 'Да',
                onPress: () => {
                    setImageUris(oldValues => {
                        return oldValues.filter((_, i) => i !== imageToDelete)
                    });
                    alert("Изображение удалено!")
                }
            },
        ]);
    }

    const addImage = async () => {
        let result;
        try {
            result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                quality: 1,
            });
        } catch (e) {
            alert("Произошла ошибка при загрузке фотографии, попробуйте еще раз!")
            return
        }

        if (!result.canceled) {
            setImageUris([...imageUris, result.assets[0].uri])
        }
    }

    return (
        <ScrollView style={styles.mainContainer}>
            <Button
                color={"#8d2424"}
                onPress={() => router.navigate({
                    pathname: '/'
                })}
                title={"Вернуться на главную"}
            />
            <Text style={styles.text}>
                Маркер находится на координатах:{"\n"}
                Широта: {marker.latitude}{"\n"}
                Долгота: {marker.longitude}{"\n"}
            </Text>
            <Button
                onPress={addImage}
                title={"Добавить изображение"}
            />
            <ImageList imageUris={imageUris} onImageDelete={(key) => deleteImage(key)}/>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        marginTop: 50,
    },
    text: {
        marginTop: 40,
        fontSize: 18,
        textAlign: "center"
    }
});