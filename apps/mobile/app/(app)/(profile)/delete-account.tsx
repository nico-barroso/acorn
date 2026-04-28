import { useRouter } from 'expo-router';
import DeleteAccountScreen from '@screens/profile/DeleteAccount/DeleteAccount';

export default function DeleteAccountRoute() {
  const router = useRouter();
  return <DeleteAccountScreen onBack={() => router.back()} />;
}
