import { useCallback } from 'react';
import { Pressable, StyleSheet, View, Vibration } from 'react-native';
import * as Haptics from 'expo-haptics';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function HomeScreen() {
  const accentColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({ light: '#F8FAFC', dark: '#050B11' }, 'background');
  const cardColor = useThemeColor({ light: '#FFFFFF', dark: '#101924' }, 'background');
  const subtleText = useThemeColor({ light: '#475569', dark: '#94A3B8' }, 'icon');

  const handlePress = useCallback(() => {
    Vibration.cancel();
    Vibration.vibrate(500);
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  }, []);

  return (
    <ThemedView style={[styles.screen, { backgroundColor }]}
      accessibilityLabel="Pantalla principal con un botón grande para activar vibración">
      <ThemedView style={[styles.card, { backgroundColor: cardColor }]}
        accessibilityRole="summary">
        <ThemedText type="title" style={styles.title}>
          Vibración instantánea
        </ThemedText>
        <ThemedText style={[styles.subtitle, { color: subtleText }]}>
          Presiona el botón para sentir un pulso háptico fuerte. Ideal para pruebas rápidas de interacción.
        </ThemedText>
      </ThemedView>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Activar vibración"
        onPress={handlePress}
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: accentColor,
            transform: pressed ? [{ scale: 0.98 }] : undefined,
            shadowColor: accentColor,
            opacity: pressed ? 0.92 : 1,
          },
        ]}>
        <View style={styles.buttonContent}>
          <ThemedText style={styles.buttonText}>Activar vibración</ThemedText>
        </View>
      </Pressable>

      <ThemedText style={[styles.helper, { color: subtleText }]}>
        Consejo: mantené presionado para repetir la vibración cuando lo necesites.
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 32,
  },
  card: {
    width: '100%',
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingVertical: 28,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.08,
    shadowRadius: 32,
    elevation: 8,
  },
  title: {
    textAlign: 'center',
    fontSize: 28,
    letterSpacing: 0.4,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 22,
  },
  button: {
    width: '100%',
    borderRadius: 32,
    paddingVertical: 28,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 40,
    elevation: 10,
  },
  buttonContent: {
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  helper: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
    maxWidth: 320,
  },
});
