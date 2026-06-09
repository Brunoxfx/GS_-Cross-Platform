import { RefreshCcw, Satellite } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { palette } from '@/constants/theme';
import { useMission } from '@/context/mission-context';
import { formatTime } from '@/utils/format';

export function MissionHeader() {
  const { latest, preferences, refreshTelemetry } = useMission();

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.identity}>
          <View style={styles.iconBubble}>
            <Satellite color={palette.cyan} size={24} />
          </View>
          <View style={styles.titleBlock}>
            <Text selectable style={styles.kicker}>
              Space Predictive Analytics
            </Text>
            <Text selectable style={styles.title}>
              {preferences.missionName}
            </Text>
          </View>
        </View>
        <Pressable accessibilityRole="button" onPress={refreshTelemetry} style={({ pressed }) => [styles.refresh, pressed && styles.pressed]}>
          <RefreshCcw color={palette.text} size={19} />
        </Pressable>
      </View>
      <View style={styles.metaRow}>
        <Text selectable style={styles.meta}>
          Operador: {preferences.operator}
        </Text>
        <Text selectable style={styles.meta}>
          Atualizado: {formatTime(latest.timestamp)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderCurve: 'continuous',
    borderRadius: 22,
    borderWidth: 1,
    gap: 16,
    padding: 18,
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  identity: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  iconBubble: {
    alignItems: 'center',
    backgroundColor: '#0D2B3E',
    borderCurve: 'continuous',
    borderRadius: 18,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  titleBlock: {
    flex: 1,
    gap: 4,
  },
  kicker: {
    color: palette.cyan,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  title: {
    color: palette.text,
    fontSize: 24,
    fontWeight: '800',
  },
  refresh: {
    alignItems: 'center',
    backgroundColor: palette.surfaceStrong,
    borderColor: palette.border,
    borderCurve: 'continuous',
    borderRadius: 15,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  pressed: {
    opacity: 0.72,
  },
  metaRow: {
    gap: 8,
  },
  meta: {
    color: palette.muted,
    fontSize: 13,
  },
});
