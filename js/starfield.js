/**
 * COSMIC MUSEUM - Advanced Starfield System
 * Multi-layer parallax stars with shooting stars and nebula clouds
 */

class CosmicStarfield {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.stars = [];
    this.shootingStars = [];
    this.nebulaClouds = [];
    this.mouse = { x: 0, y: 0 };
    this.scrollY = 0;
    this.time = 0;
    
    // Configuration
    this.config = {
      starCount: 400,
      layers: 4,
      shootingStarInterval: 4000,
      nebulaCount: 5
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
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
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
        size: Math.random() * 2 * layerMultiplier + 0.5,
        opacity: Math.random() * 0.5 + 0.3,
        twinkleSpeed: Math.random() * 0.02 + 0.01,
        twinkleOffset: Math.random() * Math.PI * 2,
        layer: layer,
        parallaxFactor: layerMultiplier * 0.5,
        // Color variation
        hue: Math.random() > 0.9 ? (Math.random() > 0.5 ? 200 : 30) : 0,
        saturation: Math.random() > 0.9 ? 80 : 0
      });
    }
  }
  
  createNebulaClouds() {
    this.nebulaClouds = [];
    
    const colors = [
      { r: 0, g: 245, b: 255, a: 0.03 },   // Cyan
      { r: 255, g: 0, b: 255, a: 0.02 },    // Magenta
      { r: 77, g: 124, b: 255, a: 0.025 },  // Blue
      { r: 0, g: 255, b: 136, a: 0.02 }     // Green
    ];
    
    for (let i = 0; i < this.config.nebulaCount; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      this.nebulaClouds.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 300 + 200,
        color: color,
        driftX: (Math.random() - 0.5) * 0.2,
        driftY: (Math.random() - 0.5) * 0.1,
        pulseSpeed: Math.random() * 0.001 + 0.0005,
        pulseOffset: Math.random() * Math.PI * 2
      });
    }
  }
  
  createShootingStar() {
    const startX = Math.random() * this.width;
    const startY = Math.random() * this.height * 0.5;
    const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.3;
    
    this.shootingStars.push({
      x: startX,
      y: startY,
      length: Math.random() * 100 + 80,
      speed: Math.random() * 15 + 10,
      angle: angle,
      opacity: 1,
      decay: 0.015
    });
  }
  
  scheduleShootingStar() {
    const interval = this.config.shootingStarInterval + Math.random() * 3000;
    setTimeout(() => {
      this.createShootingStar();
      this.scheduleShootingStar();
    }, interval);
  }
  
  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.createStars();
      this.createNebulaClouds();
    });
    
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = (e.clientX / this.width - 0.5) * 2;
      this.mouse.y = (e.clientY / this.height - 0.5) * 2;
    });
    
    window.addEventListener('scroll', () => {
      this.scrollY = window.scrollY;
    });
  }
  
  drawNebulaClouds() {
    this.nebulaClouds.forEach(cloud => {
      // Update position with drift
      cloud.x += cloud.driftX;
      cloud.y += cloud.driftY;
      
      // Wrap around
      if (cloud.x < -cloud.radius) cloud.x = this.width + cloud.radius;
      if (cloud.x > this.width + cloud.radius) cloud.x = -cloud.radius;
      if (cloud.y < -cloud.radius) cloud.y = this.height + cloud.radius;
      if (cloud.y > this.height + cloud.radius) cloud.y = -cloud.radius;
      
      // Pulse effect
      const pulse = Math.sin(this.time * cloud.pulseSpeed + cloud.pulseOffset) * 0.3 + 0.7;
      
      // Draw nebula
      const gradient = this.ctx.createRadialGradient(
        cloud.x, cloud.y, 0,
        cloud.x, cloud.y, cloud.radius
      );
      
      const { r, g, b, a } = cloud.color;
      gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${a * pulse})`);
      gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${a * 0.5 * pulse})`);
      gradient.addColorStop(1, 'transparent');
      
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(0, 0, this.width, this.height);
    });
  }
  
  drawStars() {
    this.stars.forEach(star => {
      // Parallax based on mouse and scroll
      const parallaxX = this.mouse.x * star.parallaxFactor * 30;
      const parallaxY = this.mouse.y * star.parallaxFactor * 30;
      const scrollParallax = this.scrollY * star.parallaxFactor * 0.1;
      
      star.x = star.baseX + parallaxX;
      star.y = star.baseY + parallaxY - scrollParallax;
      
      // Wrap stars
      if (star.y < -10) star.y = this.height + 10;
      if (star.y > this.height + 10) star.y = -10;
      
      // Twinkle effect
      const twinkle = Math.sin(this.time * star.twinkleSpeed + star.twinkleOffset);
      const currentOpacity = star.opacity * (0.7 + twinkle * 0.3);
      
      // Draw star
      this.ctx.beginPath();
      
      if (star.size > 1.5) {
        // Larger stars get a glow effect
        const gradient = this.ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, star.size * 3
        );
        
        if (star.hue > 0) {
          gradient.addColorStop(0, `hsla(${star.hue}, ${star.saturation}%, 80%, ${currentOpacity})`);
          gradient.addColorStop(0.5, `hsla(${star.hue}, ${star.saturation}%, 60%, ${currentOpacity * 0.3})`);
        } else {
          gradient.addColorStop(0, `rgba(255, 255, 255, ${currentOpacity})`);
          gradient.addColorStop(0.5, `rgba(255, 255, 255, ${currentOpacity * 0.3})`);
        }
        gradient.addColorStop(1, 'transparent');
        
        this.ctx.fillStyle = gradient;
        this.ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
      } else {
        // Small stars are simple dots
        if (star.hue > 0) {
          this.ctx.fillStyle = `hsla(${star.hue}, ${star.saturation}%, 80%, ${currentOpacity})`;
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
      // Update position
      star.x += Math.cos(star.angle) * star.speed;
      star.y += Math.sin(star.angle) * star.speed;
      star.opacity -= star.decay;
      
      if (star.opacity <= 0) return false;
      
      // Draw trail
      const gradient = this.ctx.createLinearGradient(
        star.x, star.y,
        star.x - Math.cos(star.angle) * star.length,
        star.y - Math.sin(star.angle) * star.length
      );
      
      gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
      gradient.addColorStop(0.3, `rgba(0, 245, 255, ${star.opacity * 0.6})`);
      gradient.addColorStop(1, 'transparent');
      
      this.ctx.strokeStyle = gradient;
      this.ctx.lineWidth = 2;
      this.ctx.lineCap = 'round';
      
      this.ctx.beginPath();
      this.ctx.moveTo(star.x, star.y);
      this.ctx.lineTo(
        star.x - Math.cos(star.angle) * star.length,
        star.y - Math.sin(star.angle) * star.length
      );
      this.ctx.stroke();
      
      // Draw head glow
      const headGlow = this.ctx.createRadialGradient(
        star.x, star.y, 0,
        star.x, star.y, 8
      );
      headGlow.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
      headGlow.addColorStop(0.5, `rgba(0, 245, 255, ${star.opacity * 0.5})`);
      headGlow.addColorStop(1, 'transparent');
      
      this.ctx.fillStyle = headGlow;
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, 8, 0, Math.PI * 2);
      this.ctx.fill();
      
      return true;
    });
  }
  
  animate() {
    this.time++;
    
    // Clear canvas
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    // Draw layers
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
    
    this.particleCount = 30;
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
    
    const size = Math.random() * 3 + 1;
    const left = Math.random() * 100;
    const duration = Math.random() * 20 + 15;
    const delay = (index / this.particleCount) * duration;
    
    particle.style.cssText = `
      left: ${left}%;
      width: ${size}px;
      height: ${size}px;
      animation-duration: ${duration}s;
      animation-delay: -${delay}s;
      opacity: ${Math.random() * 0.5 + 0.2};
    `;
    
    this.container.appendChild(particle);
  }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  new CosmicStarfield('starfield');
  new FloatingParticles(document.querySelector('.particles'));
});