import { StyleSheet } from 'react-native';
import { colors } from '../../../../theme/colors';

export const styles = StyleSheet.create({
  pill: {
    backgroundColor: 'transparent',
    borderRadius: 20,
    paddingHorizontal: 25,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: colors.brownMid,
  },
  pillActive: {
    backgroundColor: colors.salmon,
    borderColor: 'transparent',
  },
  pillLabel: {
    color: '#8B8179',
    fontSize: 15,
    fontWeight: '500',
  },
  pillLabelActive: {
    color: colors.white,
  },
  pillFilter: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#E5E5E5',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 9,
  },
  pillFilterActive: {
    backgroundColor: colors.salmon,
    borderColor: 'transparent',
  },
  pillFilterLabel: {
    color: colors.brownMid,
    fontSize: 13,
    fontWeight: '500',
  },
  pillFilterLabelActive: {
    color: '#FFFFFF',
  },
});
