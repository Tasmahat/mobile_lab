import { Stack } from 'expo-router';

export default function RootLayout() {
    return (<Stack>
        <Stack.Screen name={"index"} options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name={"marker/[id]"} options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name={"+not-found"} options={{ headerShown: false }}></Stack.Screen>
    </Stack>);
}
