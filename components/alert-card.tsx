import { AlertTriangle, CheckCircle2, CircleAlert } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { palette } from '@/constants/theme';
import { MissionAlert } from '@/types/mission';

const severityColor = {
  critical: palette.red,
  warning: palette.amber,
  info: palette.mint,
};

export function AlertCard({ alert }: { alert: MissionAlert }) {
  const color = severityColor[alert.severity];
  const Icon = alert.severity === 'critical' ? CircleAlert : alert.severity === 'warning' ? AlertTriangle : CheckCircle2;

  return (
    <View style={[styles.card, { borderColor: `${color}90` }]}>
      <View style={styles.row}>
        <View style={[styles.iconBubble, { backgroundColor: `${color}20` }]}>
          <Icon color={color} size={22} />
        </View>
        <View style={styles.content}>
          <Text selectable style={styles.title}>
            {alert.title}
          </Text>
          <Text selectable style={styles.detail}>
            {alert.detail}
          </Text>
        </View>
      </View>
      <View style={styles.values}>
        <Text selectable style={styles.value}>
          Atual: {alert.currentValue}
        </Text>
        <Text selectable style={styles.value}>
          Limite: {alert.limit}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.surface,
    borderCurve: 'continuous',
    borderRadius: 18,
    borderWidth: 1,
    gap: 14,
    padding: 16,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  iconBubble: {
    alignItems: 'center',
    borderCurve: 'continuous',
    borderRadius: 14,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  content: {
    flex: 1,
    gap: 5,
  },
  title: {
    color: palette.text,
    fontSize: 16,
    fontWeight: '800',
  },
  detail: {
    color: palette.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  values: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  value: {
    backgroundColor: palette.surfaceStrong,
    borderCurve: 'continuous',
    borderRadius: 10,
    color: palette.text,
    fontSize: 12,
    fontVariant: ['tabular-nums'],
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
});
