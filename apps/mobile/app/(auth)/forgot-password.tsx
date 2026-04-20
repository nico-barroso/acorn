import { useRouter } from 'expo-router';
import ForgotPasswordScreen from '@screens/onboarding/ForgotPassword/ForgotPassword';

export default function ForgotPasswordRoute() {
  const router = useRouter();

  return <ForgotPasswordScreen onGoToLogin={() => router.replace('/(auth)/login')} />;
}
