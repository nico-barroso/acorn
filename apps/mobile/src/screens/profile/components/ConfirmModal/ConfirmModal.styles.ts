import { StyleSheet } from 'react-native';
import { colors } from '@theme/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(66,36,25,0.1)',
  },
  handleContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 20,
  },
  handle: {
    width: 81,
    height: 5,
    borderRadius: 100,
    backgroundColor: colors.brownMid,
  },
  image: {
    width: 140,
    height: 140,
    marginBottom: 16,
  },
  title: {
    fontFamily: 'CabinetGrotesk-Bold',
    fontSize: 25,
    color: colors.brown,
    textAlign: 'center',
    marginBottom: 15,
  },
  subtitle: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 16,
    color: colors.brown,
    textAlign: 'center',
    lineHeight: 24,
    letterSpacing: 0.16,
    marginBottom: 40,
    width: 258,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginTop: 8,
    paddingBottom: 20,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: 'rgba(67,40,28,0.8)',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  cancelLabel: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 16,
    color: colors.brown,
    letterSpacing: 0.32,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: colors.salmon,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  confirmButtonDanger: {
    backgroundColor: colors.salmon,
  },
  confirmLabel: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 16,
    color: '#fff',
    letterSpacing: 0.32,
  },
});
