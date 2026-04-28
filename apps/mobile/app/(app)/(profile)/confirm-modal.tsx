import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { ConfirmModal } from '@screens/profile/components/ConfirmModal/ConfirmModal';
import { supabase } from '@lib/supabase';
import { ImageSourcePropType } from 'react-native';
import { SvgProps } from 'react-native-svg';
import { useState } from 'react';

import SignOutImage from '@assets/session-logout-image.png';
import DeleteAccountIcon from '@assets/icons/profile-exclamation-triangle.svg';
import SuccessIcon from '@assets/icons/success-icon.svg';

const ACTION_IMAGES: Record<string, ImageSourcePropType> = {
  signOut: SignOutImage,
};

const ACTION_SVGS: Record<string, React.FC<SvgProps>> = {
  deleteAccount: DeleteAccountIcon,
  success: SuccessIcon,
};

export default function ConfirmModalRoute() {
  const router = useRouter();
  const navigation = useNavigation();
  const [success, setSuccess] = useState(false);

  const {
    title,
    subtitle,
    confirmLabel,
    action,
    danger,
    successTitle,
    successSubtitle,
    successLabel,
  } = useLocalSearchParams<{
    title: string;
    subtitle?: string;
    confirmLabel: string;
    action: string;
    danger?: string;
    successTitle?: string;
    successSubtitle?: string;
    successLabel?: string;
  }>();

  const handleConfirm = async () => {
    if (action === 'signOut') {
      await supabase.auth.signOut();
      router.back();
    } else if (action === 'deleteAccount') {
      await supabase.rpc('delete_user');
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
      svgImage={ACTION_SVGS[action]}
      onConfirm={handleConfirm}
      onCancel={() => {
        if (!success) router.back();
      }}
      successTitle={successTitle}
      successSubtitle={successSubtitle}
      successLabel={successLabel}
      successSvgImage={ACTION_SVGS['success']}
      onSuccessReached={() => {
        setSuccess(true);
        navigation.setOptions({ gestureEnabled: false });
      }}
      onSuccessDismiss={() => supabase.auth.signOut()}
    />
  );
}
