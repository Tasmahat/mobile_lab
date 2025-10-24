import React, {useContext, useState} from 'react';
import {Text, Button, ScrollView, Alert, StyleSheet, Image} from "react-native";
import {router, useLocalSearchParams} from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import ImageList from "../../components/ImageList";
import {useAppContext} from "../../components/AppContext";
import {ImageData} from "../../types";

export default function userMarker() {
    const markerId = useLocalSearchParams();
    const {markers, addImageToMarker, deleteImageFromMarker} = useAppContext();

    const marker = markers.find(m => m.id == markerId.id);
    const [imageDatas, setImageDatas] = useState<ImageData[]|undefined>(marker?.images);

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
                    setImageDatas(oldValues => {
                        return oldValues?.filter(value => value.id !== imageToDelete)
                    });
                    deleteImageFromMarker(+markerId.id, imageToDelete)
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
            const imageData : ImageData = {
                id: 0,
                uri: result.assets[0].uri,
            };
            const imageId = addImageToMarker(+markerId.id, imageData)
            setImageDatas([...imageDatas, {...imageData, id : imageId}]);
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
                Широта: {marker?.coordinate.latitude}{"\n"}
                Долгота: {marker?.coordinate.longitude}{"\n"}
            </Text>
            <Button
                onPress={addImage}
                title={"Добавить изображение"}
            />
            <ImageList imageDatas={imageDatas} onImageDelete={(key) => deleteImage(key)}/>
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