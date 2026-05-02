import { StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';

export const styles = StyleSheet.create({
  tag: {
    alignSelf: 'flex-start',
    borderRadius: 24,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 10,
    color: colors.white,
    letterSpacing: 0.2,
  },
});
