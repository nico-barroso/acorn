import { View, Text } from 'react-native';
import { styles } from './Divider.styles';

export default function Divider({ label = 'o continúa con' }) {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.label}>{label}</Text>
      <View style={styles.line} />
    </View>
  );
}
