export interface MarkerData {
    id: number;
    coordinate: {
        latitude: number,
        longitude: number
    };
    images: ImageData[];
}

export interface ImageData {
    id: number;
    uri: string;
}

export type ParamList = {
    'marker/[id]': {
        id: string,
        latitude: number,
        longitude: number
    };
};