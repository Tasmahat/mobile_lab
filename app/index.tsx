import React, {useEffect, useState} from 'react';
import MapView from 'react-native-maps';
import { StyleSheet, View } from 'react-native';
import MarkerList from "../components/MarkerList";
import {Try} from "expo-router/build/views/Try";
import {MapError} from "../components/MapError";
import {useDatabaseContext} from "../contexts/DatabaseContext";

export default function Index() {
    const {addMarker, getMarkers, isLoading} = useDatabaseContext();

    const [markers, setMarkers] = useState([]);

    useEffect(() => {
        const loadMarkers = async () => {
            try {
                const markersFromDb = await getMarkers();
                setMarkers(markersFromDb)
            } catch (error) {
                console.log("Ошибка загрузки маркеров", error);
            }
        }

        if (!isLoading) {
            loadMarkers()
        }
    }, [isLoading]);

    const longPressHandler = (e) => {
        addMarker(e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude)
            .then(x => setMarkers([...markers, x]));
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