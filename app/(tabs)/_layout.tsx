import { Tabs } from 'expo-router';
import { Activity, BatteryCharging, Gauge, RadioTower, Settings, TriangleAlert } from 'lucide-react-native';

import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { palette } from '@/constants/theme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: palette.cyan,
        tabBarInactiveTintColor: colorScheme === 'dark' ? '#74839A' : '#5E6E83',
        tabBarStyle: {
          backgroundColor: palette.surface,
          borderTopColor: palette.border,
        },
        headerStyle: {
          backgroundColor: palette.background,
        },
        headerTintColor: palette.text,
        headerTitleStyle: {
          fontWeight: '800',
        },
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Missao',
          tabBarIcon: ({ color, size }) => <Gauge color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="sensors"
        options={{
          title: 'Sensores',
          tabBarIcon: ({ color, size }) => <Activity color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="energy"
        options={{
          title: 'Energia',
          tabBarIcon: ({ color, size }) => <BatteryCharging color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="communication"
        options={{
          title: 'Comunicacao',
          tabBarIcon: ({ color, size }) => <RadioTower color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: 'Alertas',
          tabBarIcon: ({ color, size }) => <TriangleAlert color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Config',
          tabBarIcon: ({ color, size }) => <Settings color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
