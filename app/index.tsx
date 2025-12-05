import React, {useEffect, useState} from 'react';
import MapView, {Region} from 'react-native-maps';
import { StyleSheet, View } from 'react-native';
import MarkerList from "../components/MarkerList";
import {Try} from "expo-router/build/views/Try";
import {MapError} from "../components/MapError";
import {useDatabaseContext} from "../contexts/DatabaseContext";
import {
    Accuracy,
    LocationObject,
    requestBackgroundPermissionsAsync,
    requestForegroundPermissionsAsync, watchPositionAsync
} from "expo-location";
import {Platform} from 'react-native';
import {notificationManager} from '../services/notifications'

export default function Index() {
    const {addMarker, getMarkers, isLoading} = useDatabaseContext();

    const [markers, setMarkers] = useState([]);
    const [location, setLocation] = useState<LocationObject | undefined>(null);
    const [region, setRegion] = useState<Region>({
        latitude: 58.0105,
        longitude: 56.2502,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

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

    useEffect(() => {
        const setupLocation = async () => {
            try {
                await requestLocationPermissions();
                await notificationManager.requestNotificationPermission();
                const locationSubscription = await startLocationUpdates((location) => {
                    console.log("Отслеживание пользователя.")
                    notificationManager.showNotificationForNearbyMarkersAndDeleteForFar(location.coords.latitude, location.coords.longitude, markers);
                    setRegion(prevState => ({
                        ...prevState,
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude
                    }));
                });
            } catch (error) {
                console.log("Unable to get location");
            }
        };

        setupLocation();
    }, []);

    const requestLocationPermissions = async () => {
        const { status } = await requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            throw new Error('Нет разрешения на отслеживание локации');
        }
        if (Platform.OS === 'android') {
            const { status: bgStatus } = await requestBackgroundPermissionsAsync();
            if (bgStatus !== 'granted') {
                console.warn('Нет разрешения на отслеживание локации в фоновом режиме');
            }
        }
    };

    const longPressHandler = async (e) => {
        await addMarker(e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude)
            .then(x => {
                setMarkers([...markers, x]);
                if (notificationManager.isNearToMarker(region.latitude, region.longitude,
                    x.coordinate.latitude, x.coordinate.longitude)) {
                    notificationManager.showNotification(x)
                }
            });
    }

    const startLocationUpdates = async (
        onLocation: (location: LocationObject) => void
    ) => {
        await watchPositionAsync(
            {
                accuracy: Accuracy.Balanced,
                timeInterval: 5000,
                distanceInterval: 5
            },
            onLocation
        );
    };

    return (
        <View style={styles.container}>
            <Try catch={MapError}>
                <MapView style={styles.map}
                         region={region}
                         onLongPress={longPressHandler}
                         onRegionChangeComplete={setRegion}
                         showsUserLocation={true}
                         showsMyLocationButton={true}
                         followsUserLocation={true}
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