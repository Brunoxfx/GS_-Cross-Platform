import { BatteryCharging, RadioTower, ShieldCheck, Thermometer } from 'lucide-react-native';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { AppShell } from '@/components/app-shell';
import { AlertCard } from '@/components/alert-card';
import { MetricCard } from '@/components/metric-card';
import { MissionHeader } from '@/components/mission-header';
import { MiniBarChart } from '@/components/mini-bar-chart';
import { SectionTitle } from '@/components/section-title';
import { palette } from '@/constants/theme';
import { useMission } from '@/context/mission-context';
import { formatPercent, getRiskLabel } from '@/utils/format';

export default function MissionDashboardScreen() {
  const { latest, history, alerts } = useMission();
  const { width } = useWindowDimensions();
  const compact = width < 720;
  const activeAlerts = alerts.filter((alert) => alert.severity !== 'info').length;
  const riskScore = Math.min(latest.battery, latest.signal, latest.stability);

  return (
    <AppShell>
      <MissionHeader />
      <SectionTitle
        title="Painel principal"
        subtitle="Indicadores simulados de telemetria com atualizacao automatica e alertas por limiar."
      />

      <View style={[styles.grid, compact && styles.gridCompact]}>
        <MetricCard
          Icon={Thermometer}
          color={palette.amber}
          detail="Controle termico dos sensores"
          title="Temperatura"
          value={`${latest.temperature.toFixed(1)} C`}
          wide={compact}
        />
        <MetricCard
          Icon={BatteryCharging}
          color={palette.mint}
          detail="Reserva dos sistemas orbitais"
          title="Energia"
          value={formatPercent(latest.battery)}
          wide={compact}
        />
        <MetricCard
          Icon={RadioTower}
          color={palette.cyan}
          detail="Qualidade do link de telemetria"
          title="Sinal"
          value={formatPercent(latest.signal)}
          wide={compact}
        />
        <MetricCard
          Icon={ShieldCheck}
          color={palette.blue}
          detail={`${activeAlerts} alerta(s) ativo(s)`}
          title="Risco operacional"
          value={getRiskLabel(riskScore)}
          wide={compact}
        />
      </View>

      <MiniBarChart color={palette.violet} max={100} suffix="%" title="Estabilidade orbital recente" values={history.slice(0, 8).reverse().map((item) => item.stability)} />

      <View style={styles.forecast}>
        <Text selectable style={styles.forecastTitle}>
          Interpretacao preditiva
        </Text>
        <Text selectable style={styles.forecastText}>
          {riskScore < 68
            ? 'A plataforma recomenda janela de correcao imediata e reducao de consumo nao essencial.'
            : riskScore < 85
              ? 'Tendencia moderada: monitorar proximos ciclos e preparar ajuste preventivo.'
              : 'Operacao estavel: manter coleta de dados e telemetria em modo nominal.'}
        </Text>
      </View>

      <SectionTitle title="Alertas em destaque" />
      {alerts.slice(0, 2).map((alert) => (
        <AlertCard alert={alert} key={alert.id} />
      ))}
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
  forecast: {
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderCurve: 'continuous',
    borderRadius: 18,
    borderWidth: 1,
    gap: 8,
    padding: 16,
  },
  forecastTitle: {
    color: palette.text,
    fontSize: 17,
    fontWeight: '800',
  },
  forecastText: {
    color: palette.muted,
    fontSize: 14,
    lineHeight: 21,
  },
});
