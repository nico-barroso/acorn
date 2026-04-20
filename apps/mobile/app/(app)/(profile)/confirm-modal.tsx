import { useLocalSearchParams, useRouter } from 'expo-router';
import { ConfirmModal } from '@screens/profile/components/ConfirmModal/ConfirmModal';
import { supabase } from '@lib/supabase';
import { ImageSourcePropType } from 'react-native';

const ACTION_IMAGES: Record<string, ImageSourcePropType> = {
  signOut: require('@assets/session-logout-image.png'),
  deleteAccount: require('@assets/acorn-empty-state.png'),
};

export default function ConfirmModalRoute() {
  const router = useRouter();
  const { title, subtitle, confirmLabel, action, danger } = useLocalSearchParams<{
    title: string;
    subtitle?: string;
    confirmLabel: string;
    action: string;
    danger?: string;
  }>();

  const handleConfirm = async () => {
    router.back();
    if (action === 'signOut') {
      await supabase.auth.signOut();
    } else if (action === 'deleteAccount') {
      // TODO: implementar
    }
  };

  return (
    <ConfirmModal
      visible
      title={title}
      subtitle={subtitle}
      confirmLabel={confirmLabel}
      danger={danger === 'true'}
      image={ACTION_IMAGES[action]}
      onConfirm={handleConfirm}
      onCancel={() => router.back()}
    />
  );
}
