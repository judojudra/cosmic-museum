/**
 * COSMIC MUSEUM - Advanced Starfield System
 * Multi-layer parallax stars with enhanced shooting stars,
 * deep nebula clouds, and cinematic depth
 */

class CosmicStarfield {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.stars = [];
    this.shootingStars = [];
    this.nebulaClouds = [];
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.scrollY = 0;
    this.time = 0;

    this.config = {
      starCount: 600,
      layers: 5,
      shootingStarInterval: 3000,
      nebulaCount: 6
    };

    this.init();
  }

  init() {
    this.resize();
    this.createStars();
    this.createNebulaClouds();
    this.bindEvents();
    this.animate();
    this.scheduleShootingStar();
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.canvas.style.width = this.width + 'px';
    this.canvas.style.height = this.height + 'px';
    this.ctx.scale(dpr, dpr);
  }

  createStars() {
    this.stars = [];

    for (let i = 0; i < this.config.starCount; i++) {
      const layer = Math.floor(Math.random() * this.config.layers);
      const layerMultiplier = (layer + 1) / this.config.layers;

      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        baseX: Math.random() * this.width,
        baseY: Math.random() * this.height,
        size: Math.random() * 1.8 * layerMultiplier + 0.3,
        opacity: Math.random() * 0.6 + 0.2,
        twinkleSpeed: Math.random() * 0.015 + 0.005,
        twinkleOffset: Math.random() * Math.PI * 2,
        layer: layer,
        parallaxFactor: layerMultiplier * 0.6,
        hue: Math.random() > 0.85 ? (Math.random() > 0.5 ? 210 : 35) : 0,
        saturation: Math.random() > 0.85 ? 70 : 0
      });
    }
  }

  createNebulaClouds() {
    this.nebulaClouds = [];

    const colors = [
      { r: 0, g: 212, b: 255, a: 0.02 },
      { r: 200, g: 80, b: 255, a: 0.015 },
      { r: 74, g: 114, b: 255, a: 0.018 },
      { r: 0, g: 224, b: 136, a: 0.012 },
      { r: 255, g: 200, b: 87, a: 0.01 }
    ];

    for (let i = 0; i < this.config.nebulaCount; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      this.nebulaClouds.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 350 + 200,
        color: color,
        driftX: (Math.random() - 0.5) * 0.15,
        driftY: (Math.random() - 0.5) * 0.08,
        pulseSpeed: Math.random() * 0.0008 + 0.0003,
        pulseOffset: Math.random() * Math.PI * 2
      });
    }
  }

  createShootingStar() {
    const startX = Math.random() * this.width * 0.8;
    const startY = Math.random() * this.height * 0.4;
    const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.4;

    this.shootingStars.push({
      x: startX,
      y: startY,
      length: Math.random() * 140 + 80,
      speed: Math.random() * 18 + 12,
      angle: angle,
      opacity: 1,
      decay: 0.012,
      thickness: Math.random() * 1.5 + 0.8,
      // Particle trail
      particles: [],
      particleTimer: 0
    });
  }

  scheduleShootingStar() {
    const interval = this.config.shootingStarInterval + Math.random() * 2500;
    setTimeout(() => {
      this.createShootingStar();
      // Occasional burst of 2-3 shooting stars
      if (Math.random() > 0.7) {
        setTimeout(() => this.createShootingStar(), 200 + Math.random() * 400);
      }
      this.scheduleShootingStar();
    }, interval);
  }

  bindEvents() {
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        this.resize();
        this.createStars();
        this.createNebulaClouds();
      }, 150);
    });

    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = (e.clientX / this.width - 0.5) * 2;
      this.mouse.targetY = (e.clientY / this.height - 0.5) * 2;
    });

    window.addEventListener('scroll', () => {
      this.scrollY = window.scrollY;
    }, { passive: true });
  }

  drawNebulaClouds() {
    this.nebulaClouds.forEach(cloud => {
      cloud.x += cloud.driftX;
      cloud.y += cloud.driftY;

      if (cloud.x < -cloud.radius) cloud.x = this.width + cloud.radius;
      if (cloud.x > this.width + cloud.radius) cloud.x = -cloud.radius;
      if (cloud.y < -cloud.radius) cloud.y = this.height + cloud.radius;
      if (cloud.y > this.height + cloud.radius) cloud.y = -cloud.radius;

      const pulse = Math.sin(this.time * cloud.pulseSpeed + cloud.pulseOffset) * 0.3 + 0.7;

      const gradient = this.ctx.createRadialGradient(
        cloud.x, cloud.y, 0,
        cloud.x, cloud.y, cloud.radius
      );

      const { r, g, b, a } = cloud.color;
      gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${a * pulse})`);
      gradient.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, ${a * 0.4 * pulse})`);
      gradient.addColorStop(1, 'transparent');

      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(0, 0, this.width, this.height);
    });
  }

  drawStars() {
    this.stars.forEach(star => {
      const parallaxX = this.mouse.x * star.parallaxFactor * 25;
      const parallaxY = this.mouse.y * star.parallaxFactor * 25;
      const scrollParallax = this.scrollY * star.parallaxFactor * 0.08;

      star.x = star.baseX + parallaxX;
      star.y = star.baseY + parallaxY - scrollParallax;

      // Wrap
      if (star.y < -10) star.baseY += this.height + 20;
      if (star.y > this.height + 10) star.baseY -= this.height + 20;
      if (star.x < -10) star.x += this.width + 20;
      if (star.x > this.width + 10) star.x -= this.width + 20;

      const twinkle = Math.sin(this.time * star.twinkleSpeed + star.twinkleOffset);
      const currentOpacity = star.opacity * (0.6 + twinkle * 0.4);

      this.ctx.beginPath();

      if (star.size > 1.2) {
        const gradient = this.ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, star.size * 3
        );

        if (star.hue > 0) {
          gradient.addColorStop(0, `hsla(${star.hue}, ${star.saturation}%, 85%, ${currentOpacity})`);
          gradient.addColorStop(0.4, `hsla(${star.hue}, ${star.saturation}%, 65%, ${currentOpacity * 0.25})`);
        } else {
          gradient.addColorStop(0, `rgba(255, 255, 255, ${currentOpacity})`);
          gradient.addColorStop(0.4, `rgba(255, 255, 255, ${currentOpacity * 0.25})`);
        }
        gradient.addColorStop(1, 'transparent');

        this.ctx.fillStyle = gradient;
        this.ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
      } else {
        if (star.hue > 0) {
          this.ctx.fillStyle = `hsla(${star.hue}, ${star.saturation}%, 85%, ${currentOpacity})`;
        } else {
          this.ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`;
        }
        this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      }

      this.ctx.fill();
    });
  }

  drawShootingStars() {
    this.shootingStars = this.shootingStars.filter(star => {
      star.x += Math.cos(star.angle) * star.speed;
      star.y += Math.sin(star.angle) * star.speed;
      star.opacity -= star.decay;

      // Spawn trail particles
      star.particleTimer++;
      if (star.particleTimer % 2 === 0 && star.opacity > 0.3) {
        star.particles.push({
          x: star.x - Math.cos(star.angle) * 5 + (Math.random() - 0.5) * 4,
          y: star.y - Math.sin(star.angle) * 5 + (Math.random() - 0.5) * 4,
          opacity: star.opacity * 0.6,
          size: Math.random() * 1.5 + 0.5,
          decay: 0.03 + Math.random() * 0.02
        });
      }

      // Draw trail particles
      star.particles = star.particles.filter(p => {
        p.opacity -= p.decay;
        if (p.opacity <= 0) return false;

        this.ctx.beginPath();
        this.ctx.fillStyle = `rgba(0, 212, 255, ${p.opacity * 0.5})`;
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fill();
        return true;
      });

      if (star.opacity <= 0 && star.particles.length === 0) return false;

      if (star.opacity > 0) {
        // Main trail
        const gradient = this.ctx.createLinearGradient(
          star.x, star.y,
          star.x - Math.cos(star.angle) * star.length,
          star.y - Math.sin(star.angle) * star.length
        );

        gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
        gradient.addColorStop(0.15, `rgba(200, 230, 255, ${star.opacity * 0.7})`);
        gradient.addColorStop(0.4, `rgba(0, 212, 255, ${star.opacity * 0.3})`);
        gradient.addColorStop(1, 'transparent');

        this.ctx.strokeStyle = gradient;
        this.ctx.lineWidth = star.thickness;
        this.ctx.lineCap = 'round';

        this.ctx.beginPath();
        this.ctx.moveTo(star.x, star.y);
        this.ctx.lineTo(
          star.x - Math.cos(star.angle) * star.length,
          star.y - Math.sin(star.angle) * star.length
        );
        this.ctx.stroke();

        // Head glow
        const headGlow = this.ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, 6
        );
        headGlow.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
        headGlow.addColorStop(0.3, `rgba(200, 230, 255, ${star.opacity * 0.5})`);
        headGlow.addColorStop(1, 'transparent');

        this.ctx.fillStyle = headGlow;
        this.ctx.beginPath();
        this.ctx.arc(star.x, star.y, 6, 0, Math.PI * 2);
        this.ctx.fill();
      }

      return true;
    });
  }

  animate() {
    this.time++;

    // Smooth mouse follow
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    this.ctx.clearRect(0, 0, this.width, this.height);

    this.drawNebulaClouds();
    this.drawStars();
    this.drawShootingStars();

    requestAnimationFrame(() => this.animate());
  }
}

// Floating particles system
class FloatingParticles {
  constructor(container) {
    this.container = container;
    if (!this.container) return;

    this.particleCount = 25;
    this.init();
  }

  init() {
    for (let i = 0; i < this.particleCount; i++) {
      this.createParticle(i);
    }
  }

  createParticle(index) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    const size = Math.random() * 2.5 + 0.5;
    const left = Math.random() * 100;
    const duration = Math.random() * 25 + 18;
    const delay = (index / this.particleCount) * duration;

    particle.style.cssText = `
      left: ${left}%;
      width: ${size}px;
      height: ${size}px;
      animation-duration: ${duration}s;
      animation-delay: -${delay}s;
      opacity: ${Math.random() * 0.4 + 0.1};
    `;

    this.container.appendChild(particle);
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  new CosmicStarfield('starfield');
  new FloatingParticles(document.querySelector('.particles'));
});
