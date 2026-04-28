import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="reset-password" />
      <Stack.Screen name="edit-profile" />
      <Stack.Screen name="delete-account" />
      <Stack.Screen
        name="confirm-modal"
        options={{
          presentation: 'transparentModal',
          animation: 'fade',
          contentStyle: { backgroundColor: 'rgba(0,0,0,0.4)' },
        }}
      />
    </Stack>
  );
}
