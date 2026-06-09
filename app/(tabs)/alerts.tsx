import { FlatList, StyleSheet, Text, View } from 'react-native';

import { AlertCard } from '@/components/alert-card';
import { MissionHeader } from '@/components/mission-header';
import { SectionTitle } from '@/components/section-title';
import { palette } from '@/constants/theme';
import { useMission } from '@/context/mission-context';

export default function AlertsScreen() {
  const { alerts } = useMission();
  const critical = alerts.filter((alert) => alert.severity === 'critical').length;
  const warning = alerts.filter((alert) => alert.severity === 'warning').length;

  return (
    <View style={styles.root}>
      <FlatList
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
        data={alerts}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.headerContent}>
            <MissionHeader />
            <SectionTitle
              title="Sistema de alertas"
              subtitle="Eventos gerados automaticamente a partir dos limiares configurados."
            />
            <View style={styles.summary}>
              <View style={styles.summaryItem}>
                <Text selectable style={styles.summaryValue}>
                  {critical}
                </Text>
                <Text selectable style={styles.summaryLabel}>
                  Criticos
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text selectable style={styles.summaryValue}>
                  {warning}
                </Text>
                <Text selectable style={styles.summaryLabel}>
                  Atencao
                </Text>
              </View>
            </View>
          </View>
        }
        renderItem={({ item }) => <AlertCard alert={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: palette.background,
    flex: 1,
  },
  content: {
    gap: 16,
    padding: 18,
    paddingBottom: 34,
  },
  headerContent: {
    gap: 16,
  },
  summary: {
    flexDirection: 'row',
    gap: 12,
  },
  summaryItem: {
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderCurve: 'continuous',
    borderRadius: 18,
    borderWidth: 1,
    flex: 1,
    gap: 4,
    padding: 16,
  },
  summaryValue: {
    color: palette.text,
    fontSize: 30,
    fontVariant: ['tabular-nums'],
    fontWeight: '900',
  },
  summaryLabel: {
    color: palette.muted,
    fontSize: 13,
    fontWeight: '700',
  },
});
