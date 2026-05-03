import { StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';

export const styles = StyleSheet.create({
  wrapper: {
    alignSelf: 'center',
    marginBottom: 8,
    marginTop: -10,
  },
  avatarContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: colors.brown,
    overflow: 'hidden',
    shadowColor: colors.salmon,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  avatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 54,
    height: 54,
    borderRadius: 37,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 7,
  },
});
