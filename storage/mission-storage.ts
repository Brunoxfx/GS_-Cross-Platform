import AsyncStorage from '@react-native-async-storage/async-storage';

import { MissionPreferences, MissionSnapshot, MissionThresholds } from '@/types/mission';

const THRESHOLDS_KEY = '@space-analytics/thresholds';
const PREFERENCES_KEY = '@space-analytics/preferences';
const HISTORY_KEY = '@space-analytics/history';

export async function loadJson<T>(key: string, fallback: T): Promise<T> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function loadThresholds(fallback: MissionThresholds) {
  return loadJson<MissionThresholds>(THRESHOLDS_KEY, fallback);
}

export function saveThresholds(thresholds: MissionThresholds) {
  return AsyncStorage.setItem(THRESHOLDS_KEY, JSON.stringify(thresholds));
}

export function loadPreferences(fallback: MissionPreferences) {
  return loadJson<MissionPreferences>(PREFERENCES_KEY, fallback);
}

export function savePreferences(preferences: MissionPreferences) {
  return AsyncStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
}

export function loadHistory(fallback: MissionSnapshot[]) {
  return loadJson<MissionSnapshot[]>(HISTORY_KEY, fallback);
}

export function saveHistory(history: MissionSnapshot[]) {
  return AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 16)));
}
