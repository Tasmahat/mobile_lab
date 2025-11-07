import React, {createContext, ReactNode, useContext, useState} from "react";
import {MarkerData} from "../types";

interface AppContextType {
    markers: MarkerData[];
    addMarker: (markerData: MarkerData) => void;
    addImageToMarker: (markerId: number, imageData: ImageData) => number;
    deleteImageFromMarker: (markerId : number, imageId : number) => void;
}

const AppContext = createContext<AppContextType|undefined>(undefined);

const AppProvider = ({ children }) => {
    const [markers, setMarkers] = useState([]);
    const [markerId, setMarkerId] = useState(0);
    const [imageId, setImageId] = useState(0);

    const addMarker = (markerData) => {
        setMarkers([...markers, {...markerData, id : markerId}])
        setMarkerId(markerId + 1)
    }

    const addImageToMarker = (markerId, imageData) => {
        setMarkers((prev) =>
            prev.map((marker) => marker.id == markerId ? {...marker, images: [...marker.images, {...imageData, id : imageId}]} : marker)
        )
        setImageId(imageId + 1)
        return imageId
    }

    const deleteImageFromMarker = (markerId, imageId) => {
        setMarkers((prev) =>
            prev.map((marker) => marker.id == markerId ? {
                ...marker,
                images: marker.images.filter((value => value.id !== imageId))
            } : marker)
        )
    }

    return (
        <AppContext.Provider value={{markers, addMarker, addImageToMarker, deleteImageFromMarker}}>
            {children}
        </AppContext.Provider>
    );
};

export default AppProvider;

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useMarkers must be used within MarkerProvider");
    }
    return context;
};