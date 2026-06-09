import { PropsWithChildren, createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { buildAlerts, createMissionSnapshot, defaultThresholds, initialSnapshot } from '@/data/mission';
import { loadHistory, loadPreferences, loadThresholds, saveHistory, savePreferences, saveThresholds } from '@/storage/mission-storage';
import { MissionAlert, MissionPreferences, MissionSnapshot, MissionThresholds } from '@/types/mission';

type MissionContextValue = {
  latest: MissionSnapshot;
  history: MissionSnapshot[];
  alerts: MissionAlert[];
  thresholds: MissionThresholds;
  preferences: MissionPreferences;
  loaded: boolean;
  refreshTelemetry: () => void;
  updateThresholds: (thresholds: MissionThresholds) => Promise<void>;
  updatePreferences: (preferences: MissionPreferences) => Promise<void>;
};

const defaultPreferences: MissionPreferences = {
  missionName: 'Aurora-7 Orbital',
  operator: 'Equipe FIAP',
  autoRefresh: true,
};

const MissionContext = createContext<MissionContextValue | null>(null);

export function MissionProvider({ children }: PropsWithChildren) {
  const [latest, setLatest] = useState(initialSnapshot);
  const [history, setHistory] = useState<MissionSnapshot[]>([initialSnapshot]);
  const [thresholds, setThresholds] = useState(defaultThresholds);
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [loaded, setLoaded] = useState(false);
  const tickRef = useRef(1);

  const refreshTelemetry = useCallback(() => {
    setLatest((current) => {
      const next = createMissionSnapshot(current, tickRef.current);
      tickRef.current += 1;
      setHistory((items) => [next, ...items].slice(0, 16));
      return next;
    });
  }, []);

  useEffect(() => {
    let active = true;

    async function hydrate() {
      const [storedThresholds, storedPreferences, storedHistory] = await Promise.all([
        loadThresholds(defaultThresholds),
        loadPreferences(defaultPreferences),
        loadHistory([initialSnapshot]),
      ]);

      if (!active) {
        return;
      }

      setThresholds(storedThresholds);
      setPreferences(storedPreferences);
      setHistory(storedHistory.length > 0 ? storedHistory : [initialSnapshot]);
      setLatest(storedHistory[0] ?? initialSnapshot);
      setLoaded(true);
    }

    hydrate();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!loaded || !preferences.autoRefresh) {
      return;
    }

    const id = setInterval(refreshTelemetry, 4500);
    return () => clearInterval(id);
  }, [loaded, preferences.autoRefresh, refreshTelemetry]);

  useEffect(() => {
    if (loaded) {
      saveHistory(history);
    }
  }, [history, loaded]);

  const updateThresholds = useCallback(async (nextThresholds: MissionThresholds) => {
    setThresholds(nextThresholds);
    await saveThresholds(nextThresholds);
  }, []);

  const updatePreferences = useCallback(async (nextPreferences: MissionPreferences) => {
    setPreferences(nextPreferences);
    await savePreferences(nextPreferences);
  }, []);

  const alerts = useMemo(() => buildAlerts(latest, thresholds), [latest, thresholds]);

  const value = useMemo(
    () => ({
      latest,
      history,
      alerts,
      thresholds,
      preferences,
      loaded,
      refreshTelemetry,
      updateThresholds,
      updatePreferences,
    }),
    [alerts, history, latest, loaded, preferences, refreshTelemetry, thresholds, updatePreferences, updateThresholds],
  );

  return <MissionContext.Provider value={value}>{children}</MissionContext.Provider>;
}

export function useMission() {
  const context = useContext(MissionContext);

  if (!context) {
    throw new Error('useMission must be used inside MissionProvider');
  }

  return context;
}
