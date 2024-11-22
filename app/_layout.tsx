import { UserProvider } from '@/context/userContext'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {

  const _boolean = true
  return (
    <UserProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {
          _boolean ?
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            :
            <Stack.Screen name="index" options={{ headerShown: false }} />
        }
      </Stack>
    </UserProvider>
  )
}
