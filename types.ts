export interface MarkerData {
    coordinate: {
        latitude: number,
        longitude: number
    };
}

export interface ImageData {
    uri: string;
}

export type ParamList = {
    'marker/[id]': {
        id: string,
        latitude: number,
        longitude: number
    };
};