import { StyleSheet, Text, View } from 'react-native';

import { palette } from '@/constants/theme';

type MiniBarChartProps = {
  title: string;
  values: number[];
  color: string;
  suffix?: string;
  max?: number;
};

export function MiniBarChart({ title, values, color, suffix = '', max = 100 }: MiniBarChartProps) {
  const latest = values[values.length - 1] ?? 0;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text selectable style={styles.title}>
          {title}
        </Text>
        <Text selectable style={styles.latest}>
          {latest.toFixed(1)}
          {suffix}
        </Text>
      </View>
      <View style={styles.chart}>
        {values.map((value, index) => {
          const height = Math.max(12, Math.min(100, (value / max) * 100));
          return <View key={`${title}-${index}`} style={[styles.bar, { height: `${height}%`, backgroundColor: color }]} />;
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderCurve: 'continuous',
    borderRadius: 18,
    borderWidth: 1,
    gap: 16,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: {
    color: palette.text,
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
  },
  latest: {
    color: palette.muted,
    fontSize: 13,
    fontVariant: ['tabular-nums'],
    fontWeight: '700',
  },
  chart: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: 8,
    height: 118,
  },
  bar: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    flex: 1,
    minHeight: 12,
  },
});
