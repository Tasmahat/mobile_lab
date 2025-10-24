import React, {useContext, useState} from 'react';
import MapView from 'react-native-maps';
import { StyleSheet, View } from 'react-native';
import MarkerList from "../components/MarkerList";
import {Try} from "expo-router/build/views/Try";
import {MapError} from "../components/MapError";
import AppContext, {useAppContext} from "../components/AppContext";
import {MarkerData} from "../types";

export default function Index() {
    const {markers, addMarker} = useAppContext();

    const longPressHandler = (e) => {
        const markerData: MarkerData = {
            id: 0,
            coordinate : {
                latitude: e.nativeEvent.coordinate.latitude,
                longitude: e.nativeEvent.coordinate.longitude
            },
            images: []
        }
        addMarker(markerData);
    }

    return (
        <View style={styles.container}>
            <Try catch={MapError}>
                <MapView style={styles.map}
                         onLongPress={longPressHandler}
                         initialRegion={{
                             latitude: 58.0105,
                             longitude: 56.2502,
                             latitudeDelta: 0.0922,
                             longitudeDelta: 0.0421,
                         }}
                >
                    <MarkerList markerDatas={markers}/>
                </MapView>
            </Try>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%',
    },
});