// components/FlightSearchComponent.tsx
import { ThemedView } from '@/components/themed-view';
import { Canvas, useFrame, useThree } from '@react-three/fiber/native';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system/legacy';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// ─── 3D model hook ───────────────────────────────────────────────────────────
function usePlaneModel() {
  const [model, setModel] = useState<THREE.Group | null>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const asset = Asset.fromModule(require('@/assets/models/boeing_777_airplane.glb'));
        await asset.downloadAsync();
        if (!asset.localUri) return;

        const base64Data = await FileSystem.readAsStringAsync(asset.localUri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const bytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
        const loader = new GLTFLoader();

        loader.parse(bytes.buffer, '', (gltf) => {
          if (!isMounted) return;
          const scene = gltf.scene;

          scene.traverse((child: any) => {
            if (child.isMesh) {
              child.material = new THREE.MeshStandardMaterial({
                color: 0xECEAE6,
                roughness: 0.88,
                metalness: 0.0,
                side: THREE.DoubleSide,
              });
              child.castShadow = true;
            }
          });

          const box = new THREE.Box3().setFromObject(scene);
          const center = box.getCenter(new THREE.Vector3());
          scene.position.sub(center);
          setModel(scene);
        }, (e) => console.error('parse error:', e));
      } catch (e) {
        console.error('load error:', e);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  return model;
}


function Scene({ onLoaded }: { onLoaded: () => void }) {
  const model = usePlaneModel();
  const { camera } = useThree();
  const notified = useRef(false);

  const planeRef = useRef<THREE.Group>(null);
  const startTime = useRef<number | null>(null);

  useFrame((state) => {
    if (!model || !planeRef.current) return;

    if (!notified.current) {
      notified.current = true;
      onLoaded();
    }

    if (startTime.current === null) startTime.current = state.clock.getElapsedTime();
    const elapsed = state.clock.getElapsedTime() - startTime.current;

    const FLY_IN = 1.8;
    const TOTAL  = 4.0;

    if (elapsed < FLY_IN) {
  const t = elapsed / FLY_IN;
  const eased = 1 - Math.pow(1 - t, 3);

  camera.position.set(-16, 5, 2);
  camera.lookAt(0, 0, 0);

  // Start far away (small) center-right, fly toward camera (gets bigger)
  planeRef.current.position.set(
    THREE.MathUtils.lerp(20, -2, eased),   // comes from right → left
    THREE.MathUtils.lerp(2, -0.5, eased),  // slight descent
    THREE.MathUtils.lerp(-20, 0, eased)    // flies toward camera
  );

  // No Math.PI — nose faces forward naturally
  planeRef.current.rotation.set(
    THREE.MathUtils.lerp(0.05, 0.02, eased),   // slight nose-up
    THREE.MathUtils.lerp(-0.2, 0.1, eased),    // subtle yaw
    THREE.MathUtils.lerp(0.15, 0, eased)       // rolls level
  );

  // Scale up: starts tiny (far away feel), ends bigger than before
  planeRef.current.scale.setScalar(
    THREE.MathUtils.lerp(0.001, 0.005, eased)  // grows as it approaches
  );

} else {
  // Idle — keep same end scale
  const idleT = elapsed - FLY_IN;

  camera.position.set(-16, 5, 2);
  camera.lookAt(0, 0, 0);

  const floatY    = Math.sin(idleT * 1.2) * 0.3;
  const floatRoll = Math.sin(idleT * 0.8) * 0.03;

  planeRef.current.position.set(
    -2 + Math.sin(idleT * 0.3) * 0.3,
    -0.5 + floatY,
    0
  );
  planeRef.current.rotation.set(
    0.02,
    0.1,
    floatRoll
  );
  planeRef.current.scale.setScalar(0.005);
}
  });

  if (!model) return null;

  return (
    <primitive
    ref={planeRef}
    object={model}
    scale={0.001}
    position={[20, 2, -20]}
    rotation={[0.05, -0.2, 0.15]}
  />
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function FlightSearchComponent() {
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const taglineSlide   = useRef(new Animated.Value(12)).current;
  const dotAnim        = useRef(new Animated.Value(0)).current;

  const handleLoaded = () => {
    // Reveal overlay after plane arrives (~1.8s)
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 1, duration: 600, useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
        Animated.timing(taglineSlide, {
          toValue: 0, duration: 600, useNativeDriver: true,
          easing: Easing.out(Easing.back(1.4)),
        }),
      ]).start();

      // Pulsing dot
      Animated.loop(
        Animated.sequence([
          Animated.timing(dotAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
          Animated.timing(dotAnim, { toValue: 0, duration: 900, useNativeDriver: true }),
        ])
      ).start();
    }, 1900);
  };

  const dotScale = dotAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.6] });
  const dotOpacity = dotAnim.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] });

  return (
    <ThemedView style={styles.wrapper}>
      <View style={styles.skyTop} />
      <View style={styles.skyBottom} />

      <Canvas
        style={StyleSheet.absoluteFill}
        camera={{ position: [-16, 5, 2], fov: 52, near: 0.1, far: 1000 }}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[12, 18, 8]}  intensity={2.2} />
        <directionalLight position={[-8, 6, -10]} intensity={0.7} />
        <directionalLight position={[0, -5, 5]}   intensity={0.3} />
        <Scene onLoaded={handleLoaded} />
      </Canvas>

      <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>

        <Animated.Text style={[
          styles.tagline,
          { transform: [{ translateY: taglineSlide }] }
        ]}>
          Flights are on their way
        </Animated.Text>

        <Text style={styles.sub}>
          We're working on bringing you the best flight deals.{'\n'}Stay tuned.
        </Text>
      </Animated.View>

    </ThemedView>
  );
}

const TEAL = '#00B4A6';

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: 340,
    overflow: 'hidden',
    borderRadius: 16,
  },
  skyTop: {
    ...StyleSheet.absoluteFill,
    bottom: '40%',
  },
  skyBottom: {
    ...StyleSheet.absoluteFill,
    top: '60%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 12,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: `${TEAL}18`,
    borderWidth: 1,
    borderColor: `${TEAL}40`,
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 8,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: TEAL,
  },
  pillText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: TEAL,
  },
  tagline: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A2B3C',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  sub: {
    fontSize: 12,
    color: '#6B7C8D',
    lineHeight: 18,
  },
});