import { useRouter } from 'expo-router';
import LoginScreen from '@screens/onboarding/Login/Login';

export default function LoginRoute() {
  const router = useRouter();

  return (
    <LoginScreen
      onGoToRegister={() => router.push('/(auth)/register')}
      onGoToForgotPassword={() => router.push('/(auth)/forgot-password')}
    />
  );
}
