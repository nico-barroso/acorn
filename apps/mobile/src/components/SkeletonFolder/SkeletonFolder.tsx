import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { colors } from '../../theme/colors';

export function SkeletonFolder() {
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
    outputRange: [0.2, 0.5],
  });

  return (
    <View style={styles.card}>
      <Animated.View style={[styles.icon, { opacity }]} />
      <View style={styles.textBlock}>
        <Animated.View style={[styles.titleLine, { opacity }]} />
        <Animated.View style={[styles.descLine, { opacity }]} />
      </View>
      <Animated.View style={[styles.menuDot, { opacity }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 25,
    paddingLeft: 22,
    paddingRight: 10,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 106,
    shadowColor: colors.salmon,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    width: '100%',
  },
  icon: {
    width: 50,
    height: 37,
    borderRadius: 8,
    backgroundColor: colors.skeletonBackground,
  },
  textBlock: {
    flex: 1,
    gap: 8,
  },
  titleLine: {
    height: 16,
    width: '60%',
    borderRadius: 4,
    backgroundColor: colors.skeletonBackground,
  },
  descLine: {
    height: 12,
    width: '85%',
    borderRadius: 4,
    backgroundColor: colors.skeletonBackground,
  },
  menuDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.skeletonBackground,
    marginLeft: 8,
    alignSelf: 'flex-end',
    marginBottom: 8,
  },
});
