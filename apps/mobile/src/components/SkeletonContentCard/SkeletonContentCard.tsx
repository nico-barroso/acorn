import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors } from '../../theme/colors';

export function SkeletonContentCard() {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(shimmerAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [shimmerAnim]);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.thumbnail}>
          <Animated.View style={[styles.skeleton, { opacity }]} />
        </View>
        <View style={styles.textLayout}>
          <Animated.View style={[styles.titleSkeleton, { opacity }]} />
          <View style={styles.sourceRow}>
            <Animated.View style={[styles.faviconSkeleton, { opacity }]} />
            <Animated.View style={[styles.sourceSkeleton, { opacity }]} />
          </View>
          <View style={styles.tagsRow}>
            <Animated.View style={[styles.tagSkeleton, { opacity }]} />
            <Animated.View style={[styles.tagSkeleton, { opacity }]} />
          </View>
        </View>
        <View style={styles.chevron} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 15,
    shadowColor: colors.salmon,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingHorizontal: 20,
    minHeight: 110,
  },
  thumbnail: {
    width: 74,
    height: 74,
    borderRadius: 13,
    overflow: 'hidden',
    marginRight: 12,
    backgroundColor: colors.skeletonBackground,
  },
  textLayout: {
    flex: 1,
    justifyContent: 'space-between',
    minHeight: 60,
    gap: 2,
  },
  titleSkeleton: {
    height: 16,
    width: '80%',
    backgroundColor: colors.skeletonBackground,
    borderRadius: 4,
  },
  sourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 4,
  },
  faviconSkeleton: {
    width: 14,
    height: 14,
    borderRadius: 3,
    backgroundColor: colors.skeletonBackground,
  },
  sourceSkeleton: {
    height: 12,
    width: 100,
    backgroundColor: colors.skeletonBackground,
    borderRadius: 4,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 6,
  },
  tagSkeleton: {
    height: 20,
    width: 60,
    backgroundColor: colors.skeletonBackground,
    borderRadius: 10,
  },
  skeleton: {
    flex: 1,
    backgroundColor: colors.skeletonBackground,
  },
  chevron: {
    width: 22,
    height: 22,
    backgroundColor: colors.skeletonBackground,
    borderRadius: 11,
    marginLeft: 8,
    alignSelf: 'flex-end',
    marginBottom: 8,
  },
});
