import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.salmon,
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 8,
  },
  buttonLabel: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 12,
    color: colors.white,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  buttonIcon: {
    width: 10,
    height: 10,
  },

  // Variantes
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.salmon,
  },
  buttonSecondaryLabel: {
    color: colors.salmon,
  },
});
