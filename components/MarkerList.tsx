import {router} from "expo-router";
import {Marker} from "react-native-maps";
import React from "react";
import { View } from 'react-native';
import {MarkerData} from "../types";

export default function MarkerList({markerDatas} : MarkerData[]) {
    return(
        <View>
            {markerDatas.map(markerData =>
                <Marker
                    key={markerData.id}
                    coordinate={markerData.coordinate}
                    tappable={true}
                    onPress={() => router.navigate({
                        pathname: 'marker/[id]',
                        params: {
                            id: markerData.id,
                            latitude: markerData.coordinate.latitude,
                            longitude: markerData.coordinate.longitude
                        }
                    })}
                />
            )}
        </View>
    )
}