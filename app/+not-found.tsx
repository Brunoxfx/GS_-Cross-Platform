import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { palette } from '@/constants/theme';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Rota nao encontrada' }} />
      <View style={styles.container}>
        <Text selectable style={styles.title}>
          Esta tela nao existe.
        </Text>

        <Link href="/" style={styles.link}>
          <Text selectable style={styles.linkText}>
            Voltar para a missao
          </Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: palette.background,
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    color: palette.text,
    fontSize: 20,
    fontWeight: '800',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: palette.cyan,
    fontWeight: '800',
  },
});
