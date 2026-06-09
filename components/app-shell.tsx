import { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { palette, screenPadding } from '@/constants/theme';

export function AppShell({ children }: PropsWithChildren) {
  return (
    <View style={styles.root}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content}>
        {children}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: palette.background,
  },
  content: {
    padding: screenPadding,
    paddingBottom: 34,
    gap: 16,
  },
});
