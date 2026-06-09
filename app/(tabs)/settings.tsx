import { useMemo, useState } from 'react';
import { KeyboardAvoidingView, KeyboardAvoidingViewProps, Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native';

import { AppShell } from '@/components/app-shell';
import { MissionHeader } from '@/components/mission-header';
import { SectionTitle } from '@/components/section-title';
import { palette } from '@/constants/theme';
import { useMission } from '@/context/mission-context';
import { MissionThresholds } from '@/types/mission';

type FormState = MissionThresholds & {
  missionName: string;
  operator: string;
  autoRefresh: boolean;
};

const numericFields: Array<keyof MissionThresholds> = [
  'maxTemperature',
  'maxRadiation',
  'minBattery',
  'minSignal',
  'maxLatency',
  'minStability',
];

const keyboardBehavior: KeyboardAvoidingViewProps['behavior'] = process.env.EXPO_OS === 'ios' ? 'padding' : undefined;

export default function SettingsScreen() {
  const { preferences, thresholds, updatePreferences, updateThresholds } = useMission();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState<FormState>({
    ...thresholds,
    ...preferences,
  });

  const errors = useMemo(() => validate(form), [form]);
  const hasErrors = Object.keys(errors).length > 0;

  const updateField = (key: keyof FormState, value: string | boolean) => {
    setSaved(false);
    setForm((current) => ({ ...current, [key]: value }));
  };

  const submit = async () => {
    if (hasErrors) {
      return;
    }

    await updateThresholds({
      maxTemperature: Number(form.maxTemperature),
      maxRadiation: Number(form.maxRadiation),
      minBattery: Number(form.minBattery),
      minSignal: Number(form.minSignal),
      maxLatency: Number(form.maxLatency),
      minStability: Number(form.minStability),
    });
    await updatePreferences({
      missionName: String(form.missionName).trim(),
      operator: String(form.operator).trim(),
      autoRefresh: Boolean(form.autoRefresh),
    });
    setSaved(true);
  };

  return (
    <AppShell>
      <MissionHeader />
      <SectionTitle
        title="Configuracoes da missao"
        subtitle="Formulario persistido com AsyncStorage para personalizar alertas e preferencias."
      />
      <KeyboardAvoidingView behavior={keyboardBehavior} style={styles.form}>
        <Input
          error={errors.missionName}
          label="Nome da missao"
          onChangeText={(value) => updateField('missionName', value)}
          value={String(form.missionName)}
        />
        <Input
          error={errors.operator}
          label="Operador"
          onChangeText={(value) => updateField('operator', value)}
          value={String(form.operator)}
        />
        <View style={styles.switchRow}>
          <View style={styles.switchText}>
            <Text selectable style={styles.label}>
              Atualizacao automatica
            </Text>
            <Text selectable style={styles.hint}>
              Simula novos ciclos de telemetria em tempo real.
            </Text>
          </View>
          <Switch onValueChange={(value) => updateField('autoRefresh', value)} value={Boolean(form.autoRefresh)} />
        </View>
        {numericFields.map((field) => (
          <Input
            error={errors[field]}
            keyboardType="numeric"
            key={field}
            label={labels[field]}
            onChangeText={(value) => updateField(field, value)}
            value={String(form[field])}
          />
        ))}
        {hasErrors ? (
          <Text selectable style={styles.errorSummary}>
            Corrija os campos destacados antes de salvar.
          </Text>
        ) : null}
        {saved ? (
          <Text selectable style={styles.success}>
            Configuracoes salvas no dispositivo.
          </Text>
        ) : null}
        <Pressable accessibilityRole="button" disabled={hasErrors} onPress={submit} style={({ pressed }) => [styles.button, hasErrors && styles.buttonDisabled, pressed && !hasErrors && styles.pressed]}>
          <Text selectable style={styles.buttonText}>
            Salvar configuracoes
          </Text>
        </Pressable>
      </KeyboardAvoidingView>
    </AppShell>
  );
}

function Input({
  error,
  keyboardType,
  label,
  onChangeText,
  value,
}: {
  error?: string;
  keyboardType?: 'default' | 'numeric';
  label: string;
  onChangeText: (value: string) => void;
  value: string;
}) {
  return (
    <View style={styles.field}>
      <Text selectable style={styles.label}>
        {label}
      </Text>
      <TextInput
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        placeholder={label}
        placeholderTextColor="#6D7F98"
        style={[styles.input, error && styles.inputError]}
        value={value}
      />
      {error ? (
        <Text selectable style={styles.error}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

function validate(form: FormState) {
  const errors: Partial<Record<keyof FormState, string>> = {};

  if (String(form.missionName).trim().length < 3) {
    errors.missionName = 'Informe pelo menos 3 caracteres.';
  }

  if (String(form.operator).trim().length < 3) {
    errors.operator = 'Informe pelo menos 3 caracteres.';
  }

  numericFields.forEach((field) => {
    const value = Number(form[field]);

    if (!Number.isFinite(value)) {
      errors[field] = 'Use apenas numeros.';
      return;
    }

    if (value <= 0) {
      errors[field] = 'O valor deve ser maior que zero.';
    }
  });

  if (Number(form.minBattery) > 95 || Number(form.minSignal) > 100 || Number(form.minStability) > 100) {
    errors.minBattery = Number(form.minBattery) > 95 ? 'Use ate 95% para manter margem operacional.' : errors.minBattery;
    errors.minSignal = Number(form.minSignal) > 100 ? 'Use ate 100%.' : errors.minSignal;
    errors.minStability = Number(form.minStability) > 100 ? 'Use ate 100%.' : errors.minStability;
  }

  return errors;
}

const labels: Record<keyof MissionThresholds, string> = {
  maxTemperature: 'Temperatura maxima (C)',
  maxRadiation: 'Radiacao maxima (mSv)',
  minBattery: 'Bateria minima (%)',
  minSignal: 'Sinal minimo (%)',
  maxLatency: 'Latencia maxima (ms)',
  minStability: 'Estabilidade minima (%)',
};

const styles = StyleSheet.create({
  form: {
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderCurve: 'continuous',
    borderRadius: 18,
    borderWidth: 1,
    gap: 14,
    padding: 16,
  },
  field: {
    gap: 7,
  },
  label: {
    color: palette.text,
    fontSize: 14,
    fontWeight: '800',
  },
  input: {
    backgroundColor: palette.surfaceStrong,
    borderColor: palette.border,
    borderCurve: 'continuous',
    borderRadius: 12,
    borderWidth: 1,
    color: palette.text,
    fontSize: 15,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  inputError: {
    borderColor: palette.red,
  },
  error: {
    color: palette.red,
    fontSize: 12,
    fontWeight: '700',
  },
  switchRow: {
    alignItems: 'center',
    backgroundColor: palette.surfaceStrong,
    borderCurve: 'continuous',
    borderRadius: 14,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    padding: 14,
  },
  switchText: {
    flex: 1,
    gap: 4,
  },
  hint: {
    color: palette.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  button: {
    alignItems: 'center',
    backgroundColor: palette.cyan,
    borderCurve: 'continuous',
    borderRadius: 14,
    justifyContent: 'center',
    minHeight: 50,
    paddingHorizontal: 16,
  },
  buttonDisabled: {
    opacity: 0.42,
  },
  pressed: {
    opacity: 0.78,
  },
  buttonText: {
    color: '#06101C',
    fontSize: 15,
    fontWeight: '900',
  },
  errorSummary: {
    color: palette.red,
    fontSize: 13,
    fontWeight: '700',
  },
  success: {
    color: palette.mint,
    fontSize: 13,
    fontWeight: '800',
  },
});
