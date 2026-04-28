import { useRouter } from 'expo-router';
import EditProfileScreen from '@screens/profile/UserProfile/UserProfile';

export default function EditProfileRoute() {
  const router = useRouter();
  return <EditProfileScreen onGoBack={() => router.back()} />;
}
