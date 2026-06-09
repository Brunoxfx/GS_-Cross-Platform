import { ComponentType } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LucideProps } from 'lucide-react-native';

import { palette } from '@/constants/theme';

type MetricCardProps = {
  title: string;
  value: string;
  detail: string;
  color: string;
  Icon: ComponentType<LucideProps>;
  wide?: boolean;
};

export function MetricCard({ title, value, detail, color, Icon, wide = false }: MetricCardProps) {
  return (
    <View style={[styles.card, wide && styles.wideCard]}>
      <View style={styles.header}>
        <View style={[styles.iconBubble, { backgroundColor: `${color}24` }]}>
          <Icon color={color} size={20} />
        </View>
        <Text selectable style={styles.title}>
          {title}
        </Text>
      </View>
      <Text selectable style={styles.value}>
        {value}
      </Text>
      <Text selectable style={styles.detail}>
        {detail}
      </Text>
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
    flexBasis: 150,
    flexGrow: 1,
    flexShrink: 1,
    gap: 10,
    minWidth: 150,
    padding: 16,
  },
  wideCard: {
    width: '100%',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  iconBubble: {
    alignItems: 'center',
    borderCurve: 'continuous',
    borderRadius: 12,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  title: {
    color: palette.muted,
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
  },
  value: {
    color: palette.text,
    fontSize: 26,
    fontVariant: ['tabular-nums'],
    fontWeight: '800',
  },
  detail: {
    color: palette.muted,
    fontSize: 13,
    lineHeight: 18,
  },
});
