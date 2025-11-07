import React, {useEffect, useState} from 'react';
import {Text, Button, ScrollView, Alert, StyleSheet, View} from "react-native";
import {router, useLocalSearchParams} from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import ImageList from "../../components/ImageList";
import {ImageData} from "../../types";
import {useDatabaseContext} from "../../contexts/DatabaseContext";

export default function userMarker() {
    const marker = useLocalSearchParams();
    const {deleteMarker, addImage, deleteImage, getMarkerImages, isLoading} = useDatabaseContext();

    const [images, setImages] = useState<ImageData[]>([]);

    useEffect(() => {
        const loadImages = async () => {
            try {
                const imagesFromDb = await getMarkerImages(+marker.id);
                setImages(imagesFromDb)
            } catch (error) {
                console.log("Ошибка загрузки изображений", error);
            }
        }

        if (!isLoading) {
            loadImages()
        }
    }, [isLoading]);

    const deleteMarkerFromMap = () => {
        deleteMarker(+marker.id).then(() => {
            router.navigate({
                pathname: '/'
            });
            alert("Маркер был удален!")
        });
    }

    const deleteImageFromMarker = (imageToDelete) => {
        Alert.alert('Удаление', 'Вы действительно хотите удалить данное фото?', [
            {
                text: 'Нет!',
                onPress: () => alert("Изображение не было удалено!"),
                style: "destructive",
            },
            {
                text: 'Да',
                onPress: () => {
                    setImages(oldValues => {
                        return oldValues.filter(value => value.id !== imageToDelete)
                    });
                    deleteImage(+imageToDelete)
                    alert("Изображение удалено!")
                }
            },
        ]);
    }

    const addImageToMarker = async () => {
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
            addImage(+marker.id, result.assets[0].uri)
                .then(x => setImages([...images, x]));
        }
    }

    return (
        <ScrollView style={styles.mainContainer}>
            <Button
                color={"#f59205"}
                onPress={() => router.navigate({
                    pathname: '/'
                })}
                title={"Вернуться на главную"}
            />
            <View style={styles.mainBlock}>
                <Button
                    color={"#b70909"}
                    onPress={deleteMarkerFromMap}
                    title={"Удалить маркер"}
                />
                <Text style={styles.text}>
                    Маркер находится на координатах:{"\n"}
                    Широта: {marker.latitude}{"\n"}
                    Долгота: {marker.longitude}{"\n"}
                </Text>
                <Button
                    onPress={addImageToMarker}
                    title={"Добавить изображение"}
                />
                <ImageList imageDatas={images} onImageDelete={(key) => deleteImageFromMarker(key)}/>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        marginTop: 50,
    },
    text: {
        marginTop: 20,
        fontSize: 18,
        textAlign: "center"
    },
    mainBlock: {
        marginTop: 50
    }
});