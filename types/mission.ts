export type AlertSeverity = 'critical' | 'warning' | 'info';

export type MissionSnapshot = {
  id: string;
  timestamp: string;
  temperature: number;
  radiation: number;
  battery: number;
  solarInput: number;
  consumption: number;
  signal: number;
  latency: number;
  packetLoss: number;
  stability: number;
};

export type MissionThresholds = {
  maxTemperature: number;
  maxRadiation: number;
  minBattery: number;
  minSignal: number;
  maxLatency: number;
  minStability: number;
};

export type MissionPreferences = {
  missionName: string;
  operator: string;
  autoRefresh: boolean;
};

export type MissionAlert = {
  id: string;
  title: string;
  detail: string;
  severity: AlertSeverity;
  currentValue: string;
  limit: string;
};
