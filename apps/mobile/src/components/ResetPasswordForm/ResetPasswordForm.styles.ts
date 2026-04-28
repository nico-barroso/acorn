import { StyleSheet } from 'react-native';

const BROWN = '#48392A';
const PRIMARY = '#C06E52';
const ERROR = '#F96F5D';
const BG = '#FFFCFB';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BG,
  },
  root: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
    gap: 20,
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    fontSize: 16,
    color: '#1B1B1B',
    fontFamily: 'Satoshi-Regular',
    letterSpacing: 0.32,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: BROWN,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 11,
    opacity: 0.9,
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: 'rgba(72,57,42,0.8)',
    fontFamily: 'Satoshi-Regular',
    letterSpacing: 0.18,
    minHeight: 24,
  },
  inputError: {
    color: 'rgba(249,111,93,0.9)',
  },
  eyeBtn: {
    paddingLeft: 8,
  },
  eyeIcon: {
    fontSize: 18,
  },
  errorMsg: {
    fontSize: 16,
    color: ERROR,
    fontFamily: 'Satoshi-Regular',
    letterSpacing: 0.32,
  },
  button: {
    backgroundColor: PRIMARY,
    borderRadius: 8,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Satoshi-Bold',
  },
});
