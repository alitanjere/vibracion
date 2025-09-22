import { useCallback, useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  View,
  Vibration,
} from 'react-native';
import * as Haptics from 'expo-haptics';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

type StatusType = 'info' | 'success' | 'error';

type StatusState = {
  message: string;
  type: StatusType;
} | null;

type QuickAction = {
  title: string;
  subtitle: string;
  onPress: () => void | Promise<void>;
  message: string;
};

export default function HomeScreen() {
  const [pulseDuration, setPulseDuration] = useState('500');
  const [pauseDuration, setPauseDuration] = useState('300');
  const [repetitions, setRepetitions] = useState('3');
  const [repeatPattern, setRepeatPattern] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState<StatusState>(null);

  const heroBackground = useThemeColor({ light: '#E8F6FF', dark: '#0B1924' }, 'background');
  const surfaceBackground = useThemeColor({ light: '#FFFFFF', dark: '#0A141F' }, 'background');
  const quickCardBackground = useThemeColor({ light: '#F1F5F9', dark: '#1C2532' }, 'background');
  const textColor = useThemeColor({}, 'text');
  const inputBackground = useThemeColor({ light: '#FFFFFF', dark: '#081119' }, 'background');
  const inputBorder = useThemeColor({ light: '#CBD5E1', dark: '#1F2A37' }, 'icon');
  const placeholderColor = useThemeColor({ light: '#64748B', dark: '#7A8597' }, 'icon');
  const primaryColor = useThemeColor({}, 'tint');
  const infoColor = useThemeColor({ light: '#1D4ED8', dark: '#93C5FD' }, 'tint');
  const successColor = useThemeColor({ light: '#047857', dark: '#34D399' }, 'tint');
  const errorColor = useThemeColor({ light: '#DC2626', dark: '#FCA5A5' }, 'tint');

  const quickActions: QuickAction[] = [
    {
      title: 'Impacto suave',
      subtitle: 'Confirma acciones secundarias con un pulso ligero.',
      onPress: () => void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
      message: 'Se envió un impacto suave.',
    },
    {
      title: 'Impacto medio',
      subtitle: 'Útil para resaltar acciones principales.',
      onPress: () => void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
      message: 'Se envió un impacto medio.',
    },
    {
      title: 'Impacto pesado',
      subtitle: 'Ideal para alertas de alto nivel.',
      onPress: () => void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
      message: 'Se envió un impacto pesado.',
    },
    {
      title: 'Notificación (éxito)',
      subtitle: 'Feedback compuesto para notificar confirmaciones.',
      onPress: () => void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
      message: 'Notificación de éxito ejecutada.',
    },
  ];

  const statusColors: Record<StatusType, string> = {
    info: infoColor,
    success: successColor,
    error: errorColor,
  };

  useEffect(() => {
    return () => {
      Vibration.cancel();
    };
  }, []);

  const sanitizeNumericValue = useCallback((value: string) => value.replace(/[^0-9]/g, ''), []);

  const handleQuickPress = useCallback(
    (action: QuickAction) => {
      Vibration.cancel();
      setIsRunning(false);
      setStatus({ message: action.message, type: 'info' });
      void action.onPress();
    },
    []
  );

  const handleStartPattern = useCallback(() => {
    const vibrationMs = Number(pulseDuration);
    const pauseMs = Number(pauseDuration);
    const reps = Number(repetitions);

    if ([vibrationMs, pauseMs, reps].some((value) => !Number.isFinite(value) || value <= 0)) {
      setStatus({
        message: 'Ingresa valores mayores a cero para crear el patrón.',
        type: 'error',
      });
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    const pattern: number[] = [0];

    for (let index = 0; index < reps; index += 1) {
      pattern.push(vibrationMs);
      const shouldAddPause = index < reps - 1 || repeatPattern;
      if (shouldAddPause) {
        pattern.push(pauseMs);
      }
    }

    if (pattern.length <= 1) {
      setStatus({
        message: 'Configura al menos un pulso para iniciar la secuencia.',
        type: 'error',
      });
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    Vibration.cancel();
    Vibration.vibrate(pattern, repeatPattern);
    setIsRunning(true);

    const totalDuration = reps * vibrationMs + Math.max(reps - 1, 0) * pauseMs;
    const seconds = (totalDuration / 1000).toFixed(1).replace(/\.0$/, '');

    setStatus({
      message: repeatPattern
        ? `Patrón en ejecución continua. Cada ciclo dura aproximadamente ${seconds} s.`
        : `Patrón iniciado por ${seconds} s aproximados.`,
      type: 'success',
    });

    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [pauseDuration, pulseDuration, repeatPattern, repetitions]);

  const handleStopPattern = useCallback(() => {
    Vibration.cancel();
    setIsRunning(false);
    setStatus({ message: 'Patrón detenido.', type: 'info' });
    void Haptics.selectionAsync();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ThemedView style={[styles.heroCard, { backgroundColor: heroBackground }]}>
        <ThemedText type="title">Diseña tus vibraciones</ThemedText>
        <ThemedText style={styles.heroDescription}>
          Experimenta con respuestas hápticas rápidas o crea un patrón personalizado para tus pruebas de
          usabilidad.
        </ThemedText>
      </ThemedView>

      <ThemedView style={[styles.section, { backgroundColor: surfaceBackground }]}>
        <ThemedText type="subtitle">Pruebas rápidas</ThemedText>
        <ThemedText style={styles.sectionDescription}>
          Lanza un pulso inmediato para validar el tono de tus interacciones. Cada opción utiliza la API de
          expo-haptics.
        </ThemedText>
        <View style={styles.quickGrid}>
          {quickActions.map((action) => (
            <Pressable
              key={action.title}
              onPress={() => handleQuickPress(action)}
              style={({ pressed }) => [
                styles.quickButton,
                {
                  backgroundColor: quickCardBackground,
                  borderColor: inputBorder,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}>
              <ThemedText type="defaultSemiBold">{action.title}</ThemedText>
              <ThemedText style={styles.quickSubtitle}>{action.subtitle}</ThemedText>
            </Pressable>
          ))}
        </View>
      </ThemedView>

      <ThemedView style={[styles.section, { backgroundColor: surfaceBackground }]}>
        <ThemedText type="subtitle">Patrón personalizado</ThemedText>
        <ThemedText style={styles.sectionDescription}>
          Define los valores en milisegundos para controlar la duración de cada pulso y las pausas entre
          ellos. Los patrones personalizados están disponibles en Android.
        </ThemedText>

        <View style={styles.inputsRow}>
          <View style={styles.inputGroup}>
            <ThemedText type="defaultSemiBold">Pulso (ms)</ThemedText>
            <TextInput
              value={pulseDuration}
              onChangeText={(value) => setPulseDuration(sanitizeNumericValue(value))}
              keyboardType="number-pad"
              inputMode="numeric"
              maxLength={5}
              placeholder="500"
              placeholderTextColor={placeholderColor}
              style={[
                styles.textInput,
                { backgroundColor: inputBackground, borderColor: inputBorder, color: textColor },
              ]}
              accessibilityLabel="Duración del pulso en milisegundos"
              returnKeyType="done"
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText type="defaultSemiBold">Pausa (ms)</ThemedText>
            <TextInput
              value={pauseDuration}
              onChangeText={(value) => setPauseDuration(sanitizeNumericValue(value))}
              keyboardType="number-pad"
              inputMode="numeric"
              maxLength={5}
              placeholder="300"
              placeholderTextColor={placeholderColor}
              style={[
                styles.textInput,
                { backgroundColor: inputBackground, borderColor: inputBorder, color: textColor },
              ]}
              accessibilityLabel="Duración de la pausa en milisegundos"
              returnKeyType="done"
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText type="defaultSemiBold">Repeticiones</ThemedText>
            <TextInput
              value={repetitions}
              onChangeText={(value) => setRepetitions(sanitizeNumericValue(value))}
              keyboardType="number-pad"
              inputMode="numeric"
              maxLength={3}
              placeholder="3"
              placeholderTextColor={placeholderColor}
              style={[
                styles.textInput,
                { backgroundColor: inputBackground, borderColor: inputBorder, color: textColor },
              ]}
              accessibilityLabel="Número de repeticiones"
              returnKeyType="done"
            />
          </View>
        </View>

        <View style={styles.switchRow}>
          <Switch
            value={repeatPattern}
            onValueChange={(value) => {
              setRepeatPattern(value);
              void Haptics.selectionAsync();
            }}
            trackColor={{ false: inputBorder, true: primaryColor }}
            ios_backgroundColor={inputBorder}
          />
          <ThemedText>Repetir hasta detener</ThemedText>
        </View>

        <View style={styles.actionsRow}>
          <Pressable
            onPress={handleStartPattern}
            style={({ pressed }) => [
              styles.primaryButton,
              { backgroundColor: primaryColor, opacity: pressed ? 0.85 : 1 },
            ]}>
            <ThemedText style={styles.primaryButtonText}>Iniciar patrón</ThemedText>
          </Pressable>
          <Pressable
            onPress={handleStopPattern}
            disabled={!isRunning}
            style={({ pressed }) => [
              styles.secondaryButton,
              {
                backgroundColor: quickCardBackground,
                borderColor: inputBorder,
                opacity: !isRunning ? 0.5 : pressed ? 0.85 : 1,
              },
            ]}>
            <ThemedText style={[styles.secondaryButtonText, { color: textColor }]}>Detener</ThemedText>
          </Pressable>
        </View>

        {status ? (
          <View style={[styles.statusPill, { backgroundColor: quickCardBackground }]}
            accessibilityLiveRegion="polite">
            <ThemedText style={[styles.statusText, { color: statusColors[status.type] }]}>
              {status.message}
            </ThemedText>
          </View>
        ) : null}

        <ThemedText style={styles.helperText}>
          Consejo: mantén las repeticiones entre 1 y 10 para obtener patrones fáciles de comparar durante las
          pruebas de experiencia de usuario.
        </ThemedText>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    gap: 24,
  },
  heroCard: {
    borderRadius: 24,
    padding: 24,
    gap: 12,
  },
  heroDescription: {
    fontSize: 16,
    lineHeight: 22,
  },
  section: {
    borderRadius: 24,
    padding: 24,
    gap: 16,
  },
  sectionDescription: {
    fontSize: 15,
    lineHeight: 22,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickButton: {
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 18,
    flexBasis: '48%',
    flexGrow: 1,
    gap: 6,
    borderWidth: StyleSheet.hairlineWidth,
  },
  quickSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  inputsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  inputGroup: {
    flex: 1,
    minWidth: 140,
    gap: 8,
  },
  textInput: {
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  primaryButton: {
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flex: 1,
  },
  primaryButtonText: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  secondaryButton: {
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
  },
  secondaryButtonText: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  statusPill: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  helperText: {
    fontSize: 13,
    lineHeight: 18,
  },
});
