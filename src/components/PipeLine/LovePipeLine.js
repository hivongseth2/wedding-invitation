import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const LoveJourney = () => {
    const canvasRef = useRef(null);
    const wrapperRef = useRef(null);
  
    // Biến cấu hình ảnh
    const imageUrls = [
      '/images/1.png', // Ảnh 1: Trái tim
      '/images/2.jpg', // Ảnh 2: Hoa hồng
      'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8', // Ảnh 3: Cặp đôi
    ];
  
    useEffect(() => {
      const ww = window.innerWidth;
      const wh = window.innerHeight;
  
      const renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        antialias: true, // Bật antialias để ảnh đẹp hơn
        powerPreference: 'high-performance',
      });
      renderer.setSize(ww, wh);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x2a002a); // Nền sáng hơn một chút
  
      const scene = new THREE.Scene();
      scene.fog = new THREE.Fog(0xff99cc, 0, 80);
  
      const camera = new THREE.PerspectiveCamera(45, ww / wh, 0.1, 100);
      const cameraGroup = new THREE.Group();
      cameraGroup.position.z = 300;
      cameraGroup.add(camera);
      scene.add(cameraGroup);
  
      // Điều chỉnh đường ống, làm mượt và giảm độ gấp khúc
      const points = [
        [0, 0, 0],
        [30, 15, 15], // Giảm độ gấp khúc
        [60, 15, 45], // Làm mượt hơn
        [60, 30, 60],
      ].map(p => new THREE.Vector3(p[0], p[2], p[1]));
  
      const path = new THREE.CatmullRomCurve3(points);
      path.tension = 1; // Giảm tension để đường mượt hơn
  
      const tubeGeometry = new THREE.TubeGeometry(path, 80, 3.5, 12, false);
      const wireframeMaterial = new THREE.MeshBasicMaterial({
        color: 0xff80bf, // Màu hồng tươi sáng hơn
        wireframe: true,
        transparent: true,
        opacity: 0.1,
      });
      const wireframe = new THREE.Mesh(tubeGeometry, wireframeMaterial);
      scene.add(wireframe);
  
      // Thêm trái tim và ảnh, giữ nguyên như mã trước
      const heartShape = new THREE.Shape();
      heartShape.moveTo(0, 0);
      heartShape.bezierCurveTo(0, -0.5, -1, -1, -1, -2);
      heartShape.bezierCurveTo(-1, -3, 0, -3, 0, -4);
      heartShape.bezierCurveTo(0, -3, 1, -3, 1, -2);
      heartShape.bezierCurveTo(1, -1, 0, -0.5, 0, 0);

  

      // Thêm các tấm ảnh với viền sáng
      const textureLoader = new THREE.TextureLoader();
      const imagePlanes = [];
      imageUrls.forEach((url, index) => {
        const texture = textureLoader.load(url);
        const planeGeometry = new THREE.PlaneGeometry(4, 4); // Tăng kích thước ảnh
        const planeMaterial = new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.75,
        });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        const t = (index + 1) / (imageUrls.length + 1);
        const pos = path.getPointAt(t);
        plane.position.copy(pos);
        plane.rotation.x = Math.PI / 2;
        plane.rotation.z = Math.PI

        scene.add(plane);
  
        // Thêm viền sáng cho ảnh
       
        imagePlanes.push(plane);
      });
  
      // Ánh sáng mạnh hơn
      const ambientLight = new THREE.AmbientLight(0xff80bf, 0.8); // Sáng hơn
      scene.add(ambientLight);
  
      const pointLight = new THREE.PointLight(0xffb3d9, 1.5, 50); // Tăng cường độ ánh sáng
      pointLight.position.set(0, 0, 50);
      scene.add(pointLight);
  
      // Hạt sáng
      const particleCount = 100; // Tăng nhẹ để lung linh hơn
      const particles = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
  
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = Math.random() * 150 - 75;
        positions[i * 3 + 1] = Math.random() * 30 - 15;
        positions[i * 3 + 2] = Math.random() * 150 - 75;
      }
  
      particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const particleMaterial = new THREE.PointsMaterial({
        color: 0xffb3d9,
        size: 0.3,
        transparent: true,
        blending: THREE.AdditiveBlending,
      });
  
      const particleSystem = new THREE.Points(particles, particleMaterial);
      scene.add(particleSystem);
  
      // Animation

      // Animation
      let cameraTargetPercentage = 0;
      let currentCameraPercentage = 0;
  
      const updateCamera = (percentage) => {
        const p1 = path.getPointAt(percentage % 1);
        const p2 = path.getPointAt((percentage + 0.1) % 1); // Tăng offset để mượt hơn config camerra
        cameraGroup.position.set(p1.x, p1.y, p1.z);
        cameraGroup.lookAt(p2);
      };
  
      gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current.querySelector('.scrollTarget'),
          start: 'top top',
          end: 'bottom 100%',
          scrub: 5,
        }
      }).to({ percent: 0 }, {
        // config pilepine
        percent: 0.9,
        duration: 9,
        onUpdate: function() {
          cameraTargetPercentage = this.targets()[0].percent;
        }
      });
  
      // Render loop
      let lastTime = 0;
      const fps = 30;
      const frameInterval = 500 / fps;
  
      const animate = (time) => {
        if (time - lastTime >= frameInterval) {
          lastTime = time;
          currentCameraPercentage = cameraTargetPercentage;
          updateCamera(currentCameraPercentage);
          renderer.render(scene, camera);
        }
        requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
  
      // Resize
      const handleResize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };
      window.addEventListener('resize', handleResize);
  
      return () => {
        window.removeEventListener('resize', handleResize);
        renderer.dispose();
        tubeGeometry.dispose();
        // heartGeometry.dispose();
        // heartMaterial.dispose();
      };
    }, []);
  
    // Styled components
    const Wrapper = styled.div`
      .experience {
        position: sticky;
        top: 0;
        left: 0;
        width: 100%;
        height: 1000vh;
        z-index: 2;
      }
  
      .scrollTarget {
        position: absolute;
        height: 6000vh;
        width: 100px;
        top: 0;
        z-index: 0;
      }
  
      .vignette-radial {
        position: fixed;
        z-index: 11;
        top: 0;
        left: 0;
        height: 100vh;
        width: 100%;
        pointer-events: none;
        
        &:after {
          pointer-events: none;
          content: ' ';
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          background: radial-gradient(circle, transparent 60%, rgba(255, 102, 178, 0.2) 150%);
        }
      }
    `;
  
    return (
      <Wrapper ref={wrapperRef}>
        <canvas className="experience" ref={canvasRef}></canvas>
        <div className="scrollTarget"></div>
        <div className="vignette-radial"></div>
      </Wrapper>
    );
  };
  
export default LoveJourney;