import { useEffect, useRef } from "react";
import * as THREE from "three";
import TypingText from "./TypingText";

export default function Kaaba3D({ className = "" }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 1.2, 4.6);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.appendChild(renderer.domElement);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambient);

    const key = new THREE.DirectionalLight(0xffffff, 0.9);
    key.position.set(3, 4, 2);
    scene.add(key);

    const rim = new THREE.DirectionalLight(0x93c5fd, 0.35);
    rim.position.set(-4, 1, -2);
    scene.add(rim);

    // Group (Kaaba)
    const group = new THREE.Group();
    scene.add(group);

    // body
    const bodyGeo = new THREE.BoxGeometry(1.25, 1.5, 1.25);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x0b0f1a,
      roughness: 0.85,
      metalness: 0.05,
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.75;
    group.add(body);

    // gold band
    const bandGeo = new THREE.BoxGeometry(1.27, 0.12, 1.27);
    const bandMat = new THREE.MeshStandardMaterial({
      color: 0xf5d36b,
      roughness: 0.35,
      metalness: 0.55,
      emissive: 0x1a1200,
      emissiveIntensity: 0.08,
    });
    const band = new THREE.Mesh(bandGeo, bandMat);
    band.position.y = 1.33;
    group.add(band);

    // base
    const baseGeo = new THREE.CylinderGeometry(0.95, 1.05, 0.12, 48);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.95,
      metalness: 0.0,
      transparent: true,
      opacity: 0.9,
    });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.06;
    group.add(base);

    // Stars
    const starCount = 240;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const r = THREE.MathUtils.randFloat(2.0, 7.0);
      const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);
      const y = THREE.MathUtils.randFloat(-1.5, 3.5);
      starPos[i * 3 + 0] = Math.cos(theta) * r;
      starPos[i * 3 + 1] = y;
      starPos[i * 3 + 2] = Math.sin(theta) * r;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.02,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // Resize
    const resize = () => {
      const w = el.clientWidth || 400;
      const h = el.clientHeight || 400;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    resize();
    window.addEventListener("resize", resize);

    // Animation: only gentle rotation, stays upright
    let raf = 0;
    const clock = new THREE.Clock();
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // upright, only rotate around Y
      group.rotation.x = 0;
      group.rotation.z = 0;
      group.rotation.y = t * 0.35;

      stars.rotation.y = t * 0.05;

      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);

      renderer.dispose();
      el.removeChild(renderer.domElement);

      bodyGeo.dispose();
      bodyMat.dispose();
      bandGeo.dispose();
      bandMat.dispose();
      baseGeo.dispose();
      baseMat.dispose();
      starGeo.dispose();
      starMat.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={[
        "relative h-[380px] w-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent",
        className,
      ].join(" ")}
    >
      {/* subtle glow overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.18),transparent_55%)]" />

        {/* ✅ Pure text overlay + shine */}
        <div className="pointer-events-none absolute left-4 right-4 top-6 text-center">
        <div className="rt-hero-text text-2xl font-semibold tracking-tight md:text-3xl">
            <TypingText
            text="Percayakan Ibadah Haji & Umroh Anda"
            speed={55}
            startDelay={450}
            fadeIn
            cursor
            stopCursorOnDone
            className="rt-shine"
            />
        </div>

        <div className="mt-2 rt-hero-text text-xl md:text-2xl">
            <TypingText
            text="Bersama "
            speed={58}
            startDelay={2000}
            fadeIn
            cursor={false}
            className="rt-shine-soft"
            />
            <span className="font-semibold">
            <TypingText
                text="Rizqi Travel"
                speed={58}
                startDelay={2200}
                fadeIn
                cursor
                stopCursorOnDone={false}
                className="rt-shine"
            />
            </span>
        </div>
        </div>
    </div>
  );
}