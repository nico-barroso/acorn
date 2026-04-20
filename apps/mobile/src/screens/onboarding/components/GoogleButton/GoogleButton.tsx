import { TouchableOpacity, Text, ActivityIndicator, Image } from 'react-native';
import { styles } from './GoogleButton.styles';
import GoogleIcon from '@assets/google-logo.webp';

type GoogleSignInButtonProps = {
  label?: string;
  loading?: boolean;
  disabled?: boolean;
  onPress?: () => void;
};

export default function GoogleSignInButton({
  label = 'Continuar con Google',
  loading = false,
  disabled = false,
  onPress,
}: GoogleSignInButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, (loading || disabled) && styles.buttonDisabled]}
      onPress={onPress}
      activeOpacity={0.75}
      disabled={loading || disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#1F1F1F" />
      ) : (
        <>
          <Image source={GoogleIcon} style={{ width: 20, height: 20 }} />
          <Text style={styles.label}>{label}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}
