import { StyleSheet } from 'react-native';
import { colors } from '@theme/colors';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    flexGrow: 1,
  },

  // Header
  header: {
    alignItems: 'center',
    paddingBottom: 50,
    paddingHorizontal: 20,
    backgroundColor: colors.background,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 14,
    overflow: 'hidden',
  },
  headerBackgroundTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '70%',
    overflow: 'hidden',
  },
  headerBackgroundBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    overflow: 'hidden',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: 'rgba(67, 40, 28, 0.3)',
    shadowColor: 'rgba(67, 40, 28, 1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
avatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    marginTop: 0,
    marginBottom: 0,
    marginHorizontal: 0,
    marginVertical: 0,
    padding: 0,
  },
  userName: {
    fontFamily: 'CabinetGrotesk-Bold',
    fontSize: 28,
    color: colors.brown,
    marginBottom: 4,
  },
  userEmail: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 16,
    color: colors.brown,
    opacity: 0.7,
    letterSpacing: 0.4,
  },

  // Sections
  sectionsBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 250,
    marginHorizontal: 20,
    overflow: 'hidden',
    borderRadius: 20,
  },
  sections: {
    paddingHorizontal: 40,
    paddingTop: 30,
    gap: 24,
    paddingBottom: 40,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 18,
    color: colors.brown,
    marginBottom: 4,
  },
  sectionCard: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    overflow: 'hidden',
  },
});
