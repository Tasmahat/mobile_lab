import {MarkerData} from "../types";
import {
    cancelScheduledNotificationAsync, dismissNotificationAsync,
    requestPermissionsAsync,
    scheduleNotificationAsync,
    setNotificationHandler
} from "expo-notifications";

interface ActiveNotification {
    markerId: number;
    notificationId: string;
    timestamp: number;
}

const PROXIMITY_THRESHOLD = 100;

class NotificationManager {
    private activeNotifications: Map<number, ActiveNotification>;

    constructor() {
        setNotificationHandler({
            handleNotification: async () => ({
                shouldPlaySound: false,
                shouldSetBadge: false,
                shouldShowBanner: true,
                shouldShowList: true,
            }),
        });
        this.activeNotifications = new Map();
    }

    public async showNotificationForNearbyMarkersAndDeleteForFar(userLatitude: number, userLongitude: number, markers: MarkerData[]) {
        markers.forEach(marker => {

            if (this.isNearToMarker(userLatitude, userLongitude,
                    marker.coordinate.latitude, marker.coordinate.longitude)) {
                    this.showNotification(marker);
                } else {
                    this.removeNotification(marker.id)
                }
            }
        )
    }

    async showNotification(marker: MarkerData): Promise<void> {
        if (this.activeNotifications.has(marker.id)) {
            return;
        }

        let notificationId;

        try {
            notificationId = await scheduleNotificationAsync({
                content: {
                    title: "Вы рядом с меткой!",
                    body: "Вы находитесь рядом с сохранённой точкой.",
                },
                trigger: null // Уведомление отправляется сразу
            });
        } catch (error) {
            console.log("Unable to set notification")
        }

        this.activeNotifications.set(marker.id, {
            markerId: marker.id,
            notificationId,
            timestamp: Date.now()
        });
    }

    async removeNotification(markerId: number): Promise<void> {
        const notification = this.activeNotifications.get(markerId);
        if (notification) {
            await cancelScheduledNotificationAsync(notification.notificationId);
            await dismissNotificationAsync(notification.notificationId);
            this.activeNotifications.delete(markerId);
        }
    }

    isNearToMarker(lat1: number, long1: number, lat2: number, long2: number): boolean {
        const R = 6378.137 * 1000;
        const b1 = (lat1 * Math.PI) / 180;
        const b2 = (lat2 * Math.PI) / 180;
        const b3 = ((lat2 - lat1) * Math.PI) / 180;
        const b4 = ((long2 - long1) * Math.PI) / 180;

        const a =
            Math.sin(b3 / 2) * Math.sin(b3 / 2) +
            Math.cos(b1) * Math.cos(b2) * Math.sin(b4 / 2) * Math.sin(b4 / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        console.log( R * c)
        return R * c < PROXIMITY_THRESHOLD;
    }

    requestNotificationPermission = async () => {
        try {
            const {status} = await requestPermissionsAsync();
            if (status !== 'granted') {
                console.log('No notification permission');
            }
        } catch (error) {
            console.log('Error getting notification permission')
        }
    }
}

export const notificationManager = new NotificationManager();
