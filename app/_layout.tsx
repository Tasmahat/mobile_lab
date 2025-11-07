import { Stack } from 'expo-router';
import {DatabaseProvider} from "../contexts/DatabaseContext";

export default function RootLayout() {
    return (
        <DatabaseProvider>
            <Stack>
                <Stack.Screen name={"index"} options={{ headerShown: false }}></Stack.Screen>
                <Stack.Screen name={"marker/[id]"} options={{ headerShown: false }}></Stack.Screen>
                <Stack.Screen name={"+not-found"} options={{ headerShown: false }}></Stack.Screen>
            </Stack>
        </DatabaseProvider>
    );
}
