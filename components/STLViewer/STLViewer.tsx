'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

type STLViewerProps = {
  modelFileName: string;
  materialColor?: string; // assuming HEX or HEXA
};

const STLViewer: React.FC<STLViewerProps> = ({ modelFileName, materialColor }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const gridHelperRef = useRef<THREE.GridHelper | null>(null);
  const axesHelperRef = useRef<THREE.AxesHelper | null>(null);

  const parseMaterialColorToHexAlpha = (color: string): { hex: string; alpha: number } => {
    if (!color || color.length < 7) return { hex: '#7777ff', alpha: 1 }; // default color if invalid

    const hex = color.slice(0, 7); // Always take the first 7 chars (#RRGGBB)
    const alphaHex = color.length === 9 ? color.slice(7) : 'ff'; // Default to fully opaque
    const alpha = parseInt(alphaHex, 16) / 255; // Convert hex to alpha (0-1 range)

    return { hex, alpha };
  };

  useEffect(() => {
    // TODO: add loading animation when re-rendering full model
    // TODO: OR attempt to keep grid and axes helpers present when re-rendering
    if (!mountRef.current) return;

    const container = mountRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeeeeee);

    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(75, 75, 100); // TODO: make this dynamic based on model size
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);

    // Material Color
    const { hex, alpha } = parseMaterialColorToHexAlpha(materialColor || '#7777ff');

    // Load STL file
    const modelPath = `/3d-models/stls/${modelFileName}.stl`;
    const loader = new STLLoader();

    loader.load(
      modelPath,
      (geometry) => {
        geometry.computeBoundingBox();
        const boundingBox = geometry.boundingBox;

        const center = new THREE.Vector3();
        boundingBox!.getCenter(center);
        geometry.translate(-center.x, -center.y, -center.z); // center the geometry

        const size = new THREE.Vector3();
        boundingBox!.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);

        const scale = 50 / maxDim; // arbitrary base size, adjust as needed
        geometry.scale(scale, scale, scale);

        const material = new THREE.MeshPhongMaterial({
          color: hex || 0x7777ff,
          transparent: true,
          opacity: alpha,
        });
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        meshRef.current = mesh;

        const gridSize = 60; // match your scale target (50) + buffer
        const divisions = Math.max(10, Math.floor(gridSize / 5));

        const gridHelper = new THREE.GridHelper(gridSize, divisions);
        gridHelper.position.y = (-size.y * scale) / 2 - 0.01; // slightly below model
        scene.add(gridHelper);

        const axesHelper = new THREE.AxesHelper(gridSize * 0.5);
        scene.add(axesHelper);

        gridHelperRef.current = gridHelper;
        axesHelperRef.current = axesHelper;
      },
      undefined,
      (error) => {
        console.error('Error loading STL file:', error);
      }
    );

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize handling
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      if (meshRef.current) {
        scene.remove(meshRef.current);
        meshRef.current.geometry.dispose();
        if (Array.isArray(meshRef.current.material)) {
          meshRef.current.material.forEach((mat) => mat.dispose());
        } else {
          meshRef.current.material.dispose();
        }
      }
      if (gridHelperRef.current) {
        scene.remove(gridHelperRef.current);
      }
      if (axesHelperRef.current) {
        scene.remove(axesHelperRef.current);
      }
    };
  }, [modelFileName]);

  useEffect(() => {
    // check if HEX (color) or HEXA (color + alpha)
    if (!materialColor || materialColor.length < 7 || !meshRef.current) return;

    const { hex, alpha } = parseMaterialColorToHexAlpha(materialColor);

    if (meshRef.current) {
      (meshRef.current.material as THREE.MeshPhongMaterial).color.set(hex);
      (meshRef.current.material as THREE.MeshPhongMaterial).opacity = alpha;
    }
  }, [materialColor]);

  return <div ref={mountRef} style={{ width: '100%', height: '100%', position: 'relative' }} />;
};

export default STLViewer;
