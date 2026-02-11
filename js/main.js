/**
 * COSMIC MUSEUM - Main Interactions
 * Cinematic page transitions, parallax scrolling, and immersive effects
 */

// ═══════════════════════════════════════════════════════════════
// Cinematic Page Transitions
// ═══════════════════════════════════════════════════════════════

class PageTransitions {
  constructor() {
    this.overlay = null;
    this.init();
  }

  init() {
    // Create transition overlay
    this.overlay = document.createElement('div');
    this.overlay.className = 'page-transition-overlay active';
    document.body.appendChild(this.overlay);

    // Fade in on load
    window.addEventListener('load', () => {
      requestAnimationFrame(() => {
        this.overlay.classList.remove('active');
      });
    });

    // Handle link clicks
    document.querySelectorAll('a[href^="./"], a[href$=".html"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (e.metaKey || e.ctrlKey || link.target === '_blank') return;
        if (href.startsWith('#')) return;

        e.preventDefault();
        this.overlay.classList.add('active');

        setTimeout(() => {
          window.location.href = href;
        }, 450);
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

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px'
    });

    this.elements.forEach(el => observer.observe(el));
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

    this.links.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        this.toggle.classList.remove('active');
        this.links.classList.remove('active');
      });
    });

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

        const offset = 100;
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
// Deep Parallax Scrolling
// ═══════════════════════════════════════════════════════════════

class DeepParallax {
  constructor() {
    this.elements = document.querySelectorAll('[data-parallax]');
    this.bgElements = document.querySelectorAll('.parallax-bg');
    this.init();
  }

  init() {
    if (!this.elements.length && !this.bgElements.length) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.update();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  update() {
    const scrollY = window.scrollY;

    this.elements.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.1;
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const offset = (center - window.innerHeight / 2) * speed;
      el.style.transform = `translateY(${offset}px)`;
    });

    this.bgElements.forEach(el => {
      const rect = el.parentElement.getBoundingClientRect();
      const progress = (rect.top + rect.height) / (window.innerHeight + rect.height);
      const offset = (progress - 0.5) * 80;
      el.style.transform = `translateY(${offset}px) scale(1.1)`;
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
    const duration = 2200;
    const startTime = performance.now();

    const easeOutExpo = (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutExpo(progress);
      const current = Math.floor(target * easedProgress);

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

        btn.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
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
    if (window.matchMedia('(hover: none)').matches) return;

    this.createGlow();
    this.init();
  }

  createGlow() {
    this.glow = document.createElement('div');
    this.glow.style.cssText = `
      position: fixed;
      width: 500px;
      height: 500px;
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      opacity: 0;
      transition: opacity 0.4s ease;
      background: radial-gradient(circle, rgba(0, 212, 255, 0.05) 0%, transparent 70%);
      transform: translate(-50%, -50%);
      mix-blend-mode: screen;
    `;
    document.body.appendChild(this.glow);
  }

  init() {
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      this.glow.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
      this.glow.style.opacity = '0';
    });

    const animate = () => {
      glowX += (mouseX - glowX) * 0.08;
      glowY += (mouseY - glowY) * 0.08;

      this.glow.style.left = `${glowX}px`;
      this.glow.style.top = `${glowY}px`;

      requestAnimationFrame(animate);
    };

    animate();
  }
}

// ═══════════════════════════════════════════════════════════════
// Nav scroll effect - subtle background change on scroll
// ═══════════════════════════════════════════════════════════════

class NavScrollEffect {
  constructor() {
    this.nav = document.querySelector('.nav');
    if (!this.nav) return;
    this.init();
  }

  init() {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (window.scrollY > 100) {
            this.nav.style.background = 'rgba(6, 6, 16, 0.85)';
            this.nav.style.borderColor = 'rgba(255, 255, 255, 0.08)';
          } else {
            this.nav.style.background = 'rgba(6, 6, 16, 0.6)';
            this.nav.style.borderColor = 'rgba(255, 255, 255, 0.05)';
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }
}

// ═══════════════════════════════════════════════════════════════
// Initialize Everything
// ═══════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  new PageTransitions();
  new ScrollReveal();
  new GlassCardEffects();
  new MobileNav();
  new SmoothScroll();
  new DeepParallax();
  new AnimatedCounter();
  new MagneticButtons();
  new CursorGlow();
  new NavScrollEffect();

  // Set active nav link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href').replace('./', '');
    link.classList.remove('active');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
});

// Utility functions
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

function lerp(start, end, factor) {
  return start + (end - start) * factor;
}
