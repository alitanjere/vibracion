import { StyleSheet } from 'react-native';

import { Collapsible } from '@/components/ui/collapsible';
import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';

export default function ExploreScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D8F1FF', dark: '#102334' }}
      headerImage={
        <IconSymbol
          size={300}
          color="#0284C7"
          name="waveform.path.ecg"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}>
          Guía de vibraciones
        </ThemedText>
      </ThemedView>

      <ThemedText style={styles.paragraph}>
        Aprende a combinar respuestas hápticas para reforzar acciones importantes y mejorar la accesibilidad
        de tus flujos. Aquí encontrarás recomendaciones para documentar patrones y evitar fatiga en la
        experiencia de uso.
      </ThemedText>

      <Collapsible title="Tipos de respuesta rápida">
        <ThemedText>
          Las opciones del inicio utilizan <ThemedText type="defaultSemiBold">expo-haptics</ThemedText> para
          disparar respuestas nativas. Prueba cada combinación y toma nota de la sensación generada.
        </ThemedText>
        <ThemedText style={styles.bullet}>{'\u2022 '}Impactos: ligeros, medios y pesados. Úsalos para
          confirmar acciones según su prioridad.</ThemedText>
        <ThemedText style={styles.bullet}>{'\u2022 '}Notificaciones: combinan vibraciones con diferentes
          intensidades y son útiles para estados como éxito, error o advertencia.</ThemedText>
      </Collapsible>

      <Collapsible title="Construye un patrón personalizado">
        <ThemedText>
          Ajusta la duración del pulso y de la pausa en milisegundos. Con{' '}
          <ThemedText type="defaultSemiBold">Repeticiones</ThemedText> defines cuántas veces se ejecuta el
          ciclo antes de detenerse.
        </ThemedText>
        <ThemedText>
          Activa la opción <ThemedText type="defaultSemiBold">Repetir hasta detener</ThemedText> para dejarlo
          funcionando en loop y evalúa la reacción del usuario al detener manualmente la vibración.
        </ThemedText>
        <ThemedText style={styles.note}>
          Nota: Los patrones personalizados sólo están disponibles en dispositivos Android. En iOS utiliza los
          impactos y notificaciones rápidas.
        </ThemedText>
      </Collapsible>

      <Collapsible title="Buenas prácticas de diseño">
        <ThemedText style={styles.bullet}>{'\u2022 '}Mantén sesiones de prueba cortas para evitar
          fatiga. Un patrón excesivo puede generar incomodidad.</ThemedText>
        <ThemedText style={styles.bullet}>{'\u2022 '}Documenta tus configuraciones (pulso, pausa y
          repeticiones) para replicarlas fácilmente en siguientes iteraciones.</ThemedText>
        <ThemedText style={styles.bullet}>{'\u2022 '}Combina la vibración con otros canales de feedback,
          como cambios de color o mensajes en pantalla.</ThemedText>
      </Collapsible>

      <Collapsible title="Recursos recomendados">
        <ThemedText>
          Revisa estas guías para profundizar en la implementación de vibraciones y patrones hápticos:
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/versions/latest/sdk/haptics/">
          <ThemedText type="link">Documentación de expo-haptics</ThemedText>
        </ExternalLink>
        <ExternalLink href="https://reactnative.dev/docs/vibration">
          <ThemedText type="link">API Vibration de React Native</ThemedText>
        </ExternalLink>
        <ExternalLink href="https://material.io/design/platform-guidance/android-haptics.html">
          <ThemedText type="link">Guía de patrones hápticos de Material Design</ThemedText>
        </ExternalLink>
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    bottom: -90,
    left: -45,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  paragraph: {
    marginBottom: 12,
    lineHeight: 22,
    fontSize: 15,
  },
  bullet: {
    marginTop: 8,
    lineHeight: 20,
    fontSize: 14,
  },
  note: {
    marginTop: 12,
    lineHeight: 20,
    fontSize: 14,
    fontStyle: 'italic',
  },
});
