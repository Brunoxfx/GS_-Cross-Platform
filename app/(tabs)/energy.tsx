import { BatteryCharging, PlugZap, SunMedium } from 'lucide-react-native';
import { StyleSheet, View, useWindowDimensions } from 'react-native';

import { AppShell } from '@/components/app-shell';
import { MetricCard } from '@/components/metric-card';
import { MissionHeader } from '@/components/mission-header';
import { MiniBarChart } from '@/components/mini-bar-chart';
import { SectionTitle } from '@/components/section-title';
import { StatusStrip } from '@/components/status-strip';
import { palette } from '@/constants/theme';
import { useMission } from '@/context/mission-context';
import { formatPercent } from '@/utils/format';

export default function EnergyDashboardScreen() {
  const { latest, history, thresholds } = useMission();
  const { width } = useWindowDimensions();
  const compact = width < 720;
  const ordered = history.slice(0, 8).reverse();

  return (
    <AppShell>
      <MissionHeader />
      <SectionTitle
        title="Dashboard de energia"
        subtitle="Acompanhamento de bateria, captacao solar e consumo dos subsistemas."
      />
      <View style={[styles.grid, compact && styles.gridCompact]}>
        <MetricCard
          Icon={BatteryCharging}
          color={palette.mint}
          detail={`Minimo configurado: ${thresholds.minBattery}%`}
          title="Bateria"
          value={formatPercent(latest.battery)}
          wide={compact}
        />
        <MetricCard
          Icon={SunMedium}
          color={palette.amber}
          detail="Entrada simulada dos paineis solares"
          title="Captacao solar"
          value={formatPercent(latest.solarInput)}
          wide={compact}
        />
        <MetricCard
          Icon={PlugZap}
          color={palette.blue}
          detail="Demanda dos sistemas ativos"
          title="Consumo"
          value={formatPercent(latest.consumption)}
          wide={compact}
        />
      </View>
      <View style={styles.panel}>
        <StatusStrip color={palette.mint} label="Reserva de bateria" value={latest.battery} />
        <StatusStrip color={palette.amber} label="Entrada solar" value={latest.solarInput} />
        <StatusStrip color={palette.blue} label="Consumo operacional" value={latest.consumption} />
      </View>
      <MiniBarChart color={palette.mint} suffix="%" title="Bateria por ciclo" values={ordered.map((item) => item.battery)} />
      <MiniBarChart color={palette.amber} suffix="%" title="Captacao solar por ciclo" values={ordered.map((item) => item.solarInput)} />
    </AppShell>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridCompact: {
    flexDirection: 'column',
  },
  panel: {
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderCurve: 'continuous',
    borderRadius: 18,
    borderWidth: 1,
    gap: 14,
    padding: 16,
  },
});
