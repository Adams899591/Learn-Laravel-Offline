import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  Animated,
  Easing,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Dimensions,
  ImageSourcePropType,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const { width: W, height: H } = Dimensions.get('window');

// Route of your modules list screen (the one you already built)
const MODULES_ROUTE = '/home';

// ---------------------------------------------------------------------------
// The six floating images. x / y are fractions of the screen (0 to 1).
// driftX / driftY = how far each one wanders, tilt = rotation in degrees,
// duration = ms for one half of the loop (bigger = slower).
// ---------------------------------------------------------------------------
type Floater = {
  source: ImageSourcePropType;
  size: number;
  x: number;
  y: number;
  driftX: number;
  driftY: number;
  tilt: number;
  duration: number;
  delay: number;
};

const FLOATERS: Floater[] = [
  { source: require('../assets/images/icon.png'), size: 56, x: 0.08, y: 0.07, driftX: 14, driftY: 22, tilt: 8,  duration: 3800, delay: 0 },
  { source: require('../assets/images/icon.png'), size: 46, x: 0.72, y: 0.1,  driftX: 18, driftY: 16, tilt: 12, duration: 4600, delay: 400 },
  { source: require('../assets/images/icon.png'), size: 40, x: 0.84, y: 0.36, driftX: 10, driftY: 26, tilt: 10, duration: 5200, delay: 900 },
  { source: require('../assets/images/icon.png'), size: 50, x: 0.04, y: 0.62, driftX: 16, driftY: 20, tilt: 9,  duration: 4200, delay: 200 },
  { source: require('../assets/images/icon.png'), size: 42, x: 0.78, y: 0.72, driftX: 12, driftY: 24, tilt: 14, duration: 4900, delay: 700 },
  { source: require('../assets/images/icon.png'), size: 36, x: 0.36, y: 0.9,  driftX: 20, driftY: 12, tilt: 7,  duration: 5600, delay: 1100 },
];

function FloatingImage({ source, size, x, y, driftX, driftY, tilt, duration, delay }: Floater) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const ease = Easing.inOut(Easing.sin);
    const loop = Animated.sequence([
      Animated.delay(delay),
      Animated.loop(
        Animated.sequence([
          Animated.timing(progress, { toValue: 1, duration, easing: ease, useNativeDriver: true }),
          Animated.timing(progress, { toValue: 0, duration, easing: ease, useNativeDriver: true }),
        ])
      ),
    ]);
    loop.start();
    return () => loop.stop();
  }, [delay, duration, progress]);

  const translateX = progress.interpolate({ inputRange: [0, 1], outputRange: [-driftX, driftX] });
  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [driftY, -driftY] });
  const rotate = progress.interpolate({ inputRange: [0, 1], outputRange: [`-${tilt}deg`, `${tilt}deg`] });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.floater,
        {
          left: x * W,
          top: y * H,
          width: size,
          height: size,
          borderRadius: size * 0.3,
          transform: [{ translateX }, { translateY }, { rotate }],
        },
      ]}
    >
      <Image source={source} style={{ width: size * 0.62, height: size * 0.62 }} resizeMode="contain" />
    </Animated.View>
  );
}

export default function WelcomeScreen() {
  return (
    <View className="flex-1">
      <StatusBar barStyle="light-content" backgroundColor="#FF3B30" />

      {/* Background: red gradient + soft light blobs so the glass has something to blur */}
      <LinearGradient
        colors={['#FF5A4F', '#FF3B30', '#B4231B']}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.blob, { width: 260, height: 260, top: -70, right: -80, backgroundColor: 'rgba(255,214,210,0.35)' }]} />
      <View style={[styles.blob, { width: 320, height: 320, bottom: -110, left: -120, backgroundColor: 'rgba(120,10,5,0.45)' }]} />
      <View style={[styles.blob, { width: 150, height: 150, top: H * 0.42, left: W * 0.55, backgroundColor: 'rgba(255,255,255,0.18)' }]} />

      {/* Six floating Laravel images */}
      {FLOATERS.map((f, i) => (
        <FloatingImage key={i} {...f} />
      ))}

      {/* Glass card */}
      <SafeAreaView className="flex-1 justify-center px-6">
        <View style={styles.glassShadow}>
          <BlurView intensity={45} tint="light" style={styles.glass}>
            <View style={styles.logoWrap}>
              <Image
                source={require('../assets/images/icon.png')}
                style={{ width: 52, height: 52 }}
                resizeMode="contain"
              />
            </View>

            <Text className="text-white text-3xl font-extrabold text-center mt-5">
              Learn Laravel Offline
            </Text>
            <Text className="text-white/85 text-sm text-center leading-relaxed mt-3">
              Build real web apps with PHP's most loved framework. Every lesson works without internet, so you can study anywhere.
            </Text>

            {/* Quick facts */}
            <View style={styles.statsRow}>
              <View className="items-center flex-1">
                <Text className="text-white text-xl font-extrabold">28</Text>
                <Text className="text-white/75 text-[11px] mt-0.5">Modules</Text>
              </View>
              <View style={styles.divider} />
              <View className="items-center flex-1">
                <Ionicons name="cloud-offline-outline" size={22} color="#fff" />
                <Text className="text-white/75 text-[11px] mt-1">Works offline</Text>
              </View>
              <View style={styles.divider} />
              <View className="items-center flex-1">
                <Ionicons name="footsteps-outline" size={22} color="#fff" />
                <Text className="text-white/75 text-[11px] mt-1">Step by step</Text>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.replace(MODULES_ROUTE as any)}
              style={styles.button}
            >
              <Text className="text-[#FF3B30] font-extrabold text-base">Start learning</Text>
              <Ionicons name="chevron-forward" size={18} color="#FF3B30" style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </BlurView>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  blob: {
    position: 'absolute',
    borderRadius: 999,
  },
  floater: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  glassShadow: {
    borderRadius: 32,
    shadowColor: '#5B0A05',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.35,
    shadowRadius: 28,
    elevation: 12,
  },
  glass: {
    borderRadius: 32,
    overflow: 'hidden', // needed so the blur respects the rounded corners
    paddingHorizontal: 24,
    paddingVertical: 32,
    backgroundColor: 'rgba(255,255,255,0.14)', // also gives a glass look on Android
    borderWidth: 1.2,
    borderColor: 'rgba(255,255,255,0.45)',
    alignItems: 'center',
  },
  logoWrap: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 22,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginTop: 26,
    paddingVertical: 14,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  button: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    paddingVertical: 15,
    borderRadius: 18,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
});