import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    gap: 6,
  },

  // Label
  label: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 16,
    color: colors.brownMid,
    letterSpacing: 0.32,
    lineHeight: 20,
  },

  // Campo
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.brownMid,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    opacity: 0.9,
  },
  inputWrapperFocused: {
    borderColor: colors.salmon,
    opacity: 1,
  },
  inputWrapperError: {
    borderColor: '#F96F5D',
    opacity: 1,
  },
  input: {
    flex: 1,
    fontFamily: 'Satoshi-Regular',
    fontSize: 18,
    color: colors.brown,
    letterSpacing: 0.18,
    lineHeight: 24,
    padding: 0, // evita padding interno en Android
  },
  inputError: {
    color: 'rgba(249, 111, 93, 0.9)',
  },

  // Icono clear
  clearButton: {
    marginLeft: 8,
    padding: 2,
  },
  clearIcon: {
    fontSize: 18,
    color: colors.brownMid,
  },

  // Mensaje de error
  errorText: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 16,
    color: '#F96F5D',
    letterSpacing: 0.32,
    lineHeight: 20,
  },
});
