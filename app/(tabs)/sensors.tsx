import { Microscope, Radiation, Thermometer } from 'lucide-react-native';
import { StyleSheet, View, useWindowDimensions } from 'react-native';

import { AppShell } from '@/components/app-shell';
import { MetricCard } from '@/components/metric-card';
import { MissionHeader } from '@/components/mission-header';
import { MiniBarChart } from '@/components/mini-bar-chart';
import { SectionTitle } from '@/components/section-title';
import { palette } from '@/constants/theme';
import { useMission } from '@/context/mission-context';

export default function SensorsDashboardScreen() {
  const { latest, history, thresholds } = useMission();
  const { width } = useWindowDimensions();
  const compact = width < 720;
  const ordered = history.slice(0, 8).reverse();

  return (
    <AppShell>
      <MissionHeader />
      <SectionTitle
        title="Dashboard de sensores"
        subtitle="Temperatura, radiacao e integridade dos modulos cientificos simulados."
      />
      <View style={[styles.grid, compact && styles.gridCompact]}>
        <MetricCard
          Icon={Thermometer}
          color={palette.amber}
          detail={`Limite configurado: ${thresholds.maxTemperature} C`}
          title="Temperatura"
          value={`${latest.temperature.toFixed(1)} C`}
          wide={compact}
        />
        <MetricCard
          Icon={Radiation}
          color={palette.red}
          detail={`Limite configurado: ${thresholds.maxRadiation} mSv`}
          title="Radiacao"
          value={`${latest.radiation.toFixed(2)} mSv`}
          wide={compact}
        />
        <MetricCard
          Icon={Microscope}
          color={palette.cyan}
          detail="Pacote de sensores em leitura continua"
          title="Amostras"
          value={`${history.length}`}
          wide={compact}
        />
      </View>
      <MiniBarChart color={palette.amber} max={100} suffix=" C" title="Temperatura por ciclo" values={ordered.map((item) => item.temperature)} />
      <MiniBarChart color={palette.red} max={8} suffix=" mSv" title="Radiacao por ciclo" values={ordered.map((item) => item.radiation)} />
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
