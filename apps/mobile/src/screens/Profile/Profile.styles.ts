import { StyleSheet } from 'react-native';

import { colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(27, 27, 27, 0.45)',
    justifyContent: 'flex-end',
  },
  panel: {
    maxHeight: '90%',
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontFamily: 'CabinetGrotesk-Bold',
    fontSize: 24,
    color: colors.brown,
  },
  closeLabel: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 14,
    color: colors.salmon,
  },
  subtitle: {
    marginBottom: 12,
    fontFamily: 'Satoshi-Regular',
    fontSize: 13,
    color: colors.brownMid,
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: `${colors.brown}18`,
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  row: {
    gap: 4,
  },
  label: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 12,
    color: colors.brownMid,
  },
  value: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 14,
    color: colors.black,
  },
  actions: {
    marginTop: 14,
    gap: 8,
  },
  error: {
    marginTop: 10,
    color: '#8b2a1b',
    fontFamily: 'Satoshi-Regular',
    fontSize: 12,
  },
});
