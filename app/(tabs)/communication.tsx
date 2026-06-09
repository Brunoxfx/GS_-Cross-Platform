import { Activity, RadioTower, WifiOff } from 'lucide-react-native';
import { StyleSheet, View, useWindowDimensions } from 'react-native';

import { AppShell } from '@/components/app-shell';
import { MetricCard } from '@/components/metric-card';
import { MissionHeader } from '@/components/mission-header';
import { MiniBarChart } from '@/components/mini-bar-chart';
import { SectionTitle } from '@/components/section-title';
import { palette } from '@/constants/theme';
import { useMission } from '@/context/mission-context';
import { formatPercent } from '@/utils/format';

export default function CommunicationDashboardScreen() {
  const { latest, history, thresholds } = useMission();
  const { width } = useWindowDimensions();
  const compact = width < 720;
  const ordered = history.slice(0, 8).reverse();

  return (
    <AppShell>
      <MissionHeader />
      <SectionTitle
        title="Dashboard de comunicacao"
        subtitle="Telemetria simulada para qualidade de sinal, latencia e perda de pacotes."
      />
      <View style={[styles.grid, compact && styles.gridCompact]}>
        <MetricCard
          Icon={RadioTower}
          color={palette.cyan}
          detail={`Minimo configurado: ${thresholds.minSignal}%`}
          title="Sinal"
          value={formatPercent(latest.signal)}
          wide={compact}
        />
        <MetricCard
          Icon={Activity}
          color={palette.violet}
          detail={`Maximo configurado: ${thresholds.maxLatency} ms`}
          title="Latencia"
          value={`${latest.latency.toFixed(0)} ms`}
          wide={compact}
        />
        <MetricCard
          Icon={WifiOff}
          color={palette.red}
          detail="Perda estimada no link orbital"
          title="Perda"
          value={formatPercent(latest.packetLoss)}
          wide={compact}
        />
      </View>
      <MiniBarChart color={palette.cyan} suffix="%" title="Qualidade do sinal" values={ordered.map((item) => item.signal)} />
      <MiniBarChart color={palette.violet} max={1400} suffix=" ms" title="Latencia de telemetria" values={ordered.map((item) => item.latency)} />
      <MiniBarChart color={palette.red} max={10} suffix="%" title="Perda de pacotes" values={ordered.map((item) => item.packetLoss)} />
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
});
