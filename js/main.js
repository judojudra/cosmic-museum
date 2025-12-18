/**
 * COSMIC MUSEUM - Main Interactions
 * Smooth animations, scroll reveals, and glass card effects
 */

// ═══════════════════════════════════════════════════════════════
// Smooth Page Transitions
// ═══════════════════════════════════════════════════════════════

class PageTransitions {
  constructor() {
    this.init();
  }
  
  init() {
    // Fade in on page load
    document.body.style.opacity = '0';
    
    window.addEventListener('load', () => {
      document.body.style.transition = 'opacity 0.6s ease';
      document.body.style.opacity = '1';
    });
    
    // Handle link clicks for smooth transitions
    document.querySelectorAll('a[href^="./"], a[href$=".html"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        // Skip if modifier keys or new tab
        if (e.metaKey || e.ctrlKey || link.target === '_blank') return;
        
        e.preventDefault();
        
        document.body.style.opacity = '0';
        
        setTimeout(() => {
          window.location.href = href;
        }, 300);
      });
    });
  }
}

// ═══════════════════════════════════════════════════════════════
// Scroll Reveal Animations
// ═══════════════════════════════════════════════════════════════

class ScrollReveal {
  constructor() {
    this.elements = document.querySelectorAll('.reveal, .stagger-children');
    this.init();
  }
  
  init() {
    if (!this.elements.length) return;
    
    // Initial check
    this.checkElements();
    
    // Optimized scroll handler with throttle
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.checkElements();
          ticking = false;
        });
        ticking = true;
      }
    });
  }
  
  checkElements() {
    const viewportHeight = window.innerHeight;
    const triggerPoint = viewportHeight * 0.85;
    
    this.elements.forEach(element => {
      const rect = element.getBoundingClientRect();
      
      if (rect.top < triggerPoint) {
        element.classList.add('visible');
      }
    });
  }
}

// ═══════════════════════════════════════════════════════════════
// Glass Card Mouse Effects
// ═══════════════════════════════════════════════════════════════

class GlassCardEffects {
  constructor() {
    this.cards = document.querySelectorAll('.glass-card');
    this.init();
  }
  
  init() {
    this.cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        card.style.setProperty('--mouse-x', `${x}%`);
        card.style.setProperty('--mouse-y', `${y}%`);
      });
    });
  }
}

// ═══════════════════════════════════════════════════════════════
// Mobile Navigation
// ═══════════════════════════════════════════════════════════════

class MobileNav {
  constructor() {
    this.toggle = document.querySelector('.nav-toggle');
    this.links = document.querySelector('.nav-links');
    this.init();
  }
  
  init() {
    if (!this.toggle || !this.links) return;
    
    this.toggle.addEventListener('click', () => {
      this.toggle.classList.toggle('active');
      this.links.classList.toggle('active');
    });
    
    // Close on link click
    this.links.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        this.toggle.classList.remove('active');
        this.links.classList.remove('active');
      });
    });
    
    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav')) {
        this.toggle.classList.remove('active');
        this.links.classList.remove('active');
      }
    });
  }
}

// ═══════════════════════════════════════════════════════════════
// Smooth Scroll for Anchor Links
// ═══════════════════════════════════════════════════════════════

class SmoothScroll {
  constructor() {
    this.init();
  }
  
  init() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#') return;
        
        const target = document.querySelector(href);
        if (!target) return;
        
        e.preventDefault();
        
        const offset = 100; // Account for fixed nav
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      });
    });
  }
}

// ═══════════════════════════════════════════════════════════════
// Parallax Effect for Elements
// ═══════════════════════════════════════════════════════════════

class ParallaxElements {
  constructor() {
    this.elements = document.querySelectorAll('[data-parallax]');
    this.init();
  }
  
  init() {
    if (!this.elements.length) return;
    
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.updateElements();
          ticking = false;
        });
        ticking = true;
      }
    });
  }
  
  updateElements() {
    const scrollY = window.scrollY;
    
    this.elements.forEach(element => {
      const speed = parseFloat(element.dataset.parallax) || 0.1;
      const offset = scrollY * speed;
      element.style.transform = `translateY(${offset}px)`;
    });
  }
}

// ═══════════════════════════════════════════════════════════════
// Animated Counter
// ═══════════════════════════════════════════════════════════════

class AnimatedCounter {
  constructor() {
    this.counters = document.querySelectorAll('.stat-value[data-count]');
    this.init();
  }
  
  init() {
    if (!this.counters.length) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    this.counters.forEach(counter => observer.observe(counter));
  }
  
  animateCounter(element) {
    const target = parseInt(element.dataset.count);
    const suffix = element.dataset.suffix || '';
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();
    
    const easeOutExpo = (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    
    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutExpo(progress);
      const current = Math.floor(start + (target - start) * easedProgress);
      
      element.textContent = current.toLocaleString() + suffix;
      
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };
    
    requestAnimationFrame(update);
  }
}

// ═══════════════════════════════════════════════════════════════
// Magnetic Buttons
// ═══════════════════════════════════════════════════════════════

class MagneticButtons {
  constructor() {
    this.buttons = document.querySelectorAll('.btn');
    this.init();
  }
  
  init() {
    if (window.matchMedia('(hover: none)').matches) return;
    
    this.buttons.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
      });
      
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
      });
    });
  }
}

// ═══════════════════════════════════════════════════════════════
// Cursor Glow Effect (Desktop Only)
// ═══════════════════════════════════════════════════════════════

class CursorGlow {
  constructor() {
    // Only on devices with hover capability
    if (window.matchMedia('(hover: none)').matches) return;
    
    this.createGlow();
    this.init();
  }
  
  createGlow() {
    this.glow = document.createElement('div');
    this.glow.className = 'cursor-glow';
    this.glow.style.cssText = `
      position: fixed;
      width: 400px;
      height: 400px;
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      opacity: 0;
      transition: opacity 0.3s ease;
      background: radial-gradient(circle, rgba(0, 245, 255, 0.08) 0%, transparent 70%);
      transform: translate(-50%, -50%);
      mix-blend-mode: screen;
    `;
    document.body.appendChild(this.glow);
  }
  
  init() {
    let mouseX = 0;
    let mouseY = 0;
    let glowX = 0;
    let glowY = 0;
    
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      this.glow.style.opacity = '1';
    });
    
    document.addEventListener('mouseleave', () => {
      this.glow.style.opacity = '0';
    });
    
    // Smooth follow
    const animate = () => {
      glowX += (mouseX - glowX) * 0.1;
      glowY += (mouseY - glowY) * 0.1;
      
      this.glow.style.left = `${glowX}px`;
      this.glow.style.top = `${glowY}px`;
      
      requestAnimationFrame(animate);
    };
    
    animate();
  }
}

// ═══════════════════════════════════════════════════════════════
// Text Typing Effect
// ═══════════════════════════════════════════════════════════════

class TypeWriter {
  constructor(element, texts, options = {}) {
    this.element = element;
    this.texts = texts;
    this.options = {
      typeSpeed: 80,
      deleteSpeed: 50,
      pauseDuration: 2000,
      ...options
    };
    this.textIndex = 0;
    this.charIndex = 0;
    this.isDeleting = false;
    this.init();
  }
  
  init() {
    this.type();
  }
  
  type() {
    const currentText = this.texts[this.textIndex];
    
    if (this.isDeleting) {
      this.charIndex--;
      this.element.textContent = currentText.substring(0, this.charIndex);
    } else {
      this.charIndex++;
      this.element.textContent = currentText.substring(0, this.charIndex);
    }
    
    let delay = this.isDeleting ? this.options.deleteSpeed : this.options.typeSpeed;
    
    if (!this.isDeleting && this.charIndex === currentText.length) {
      delay = this.options.pauseDuration;
      this.isDeleting = true;
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.textIndex = (this.textIndex + 1) % this.texts.length;
    }
    
    setTimeout(() => this.type(), delay);
  }
}

// ═══════════════════════════════════════════════════════════════
// Initialize Everything
// ═══════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  // Core functionality
  new PageTransitions();
  new ScrollReveal();
  new GlassCardEffects();
  new MobileNav();
  new SmoothScroll();
  new ParallaxElements();
  new AnimatedCounter();
  new MagneticButtons();
  new CursorGlow();
  
  // Set active nav link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href').replace('./', '');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
  
  // Typewriter effect for hero if present
  const typewriterElement = document.querySelector('[data-typewriter]');
  if (typewriterElement) {
    const texts = typewriterElement.dataset.typewriter.split('|');
    new TypeWriter(typewriterElement, texts);
  }
});

// ═══════════════════════════════════════════════════════════════
// Utility Functions
// ═══════════════════════════════════════════════════════════════

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Check if element is in viewport
function isInViewport(element, offset = 0) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= -offset &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Lerp function for smooth animations
function lerp(start, end, factor) {
  return start + (end - start) * factor;
}