import { DimensionValue, StyleSheet, Text, View } from 'react-native';

import { palette } from '@/constants/theme';

type StatusStripProps = {
  label: string;
  value: number;
  color: string;
  suffix?: string;
};

export function StatusStrip({ label, value, color, suffix = '%' }: StatusStripProps) {
  const width = `${Math.max(4, Math.min(100, value))}%` as DimensionValue;

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Text selectable style={styles.label}>
          {label}
        </Text>
        <Text selectable style={styles.value}>
          {value.toFixed(1)}
          {suffix}
        </Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 8,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  label: {
    color: palette.muted,
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
  },
  value: {
    color: palette.text,
    fontSize: 13,
    fontVariant: ['tabular-nums'],
    fontWeight: '800',
  },
  track: {
    backgroundColor: palette.surfaceStrong,
    borderCurve: 'continuous',
    borderRadius: 999,
    height: 10,
    overflow: 'hidden',
  },
  fill: {
    borderCurve: 'continuous',
    borderRadius: 999,
    height: 10,
  },
});
