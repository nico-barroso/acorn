import React from 'react';
import { View, Animated } from 'react-native';
import { colors } from '../../theme/colors';
import { styles } from './ContentCardSkeleton.styles';

const AnimatedView = Animated.View;

function SkeletonBox({
  style,
  color,
  opacityRange,
}: {
  style: any;
  color?: string;
  opacityRange?: { min: number; max: number };
}) {
  const min = opacityRange?.min ?? 0.15;
  const max = opacityRange?.max ?? 0.35;
  const opacity = React.useRef(new Animated.Value(min)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: max, duration: 1000, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: min, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <AnimatedView
      style={[style, { opacity, backgroundColor: color ?? colors.skeletonBackground }]}
    />
  );
}

export function ContentCardSkeleton() {
  return (
    <View style={styles.card}>
      <View style={styles.thumbnail}>
        <SkeletonBox
          style={{ width: '100%', height: '100%' }}
          color={colors.brownMid}
          opacityRange={{ min: 0.1, max: 0.25 }}
        />
      </View>
      <View style={styles.textLayout}>
        <SkeletonBox
          style={{ width: '80%', height: 16, borderRadius: 4, marginBottom: 8 }}
          color={colors.brown}
        />
        <View style={styles.sourceRow}>
          <SkeletonBox style={{ width: 14, height: 14, borderRadius: 2, marginRight: 4 }} color={colors.brownMid} />
          <SkeletonBox style={{ width: 100, height: 12, borderRadius: 4 }} color={colors.brownMid} />
        </View>
        <View style={styles.tagsRow}>
          <SkeletonBox style={{ width: 60, height: 20, borderRadius: 10, marginRight: 6 }} color={colors.salmon} />
          <SkeletonBox style={{ width: 60, height: 20, borderRadius: 10, marginRight: 6 }} color={colors.salmon} />
          <SkeletonBox style={{ width: 60, height: 20, borderRadius: 10 }} color={colors.salmon} />
        </View>
      </View>
      <SkeletonBox style={{ width: 12, height: 20, borderRadius: 2 }} color={colors.brownMid} />
    </View>
  );
}
