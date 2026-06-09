import { MissionAlert, MissionSnapshot, MissionThresholds } from '@/types/mission';

export const defaultThresholds: MissionThresholds = {
  maxTemperature: 78,
  maxRadiation: 4.5,
  minBattery: 38,
  minSignal: 62,
  maxLatency: 880,
  minStability: 72,
};

export const initialSnapshot: MissionSnapshot = {
  id: 'initial',
  timestamp: new Date().toISOString(),
  temperature: 64,
  radiation: 2.2,
  battery: 76,
  solarInput: 68,
  consumption: 44,
  signal: 84,
  latency: 430,
  packetLoss: 1.4,
  stability: 91,
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const round = (value: number, digits = 0) => Number(value.toFixed(digits));

export function createMissionSnapshot(previous: MissionSnapshot, tick: number): MissionSnapshot {
  const wave = Math.sin(tick / 2);
  const drift = Math.cos(tick / 3);
  const outagePulse = tick % 9 === 0 ? -18 : 0;
  const thermalPulse = tick % 7 === 0 ? 12 : 0;

  return {
    id: `${Date.now()}-${tick}`,
    timestamp: new Date().toISOString(),
    temperature: round(clamp(previous.temperature + wave * 2.8 + thermalPulse - 2, 42, 94), 1),
    radiation: round(clamp(previous.radiation + drift * 0.22 + (tick % 11 === 0 ? 1.1 : -0.05), 0.7, 6.8), 2),
    battery: round(clamp(previous.battery + drift * 1.6 + (previous.solarInput > previous.consumption ? 1 : -1.8), 18, 100), 1),
    solarInput: round(clamp(66 + wave * 19 + (tick % 8 === 0 ? -21 : 0), 18, 100), 1),
    consumption: round(clamp(46 + drift * 16 + (tick % 6 === 0 ? 18 : 0), 18, 92), 1),
    signal: round(clamp(previous.signal + wave * 3.4 + outagePulse + 2, 24, 99), 1),
    latency: round(clamp(430 + drift * 170 + (tick % 9 === 0 ? 380 : 0), 120, 1300), 0),
    packetLoss: round(clamp(1.2 + Math.abs(wave) * 2 + (tick % 9 === 0 ? 5 : 0), 0, 9.8), 1),
    stability: round(clamp(previous.stability + drift * 2.4 + (tick % 10 === 0 ? -19 : 1.2), 36, 99), 1),
  };
}

export function buildAlerts(snapshot: MissionSnapshot, thresholds: MissionThresholds): MissionAlert[] {
  const alerts: MissionAlert[] = [];

  if (snapshot.temperature >= thresholds.maxTemperature) {
    alerts.push({
      id: 'thermal',
      title: 'Temperatura critica',
      detail: 'Modulo de sensores acima do limite operacional seguro.',
      severity: snapshot.temperature >= thresholds.maxTemperature + 8 ? 'critical' : 'warning',
      currentValue: `${snapshot.temperature.toFixed(1)} C`,
      limit: `${thresholds.maxTemperature} C`,
    });
  }

  if (snapshot.radiation >= thresholds.maxRadiation) {
    alerts.push({
      id: 'radiation',
      title: 'Radiacao elevada',
      detail: 'Exposicao acumulada pode comprometer componentes sensiveis.',
      severity: snapshot.radiation >= thresholds.maxRadiation + 1 ? 'critical' : 'warning',
      currentValue: `${snapshot.radiation.toFixed(2)} mSv`,
      limit: `${thresholds.maxRadiation} mSv`,
    });
  }

  if (snapshot.battery <= thresholds.minBattery) {
    alerts.push({
      id: 'battery',
      title: 'Energia baixa',
      detail: 'Reserva de bateria abaixo do minimo configurado para a missao.',
      severity: snapshot.battery <= thresholds.minBattery - 10 ? 'critical' : 'warning',
      currentValue: `${snapshot.battery.toFixed(1)}%`,
      limit: `${thresholds.minBattery}%`,
    });
  }

  if (snapshot.signal <= thresholds.minSignal) {
    alerts.push({
      id: 'signal',
      title: 'Sinal degradado',
      detail: 'Link de telemetria instavel com risco de perda de pacotes.',
      severity: snapshot.signal <= thresholds.minSignal - 15 ? 'critical' : 'warning',
      currentValue: `${snapshot.signal.toFixed(1)}%`,
      limit: `${thresholds.minSignal}%`,
    });
  }

  if (snapshot.latency >= thresholds.maxLatency) {
    alerts.push({
      id: 'latency',
      title: 'Latencia alta',
      detail: 'Tempo de resposta acima do limite para comandos remotos.',
      severity: snapshot.latency >= thresholds.maxLatency + 220 ? 'critical' : 'warning',
      currentValue: `${snapshot.latency.toFixed(0)} ms`,
      limit: `${thresholds.maxLatency} ms`,
    });
  }

  if (snapshot.stability <= thresholds.minStability) {
    alerts.push({
      id: 'stability',
      title: 'Estabilidade orbital baixa',
      detail: 'Vetor de atitude exige correcao preventiva.',
      severity: snapshot.stability <= thresholds.minStability - 12 ? 'critical' : 'warning',
      currentValue: `${snapshot.stability.toFixed(1)}%`,
      limit: `${thresholds.minStability}%`,
    });
  }

  if (alerts.length === 0) {
    alerts.push({
      id: 'nominal',
      title: 'Operacao nominal',
      detail: 'Todos os indicadores estao dentro dos limiares configurados.',
      severity: 'info',
      currentValue: 'OK',
      limit: 'Nominal',
    });
  }

  return alerts;
}
