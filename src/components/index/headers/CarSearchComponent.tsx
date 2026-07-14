import { View } from 'react-native';
// components/CarAnimation.tsx
import { Canvas, useFrame, useThree } from '@react-three/fiber/native';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system/legacy';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text } from 'react-native';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// ─── Easing ──────────────────────────────────────────────────────────────────
const easeOutCubic  = (t: number) => 1 - Math.pow(1 - t, 3);
const easeOutQuart  = (t: number) => 1 - Math.pow(1 - t, 4);
const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;
const clamp01 = (t: number) => Math.max(0, Math.min(1, t));
const phase = (t: number, s: number, e: number) => clamp01((t - s) / (e - s));
const L = THREE.MathUtils.lerp;

// ─── Materials ────────────────────────────────────────────────────────────────
const CLAY = new THREE.MeshStandardMaterial({
  color: 0xEDEAE4, roughness: 0.92, metalness: 0.0, side: THREE.DoubleSide,
});
const HEADLIGHT_OFF = new THREE.MeshStandardMaterial({
  color: 0xDDDDD8, roughness: 0.85, metalness: 0.0, side: THREE.DoubleSide,
});
const HEADLIGHT_ON = new THREE.MeshStandardMaterial({
  color: 0xFFFFCC, roughness: 0.1, metalness: 0.0,
  emissive: new THREE.Color(0xFFEE88), emissiveIntensity: 3.0,
  side: THREE.DoubleSide,
});
const TAILLIGHT_OFF = new THREE.MeshStandardMaterial({
  color: 0xCCAAAA, roughness: 0.85, metalness: 0.0, side: THREE.DoubleSide,
});
const TAILLIGHT_ON = new THREE.MeshStandardMaterial({
  color: 0xFF2200, roughness: 0.1, metalness: 0.0,
  emissive: new THREE.Color(0xFF1100), emissiveIntensity: 4.0,
  side: THREE.DoubleSide,
});

// ─── Model loader ─────────────────────────────────────────────────────────────
interface CarModel {
  scene: THREE.Group;
  headlights: THREE.Mesh[];
  taillights: THREE.Mesh[];
  wheels: THREE.Object3D[];
}

function useCarModel() {
  const [car, setCar] = useState<CarModel | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const asset = Asset.fromModule(require('@/assets/models/boeing_777_airplane.glb'));
        await asset.downloadAsync();
        if (!asset.localUri) return;

        const b64 = await FileSystem.readAsStringAsync(asset.localUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));

        new GLTFLoader().parse(bytes.buffer, '', (gltf) => {
          if (!alive) return;
          const scene = gltf.scene;

          const headlights: THREE.Mesh[] = [];
          const taillights: THREE.Mesh[] = [];
          const wheels: THREE.Object3D[] = [];

          scene.traverse((child: any) => {
            // Collect wheels by node name
            const name: string = child.name ?? '';
            if (name.includes('3DWheel')) {
              wheels.push(child);
            }

            if (!child.isMesh) return;
            const matName: string = child.material?.name ?? '';

            if (matName.includes('LightA')) {
              // Headlight/running light geometry
              child.material = HEADLIGHT_OFF;
              headlights.push(child);
            } else if (matName.includes('red_glass') || matName === 'red_glass') {
              // Taillight lens
              child.material = TAILLIGHT_OFF;
              taillights.push(child);
            } else {
              // Everything else → clay
              child.material = CLAY;
            }
            child.castShadow = true;
          });

          // Center at origin
          const box = new THREE.Box3().setFromObject(scene);
          const center = box.getCenter(new THREE.Vector3());
          scene.position.sub(center);

          const size = box.getSize(new THREE.Vector3());
          console.log('🚗 Car size:', JSON.stringify(size));

          setCar({ scene, headlights, taillights, wheels });
        }, console.error);
      } catch (e) { console.error(e); }
    })();
    return () => { alive = false; };
  }, []);

  return car;
}

// ─── Animation timeline ───────────────────────────────────────────────────────
//
//  0.0 – 0.4s  ESTABLISH   Car is parked off left, dark, static. Camera looks left.
//  0.4 – 0.5s  BIP 1       Lights flash on briefly — blink. Car still parked.
//  0.5 – 0.6s  PAUSE       Lights off.
//  0.6 – 0.7s  BIP 2       Lights flash again — confirmation bip.
//  0.7 – 1.0s  REV UP      Car stays, wheels begin spinning (anticipation)
//  1.0 – 3.0s  DRIVE-IN    Car sweeps from left, accelerating. Camera tracks.
//                           Wheels spin fast. Slight front-weight dip on launch.
//  3.0 – 3.8s  BRAKE       Car decelerates hard, front dips. Wheels slow to stop.
//                           Camera settles to beauty angle: 3/4 front, slightly low.
//  3.8s – ∞    IDLE        Gentle suspension bounce. Camera micro-breathes.

const CAR_SCALE = 0.012;

function Scene({ onLoaded }: { onLoaded: () => void }) {
  const car = useCarModel();
  const { camera } = useThree();

  const carRef   = useRef<any>(null);
  const notified = useRef(false);
  const startT   = useRef<number | null>(null);

  // Camera state
  const camPos    = useRef(new THREE.Vector3(-18, 3.5, 12));
  const camTarget = useRef(new THREE.Vector3(-8, 0, 0));

  // Wheel rotation accumulator
  const wheelRot = useRef(0);

  // Light flash state
  const lightsOn = useRef(false);

  const setLights = (on: boolean) => {
    if (!car || lightsOn.current === on) return;
    lightsOn.current = on;
    car.headlights.forEach(m => { m.material = on ? HEADLIGHT_ON : HEADLIGHT_OFF; });
    car.taillights.forEach(m => { m.material = on ? TAILLIGHT_ON : TAILLIGHT_OFF; });
  };

  useFrame((state) => {
    if (!car || !carRef.current) return;

    if (!notified.current) { notified.current = true; onLoaded(); }
    if (startT.current === null) startT.current = state.clock.getElapsedTime();
    const T = state.clock.getElapsedTime() - startT.current;
    const dt = state.clock.getDelta();

    const c = carRef.current as THREE.Group;

    // ── ESTABLISH (0 → 0.4) ───────────────────────────────────────────────
    if (T < 0.4) {
      c.position.set(-9, 0, 0);
      c.rotation.set(0, -Math.PI * 0.15, 0); // angled slightly toward camera
      c.scale.setScalar(CAR_SCALE);
      setLights(false);
      camPos.current.set(-18, 3.5, 12);
      camTarget.current.set(-9, 0.5, 0);
    }

    // ── BIP 1 (0.4 → 0.5) ────────────────────────────────────────────────
    else if (T < 0.5) {
      setLights(true);
    }

    // ── PAUSE (0.5 → 0.6) ────────────────────────────────────────────────
    else if (T < 0.6) {
      setLights(false);
    }

    // ── BIP 2 (0.6 → 0.75) ───────────────────────────────────────────────
    else if (T < 0.75) {
      setLights(true);
    }

    // ── LIGHTS OFF + REV UP (0.75 → 1.0) ─────────────────────────────────
    else if (T < 1.0) {
      setLights(false);
      // Wheels begin spinning slowly — anticipation
      const revT = phase(T, 0.75, 1.0);
      wheelRot.current += revT * 0.08;
      car.wheels.forEach(w => { w.rotation.x = wheelRot.current; });
    }

    // ── DRIVE-IN (1.0 → 3.0) ─────────────────────────────────────────────
    else if (T < 3.0) {
      const t = phase(T, 1.0, 3.0);
      const e = easeInOutSine(t);
      const launch = easeOutCubic(clamp01(t * 4)); // quick initial burst

      // Car sweeps from far left to center-right, slight front dip on launch
      c.position.set(
        L(-9, 1.5, e),
        L(0, 0, e) - Math.sin(launch * Math.PI) * 0.15, // front dip at launch
        L(0, 0, e),
      );

      // Car faces mostly forward (toward right, away from camera slightly)
      const yaw = L(-Math.PI * 0.15, Math.PI * 0.08, easeOutCubic(t));
      c.rotation.set(0, yaw, 0);
      c.scale.setScalar(CAR_SCALE);

      // Fast wheel spin
      wheelRot.current += 0.18 * (1 - t * 0.3); // slows slightly as speed drops
      car.wheels.forEach(w => { w.rotation.x = wheelRot.current; });

      // Camera: tracks car from behind-left, converges to beauty position
      camPos.current.lerp(new THREE.Vector3(-4, 2.5, 10), 0.04);
      camTarget.current.lerp(new THREE.Vector3(c.position.x, 0.5, 0), 0.06);
    }

    // ── BRAKE (3.0 → 3.8) ────────────────────────────────────────────────
    else if (T < 3.8) {
      const t  = phase(T, 3.0, 3.8);
      const e  = easeOutQuart(t);

      // Nose dips hard under braking, then recovers
      const brakeDip = Math.sin(clamp01(t * 2.5) * Math.PI) * 0.18;

      c.position.set(
        L(1.5, 0, e),
        -brakeDip,
        0,
      );
      c.rotation.set(0, L(Math.PI * 0.08, 0, easeOutQuart(t)), 0);
      c.scale.setScalar(CAR_SCALE);

      // Wheels coast to stop
      const spinDown = 1 - easeOutCubic(t);
      wheelRot.current += 0.18 * spinDown * 0.3;
      car.wheels.forEach(w => { w.rotation.x = wheelRot.current; });

      // Camera: settle to final hero angle — low, 3/4 front
      camPos.current.lerp(new THREE.Vector3(3, 2.0, 9), 0.07);
      camTarget.current.lerp(new THREE.Vector3(0, 0.4, 0), 0.07);
    }

    // ── IDLE (3.8 → ∞) ───────────────────────────────────────────────────
    else {
      const idle = T - 3.8;

      // Gentle suspension: compound sines so it never loops mechanically
      const suspY =  Math.sin(idle * 1.1) * 0.04
                   + Math.sin(idle * 2.3) * 0.015;
      const suspRoll = Math.sin(idle * 0.7) * 0.008;

      c.position.set(0, suspY, 0);
      c.rotation.set(0, 0, suspRoll);
      c.scale.setScalar(CAR_SCALE);

      // Camera breathes imperceptibly
      const breathY = Math.sin(idle * 0.5) * 0.03;
      camPos.current.lerp(new THREE.Vector3(3, 2.0 + breathY, 9), 0.015);
      camTarget.current.lerp(new THREE.Vector3(0, 0.4 + suspY * 0.3, 0), 0.02);
    }

    // Apply camera every frame
    camera.position.copy(camPos.current);
    camera.lookAt(camTarget.current);
  });

  if (!car) return null;

  return (
    <primitive
      ref={carRef}
      object={car.scene}
      scale={CAR_SCALE}
      position={[-9, 0, 0]}
      rotation={[0, -Math.PI * 0.15, 0]}
    />
  );
}

export default function CarAnimation() {
  const cardOpacity  = useRef(new Animated.Value(0)).current;
  const taglineY     = useRef(new Animated.Value(14)).current;
  const subOpacity   = useRef(new Animated.Value(0)).current;
  const dotPulse     = useRef(new Animated.Value(0)).current;

  const handleLoaded = () => {
    // Reveal text just as car brakes to a stop
    setTimeout(() => {
      Animated.sequence([
        Animated.timing(cardOpacity, {
          toValue: 1, duration: 450,
          easing: Easing.out(Easing.ease), useNativeDriver: true,
        }),
        Animated.parallel([
          Animated.timing(taglineY, {
            toValue: 0, duration: 420,
            easing: Easing.out(Easing.back(1.5)), useNativeDriver: true,
          }),
          Animated.timing(subOpacity, {
            toValue: 1, duration: 500,
            easing: Easing.out(Easing.ease), useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(dotPulse, { toValue: 1, duration: 950, useNativeDriver: true }),
            Animated.timing(dotPulse, { toValue: 0, duration: 950, useNativeDriver: true }),
          ])
        ).start();
      });
    }, 3900);
  };

  const dotScale   = dotPulse.interpolate({ inputRange: [0,1], outputRange: [0.8, 1.4] });
  const dotOpacity = dotPulse.interpolate({ inputRange: [0,1], outputRange: [0.4, 1.0] });

  return (
    <View style={styles.wrapper}>
      <View style={[StyleSheet.absoluteFill, styles.bgTop]} />
      <View style={[StyleSheet.absoluteFill, styles.bgBottom]} />

      <Canvas
        style={StyleSheet.absoluteFill}
        camera={{ position: [-18, 3.5, 12], fov: 48, near: 0.1, far: 500 }}
        gl={{ antialias: true }}
      >
        {/* Three-point lighting optimized for clay + emissive lights */}
        <ambientLight intensity={0.65} />
        {/* Warm key from upper-right front */}
        <directionalLight position={[8, 12, 8]}   intensity={1.8} color={0xFFFAF0} />
        {/* Cool fill from left */}
        <directionalLight position={[-10, 6, 4]}  intensity={0.5} color={0xEEF4FF} />
        {/* Ground rim — subtle warm bounce */}
        <directionalLight position={[0, -4, 6]}   intensity={0.25} color={0xFFF0E0} />

        <Scene onLoaded={handleLoaded} />
      </Canvas>

      {/* Text card */}
      <Animated.View style={[styles.card, { opacity: cardOpacity }]}>
        <View style={styles.pill}>
          <Animated.View style={[
            styles.dot,
            { transform: [{ scale: dotScale }], opacity: dotOpacity },
          ]} />
          <Text style={styles.pillText}>COMING SOON</Text>
        </View>

        <Animated.Text style={[styles.tagline, { transform: [{ translateY: taglineY }] }]}>
          Cars are on{'\n'}their way 🚗
        </Animated.Text>

        <Animated.Text style={[styles.sub, { opacity: subOpacity }]}>
          Premium car rentals, arriving soon.{'\n'}We're putting the finishing touches on it.
        </Animated.Text>
      </Animated.View>
    </View>
  );
}

const TEAL = '#047575'; 

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: 360,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#ECEEF1',
  },
  bgTop: {
    bottom: '40%',
    backgroundColor: '#E8ECF2',
  },
  bgBottom: {
    top: '60%',
    backgroundColor: '#F0F1F2',
  },
  card: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    paddingHorizontal: 22,
    paddingBottom: 22,
    paddingTop: 14,
    backgroundColor: 'rgba(236,238,241,0.85)',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: `${TEAL}18`,
    borderWidth: 1,
    borderColor: `${TEAL}35`,
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10,
    gap: 6,
  },
  dot: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: TEAL,
  },
  pillText: {
    fontSize: 10, fontWeight: '700',
    letterSpacing: 1.8, color: TEAL,
  },
  tagline: {
    fontSize: 22, fontWeight: '800',
    color: '#111C27', letterSpacing: -0.5,
    lineHeight: 28, marginBottom: 6,
  },
  sub: {
    fontSize: 13, color: '#667788', lineHeight: 20,
  },
});

// const CarSearchComponent = () => {
//   return (
//     <View>
//       <ThemedText>CarSearchComponent</ThemedText>
//       <PureNativeButton >hello</PureNativeButton>
//     </View>
//   )
// }

// export default CarSearchComponent