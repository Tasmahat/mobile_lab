import {ImageData, MarkerData} from "../types";
import React, {createContext, useContext, useEffect, useState} from "react";
import * as SQLite from 'expo-sqlite';
import {initDatabase} from "../database/schema";
import {SQLiteDatabase} from "expo-sqlite";

interface DatabaseContextType {
    // Операции с базой данных
    addMarker: (latitude: number, longitude: number) => Promise<MarkerData>;
    deleteMarker: (id: number) => Promise<void>;
    getMarkers: () => Promise<MarkerData[]>;
    addImage: (markerId: number, uri: string) => Promise<ImageData>;
    deleteImage: (id: number) => Promise<void>;
    getMarkerImages: (markerId: number) => Promise<ImageData[]>;

    // Статусы
    isLoading: boolean;
    error: Error | null;
}

const DatabaseContext = createContext<DatabaseContextType | null>(null);

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        initDatabase()
            .then(setDb)
            .catch(setError)
            .finally(() => setIsLoading(false));

        return () => {
            db?.closeAsync()
        };
    }, []);

    const addMarker = async (latitude: number, longitude: number) => {
        if (db instanceof SQLiteDatabase) {
            let row = await db.getFirstAsync<{ id : number }>(`select max(id) as id from markers`)
            let markerId;
            if (row) {
                markerId = await row?.id == null ? 1 : row.id + 1
            }
            await db.runAsync(`insert into markers(id, latitude, longitude, created_at) values (?, ?, ?, ?)`,
                markerId, latitude, longitude, new Date().toLocaleString())
            return {
                id: markerId,
                coordinate: {
                    latitude: latitude,
                    longitude: longitude
                },
                images: []
            }
        } else {
            console.error('Ошибка вставки маркера в базу данных');
        }
    }

    const deleteMarker = async (id: number) => {
        if (db instanceof SQLiteDatabase) {
            await db.withTransactionAsync(async () => {
                await db.runAsync(`delete from marker_images where marker_id = ?`, id)
                await db.runAsync(`delete from markers where id = ?`, id)
            })
        } else {
            console.error('Ошибка удаления маркера из базы данных');
        }
    };

    const getMarkers = async () => {
        if (db instanceof SQLiteDatabase) {
            let markers : MarkerData[] = []
            const allRows = await db.getAllAsync(`select id, latitude, longitude from markers`)
            for (const row of allRows) {
                markers.push({
                    id : row.id,
                    coordinate: {
                        latitude: row.latitude,
                        longitude: row.longitude
                    },
                    images: []
                })
            }
            return markers
        } else {
            console.error('Ошибка выбора маркеров из базы данных');
        }
    }

    const addImage = async (markerId: number, uri: string) => {
        if (db instanceof SQLiteDatabase) {
            let row = await db.getFirstAsync<{id : number}>(`select max(id) as id from marker_images`)
            let imageId;
            if (row) {
                imageId = await row?.id == null ? 1 : row.id + 1
            }
            await db.runAsync(`insert into marker_images(id, marker_id, uri, created_at) values (?, ?, ?, ?)`,
                imageId, markerId, uri, new Date().toLocaleString())
            return {
                id:imageId,
                uri:uri
            }
        } else {
            console.error('Ошибка вставки изображения в базу данных');
        }
    }

    const deleteImage = async (id: number) => {
        if (db instanceof SQLiteDatabase) {
            await db.runAsync(`delete from marker_images where id = ?`, id)
        } else {
            console.error('Ошибка удаления изображения из базы данных');
        }
    };

    const getMarkerImages = async (markerId: number) => {
        if (db instanceof SQLiteDatabase) {
            let images : ImageData[] = []
            const allRows = await db.getAllAsync(`select id, uri, created_at from marker_images where marker_id = ?`, markerId)
            for (const row of allRows) {
                images.push({
                    id: row.id,
                    uri: row.uri
                })
            }
            return images
        } else {
            console.error('Ошибка выбора изображений маркера из базы данных');
        }
    };

    return (
        <DatabaseContext.Provider value={{addMarker, deleteMarker, getMarkers, addImage, deleteImage, getMarkerImages, isLoading, error}}>
            {children}
        </DatabaseContext.Provider>
    );
};

export const useDatabaseContext = () => {
    const context = useContext(DatabaseContext);
    if (!context) {
        throw new Error("useDatabaseContext must be used within DatabaseProvider");
    }
    return context;
};