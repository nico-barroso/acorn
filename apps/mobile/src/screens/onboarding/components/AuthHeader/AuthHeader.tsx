import { View, Text } from 'react-native';
import Logo from '@assets/svg/acorn-logo.svg';
import { styles } from './AuthHeader.styles';

type AuthHeaderProps = {
  title?: string;
  subtitle?: string;
};

export default function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <View style={styles.header}>
      <Logo width={112} height={29} />
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}
