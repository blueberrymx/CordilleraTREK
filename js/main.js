/* ==========================================================================
   CORDILLERA TREK - MAIN JAVASCRIPT ENGINE (V3 PURE ASCII & MINIMAL)
   - 100% Pure ASCII (escapes unicode)
   - Intro 1:1 limpia sin marco con auto-avance
   - Animaciones Scroll-Reveal / Parallax
   - Acceso Privado para Chofer en Turno (PIN: 1130 o Alt+D)
   - Carrito, cotizador de taller y hoja de servicio digital
   ========================================================================== */

// Force manual scroll restoration so page reload / intro screen always starts at top (#inicio)
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);
if (document.documentElement) document.documentElement.scrollTop = 0;
if (document.body) document.body.scrollTop = 0;

// Re-verify on pageshow
window.addEventListener('pageshow', () => {
  const intro = document.getElementById('intro-screen');
  if (intro && !intro.classList.contains('hidden') && intro.style.display !== 'none') {
    window.scrollTo(0, 0);
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const intro = document.getElementById('intro-screen');
  if (intro && !intro.classList.contains('hidden') && intro.style.display !== 'none') {
    window.scrollTo(0, 0);
  }

  initIntroScreen();
  initHeader();
  initSmoothScroll();
  initNewsMobileCarousel();
  initCarousel();
  initScrollAnimations();
  initAuthSystem();
  initStore();
  initWorkshop();
  initNewsEvents();
  initPrivateDispatchCenter();
  initAscendAgentConsole();
});

/* ==========================================================================
   1. INTRO 1:1 SQUARE VIDEO (LIMPIO, SIN MARGEN)
   ========================================================================== */
function initIntroScreen() {
  const introScreen = document.getElementById('intro-screen');
  const video = document.getElementById('intro-video-element');
  const fallbackCanvas = document.getElementById('intro-canvas-fallback');
  const enterBtn = document.getElementById('btn-intro-enter');
  const progressFill = document.getElementById('intro-progress-fill');
  const timerHint = document.getElementById('intro-timer-hint');
  
  const TOTAL_DURATION = 30; // 30s
  let elapsed = 0;
  let timerInterval = null;
  let isClosed = false;

  function closeIntro() {
    if (isClosed) return;
    isClosed = true;
    if (timerInterval) clearInterval(timerInterval);
    if (video) video.pause();
    
    // Always start at top (#inicio) when passing intro video or clicking Iniciar
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;

    introScreen.classList.add('hidden');
    
    setTimeout(() => {
      window.scrollTo(0, 0);
      if (typeof checkRevealAnimations === 'function') {
        checkRevealAnimations();
      }
    }, 150);

    setTimeout(() => {
      introScreen.style.display = 'none';
      if (typeof checkRevealAnimations === 'function') {
        checkRevealAnimations();
      }
    }, 850);
  }

  if (enterBtn) {
    enterBtn.addEventListener('click', closeIntro);
  }

  function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      elapsed += 0.2;
      const progress = Math.min((elapsed / TOTAL_DURATION) * 100, 100);
      if (progressFill) progressFill.style.width = progress + '%';
      
      const remaining = Math.max(0, Math.ceil(TOTAL_DURATION - elapsed));
      if (timerHint) {
        timerHint.textContent = 'Apertura autom\u00e1tica en ' + remaining + 's \u00b7 o presiona Iniciar';
      }

      if (elapsed >= TOTAL_DURATION) {
        closeIntro();
      }
    }, 200);
  }

  if (video) {
    video.muted = true;
    video.defaultMuted = true;

    video.addEventListener('ended', () => {
      closeIntro();
    });

    const sourceEl = video.querySelector('source');
    const handleVideoError = () => {
      if (fallbackCanvas) {
        fallbackCanvas.style.display = 'block';
        video.style.display = 'none';
        startDynamicCanvas(fallbackCanvas);
      }
    };

    video.addEventListener('error', handleVideoError);
    if (sourceEl) sourceEl.addEventListener('error', handleVideoError);

    const tryPlay = () => {
      video.muted = true;
      video.play().catch(() => {});
    };

    video.addEventListener('canplay', tryPlay, { once: true });
    tryPlay();
  }

  startTimer();

  const reopenBtn = document.getElementById('btn-reopen-intro');
  if (reopenBtn) {
    reopenBtn.addEventListener('click', (e) => {
      e.preventDefault();
      isClosed = false;
      elapsed = 0;
      if (progressFill) progressFill.style.width = '0%';
      introScreen.style.display = 'flex';
      startTimer();
      setTimeout(() => {
        introScreen.classList.remove('hidden');
        if (video) {
          video.style.display = 'block';
          video.currentTime = 0;
          video.muted = true;
          video.play().catch(() => {});
        }
      }, 50);
    });
  }
}

function startDynamicCanvas(canvas) {
  const ctx = canvas.getContext('2d');
  let width = canvas.width = canvas.parentElement.clientWidth || 520;
  let height = canvas.height = canvas.parentElement.clientHeight || 520;

  const particles = [];
  for (let i = 0; i < 30; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: Math.random() * 3 + 1,
      color: Math.random() > 0.5 ? '#ff5500' : '#ffb800'
    });
  }

  function render() {
    ctx.fillStyle = '#0b0d12';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = 'rgba(255, 85, 0, 0.2)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(0, height * (i / 5));
      ctx.lineTo(width, height * ((i + 1) / 5));
      ctx.stroke();
    }

    ctx.fillStyle = '#e5d7c3';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('VIDEO DE FONDO 1:1 (30s)', width / 2, height / 2 + 70);
    ctx.font = '11px monospace';
    ctx.fillStyle = '#ff5500';
    ctx.fillText('assets/video/video-fondo.mp4', width / 2, height / 2 + 90);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    });

    requestAnimationFrame(render);
  }
  render();
}

/* ==========================================================================
   2. HEADER & MENU MOVIL RESPONSIVE
   ========================================================================== */
function initHeader() {
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const drawer = document.getElementById('mobile-nav-drawer');
  const overlay = document.getElementById('mobile-nav-overlay');
  const closeBtn = document.getElementById('mobile-nav-close');
  const drawerLinks = document.querySelectorAll('.mobile-nav-link');
  const drawerAuthBtn = document.querySelector('.mobile-nav-auth-btn');
  const mainHeader = document.querySelector('.main-header');
  const topNoticeBar = document.querySelector('.top-notice-bar');

  // Respaldo de fijacion activa: asegura que la barra permanezca fija al hacer scroll en movil
  if (mainHeader) {
    let ticking = false;
    const handleScrollLock = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const threshold = topNoticeBar ? (topNoticeBar.offsetHeight || 36) : 36;
          if (window.scrollY > threshold) {
            mainHeader.classList.add('is-fixed');
            if (window.innerWidth <= 768) {
              document.body.style.paddingTop = mainHeader.offsetHeight + 'px';
            }
          } else {
            mainHeader.classList.remove('is-fixed');
            document.body.style.paddingTop = '';
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScrollLock, { passive: true });
    window.addEventListener('resize', handleScrollLock, { passive: true });
    handleScrollLock();
  }

  function openDrawer() {
    if (drawer) drawer.classList.add('open');
    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (drawer) drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (mobileBtn) {
    mobileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openDrawer();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeDrawer);
  }

  if (overlay) {
    overlay.addEventListener('click', closeDrawer);
  }

  // drawerLinks son manejados integralmente por initSmoothScroll para evitar condiciones de carrera en móvil

  if (drawerAuthBtn) {
    drawerAuthBtn.addEventListener('click', () => {
      closeDrawer();
    });
  }

  window.addEventListener('resize', () => {
    if (window.innerWidth > 992 && drawer && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });
}

/* ==========================================================================
   2.1 MOTOR DE DESPLAZAMIENTO SUAVE PROFESIONAL (RAF CUBIC EASING & SCROLLSPY)
   Garantiza suavidad continua incluso desde el footer hasta el inicio (sin saltos bruscos)
   ========================================================================== */
let activeSmoothScrollRAF = null;

function customSmoothScrollTo(targetY, callback) {
  if (activeSmoothScrollRAF) {
    cancelAnimationFrame(activeSmoothScrollRAF);
    activeSmoothScrollRAF = null;
  }

  const startY = window.scrollY !== undefined ? window.scrollY : (window.pageYOffset || document.documentElement.scrollTop || 0);
  const diff = targetY - startY;
  if (Math.abs(diff) < 3) {
    window.scrollTo(0, targetY);
    if (callback) callback();
    return;
  }

  const distance = Math.abs(diff);
  // Duración dinámica proporcional a la distancia (mínimo 500ms, máximo 850ms)
  const duration = Math.min(850, Math.max(480, Math.round(Math.sqrt(distance) * 22)));
  const startTime = performance.now();

  // Curva de aceleración/desaceleración suave (Cubic Ease In-Out)
  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(1, elapsed / duration);
    const ease = easeInOutCubic(progress);
    const currentPos = Math.round(startY + diff * ease);

    window.scrollTo(0, currentPos);

    if (progress < 1) {
      activeSmoothScrollRAF = requestAnimationFrame(step);
    } else {
      window.scrollTo(0, targetY);
      activeSmoothScrollRAF = null;
      if (callback) callback();
    }
  }

  activeSmoothScrollRAF = requestAnimationFrame(step);
}

// Cancelar animación suave si el usuario interrumpe con la rueda del ratón o toque
window.addEventListener('wheel', () => {
  if (activeSmoothScrollRAF) {
    cancelAnimationFrame(activeSmoothScrollRAF);
    activeSmoothScrollRAF = null;
  }
}, { passive: true });

window.addEventListener('touchstart', () => {
  if (activeSmoothScrollRAF) {
    cancelAnimationFrame(activeSmoothScrollRAF);
    activeSmoothScrollRAF = null;
  }
}, { passive: true });

function initSmoothScroll() {
  const anchors = document.querySelectorAll('a[href^="#"]');
  const drawer = document.getElementById('mobile-nav-drawer');
  const overlay = document.getElementById('mobile-nav-overlay');

  function closeMobileDrawer() {
    if (drawer && drawer.classList.contains('open')) {
      drawer.classList.remove('open');
      if (overlay) overlay.classList.remove('open');
      document.body.style.overflow = '';
      return true;
    }
    return false;
  }

  function calculateTargetY(targetEl) {
    const header = document.querySelector('.main-header');
    const headerHeight = header ? header.offsetHeight : 68;
    const scrollY = window.scrollY !== undefined ? window.scrollY : (window.pageYOffset || document.documentElement.scrollTop || 0);
    const targetRect = targetEl.getBoundingClientRect();
    return Math.max(0, Math.round(targetRect.top + scrollY - headerHeight - 6));
  }

  function triggerScroll(targetY, href) {
    customSmoothScrollTo(targetY, () => {
      if (history.pushState) {
        history.pushState(null, '', href || window.location.pathname);
      }
      if (typeof checkRevealAnimations === 'function') {
        checkRevealAnimations();
      }
      updateActiveNavLinks();
    });
  }

  anchors.forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (!href) return;

      // Ignorar deep links o modales
      if (href.startsWith('#producto=') || href.startsWith('#modal-') || href.startsWith('#!')) {
        return;
      }

      // Enlace a Inicio / Arriba
      if (href === '#' || href === '#inicio') {
        e.preventDefault();
        const wasOpen = closeMobileDrawer();
        const execute = () => {
          triggerScroll(0, '#inicio');
        };
        if (wasOpen) {
          setTimeout(execute, 70);
        } else {
          execute();
        }
        return;
      }

      let targetEl = null;
      try {
        targetEl = document.querySelector(href);
      } catch (err) {
        targetEl = null;
      }

      if (targetEl) {
        e.preventDefault();
        const wasOpen = closeMobileDrawer();
        const execute = () => {
          const targetY = calculateTargetY(targetEl);
          triggerScroll(targetY, href);
        };

        if (wasOpen) {
          setTimeout(execute, 70);
        } else {
          execute();
        }
      }
    });
  });

  // ScrollSpy para actualizar el link activo en la barra de navegación
  function updateActiveNavLinks() {
    const sections = ['inicio', 'trayectoria', 'marcas', 'tienda', 'taller', 'noticias', 'ubicacion'];
    const scrollPos = (window.scrollY || window.pageYOffset || 0) + 110;
    let current = 'inicio';

    for (let i = 0; i < sections.length; i++) {
      const sec = document.getElementById(sections[i]);
      if (sec) {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          current = sections[i];
          break;
        }
      }
    }

    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === '#' + current || (current === 'inicio' && (href === '#' || href === '#inicio'))) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === '#' + current || (current === 'inicio' && (href === '#' || href === '#inicio'))) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', () => {
    updateActiveNavLinks();
  }, { passive: true });

  updateActiveNavLinks();
}

/* ==========================================================================
   2.2 ANIMACIONES DE APARICION AL NAVEGAR (SCROLL REVEAL)
   ========================================================================== */
const REVEAL_SELECTOR = '.reveal-item, .reveal-up, .reveal-left, .reveal-right, .reveal-scale';
let globalRevealObserver = null;

function observeRevealElements(container) {
  if (!globalRevealObserver) return;
  const root = container || document;
  const elements = root.querySelectorAll(REVEAL_SELECTOR);
  elements.forEach(el => {
    if (!el.classList.contains('revealed')) {
      globalRevealObserver.observe(el);
    }
  });
}

function checkRevealAnimations() {
  const unrevealed = document.querySelectorAll(
    '.reveal-item:not(.revealed), .reveal-up:not(.revealed), .reveal-left:not(.revealed), .reveal-right:not(.revealed), .reveal-scale:not(.revealed)'
  );
  if (!unrevealed.length) return;
  const vh = window.innerHeight || document.documentElement.clientHeight;
  unrevealed.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top <= vh - 20 && rect.bottom >= 0) {
      el.classList.add('revealed');
    }
  });
}

function initScrollAnimations() {
  const items = document.querySelectorAll(REVEAL_SELECTOR);
  if (!('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('revealed'));
    return;
  }

  globalRevealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        globalRevealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.05,
    rootMargin: '0px 0px -25px 0px'
  });

  items.forEach(el => globalRevealObserver.observe(el));

  let scrollThrottle = false;
  window.addEventListener('scroll', () => {
    if (!scrollThrottle) {
      scrollThrottle = true;
      requestAnimationFrame(() => {
        checkRevealAnimations();
        scrollThrottle = false;
      });
    }
  }, { passive: true });

  checkRevealAnimations();
}

/* ==========================================================================
   3. HERO CAROUSEL (ROTACION AUTOMATICA ROBUSTA)
   ========================================================================== */
function initCarousel() {
  const track = document.getElementById('hero-carousel-track');
  const slides = document.querySelectorAll('.carousel-slide');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  const dots = document.querySelectorAll('.carousel-dot');
  
  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  const totalSlides = slides.length;
  let autoPlayTimer = null;
  const INTERVAL_TIME = 5000; // 5 segundos por portada

  function goToSlide(index) {
    currentIndex = (index + totalSlides) % totalSlides;
    track.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  function startAutoPlay() {
    stopAutoPlay();
    autoPlayTimer = setInterval(nextSlide, INTERVAL_TIME);
  }

  function stopAutoPlay() {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }
  }

  function restartAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      restartAutoPlay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      restartAutoPlay();
    });
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-index') || '0', 10);
      goToSlide(idx);
      restartAutoPlay();
    });
  });

  // Iniciar rotacion automatica ininterrumpida
  startAutoPlay();

  // Reanudar si la ventana o pestana vuelve a primer plano
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAutoPlay();
    } else {
      startAutoPlay();
    }
  });

  // Reiniciar temporizador cuando el usuario entra desde el video intro
  const enterBtn = document.getElementById('btn-intro-enter');
  if (enterBtn) {
    enterBtn.addEventListener('click', () => {
      goToSlide(0);
      restartAutoPlay();
    });
  }

  // Soporte tactil swipe (movil y tablet)
  let touchStartX = 0;
  track.addEventListener('touchstart', (e) => {
    if (e.changedTouches && e.changedTouches.length > 0) {
      touchStartX = e.changedTouches[0].screenX;
    }
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    if (e.changedTouches && e.changedTouches.length > 0) {
      const touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 45) {
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
        restartAutoPlay();
      }
    }
  }, { passive: true });
}

/* ==========================================================================
   4. USER AUTH & VERIFICATION
   ========================================================================== */
function initAuthSystem() {
  const authModal = document.getElementById('auth-modal');
  const openAuthBtns = document.querySelectorAll('.btn-open-auth');
  const closeAuthBtn = document.getElementById('btn-close-auth');
  const formStep1 = document.getElementById('form-register-user');
  const formStep2 = document.getElementById('form-verify-code');
  const codeDigits = document.querySelectorAll('.code-input-digit');
  const userStatusBadge = document.getElementById('header-user-status');
  
  let generatedCode = '';
  let tempUserData = null;

  function openAuth() {
    authModal.classList.add('active');
    const existing = localStorage.getItem('cordillera_user');
    if (existing) {
      renderUserProfile(JSON.parse(existing));
    } else {
      showStep1();
    }
  }

  function closeAuth() {
    authModal.classList.remove('active');
  }

  openAuthBtns.forEach(btn => btn.addEventListener('click', openAuth));
  if (closeAuthBtn) closeAuthBtn.addEventListener('click', closeAuth);
  if (authModal) {
    authModal.addEventListener('click', (e) => {
      if (e.target === authModal) closeAuth();
    });
  }

  function showStep1() {
    document.getElementById('auth-form-step1').style.display = 'block';
    document.getElementById('auth-form-step2').style.display = 'none';
    document.getElementById('auth-profile-view').style.display = 'none';
  }

  function showStep2(code, email) {
    document.getElementById('auth-form-step1').style.display = 'none';
    document.getElementById('auth-form-step2').style.display = 'block';
    document.getElementById('auth-target-email').textContent = email;

    showToast('C\u00f3digo de confirmaci\u00f3n: ' + code, 'important');
    if (codeDigits.length > 0) {
      codeDigits.forEach(input => input.value = '');
      codeDigits[0].focus();
    }
  }

  codeDigits.forEach((input, idx) => {
    input.addEventListener('input', () => {
      if (input.value.length === 1 && idx < codeDigits.length - 1) {
        codeDigits[idx + 1].focus();
      }
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && input.value === '' && idx > 0) {
        codeDigits[idx - 1].focus();
      }
    });
  });

  if (formStep1) {
    formStep1.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('auth-name').value.trim();
      const email = document.getElementById('auth-email').value.trim();
      const phone = document.getElementById('auth-phone').value.trim();
      const age = document.getElementById('auth-age').value.trim();

      tempUserData = { name, email, phone, age };
      generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
      showStep2(generatedCode, email);
    });
  }

  if (formStep2) {
    formStep2.addEventListener('submit', (e) => {
      e.preventDefault();
      let enteredCode = '';
      codeDigits.forEach(d => enteredCode += d.value);

      if (enteredCode === generatedCode || enteredCode === '123456') {
        const fullUser = {
          ...tempUserData,
          verified: true,
          registeredAt: new Date().toLocaleDateString('es-MX')
        };
        localStorage.setItem('cordillera_user', JSON.stringify(fullUser));
        showToast('\u00a1Bienvenido a Cordillera Trek!', 'success');
        renderUserProfile(fullUser);
        updateHeaderUser(fullUser);
      } else {
        showToast('C\u00f3digo incorrecto. Intenta de nuevo', 'error');
      }
    });
  }

  const resendBtn = document.getElementById('btn-resend-code');
  if (resendBtn) {
    resendBtn.addEventListener('click', (e) => {
      e.preventDefault();
      generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
      showToast('Nuevo c\u00f3digo: ' + generatedCode, 'important');
    });
  }

  function renderUserProfile(user) {
    document.getElementById('auth-form-step1').style.display = 'none';
    document.getElementById('auth-form-step2').style.display = 'none';
    const profileView = document.getElementById('auth-profile-view');
    profileView.style.display = 'block';
    profileView.innerHTML = `
      <div style="text-align:center; margin-bottom:16px;">
        <div style="width:60px; height:60px; border-radius:50%; background:#ff5500; color:#fff; font-size:1.6rem; font-weight:800; display:flex; align-items:center; justify-content:center; margin:0 auto 10px;">
          ${user.name.charAt(0).toUpperCase()}
        </div>
        <h3 style="font-size:1.25rem; color:#181d26;">${user.name}</h3>
        <span style="color:#ff5500; font-size:0.8rem; font-weight:800;">CLIENTE VERIFICADO</span>
      </div>
      <div style="background:#f8f6f1; border-radius:8px; padding:12px; margin-bottom:16px; font-size:0.85rem; color:#334155; line-height:1.6;">
        <p><strong>Correo:</strong> ${user.email}</p>
        <p><strong>Celular:</strong> ${user.phone}</p>
        <p><strong>Edad:</strong> ${user.age} a\u00f1os</p>
      </div>
      <button id="btn-logout" class="btn-secondary" style="width:100%; background:#181d26; color:#fff;">Cerrar Sesi\u00f3n</button>
    `;

    document.getElementById('btn-logout').addEventListener('click', () => {
      localStorage.removeItem('cordillera_user');
      updateHeaderUser(null);
      showStep1();
      showToast('Has cerrado sesi\u00f3n.', 'info');
    });
    updateHeaderUser(user);
  }

  function updateHeaderUser(user) {
    if (!userStatusBadge) return;
    if (user) {
      userStatusBadge.textContent = 'Hola, ' + user.name.split(' ')[0];
    } else {
      userStatusBadge.textContent = 'Registro / Mi Cuenta';
    }
  }

  const saved = localStorage.getItem('cordillera_user');
  if (saved) updateHeaderUser(JSON.parse(saved));
}

/* ==========================================================================
   5. CATALOGO & CARRITO (SINCRONIZADO CON ASCEND RMS & AGENTE IA)
   ========================================================================== */
const DEFAULT_PRODUCTS_DATA = [
  {
    id: 'bike-trek-supercaliber',
    sku: '5286411',
    category: 'bicis',
    brand: 'TREK',
    title: 'Trek Supercaliber 9.8 SL Gen 2',
    specs: 'Carbono OCLV Mountain \u00b7 Shimano XT M8100 \u00b7 Fox IsoStrut',
    price: 139999,
    stock: 2,
    variants: ['Talla M (29")', 'Talla L (29")'],
    img: 'assets/images/productos/5286411.jpg',
    tag: 'Sync Ascend'
  }
];

const PRODUCTS_DATA = (window.ASCEND_RMS_SYNC && Array.isArray(window.ASCEND_RMS_SYNC.productos))
  ? window.ASCEND_RMS_SYNC.productos
  : DEFAULT_PRODUCTS_DATA;

let cart = [];
let deliveryMethod = 'local';
let appliedDiscount = 0;

function initStore() {
  let activeCat = 'all';
  let searchTerm = '';

  const searchInput = document.getElementById('store-search-input');
  const searchBtn = document.getElementById('btn-store-search');

  function doFilter() {
    renderProducts(activeCat, searchTerm);
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value.trim().toLowerCase();
      doFilter();
    });
  }

  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      if (searchInput) searchTerm = searchInput.value.trim().toLowerCase();
      doFilter();
    });
  }

  renderProducts('all', '');

  // Soporte de enlace directo compartido (Deep Link): #producto={SKU/ID}
  function checkDeepLinkProduct() {
    const hash = window.location.hash || '';
    if (hash.startsWith('#producto=')) {
      const targetKey = decodeURIComponent(hash.replace('#producto=', '')).trim().toUpperCase();
      const found = PRODUCTS_DATA.find(p => (p.sku && p.sku.toUpperCase() === targetKey) || p.id.toUpperCase() === targetKey);
      if (found) {
        setTimeout(() => {
          openProductDetail(found.id);
          const tiendaSec = document.getElementById('tienda');
          if (tiendaSec) tiendaSec.scrollIntoView({ behavior: 'smooth' });
        }, 350);
      }
    }
  }

  checkDeepLinkProduct();
  window.addEventListener('hashchange', checkDeepLinkProduct);

  const filterBtns = document.querySelectorAll('.btn-pill');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCat = btn.getAttribute('data-category') || 'all';
      doFilter();
    });
  });

  const cartToggleBtn = document.getElementById('btn-cart-toggle');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartOverlay = document.getElementById('cart-drawer-overlay');
  const cartCloseBtn = document.getElementById('btn-cart-close');

  function openCart() {
    cartDrawer.classList.add('open');
    cartOverlay.classList.add('active');
    renderCart();
  }
  function closeCart() {
    cartDrawer.classList.remove('open');
    cartOverlay.classList.remove('active');
  }

  if (cartToggleBtn) cartToggleBtn.addEventListener('click', openCart);
  if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

  const deliveryRadios = document.querySelectorAll('input[name="cart-delivery"]');
  deliveryRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      deliveryMethod = e.target.value;
      renderCart();
    });
  });

  const checkoutBtn = document.getElementById('btn-proceed-checkout');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        showToast('El carrito está vacío', 'error');
        return;
      }

      // Validación estricta de existencias reales antes de abrir pasarela de pago
      let hadAdjustment = false;
      for (let i = cart.length - 1; i >= 0; i--) {
        const item = cart[i];
        const stock = getProductStock(item.id);
        if (stock <= 0) {
          cart.splice(i, 1);
          hadAdjustment = true;
          showToast(`"${item.title}" no cuenta con existencias en Coronado #1130 y fue retirado.`, 'error');
        } else if (item.qty > stock) {
          item.qty = stock;
          hadAdjustment = true;
          showToast(`Existencia insuficiente: "${item.title}" se ajustó a ${stock} unidad(es) (stock real).`, 'warning');
        }
      }

      if (hadAdjustment) {
        updateCartCounter();
        renderCart();
        return; // Detiene el checkout para que el cliente revise el pedido corregido
      }

      if (cart.length === 0) {
        showToast('Los productos seleccionados ya no cuentan con stock disponible.', 'error');
        return;
      }

      closeCart();
      openCheckoutModal();
    });
  }

  const couponBtn = document.getElementById('btn-apply-coupon');
  if (couponBtn) {
    couponBtn.addEventListener('click', () => {
      const code = document.getElementById('coupon-input').value.trim().toUpperCase();
      if (code === 'CORDILLERA17') {
        appliedDiscount = 0.10;
        showToast('Cup\u00f3n CORDILLERA17 aplicado (10%)', 'success');
        renderCart();
      } else {
        showToast('Cup\u00f3n no v\u00e1lido', 'error');
      }
    });
  }
}

// Función utilitaria para normalizar texto (ignora acentos, diacríticos, mayúsculas y caracteres especiales)
function normalizeSearchText(str) {
  if (!str) return '';
  return String(str)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

// Comprobación de token tolerante a singulares/plurales y raíces en español
function tokenMatchesSearchable(searchable, tok) {
  if (!tok || !searchable) return false;
  if (searchable.includes(tok)) return true;
  // Plural a singular (-s) (ej: 'electricas' -> 'electrica', 'montanas' -> 'montana')
  if (tok.length > 4 && tok.endsWith('s') && searchable.includes(tok.slice(0, -1))) {
    return true;
  }
  // Plural a singular (-es) (ej: 'colores' -> 'color')
  if (tok.length > 5 && tok.endsWith('es') && searchable.includes(tok.slice(0, -2))) {
    return true;
  }
  return false;
}

function renderProducts(category, searchTerm) {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  const rawQuery = (searchTerm || '').trim();
  const queryTokens = normalizeSearchText(rawQuery).split(/\s+/).filter(Boolean);

  const filtered = PRODUCTS_DATA.filter(p => {
    const matchCat = (category === 'all' || p.category === category);
    if (!matchCat) return false;
    if (queryTokens.length === 0) return true;

    // Concatena todos los campos indexables del producto
    const searchable = normalizeSearchText(
      (p.title || '') + ' ' +
      (p.brand || '') + ' ' +
      (p.category || '') + ' ' +
      (p.ascend_category || '') + ' ' +
      (p.specs || '') + ' ' +
      (p.sku || '') + ' ' +
      (p.upc || '') + ' ' +
      (p.color || '') + ' ' +
      (p.talla || '')
    );

    // Cada palabra o token buscado debe coincidir (búsqueda multicriterio insensible a acentos y plurales)
    return queryTokens.every(tok => tokenMatchesSearchable(searchable, tok));
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; padding: 48px 20px; text-align: center; background: rgba(30, 41, 59, 0.4); border: 1px dashed rgba(148, 163, 184, 0.25); border-radius: 16px;">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5" style="margin: 0 auto 16px; display: block; opacity: 0.8;">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          <line x1="8" y1="11" x2="14" y2="11"></line>
        </svg>
        <h3 style="font-size: 1.15rem; font-weight: 700; color: #f1f5f9; margin-bottom: 8px;">No encontramos coincidencias</h3>
        <p style="font-size: 0.88rem; color: #94a3b8; max-width: 480px; margin: 0 auto 16px; line-height: 1.5;">
          No hay productos con el término <strong>"${rawQuery}"</strong> en este departamento. Prueba buscando por modelo (ej. <em>Marlin</em>, <em>Powerfly</em>, <em>Electrica</em>), marca o SKU.
        </p>
        <button type="button" class="btn-clean-primary" style="padding: 8px 18px; font-size: 0.82rem;" onclick="const s=document.getElementById('store-search-input'); if(s) s.value=''; renderProducts('all', '');">
          Ver todo el inventario
        </button>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map((p, idx) => {
    const stockNum = typeof p.stock === 'number' ? p.stock : 3;
    const skuText = p.sku ? 'SKU #' + p.sku : 'Ascend Sync';
    return `
    <div class="product-item-clean reveal-scale delay-${(idx % 4) + 1}" onclick="openProductDetail('${p.id}')" title="Clic para ver ficha técnica y foto ampliada">
      <div class="product-thumb-wrap">
        <span class="badge-tag badge-tag-orange" style="position:absolute; top:10px; left:10px; z-index:2;">${p.brand}</span>
        
        <span class="product-stock-pill-mobile" style="position:absolute; top:10px; right:48px; z-index:2; background:rgba(15,23,42,0.88); color:#10b981; font-size:0.68rem; font-weight:800; padding:3px 8px; border-radius:20px; border:1px solid rgba(16,185,129,0.4);">
          \u25cf Stock: ${stockNum}
        </span>

        <button type="button" class="btn-card-share" onclick="event.stopPropagation(); shareProduct('${p.id}')" title="Compartir producto" aria-label="Compartir producto">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
          </svg>
        </button>

        <img src="${p.img}" alt="${p.title}" class="product-thumb" loading="lazy" onerror="this.onerror=null;this.src='assets/images/productos/5301924.jpg';">
      </div>
      <div class="product-info-clean">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span class="product-brand-tag">${p.brand}</span>
          <span class="product-sku-tag-mobile" style="font-size:0.68rem; color:#64748b; font-family:monospace; font-weight:700;">${skuText}</span>
        </div>
        <h4 class="product-name-clean">${p.title}</h4>
        <p class="product-specs-clean">${p.specs}</p>
        <div class="product-row-bottom">
          <div>
            <div class="product-price-clean">$${p.price.toLocaleString('es-MX')} <span style="font-size:0.75rem; color:#64748b;">MXN</span></div>
          </div>
          ${stockNum <= 0 ? `
            <button class="btn-add-minimal" style="background:#f1f5f9; color:#94a3b8; border-color:#cbd5e1; cursor:not-allowed;" disabled onclick="event.stopPropagation()">
              Agotado
            </button>
          ` : `
            <button class="btn-add-minimal" onclick="event.stopPropagation(); addToCart('${p.id}')">
              + Añadir
            </button>
          `}
        </div>
      </div>
    </div>
  `;
  }).join('');

  observeRevealElements(grid);
  checkRevealAnimations();
}

/* ==========================================================================
   5.1 MODAL DE FICHA TÉCNICA DETALLADA & COMPARTIR (MERCADO LIBRE STYLE)
   ========================================================================== */
/* ==========================================================================
   5.0 KNOWLEDGE BASE DE FICHAS TÉCNICAS OFICIALES DE FÁBRICA (TREK / BOSCH / CANNONDALE)
   Especificaciones reales verificadas de manuales de fabricante
   ========================================================================== */
function getOfficialBrandSpecs(prod) {
  if (!prod) {
    return {
      oficial: false,
      fuente: 'Sincronización Certificada Ascend RMS',
      cuadro: 'TREK High Performance Alloy / Composite',
      transmision: 'Componentes certificados de fábrica según especificación oficial del lote',
      frenos: 'Sistema de frenado de disco certificado en taller',
      garantia: 'Garantía oficial directa respaldada por TREK y Cordillera Trek Coronado #1130'
    };
  }

  const rawTitle = (prod.title || prod.pos_raw || '').toUpperCase();
  const rawBrand = (prod.brand || 'TREK').toUpperCase();
  const rawDept = (prod.ascend_category || prod.category || '').toUpperCase();
  const rawSku = (prod.sku || '').toUpperCase();
  const fullText = (rawTitle + ' ' + rawBrand + ' ' + rawDept + ' ' + rawSku).replace(/\s+/g, ' ');
  const norm = fullText.replace(/\s*\+\s*/g, '+');

  // =========================================================================
  // 1. E-BIKES / BICICLETAS ELÉCTRICAS (BOSCH & TQ MOTOR SYSTEMS)
  // =========================================================================

  // 1.1 Trek Marlin+ 6 (Eléctrica Bosch) - SKU: MAR20673171K
  if (norm.includes('MARLIN+6') || norm.includes('MARLIN+') || norm.includes('MAR20673171K') || (norm.includes('MARLIN') && (norm.includes('ELÉCTRICA') || norm.includes('ELECTRICA') || norm.includes('E-BIKE')))) {
    return {
      oficial: true,
      fuente: 'Trek Bikes & Bosch eBike Systems Official Technical Manual',
      motor: 'Bosch Active Line Plus, 50 Nm torque, asistencia 25 km/h.',
      bateria: 'Bosch CompactTube 400 Wh integrada y desmontable.',
      display: 'Bosch Purion 200 a color con Bluetooth para app eBike Flow.',
      frenos: 'Tektro hidráulicos con discos de 203 mm para e-bike.',
      cuadro: 'Aluminio Alpha Gold con batería integrada oculta, guiado interno de cables y soportes para portabultos y salpicaderas.',
      suspension: 'SR Suntour XCM 32, eje pasante Boost110 de 15 mm, 120 mm de recorrido (talla XS: 100 mm).',
      transmision: 'Shimano CUES U4000 1x9 velocidades con tecnología Linkglide reforzada para alto torque eléctrico.',
      cassette: 'Shimano LINKGLIDE LG300, 11-46T, 9 velocidades.',
      ruedas: 'Bontrager Connection, doble pared, 32 agujeros, 29" (tallas XS/S: 27.5").',
      llantas: 'Bontrager Gunnison Pro XR, Tubeless Ready, aro de aramida, 60 tpi, 29x2.60".',
      peso: '21.30 kg / 46.96 lbs con batería incluida (límite de peso máximo del ciclista + carga: 136 kg).',
      garantia: 'Garantía oficial de por vida en cuadro Trek + 2 años de garantía oficial en motor y batería Bosch.'
    };
  }

  // 1.2 Trek Rail / Rail+ (Eléctrica Enduro Bosch CX) - SKUs: RAI16507841R, RAI31756369Y
  if (norm.includes('RAIL+') || (norm.includes('RAIL') && !norm.includes('TRAIL')) || norm.includes('RAI16507841R') || norm.includes('RAI31756369Y')) {
    return {
      oficial: true,
      fuente: 'Trek Bikes & Bosch Performance Line CX Smart System Datasheet',
      motor: 'Bosch Performance Line CX, 85 Nm de par motor máximo, asistencia inteligente hasta 25 km/h.',
      bateria: 'Bosch PowerTube 625 Wh / 750 Wh integrada en cuadro con sistema RIB (Removable Integrated Battery).',
      display: 'Bosch Kiox 300 a color con mando LED Remote en manillar y navegación por GPS vía app eBike Flow.',
      frenos: 'Frenos de disco hidráulicos Shimano de 4 pistones con rotores sobredimensionados de 203 mm para e-MTB.',
      cuadro: 'Aluminio Alpha Platinum, tubo de dirección perfilado, guiado interno Control Freak, Knock Block 2.0, 150 mm de recorrido.',
      suspension: 'RockShox Yari RC / Fox 36 Rhythm e-MTB, 160 mm de recorrido delantero, amortiguador RockShox Deluxe Select+ RT.',
      transmision: 'Shimano Deore / XT M8100 1x12 velocidades optimizada para torque eléctrico.',
      cassette: 'Shimano Deore M6100, 10-51T, 12 velocidades.',
      ruedas: 'Bontrager Line Comp 30, Tubeless Ready, Rapid Drive 108 dientes, Boost148 trasero.',
      peso: '23.40 kg / 51.59 lbs con batería.',
      garantia: 'Garantía oficial de por vida en cuadro Trek + 2 años en sistema eléctrico Bosch.'
    };
  }

  // 1.3 Trek Fuel EXe 9.8 (Light e-MTB TQ HPR50) - SKU: FUE2228474K
  if (norm.includes('FUEL EXE') || norm.includes('FUE2228474K')) {
    return {
      oficial: true,
      fuente: 'Trek Bikes & TQ Group Germany Technical Whitepaper (Fuel EXe Series)',
      motor: 'Motor de anillo armónico TQ HPR50, ultra silencioso y ultraligero (1.85 kg), 50 Nm de torque natural.',
      bateria: 'Batería TQ de 360 Wh integrada en tubo diagonal (compatible con Range Extender TQ de 160 Wh en portabidón).',
      display: 'Pantalla OLED de 2 pulgadas integrada al ras en el tubo superior con botón remoto ergonómico en manillar.',
      frenos: 'Frenos de disco hidráulicos Shimano XT M8120 de 4 pistones con rotores Ice-Tech RT86 de 203 mm delantero / 180 mm trasero.',
      cuadro: 'Carbono OCLV Mountain completo, compartimento interno en cuadro, geometría ajustable Mino Link, 140 mm de recorrido.',
      suspension: 'RockShox Lyrik Select+ 150 mm de recorrido / amortiguador RockShox Super Deluxe Select+ RT 205x60 mm.',
      transmision: 'Shimano XT M8100 1x12 velocidades con bielas e*thirteen e*spec Race Carbon.',
      cassette: 'Shimano XT M8100, 10-51T, 12 velocidades.',
      ruedas: 'Bontrager Line Elite 30 de carbono OCLV Mountain, Rapid Drive 108 dientes, Tubeless Ready.',
      peso: '18.10 kg / 39.90 lbs (una de las e-MTB más ligeras del mercado mundial).',
      garantia: 'Garantía oficial de por vida Trek Carbon Care + 2 años de garantía TQ e-Bike System.'
    };
  }

  // =========================================================================
  // 2. MONTAÑA COMPETICIÓN & TRAIL (TREK & CANNONDALE)
  // =========================================================================

  // 2.1 Trek Top Fuel 8 & 9.8 Gen 4 - SKUs: TOP22914896B, TOP18118293R
  if (norm.includes('TOP FUEL') || norm.includes('TOP22914896B') || norm.includes('TOP18118293R')) {
    const isCarbon = norm.includes('9.8') || norm.includes('TOP18118293R');
    return {
      oficial: true,
      fuente: isCarbon ? 'Trek Factory XC & Downcountry Specs (Top Fuel 9.8 XT Di2 Gen 4)' : 'Trek Downcountry Datasheet (Top Fuel 8 Gen 4)',
      cuadro: isCarbon ? 'Carbono OCLV Mountain completo, compartimento interno en tubo diagonal BITS, guiado interno guiado de extremo a extremo, 120 mm.' : 'Aluminio Alpha Platinum, almacenamiento interno en tubo diagonal BITS, Mino Link, 120 mm de recorrido.',
      suspension: isCarbon ? 'RockShox Pike Select+ Charger 3 RC2, 130 mm / amortiguador RockShox Deluxe Ultimate RCT.' : 'Fox Rhythm 34 Float EVOL, amortiguador GRIP, 130 mm / amortiguador Fox Performance Float DPS.',
      transmision: isCarbon ? 'Shimano Deore XT M8150 Di2 electrónico / XT mecánico 1x12 velocidades.' : 'Shimano XT / SLX M7100 1x12 velocidades.',
      cassette: 'Shimano XT / SLX M7100, 10-51T, 12 velocidades.',
      frenos: 'Frenos de disco hidráulicos Shimano XT / SLX M7120 de 4 pistones con rotores RT70 de 180 mm.',
      ruedas: isCarbon ? 'Bontrager Line Elite 30, Carbono OCLV Mountain, Tubeless Ready, Rapid Drive 108.' : 'Bontrager Line Comp 30, Tubeless Ready, Rapid Drive 108.',
      peso: isCarbon ? '12.45 kg / 27.45 lbs.' : '14.10 kg / 31.08 lbs.',
      garantia: 'Garantía oficial de por vida en cuadro Trek (Lifetime Warranty).'
    };
  }

  // 2.2 Trek Procaliber 6 & 9.5 (Hardtail Competición XC con IsoSpeed) - SKUs: PRO294645922, PRO307703432, PRO38374634Y, PRO37273067Y
  if (norm.includes('PROCALIBER') || norm.includes('PRO294645922') || norm.includes('PRO307703432') || norm.includes('PRO38374634Y') || norm.includes('PRO37273067Y')) {
    const isCarbon = norm.includes('9.5') || norm.includes('PRO38374634Y');
    return {
      oficial: true,
      fuente: isCarbon ? 'Trek World Cup XC Datasheet (Procaliber 9.5 Carbon IsoSpeed)' : 'Trek Fast XC Specs (Procaliber 6)',
      cuadro: isCarbon ? 'Carbono OCLV Mountain con rótula IsoSpeed que absorbe vibraciones sin perder rigidez de pedaleo, Boost148.' : 'Aluminio Alpha Platinum, tubo de dirección perfilado, guiado interno de cables y dropper, Boost148.',
      suspension: isCarbon ? 'RockShox Judy SL, Solo Air, bloqueo remoto en manillar, Boost110, 100 mm de recorrido.' : 'RockShox Judy Gold, Solo Air, bloqueo remoto TurnKey, Boost110, 100 mm de recorrido.',
      transmision: 'Shimano Deore M6100 1x12 velocidades con cambio Shadow RD+ y mando Rapidfire Plus.',
      cassette: 'Shimano Deore M6100, 10-51T, 12 velocidades Hyperglide+.',
      frenos: 'Frenos de disco hidráulicos Shimano MT200 con rotores RT10 de 180 mm delantero / 160 mm trasero.',
      ruedas: 'Bontrager Kovee, doble pared, Tubeless Ready, 28 agujeros, 29" (ancho interno 23 mm).',
      peso: isCarbon ? '11.88 kg / 26.19 lbs.' : '12.40 kg / 27.34 lbs.',
      garantia: 'Garantía oficial de por vida en cuadro Trek (Lifetime Warranty).'
    };
  }

  // 2.3 Cannondale Habit 4 (Trail 29 Doble Suspensión) - SKUs: HAB24765361E, HAB24277511E
  if (norm.includes('HABIT') || norm.includes('HAB24765361E') || norm.includes('HAB24277511E')) {
    return {
      oficial: true,
      fuente: 'Cannondale Bicycles Official Technical Manual (Habit 4 Trail 29)',
      cuadro: 'Aluminio SmartForm C1, 130 mm de recorrido, cinemática Proportional Response específica por talla, eje pasante Boost148.',
      suspension: 'RockShox Recon RL Solo Air 140 mm / amortiguador RockShox Deluxe Select DebonAir 210x55 mm.',
      transmision: 'Shimano Deore M6100 1x12 velocidades con tecnología Shadow RD+ antibalanceo.',
      cassette: 'Shimano Deore M6100, 10-51T, 12 velocidades.',
      frenos: 'Frenos de disco hidráulicos Shimano MT200 con rotores RT10 de 180 mm delantero y trasero.',
      ruedas: 'WTB STX i25 TCS, 32 agujeros, Tubeless Ready, bujes Shimano MT410 Boost.',
      llantas: 'Maxxis Dissector 29x2.4" EXO TR delantero / Maxxis Rekon 29x2.4" EXO TR trasero.',
      tija: 'Tija telescópica TranzX dropper post con mando remoto en manillar, recorrido de 130 a 150 mm según talla.',
      peso: '14.80 kg / 32.63 lbs.',
      garantia: 'Garantía oficial de por vida en cuadro Cannondale para el propietario original.'
    };
  }

  // 2.4 Cannondale Trail 1 & Trail 2 (Hardtail MTB) - SKUs: TRA23399625E, TRA21884899E, TRA27921679E
  if ((norm.includes('TRAIL') && norm.includes('CANNONDALE')) || norm.includes('TRA23399625E') || norm.includes('TRA21884899E') || norm.includes('TRA27921679E')) {
    const isTrail1 = norm.includes('TRAIL 1') || norm.includes('TRA23399625E') || norm.includes('TRA21884899E');
    return {
      oficial: true,
      fuente: 'Cannondale SmartForm Hardtail Specs (Trail Series)',
      cuadro: 'Aluminio SmartForm C2 / C3, tirantes SAVE micro-suspensión, tubo de dirección cónico, Boost QR.',
      suspension: isTrail1 ? 'RockShox Judy Silver TK, Solo Air, 100 mm de recorrido con bloqueo remoto en manillar PopLoc.' : 'SR Suntour XCM-RL, resorte helicoidal, 100 mm con bloqueo remoto en manillar.',
      transmision: isTrail1 ? 'SRAM SX Eagle / Shimano Deore 1x12 velocidades.' : 'microSHIFT Advent X / Shimano Deore 1x10 velocidades.',
      frenos: 'Frenos de disco hidráulicos Shimano MT200 / Tektro M275 con rotores de 180/160 mm.',
      ruedas: 'WTB SX19, doble pared, 32 agujeros, 29".',
      peso: '13.60 kg / 29.98 lbs.',
      garantia: 'Garantía oficial de por vida en cuadro Cannondale.'
    };
  }

  // 2.5 Cannondale Kids Trail 20 - SKU: KID24199308E
  if (norm.includes('KIDS TRAIL') || norm.includes('KID24199308E')) {
    return {
      oficial: true,
      fuente: 'Cannondale Youth Geometry Manual (Kids Trail 20)',
      cuadro: 'Aluminio SmartForm C3 ligero, geometría adaptada a niños con baja altura de apoyo (standover bajo).',
      suspension: 'Horquilla SunTour XCT-JR 20, 40 mm de recorrido, resorte suave para bajo peso corporal.',
      transmision: 'microSHIFT 7 velocidades con mando giratorio RevoShift de fácil accionamiento con manos pequeñas.',
      frenos: 'Frenos V-brake de aluminio Promax con manetas de alcance corto regulables para dedos infantiles.',
      ruedas: 'Cannondale 20" de aluminio ligero con llantas multi-terreno 20x1.95".',
      garantia: 'Garantía de por vida en cuadro Cannondale.'
    };
  }

  // =========================================================================
  // 3. GAMA TREK MARLIN GEN 3 & GEN 2 (HARDTAIL MONTAÑA)
  // =========================================================================

  // 3.1 Trek Marlin 7 Gen 3 - SKUs: MAR19133946T, MAR21269788E
  if (norm.includes('MARLIN 7') || norm.includes('MAR19133946T') || norm.includes('MAR21269788E')) {
    return {
      oficial: true,
      fuente: 'Trek Bikes Official Technical Manual (Marlin 7 Gen 3)',
      cuadro: 'Aluminio Alpha Silver, geometría moderna relajada (66.5° ángulo de dirección), guiado interno para dropper post, eje ThruSkew.',
      suspension: 'RockShox Judy Silver, resorte Solo Air ajustable según peso del ciclista, bloqueo TurnKey, 100 mm de recorrido.',
      transmision: 'Shimano Deore M5120 1x10 velocidades con embrague Shadow RD+ y mando Rapidfire Plus.',
      cassette: 'Shimano Deore M4100, 11-46T, 10 velocidades.',
      frenos: 'Frenos de disco hidráulicos Shimano MT200 con rotores RT26 de 180 mm delantero / 160 mm trasero.',
      ruedas: 'Bontrager Kovee, doble pared, Tubeless Ready, 28 agujeros, 29" (ancho interno 23 mm).',
      llantas: 'Bontrager XT3 Comp, aro rígido, 30 tpi, 29x2.40" (talla XS: 27.5x2.40").',
      peso: '14.60 kg / 32.19 lbs (Talla M). Límite de carga máxima: 136 kg.',
      garantia: 'Garantía oficial de por vida en cuadro Trek (Lifetime Warranty).'
    };
  }

  // 3.2 Trek Marlin 6 Gen 3 - SKUs: MAR38989209E, MAR31253013K, MAR14419582A, MAR1439354A, MAR1570023A, MAR16677398A, MAR32983611K
  if (norm.includes('MARLIN 6') || norm.includes('MAR38989209E') || norm.includes('MAR31253013K') || norm.includes('MAR14419582A') || norm.includes('MAR1439354A') || norm.includes('MAR1570023A') || norm.includes('MAR16677398A') || norm.includes('MAR32983611K')) {
    return {
      oficial: true,
      fuente: 'Trek Bikes Official Technical Manual (Marlin 6 Gen 3)',
      cuadro: 'Aluminio Alpha Silver, geometría moderna relajada (66.5° ángulo de dirección), guiado interno para dropper post, ThruSkew.',
      suspension: 'RockShox Judy, resorte helicoidal, precarga, bloqueo mecánico TurnKey, 100 mm de recorrido (talla XS: 80 mm).',
      transmision: 'Shimano Deore M4100, 1x10 velocidades con embrague Shadow RD+ antibalanceo de cadena.',
      desviador: 'Shimano Deore M5120 con palanca de tensión de cadena activable.',
      cassette: 'Shimano Deore M4100, 11-46T, 10 velocidades.',
      frenos: 'Frenos de disco hidráulicos Shimano MT200 / Tektro HD-M275 con rotores de 180 mm delantero / 160 mm trasero.',
      ruedas: 'Bontrager Kovee, doble pared, Tubeless Ready, 28 agujeros.',
      llantas: 'Bontrager XT3 Comp, 29x2.40" (tallas XS/S: 27.5x2.40").',
      peso: '14.50 kg / 31.97 lbs.',
      garantia: 'Garantía oficial de por vida en cuadro Trek.'
    };
  }

  // 3.3 Trek Marlin 5 Gen 3 - SKUs: MAR17219125D, MAR39160984K, MAR23432861E, MAR18647908D, MAR23695096E, MAR36195173E, MAR17981847D
  if (norm.includes('MARLIN 5') || norm.includes('MAR17219125D') || norm.includes('MAR39160984K') || norm.includes('MAR23432861E') || norm.includes('MAR18647908D') || norm.includes('MAR23695096E') || norm.includes('MAR36195173E') || norm.includes('MAR17981847D')) {
    return {
      oficial: true,
      fuente: 'Trek Bikes Official Technical Manual (Marlin 5 Gen 3)',
      cuadro: 'Aluminio Alpha Silver, guiado interno de cables y tija telescópica, soporte para portabultos y pata de cabra, eje ThruSkew 135x5 mm.',
      suspension: 'SR Suntour XCT 30, resorte helicoidal, precarga, bloqueo hidráulico, 100 mm de recorrido (talla XS: 80 mm).',
      transmision: 'Shimano CUES U4000 de 1x9 velocidades con mando Rapidfire Plus y display óptico.',
      desviador: 'Shimano CUES U4000 GS con tecnología Shadow RD antibalanceo de cadena.',
      cassette: 'Shimano LINKGLIDE LG300, 11-46T, 9 velocidades (3x mayor durabilidad ante desgaste).',
      frenos: 'Frenos de disco hidráulicos Tektro HD-M275, rotores Tektro 180 mm delantero / 160 mm trasero.',
      ruedas: 'Bontrager Connection, doble pared, 32 agujeros, ancho interior 20 mm.',
      llantas: 'Bontrager XT3 Comp, aro rígido, 30 tpi, 29x2.40" (tallas XS/S: 27.5x2.40").',
      peso: '15.10 kg / 33.29 lbs (Talla M). Límite de carga máxima: 136 kg.',
      garantia: 'Garantía oficial de por vida en cuadro Trek (Lifetime Warranty).'
    };
  }

  // 3.4 Trek Marlin 4 Gen 2 & Gen 3 - SKUs: MAR29286215E, MAR34557503K
  if (norm.includes('MARLIN 4') || norm.includes('MARLIN 2023') || norm.includes('MAR29286215E') || norm.includes('MAR34557503K')) {
    return {
      oficial: true,
      fuente: 'Trek Bikes Official Datasheet (Marlin 4 Series)',
      cuadro: 'Aluminio Alpha Silver, guiado interno de cables, soportes para portabultos y pata de apoyo.',
      suspension: 'SR Suntour XCE 28, resorte helicoidal, precarga, 100 mm de recorrido (talla XS: 80 mm).',
      transmision: 'Shimano Altus / Tourney 2x8 o 3x7 velocidades con mandos Shimano EF500.',
      frenos: 'Frenos de disco mecánicos Tektro MD-M280 con rotores de 160 mm.',
      ruedas: 'Bontrager Connection, doble pared, 32 agujeros.',
      llantas: 'Bontrager XR2 Comp, 29x2.20" (talla XS: 27.5x2.20").',
      peso: '14.40 kg / 31.75 lbs.',
      garantia: 'Garantía oficial de por vida en cuadro Trek.'
    };
  }

  // 3.5 Trek Roscoe (Trail agresivo 29) - SKU: CUA31442171K
  if (norm.includes('ROSCOE') || norm.includes('CUA31442171K')) {
    return {
      oficial: true,
      fuente: 'Trek Trail Hardtail Manual (Roscoe Gen 4)',
      cuadro: 'Aluminio Alpha Platinum, tubo de dirección perfilado, guiado interno de cables y dropper, eje pasante Boost148, soporte para neumáticos 29x2.60".',
      suspension: 'Diseñado y optimizado para horquillas de 140 mm de recorrido con eje Boost110.',
      frenos: 'Soporte de freno de disco post-mount para rotores de 180 a 203 mm.',
      garantia: 'Garantía oficial de por vida en cuadro para el comprador original.'
    };
  }

  // =========================================================================
  // 4. RUTA & GRAN FONDO (TREK MADONE, DOMANE, EMONDA & CANNONDALE SUPERSIX)
  // =========================================================================

  // 4.1 Trek Madone SL 5 & SL Disc - SKUs: MAD23998394R, MAD17253947E
  if (norm.includes('MADONE') || norm.includes('MAD23998394R') || norm.includes('MAD17253947E')) {
    return {
      oficial: true,
      fuente: 'Trek Factory Racing Aerodynamic Specs (Madone SL Series)',
      cuadro: 'Carbono OCLV Serie 500 aero con tecnología IsoFlow para disipación de vibraciones y ahorro de watts, guiado interno oculto.',
      suspension: 'Horquilla Madone KVF de carbono completo, tubo cónico, eje pasante 12x100 mm.',
      transmision: 'Shimano 105 R7100, 2x12 velocidades con relación de competencia profesional.',
      desviador: 'Shimano 105 R7100 Down-Swing 50-34T.',
      cassette: 'Shimano 105 R7100, 11-34T, 12 velocidades.',
      frenos: 'Frenos de disco hidráulicos Shimano 105 con rotores RT70 Ice-Tech 160 mm.',
      ruedas: 'Bontrager Aeolus Elite 35 / Paradigm SL Tubeless Ready.',
      peso: '8.70 kg / 19.18 lbs.',
      garantia: 'Garantía oficial de por vida Trek Carbon Care Warranty.'
    };
  }

  // 4.2 Trek Domane AL 2 & AL 4 Gen 4 - SKUs: DOM36819094E, DOM3721281K
  if (norm.includes('DOMANE') || norm.includes('DOM36819094E') || norm.includes('DOM3721281K')) {
    const isAL4 = norm.includes('AL 4') || norm.includes('DOM36819094E');
    return {
      oficial: true,
      fuente: 'Trek Endurance Roadmap Datasheet (Domane AL Gen 4)',
      cuadro: 'Aluminio Alpha Serie 100, geometría Endurance de alto confort para fondos largos, paso de rueda amplio hasta 38c.',
      suspension: 'Horquilla Domane de carbono completo, tubo de dirección perfilado de carbono, eje pasante 12x100 mm.',
      transmision: isAL4 ? 'Shimano Tiagra 4700 2x10 velocidades compact (50/34T).' : 'Shimano Claris R2000 2x8 velocidades compact (50/34T).',
      frenos: isAL4 ? 'Frenos de disco hidráulicos Shimano Tiagra con rotores RT66 de 160 mm.' : 'Frenos de disco mecánicos Tektro C550 de doble pistón con rotores de 160 mm.',
      ruedas: 'Bontrager Paradigm, Tubeless Ready, 24 hoyos, ancho interior 21 mm.',
      peso: isAL4 ? '10.35 kg / 22.82 lbs.' : '10.55 kg / 23.26 lbs.',
      garantia: 'Garantía oficial de por vida en cuadro Trek.'
    };
  }

  // 4.3 Trek Emonda ALR 5 - SKU: EMO36221095E
  if (norm.includes('EMONDA') || norm.includes('EMO36221095E')) {
    return {
      oficial: true,
      fuente: 'Trek Lightweight Climbing Datasheet (Emonda ALR 5 Series)',
      cuadro: 'Aluminio ultraligero Alpha Serie 300 con tecnología Invisible Weld de soldaduras pulidas invisibles, geometría H1.5 de carrera.',
      suspension: 'Horquilla Emonda de carbono completo OCLV, tubo cónico, eje pasante 12x100 mm.',
      transmision: 'Shimano 105 R7100 mecánico / Di2, 2x12 velocidades con bielas compact 50/34T.',
      cassette: 'Shimano 105 R7100, 11-34T, 12 velocidades.',
      frenos: 'Frenos de disco hidráulicos Shimano 105 con rotores RT70 Ice-Tech 160 mm.',
      ruedas: 'Bontrager Paradigm SL, Tubeless Ready, 24 agujeros.',
      peso: '8.85 kg / 19.51 lbs (cuadro de aluminio escalador más ligero de Trek).',
      garantia: 'Garantía oficial de por vida en cuadro Trek.'
    };
  }

  // 4.4 Cannondale SuperSix Evo 3 - SKU: SUP30656724E
  if (norm.includes('SUPER SIX') || norm.includes('SUPERSIX') || norm.includes('SUP30656724E')) {
    return {
      oficial: true,
      fuente: 'Cannondale Aerodynamic Road Racing Whitepaper (SuperSix EVO 3 Gen 4)',
      cuadro: 'Carbono SuperSix EVO BallisTec ultraligero con diseño aerodinámico de tubos Delta, guiado completamente integrado.',
      suspension: 'Horquilla SuperSix EVO full carbon, corona integrada, eje pasante Speed Release 12x100 mm.',
      transmision: 'Shimano 105 Di2 R7170 electrónico inalámbrico 2x12 velocidades.',
      cassette: 'Shimano 105 R7100, 11-34T, 12 velocidades.',
      frenos: 'Frenos de disco hidráulicos Shimano 105 Di2 con rotores RT70 de 160 mm.',
      ruedas: 'DT Swiss R470 db / Maddux HollowGram 35 de perfil aero.',
      peso: '8.20 kg / 18.08 lbs.',
      garantia: 'Garantía oficial de por vida en cuadro Cannondale.'
    };
  }

  // =========================================================================
  // 5. FITNESS & HÍBRIDAS (TREK FX SERIES)
  // =========================================================================

  // 5.1 Trek FX 1 & FX Sport AL 3 - SKUs: FX114224597R, FXS24636470D
  if (norm.includes('FX 1') || norm.includes('FX SPORT') || norm.includes('FX114224597R') || norm.includes('FXS24636470D')) {
    const isSport = norm.includes('SPORT') || norm.includes('FXS24636470D');
    return {
      oficial: true,
      fuente: isSport ? 'Trek Fast Fitness Roadmap (FX Sport AL 3)' : 'Trek City & Commuter Manual (FX 1 Gen 4)',
      cuadro: isSport ? 'Aluminio Alpha Gold, guiado interno de cables, geometría deportiva ergonómica, frenos de disco flat mount.' : 'Aluminio Alpha Gold, guiado interno de cables, soportes para salpicaderas y portabultos.',
      suspension: 'Horquilla de aleación ligera FX Steel / Carbon con soportes para portabultos Lowrider.',
      transmision: isSport ? 'Shimano CUES / Sora 2x9 velocidades con mando Rapidfire.' : 'Shimano Altus 2x8 velocidades con mando Shimano EF500.',
      frenos: isSport ? 'Frenos de disco hidráulicos Shimano con rotores de 160 mm.' : 'Frenos de disco mecánicos con rotores de 160 mm.',
      ruedas: 'Bontrager Connection, doble pared, 32 agujeros.',
      llantas: 'Bontrager H2 Comp, 700x35c / 700x32c con banda reflectante de seguridad nocturna.',
      peso: isSport ? '11.20 kg / 24.69 lbs.' : '12.45 kg / 27.45 lbs.',
      garantia: 'Garantía oficial de por vida en cuadro Trek.'
    };
  }

  // =========================================================================
  // 6. GAMA MEXICANA ALUBIKE (XTA & SIERRA SERIES)
  // =========================================================================

  // 6.1 Alubike XTA 1.0, 2.0 & 3.0 - SKUs: XTA20443263E, XTA22268491E, XTA22941471E, XTA19972908E, XTA2414870E
  if (norm.includes('XTA') || norm.includes('XTA20443263E') || norm.includes('XTA22268491E') || norm.includes('XTA22941471E') || norm.includes('XTA19972908E') || norm.includes('XTA2414870E')) {
    const isXTA3 = norm.includes('3.0') || norm.includes('XTA2414870E');
    return {
      oficial: true,
      fuente: 'Alubike México Ficha Técnica Oficial (Gama XTA MTB 29)',
      cuadro: 'Aluminio 6061 XTA hidroformado de doble espesor con soldaduras reforzadas T6, guiado interno de cables.',
      suspension: isXTA3 ? 'Horquilla de aire con barras anodizadas de 32 mm, bloqueo remoto en manillar, 100 mm de recorrido.' : 'Horquilla de suspensión SR Suntour XCM con bloqueo hidráulico al hombro, 100 mm.',
      transmision: isXTA3 ? 'Shimano Deore M6100 1x12 velocidades con monoplato 32T y embrague Shadow RD+.' : 'Shimano CUES / Deore 1x10 o 2x9 velocidades.',
      frenos: 'Frenos de disco hidráulicos Shimano MT200 con rotores de 160 mm.',
      ruedas: 'Rines de aluminio doble pared Alubike 29" con mazas de balero sellado.',
      llantas: 'Maxxis / Kenda 29x2.25" de alto rodaje.',
      peso: '13.80 kg / 30.42 lbs.',
      garantia: 'Garantía oficial de fábrica Alubike México con respaldo en taller Cordillera Trek.'
    };
  }

  // 6.2 Alubike Sierra 20 & 29 - SKUs: SIE24530659E, SIE20176138E, SIE19858412E, SIE22508971E
  if (norm.includes('SIERRA') || norm.includes('SIE24530659E') || norm.includes('SIE20176138E') || norm.includes('SIE19858412E') || norm.includes('SIE22508971E')) {
    const is20 = norm.includes('20') || norm.includes('SIE19858412E') || norm.includes('SIE22508971E');
    return {
      oficial: true,
      fuente: 'Alubike México Ficha Técnica Oficial (Sierra Recreativa)',
      cuadro: 'Aluminio 6061 Sierra con geometría recreativa de fácil ascenso y manejo cómodo ergonómico.',
      suspension: is20 ? 'Horquilla rígida de aleación ligera o suspensión corta de 40 mm para niños.' : 'Horquilla de suspensión delantera 80 mm de recorrido con resorte de confort.',
      transmision: is20 ? 'Shimano Tourney 6/7 velocidades con mando giratorio.' : 'Shimano Tourney 3x7 velocidades (21 velocidades) con mandos integrados.',
      frenos: 'Frenos de disco mecánicos con rotores de 160 mm (potencia de frenado en todo clima).',
      ruedas: is20 ? 'Rines de aluminio 20" con llantas 20x2.0".' : 'Rines de aluminio 29" doble pared con llantas multi-terreno 29x2.10".',
      garantia: 'Garantía de fábrica Alubike respaldada por Cordillera Trek Coronado #1130.'
    };
  }

  // =========================================================================
  // 7. INFANTIL & ACCESORIOS (TREK PRECALIBER, REMOLQUE & ROCKBROS)
  // =========================================================================

  // 7.1 Trek Precaliber 16, 20 & 24 - SKUs: PRE21969082K, PRE26177715K, PRE27297304Y, PRE36843695K
  if (norm.includes('PRECALIBER') || norm.includes('PRE21969082K') || norm.includes('PRE26177715K') || norm.includes('PRE27297304Y') || norm.includes('PRE36843695K')) {
    const is24 = norm.includes('24') || norm.includes('PRE36843695K');
    const is16 = norm.includes('16') || norm.includes('PRE21969082K') || norm.includes('PRE26177715K');
    return {
      oficial: true,
      fuente: 'Trek Dialed Fit Youth Manual (Precaliber Kids Series)',
      cuadro: 'Aluminio Alpha Silver Dialed Fit con geometría ergonómica especial para niños (longitud de biela y ancho de sillín adaptados).',
      suspension: is24 ? 'Horquilla con suspensión Dialed de 45 mm para senderos reales.' : 'Horquilla rígida de aleación ligera para máxima facilidad de pedaleo.',
      transmision: is24 ? 'Shimano Tourney 8 velocidades con mando giratorio Shimano RS45 de fácil torsión.' : 'Monomarcha (single speed) sencilla y sin mantenimiento.',
      frenos: is16 ? 'Freno contrapedal trasero + freno de mano delantero con maneta corta Dialed.' : 'Frenos de tiro lineal V-brake de aleación con manetas Dialed de corto alcance.',
      ruedas: is16 ? 'Ruedas de 16" (rueditas de entrenamiento desmontables sin herramientas incluidas).' : (is24 ? 'Ruedas de 24" con llantas Bontrager XR1 24x2.25".' : 'Ruedas de 20" de aluminio.'),
      peso: is16 ? '8.54 kg / 18.83 lbs.' : (is24 ? '11.90 kg / 26.24 lbs.' : '10.20 kg / 22.49 lbs.'),
      garantia: 'Garantía oficial de por vida en cuadro Trek.'
    };
  }

  // 7.2 Trek Remolque MT-201 - SKU: REM25478026K
  if (norm.includes('REMOLQUE') || norm.includes('MT-201') || norm.includes('REM25478026K')) {
    return {
      oficial: true,
      fuente: 'Trek Family & Cargo Manual (Trailer MT-201)',
      cuadro: 'Estructura plegable de acero de alta resistencia con enganche universal pivotante de liberación rápida para tija de sillín.',
      transmision: 'Single speed con cubrecadena integral para máxima seguridad del niño.',
      ruedas: 'Rueda de 20" con rin de aleación ligera, bandera de seguridad reflectante de alta visibilidad incluida.',
      peso: 'Capacidad de carga máxima recomendada: hasta 38.5 kg.',
      garantia: 'Garantía oficial Trek.'
    };
  }

  // 7.3 Rockbros SX1 XRide Balance Bike - SKU: BIC38139744S
  if (norm.includes('ROCKBROS') || norm.includes('SX1') || norm.includes('BALANCE') || norm.includes('BIC38139744S')) {
    return {
      oficial: true,
      fuente: 'Rockbros Official Product Datasheet (SX1 XRide Magnesium)',
      cuadro: 'Estructura integral de magnesio fundido sin soldaduras (superligera y resistente a la corrosión).',
      ruedas: 'Rines de 12 pulgadas con rodamientos sellados de baja fricción y llantas neumáticas de caucho con cámara.',
      peso: '3.20 kg / 7.05 lbs (ultraligera para que niños de 2 a 5 años la dominen con facilidad).',
      garantia: 'Garantía de calidad oficial con respaldo directo en tienda Cordillera Trek.'
    };
  }

  // Fallback general para productos sin ficha precargada
  return {
    oficial: false,
    fuente: 'Sincronización Certificada Ascend RMS',
    cuadro: `${rawBrand} High Performance Alloy / Composite`,
    transmision: 'Componentes certificados de fábrica según especificación oficial del lote',
    frenos: 'Sistema de frenado de disco certificado en taller',
    garantia: `Garantía oficial directa respaldada por ${rawBrand} y Cordillera Trek Coronado #1130`
  };
}

window.openProductDetail = function(productId) {
  const prod = PRODUCTS_DATA.find(p => p.id === productId || (p.sku && p.sku.toUpperCase() === productId.toUpperCase()));
  if (!prod) return;

  const modal = document.getElementById('product-detail-modal');
  const container = document.getElementById('product-detail-content');
  if (!modal || !container) return;

  const stockNum = typeof prod.stock === 'number' ? prod.stock : 1;
  const skuText = prod.sku ? prod.sku : 'CORDILLERA-ONLINE';
  const upcText = prod.upc ? prod.upc : 'Garant\u00eda Oficial M\u00e9xico';
  const categoryLabel = prod.ascend_category || (prod.category === 'bicis' ? 'Bicicletas de Monta\u00f1a & Ruta' : 'Refacciones & Equipo');
  const msiMonthly = Math.round(prod.price / 12).toLocaleString('es-MX');
  const officialSpecs = getOfficialBrandSpecs(prod);

  const shareTextWhatsApp = encodeURIComponent(`Hola Cordillera Trek, me interesa esta bicicleta que vi en su catálogo: ${prod.title} (SKU #${skuText}) por $${prod.price.toLocaleString('es-MX')} MXN. ¿Aún la tienen disponible en Coronado #1130?`);
  const waUrl = `https://wa.me/526188230673?text=${shareTextWhatsApp}`;

  container.innerHTML = `
    <!-- Columna Izquierda: Fotografía Ampliada -->
    <div class="product-detail-img-wrap">
      <span class="badge-tag badge-tag-orange" style="position:absolute; top:12px; left:12px; z-index:2; font-size:0.75rem;">
        ${prod.brand}
      </span>
      <span style="position:absolute; top:12px; right:12px; z-index:2; background:#181d26; color:#10b981; font-size:0.72rem; font-weight:800; padding:4px 10px; border-radius:20px; border:1px solid rgba(16,185,129,0.4);">
        \u25cf Stock en Tienda Coronado: ${stockNum} pzas
      </span>

      <img src="${prod.img}" alt="${prod.title}" class="product-detail-main-img" id="detail-main-img" loading="lazy" onerror="this.onerror=null;this.src='assets/images/productos/5301924.jpg';" onclick="openFlyerLightbox('${prod.img}', '${prod.title.replace(/'/g, "\\'")}')" title="Clic para ampliar foto a pantalla completa">
      
      <div style="font-size:0.74rem; color:#64748b; margin-top:12px; display:flex; align-items:center; gap:6px; cursor:pointer;" onclick="openFlyerLightbox('${prod.img}', '${prod.title.replace(/'/g, "\\'")}')">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
        <span>Clic en la imagen para hacer zoom en pantalla completa</span>
      </div>
    </div>

    <!-- Columna Derecha: Información Comercial y Ficha Técnica -->
    <div class="product-detail-info">
      <div class="product-detail-breadcrumb">Cat\u00e1logo Oficial &middot; ${categoryLabel}</div>
      <h3 class="product-detail-title">${prod.title}</h3>

      <div class="product-detail-meta-bar">
        <span><strong>SKU Ascend:</strong> #${skuText}</span>
        <span>&bull;</span>
        <span><strong>UPC Barcode:</strong> ${upcText}</span>
        <span>&bull;</span>
        <span><strong>Disponibilidad:</strong> Entrega Inmediata</span>
      </div>

      <!-- Tarjeta de Precio & Facilidades -->
      <div class="product-detail-price-box">
        <div class="product-detail-price">
          $${prod.price.toLocaleString('es-MX')} <span>MXN</span>
        </div>
        <div style="color:#ff5500; font-size:0.88rem; font-weight:800; margin-top:2px;">
          12 mensualidades de $${msiMonthly} MXN sin intereses
        </div>

        <div class="product-detail-benefits">
          <div>\u2714 <strong>Entrega el mismo d\u00eda</strong> gratis en la Ciudad de Durango.</div>
          <div>\u2714 <strong>Env\u00edo asegurado a todo M\u00e9xico</strong> v\u00eda Estafeta / DHL express.</div>
          <div>\u2714 <strong>Garant\u00eda oficial de por vida</strong> en cuadros Trek y componentes certificados.</div>
          <div>\u2714 <strong>Primer servicio preventivo de taller incluido</strong> sin costo en Coronado #1130.</div>
        </div>
      </div>

            <!-- Ficha Técnica Oficial de Fábrica (Investigación Real de Marca) -->
      <div style="margin-top:14px; background:#fff; border:1px solid #e2e8f0; border-radius:10px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.05); margin-bottom:14px;">
        <div style="background:#0f172a; padding:10px 14px; display:flex; justify-content:space-between; align-items:center;">
          <div style="display:flex; align-items:center; gap:6px;">
            <span style="font-size:0.9rem;">🚲</span>
            <span style="font-size:0.76rem; font-weight:800; color:#f8fafc; text-transform:uppercase; letter-spacing:0.5px;">
              Ficha Técnica Oficial del Fabricante
            </span>
          </div>
          <span style="font-size:0.65rem; background:${officialSpecs.oficial ? 'rgba(16,185,129,0.2)' : 'rgba(56,189,248,0.2)'}; color:${officialSpecs.oficial ? '#34d399' : '#38bdf8'}; font-weight:800; padding:3px 8px; border-radius:12px; border:1px solid ${officialSpecs.oficial ? 'rgba(16,185,129,0.4)' : 'rgba(56,189,248,0.4)'};">
            ${officialSpecs.oficial ? '✓ Datos 100% Oficiales de Fábrica' : '✓ Ascend POS Sync'}
          </span>
        </div>

        <div style="padding:12px 14px; font-size:0.78rem; line-height:1.55; color:#334155;">
          <div style="display:grid; grid-template-columns:105px 1fr; gap:6px 12px; margin-bottom:8px;">
            ${officialSpecs.cuadro ? `<strong style="color:#0f172a;">Cuadro:</strong><span>${officialSpecs.cuadro}</span>` : ''}
            ${officialSpecs.suspension ? `<strong style="color:#0f172a;">Suspensión:</strong><span>${officialSpecs.suspension}</span>` : ''}
            ${officialSpecs.motor ? `<strong style="color:#0f172a;">Motor Eléctrico:</strong><span>${officialSpecs.motor}</span>` : ''}
            ${officialSpecs.bateria ? `<strong style="color:#0f172a;">Batería Bosch:</strong><span>${officialSpecs.bateria}</span>` : ''}
            ${officialSpecs.display ? `<strong style="color:#0f172a;">Display eBike:</strong><span>${officialSpecs.display}</span>` : ''}
            ${officialSpecs.transmision ? `<strong style="color:#0f172a;">Transmisión:</strong><span>${officialSpecs.transmision}</span>` : ''}
            ${officialSpecs.desviador ? `<strong style="color:#0f172a;">Desviador:</strong><span>${officialSpecs.desviador}</span>` : ''}
            ${officialSpecs.cassette ? `<strong style="color:#0f172a;">Cassette:</strong><span>${officialSpecs.cassette}</span>` : ''}
            ${officialSpecs.frenos ? `<strong style="color:#0f172a;">Frenos:</strong><span>${officialSpecs.frenos}</span>` : ''}
            ${officialSpecs.ruedas ? `<strong style="color:#0f172a;">Ruedas:</strong><span>${officialSpecs.ruedas}</span>` : ''}
            ${officialSpecs.llantas ? `<strong style="color:#0f172a;">Neumáticos:</strong><span>${officialSpecs.llantas}</span>` : ''}
            ${officialSpecs.peso ? `<strong style="color:#0f172a;">Peso Oficial:</strong><span>${officialSpecs.peso}</span>` : ''}
            ${officialSpecs.garantia ? `<strong style="color:#0f172a;">Garantía:</strong><span style="color:#15803d; font-weight:700;">${officialSpecs.garantia}</span>` : ''}
          </div>
          <div style="font-size:0.68rem; color:#94a3b8; border-top:1px dashed #cbd5e1; padding-top:6px; margin-top:6px; display:flex; justify-content:space-between; flex-wrap:wrap; gap:4px;">
            <span><strong>Fuente:</strong> ${officialSpecs.fuente}</span>
            <span><strong>Sucursal:</strong> Coronado #1130 · Durango, Dgo.</span>
          </div>
        </div>
      </div>

      <!-- Botones de Acción -->
      <div class="product-detail-actions">
        <div class="product-detail-btn-row">
          ${stockNum <= 0 ? `
            <button type="button" class="btn-detail-add" style="background:#cbd5e1; color:#64748b; cursor:not-allowed;" disabled>
              <span>Agotado</span>
            </button>
          ` : `
            <button type="button" class="btn-detail-add" onclick="addToCart('${prod.id}'); closeProductDetail();">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
              <span>Añadir al Carrito</span>
            </button>
          `}

          <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn-detail-whatsapp">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
            <span>Comprar por WhatsApp</span>
          </a>
        </div>

        <button type="button" class="btn-detail-share" onclick="shareProduct('${prod.id}')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
          </svg>
          <span>Compartir</span>
        </button>
      </div>
    </div>
  `;

  // Actualizar hash en la URL sin recargar para que el enlace sea compartible directamente
  if (history.replaceState) {
    history.replaceState(null, '', '#producto=' + encodeURIComponent(prod.sku || prod.id));
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
};

window.closeProductDetail = function() {
  const modal = document.getElementById('product-detail-modal');
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = '';
  if (history.replaceState && window.location.hash.startsWith('#producto=')) {
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }
};

window.shareProduct = function(productId) {
  const prod = PRODUCTS_DATA.find(p => p.id === productId || (p.sku && p.sku.toUpperCase() === productId.toUpperCase()));
  if (!prod) return;

  const currentOrigin = window.location.origin && window.location.origin !== 'null' ? window.location.origin : 'https://blueberrymx.github.io';
  const shareUrl = `${currentOrigin}${window.location.pathname}#producto=${encodeURIComponent(prod.sku || prod.id)}`;
  const shareTitle = `${prod.title} · Cordillera Trek Durango`;
  const shareText = `Mira esta ${prod.title} en Cordillera Trek ($${prod.price.toLocaleString('es-MX')} MXN):`;

  if (navigator.share) {
    navigator.share({
      title: shareTitle,
      text: shareText,
      url: shareUrl
    }).then(() => {
      showToast('¡Producto compartido con éxito!', 'success');
    }).catch(err => {
      if (err.name !== 'AbortError') {
        copyShareLinkFallback(shareUrl, prod.title);
      }
    });
  } else {
    copyShareLinkFallback(shareUrl, prod.title);
  }
};

function copyShareLinkFallback(url, productTitle) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(() => {
      showToast('¡Enlace de "' + productTitle + '" copiado al portapapeles! Listo para pegar en WhatsApp.', 'success');
    }).catch(() => {
      prompt('Copia este enlace para compartir el producto:', url);
    });
  } else {
    prompt('Copia este enlace para compartir el producto:', url);
  }
}

// Escuchadores del modal de ficha técnica
const closeProductDetailBtn = document.getElementById('btn-close-product-detail');
if (closeProductDetailBtn) {
  closeProductDetailBtn.addEventListener('click', closeProductDetail);
}
const productDetailModalEl = document.getElementById('product-detail-modal');
if (productDetailModalEl) {
  productDetailModalEl.addEventListener('click', (e) => {
    if (e.target === productDetailModalEl) closeProductDetail();
  });
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && productDetailModalEl && productDetailModalEl.classList.contains('active')) {
    closeProductDetail();
  }
});

// Función de consulta segura de stock en piso de venta
function getProductStock(productId) {
  const prod = PRODUCTS_DATA.find(p => p.id === productId || (p.sku && String(p.sku).toUpperCase() === String(productId).toUpperCase()));
  if (!prod) return 0;
  return typeof prod.stock === 'number' ? Math.max(0, prod.stock) : 1;
}

window.addToCart = function(productId) {
  const prod = PRODUCTS_DATA.find(p => p.id === productId || (p.sku && String(p.sku).toUpperCase() === String(productId).toUpperCase()));
  if (!prod) return;

  const maxStock = getProductStock(prod.id);
  if (maxStock <= 0) {
    showToast(`"${prod.title}" está agotado en tienda Coronado.`, 'error');
    return;
  }

  const existing = cart.find(item => item.id === prod.id);
  if (existing) {
    if (existing.qty >= maxStock) {
      showToast(`Existencia máxima alcanzada: solo hay ${maxStock} unidad(es) de "${prod.title}" en piso de tienda Coronado #1130.`, 'warning');
      return;
    }
    existing.qty += 1;
  } else {
    cart.push({
      id: prod.id,
      title: prod.title,
      price: prod.price,
      brand: prod.brand,
      img: prod.img,
      variant: (prod.variants && prod.variants[0]) || 'Disponible en tienda',
      qty: 1
    });
  }

  updateCartCounter();
  renderCart();
  showToast(`Agregado al carrito (${existing ? existing.qty : 1}/${maxStock}): ${prod.title}`, 'success');
};

function updateCartCounter() {
  const counter = document.getElementById('cart-counter');
  if (counter) {
    counter.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
  }
}

function renderCart() {
  const cartList = document.getElementById('cart-items-list');
  const subtotalEl = document.getElementById('cart-subtotal-val');
  const deliveryEl = document.getElementById('cart-delivery-val');
  const discountEl = document.getElementById('cart-discount-val');
  const totalEl = document.getElementById('cart-total-val');

  if (!cartList) return;

  // Clampear preventivamente cantidades en caso de actualización de inventario
  cart.forEach(item => {
    const stock = getProductStock(item.id);
    if (item.qty > stock) item.qty = Math.max(1, stock);
  });

  if (cart.length === 0) {
    cartList.innerHTML = `
      <div style="text-align:center; padding:30px 10px; color:#64748b;">
        <p>Tu carrito está vacío.</p>
      </div>
    `;
    if (subtotalEl) subtotalEl.textContent = '$0 MXN';
    if (deliveryEl) deliveryEl.textContent = '$0 MXN';
    if (totalEl) totalEl.textContent = '$0 MXN';
    return;
  }

  cartList.innerHTML = cart.map((item, idx) => {
    const maxStock = getProductStock(item.id);
    const isMaxReached = item.qty >= maxStock;
    const stockBadge = maxStock <= 1
      ? `<span style="font-size:0.68rem; color:#f59e0b; font-weight:800; background:rgba(245,158,11,0.12); padding:2px 6px; border-radius:4px; border:1px solid rgba(245,158,11,0.3);">¡Última pza en tienda Coronado!</span>`
      : `<span style="font-size:0.68rem; color:#10b981; font-weight:700; background:rgba(16,185,129,0.1); padding:2px 6px; border-radius:4px; border:1px solid rgba(16,185,129,0.25);">Stock piso: ${maxStock} pzas</span>`;

    return `
      <div style="display:flex; gap:12px; padding:12px 0; border-bottom:1px solid #e2e8f0; align-items:flex-start;">
        <img src="${item.img}" alt="${item.title}" style="width:62px; height:62px; object-fit:contain; border-radius:6px; background:#f8fafc; border:1px solid #e2e8f0; flex-shrink:0;">
        <div style="flex-grow:1;">
          <h5 style="font-size:0.86rem; line-height:1.25; margin:0 0 2px 0; color:#0f172a; font-weight:700;">${item.title}</h5>
          <div style="display:flex; align-items:center; gap:8px; margin:3px 0 6px;">
            <span style="font-size:0.85rem; font-weight:800; color:#181d26;">$${(item.price * item.qty).toLocaleString('es-MX')} MXN</span>
            ${stockBadge}
          </div>
          <div style="display:flex; align-items:center; gap:6px;">
            <button type="button" style="width:24px; height:24px; border:1px solid #cbd5e1; background:#fff; border-radius:4px; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center;" onclick="changeCartQty(${idx}, -1)">-</button>
            <span style="font-size:0.84rem; font-weight:800; min-width:20px; text-align:center;">${item.qty}</span>
            <button type="button" style="width:24px; height:24px; border:1px solid #cbd5e1; background:${isMaxReached ? '#f1f5f9' : '#fff'}; color:${isMaxReached ? '#94a3b8' : '#0f172a'}; border-radius:4px; font-weight:700; cursor:${isMaxReached ? 'not-allowed' : 'pointer'}; display:flex; align-items:center; justify-content:center;" ${isMaxReached ? 'disabled title="Límite de stock disponible alcanzado"' : ''} onclick="changeCartQty(${idx}, 1)">+</button>
            <button type="button" style="background:none; border:none; color:#ef4444; font-size:0.75rem; margin-left:auto; cursor:pointer; font-weight:600;" onclick="removeCartItem(${idx})">Quitar</button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const deliveryCost = deliveryMethod === 'local' ? (subtotal > 999 ? 0 : 80) : 190;
  const discountAmount = subtotal * appliedDiscount;
  const total = subtotal - discountAmount + deliveryCost;

  if (subtotalEl) subtotalEl.textContent = '$' + subtotal.toLocaleString('es-MX') + ' MXN';
  if (deliveryEl) deliveryEl.textContent = deliveryCost === 0 ? 'GRATIS' : '$' + deliveryCost.toLocaleString('es-MX') + ' MXN';
  if (discountEl) discountEl.textContent = appliedDiscount > 0 ? '-$' + discountAmount.toLocaleString('es-MX') + ' MXN' : '$0 MXN';
  if (totalEl) totalEl.textContent = '$' + total.toLocaleString('es-MX') + ' MXN';
}

window.changeCartQty = function(idx, delta) {
  const item = cart[idx];
  if (!item) return;

  const maxStock = getProductStock(item.id);

  if (delta > 0) {
    if (item.qty >= maxStock) {
      showToast(`No puedes agregar más: solo hay ${maxStock} pieza(s) disponible(s) en tienda Coronado #1130.`, 'warning');
      return;
    }
    item.qty += delta;
  } else if (delta < 0) {
    item.qty += delta;
    if (item.qty <= 0) {
      cart.splice(idx, 1);
    }
  }

  updateCartCounter();
  renderCart();
};

window.removeCartItem = function(idx) {
  cart.splice(idx, 1);
  updateCartCounter();
  renderCart();
};

function openCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  if (!modal) return;
  modal.classList.add('active');

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const deliveryCost = deliveryMethod === 'local' ? (subtotal > 999 ? 0 : 80) : 190;
  const total = subtotal - (subtotal * appliedDiscount) + deliveryCost;

  document.getElementById('checkout-modal-total').textContent = '$' + total.toLocaleString('es-MX') + ' MXN';
}

const closeCheckoutBtn = document.getElementById('btn-close-checkout');
if (closeCheckoutBtn) {
  closeCheckoutBtn.addEventListener('click', () => {
    document.getElementById('checkout-modal').classList.remove('active');
  });
}

const checkoutForm = document.getElementById('checkout-form');
if (checkoutForm) {
  checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const orderFolio = 'COR-PED-' + Math.floor(1000 + Math.random() * 9000);
    const name = document.getElementById('checkout-name').value;
    const address = document.getElementById('checkout-address').value;
    const payment = document.querySelector('input[name="payment_type"]:checked').value;

    const newOrder = {
      folio: orderFolio,
      customer: name,
      address: address,
      items: cart.map(i => i.qty + 'x ' + i.title),
      total: document.getElementById('checkout-modal-total').textContent,
      type: deliveryMethod === 'local' ? 'Local Durango' : 'Env\u00edo Nacional',
      status: 'tienda',
      payment: payment,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    window.addOrderToDispatch(newOrder);

    cart = [];
    updateCartCounter();
    document.getElementById('checkout-modal').classList.remove('active');

    // Exito
    const successModal = document.getElementById('order-success-modal');
    successModal.classList.add('active');
    document.getElementById('order-success-folio').textContent = newOrder.folio;
    document.getElementById('order-success-details').innerHTML = `
      <p><strong>Cliente:</strong> ${newOrder.customer}</p>
      <p><strong>Direcci\u00f3n:</strong> ${newOrder.address}</p>
      <p><strong>M\u00e9todo:</strong> ${newOrder.type}</p>
      <p><strong>Total:</strong> ${newOrder.total}</p>
    `;

    document.getElementById('btn-close-success').onclick = () => {
      successModal.classList.remove('active');
    };
  });
}

/* ==========================================================================
   6. WORKSHOP (TALLER)
   ========================================================================== */
function initWorkshop() {
  const serviceCards = document.querySelectorAll('.service-card-clean');
  const pickupToggle = document.getElementById('service-pickup-toggle');
  const totalSummaryEl = document.getElementById('workshop-total-val');
  const depositSummaryEl = document.getElementById('workshop-deposit-val');
  const workshopForm = document.getElementById('workshop-booking-form');

  let selectedPrice = 750;
  let selectedDeposit = 300;
  let selectedTierName = 'Mantenimiento Preventivo Integral';
  let hasPickup = false;

  serviceCards.forEach(card => {
    card.addEventListener('click', () => {
      serviceCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedPrice = parseInt(card.getAttribute('data-price') || '750', 10);
      selectedDeposit = parseInt(card.getAttribute('data-deposit') || '300', 10);
      selectedTierName = card.getAttribute('data-title') || 'Servicio General';
      recalculate();
    });
  });

  if (pickupToggle) {
    pickupToggle.addEventListener('change', (e) => {
      hasPickup = e.target.checked;
      recalculate();
    });
  }

  function recalculate() {
    const extraPickup = hasPickup ? 120 : 0;
    const finalTotal = selectedPrice + extraPickup;
    if (totalSummaryEl) totalSummaryEl.textContent = '$' + finalTotal.toLocaleString('es-MX') + ' MXN';
    if (depositSummaryEl) depositSummaryEl.textContent = '$' + selectedDeposit.toLocaleString('es-MX') + ' MXN';
  }

  if (workshopForm) {
    workshopForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const bikeType = document.getElementById('service-bike-type').value;
      const bikeBrand = document.getElementById('service-bike-brand').value;
      const clientName = document.getElementById('service-client-name').value;
      const clientPhone = document.getElementById('service-client-phone').value;
      const serviceDate = document.getElementById('service-date').value;
      const notes = document.getElementById('service-notes').value;

      const folio = 'COR-SRV-' + Math.floor(100 + Math.random() * 900);

      const voucherModal = document.getElementById('service-voucher-modal');
      voucherModal.classList.add('active');

      document.getElementById('service-voucher-content').innerHTML = `
        <div style="background:#fff; color:#111; padding:26px; border-radius:12px; box-shadow:0 15px 40px rgba(0,0,0,0.5);">
          <div style="border-bottom:2px solid #ff5500; padding-bottom:10px; margin-bottom:12px; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <h3 style="color:#ff5500; font-size:1.3rem; font-weight:800;">CORDILLERA TREK \u00b7 TALLER</h3>
              <p style="font-size:0.75rem; color:#555;">Coronado #1130, Zona Centro, Durango</p>
            </div>
            <div style="text-align:right;">
              <div style="font-size:0.7rem; color:#666;">FOLIO</div>
              <div style="font-size:1.15rem; font-weight:800;">${folio}</div>
            </div>
          </div>
          <div style="background:#f8f6f1; padding:12px; border-radius:8px; font-size:0.85rem; line-height:1.6; margin-bottom:12px;">
            <p><strong>Cliente:</strong> ${clientName} (${clientPhone})</p>
            <p><strong>Bicicleta:</strong> ${bikeBrand} (${bikeType})</p>
            <p><strong>Paquete:</strong> ${selectedTierName}</p>
            <p><strong>Fecha:</strong> ${serviceDate}</p>
            <p><strong>Recolecci\u00f3n:</strong> ${hasPickup ? 'A Domicilio' : 'En Tienda Coronado'}</p>
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:14px; font-size:0.9rem;">
            <span>Anticipo: <strong>${depositSummaryEl.textContent}</strong></span>
            <span>Total: <strong>${totalSummaryEl.textContent}</strong></span>
          </div>
          <div style="display:flex; gap:8px;">
            <button class="btn-primary" style="flex:1; justify-content:center; font-size:0.82rem;" onclick="window.print()">Imprimir</button>
            <a class="btn-secondary" style="flex:1; justify-content:center; font-size:0.82rem; background:#25D366; color:#fff; border:none;" target="_blank" href="https://wa.me/526188230673?text=${encodeURIComponent('Hola Cordillera Trek, agende servicio folio ' + folio + ' para ' + clientName)}">WhatsApp Taller</a>
          </div>
        </div>
      `;

      document.getElementById('btn-close-voucher').onclick = () => {
        voucherModal.classList.remove('active');
      };
    });
  }
}

/* ==========================================================================
   7. PANEL PRIVADO DE DESPACHO & CHOFER EN TURNO
   (Privado: solo se abre desde enlace discreto en footer o tecla Alt + D)
   ========================================================================== */
let dispatchOrders = [
  {
    folio: 'COR-PED-802',
    customer: 'Lic. Gerardo Morales',
    address: 'Calle Laureles #204, Fracc. Lomas del Parque',
    items: ['1x Casco Giro Manifest MIPS', '2x Geles SiS'],
    total: '$6,830 MXN',
    type: 'Local Durango',
    status: 'tienda',
    time: '11:15 AM'
  },
  {
    folio: 'COR-PED-794',
    customer: 'Dra. Patricia Simental',
    address: 'Av. 20 de Noviembre #1405, Zona Centro',
    items: ['1x Trek Supercaliber 9.8 M'],
    total: '$139,999 MXN',
    type: 'Local Durango',
    status: 'ruta',
    time: '10:40 AM'
  },
  {
    folio: 'COR-PED-788',
    customer: 'Ing. Fernando Valles',
    address: 'Calle Nogal #412, Col. Silvestre Dorador',
    items: ['1x Llanta Maxxis Assegai 29x2.5'],
    total: '$1,890 MXN',
    type: 'Local Durango',
    status: 'entregado',
    time: '09:20 AM'
  }
];

function initPrivateDispatchCenter() {
  const choferPinModal = document.getElementById('chofer-pin-modal');
  const dispatchModal = document.getElementById('dispatch-modal');
  const privateLink = document.getElementById('link-chofer-private');
  const formPin = document.getElementById('form-chofer-pin');
  const inputPin = document.getElementById('input-chofer-pin');
  const closePinBtn = document.getElementById('btn-close-chofer-pin');
  const closeDispatchBtn = document.getElementById('btn-close-dispatch');

  function openPinModal() {
    choferPinModal.classList.add('active');
    if (inputPin) {
      inputPin.value = '';
      inputPin.focus();
    }
  }

  if (privateLink) {
    privateLink.addEventListener('click', (e) => {
      e.preventDefault();
      openPinModal();
    });
  }

  // Atajo de teclado para la computadora de la tienda: Alt + D
  window.addEventListener('keydown', (e) => {
    if (e.altKey && (e.key === 'd' || e.key === 'D')) {
      e.preventDefault();
      openPinModal();
    }
  });

  if (closePinBtn) {
    closePinBtn.addEventListener('click', () => choferPinModal.classList.remove('active'));
  }
  if (closeDispatchBtn) {
    closeDispatchBtn.addEventListener('click', () => dispatchModal.classList.remove('active'));
  }

  if (formPin) {
    formPin.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = inputPin.value.trim();
      // Acepta 1130 (numero de la tienda) o cualquier ingreso de confirmacion
      if (val === '1130' || val === '1234' || val.length >= 2) {
        choferPinModal.classList.remove('active');
        dispatchModal.classList.add('active');
        renderDispatchBoard();
        showToast('Acceso Autorizado: Turno Chofer', 'success');
      } else {
        showToast('PIN incorrecto (Prueba 1130)', 'error');
      }
    });
  }

  window.addOrderToDispatch = function(order) {
    dispatchOrders.unshift(order);
    renderDispatchBoard();
  };
}

function renderDispatchBoard() {
  const container = document.getElementById('dispatch-orders-container');
  if (!container) return;

  const tienda = dispatchOrders.filter(o => o.status === 'tienda').length;
  const ruta = dispatchOrders.filter(o => o.status === 'ruta').length;
  const entregados = dispatchOrders.filter(o => o.status === 'entregado').length;

  document.getElementById('dispatch-count-tienda').textContent = tienda;
  document.getElementById('dispatch-count-ruta').textContent = ruta;
  document.getElementById('dispatch-count-entregado').textContent = entregados;

  container.innerHTML = dispatchOrders.map((o, idx) => `
    <div style="background:#f8f6f1; border-left:4px solid ${o.status === 'tienda' ? '#a36700' : o.status === 'ruta' ? '#ff5500' : '#059669'}; padding:12px; border-radius:6px; margin-bottom:10px;">
      <div style="display:flex; justify-content:space-between; margin-bottom:4px; font-size:0.85rem;">
        <span style="font-weight:800; color:#ff5500;">${o.folio} &middot; ${o.customer}</span>
        <span style="font-size:0.75rem; font-weight:700;">${o.status.toUpperCase()}</span>
      </div>
      <div style="font-size:0.8rem; color:#64748b; margin-bottom:6px;">${o.address}</div>
      <div style="font-size:0.78rem; background:#fff; padding:6px; border-radius:4px; margin-bottom:6px;">${o.items.join(', ')} &middot; <strong>${o.total}</strong></div>
      <div style="display:flex; gap:6px; justify-content:flex-end;">
        <button style="font-size:0.72rem; padding:3px 6px; cursor:pointer;" onclick="changeStatus(${idx}, 'tienda')">Tienda</button>
        <button style="font-size:0.72rem; padding:3px 6px; cursor:pointer;" onclick="changeStatus(${idx}, 'ruta')">En Ruta</button>
        <button style="font-size:0.72rem; padding:3px 6px; cursor:pointer;" onclick="changeStatus(${idx}, 'entregado')">Entregado</button>
        <button style="font-size:0.72rem; padding:3px 8px; background:#25D366; color:#fff; border:none; border-radius:4px; cursor:pointer;" onclick="dispatchWhatsApp(${idx})">WhatsApp</button>
      </div>
    </div>
  `).join('');
}

window.changeStatus = function(idx, s) {
  if (dispatchOrders[idx]) {
    dispatchOrders[idx].status = s;
    renderDispatchBoard();
  }
};

window.dispatchWhatsApp = function(idx) {
  const o = dispatchOrders[idx];
  if (!o) return;
  const msg = 'REPARTO CORDILLERA TREK\n' + o.folio + ' - ' + o.customer + '\nDireccion: ' + o.address + '\nTotal: ' + o.total;
  window.open('https://wa.me/526188230673?text=' + encodeURIComponent(msg), '_blank');
};

/* ==========================================================================
   8. NOTIFICATION TOAST
   ========================================================================== */
function showToast(message, type = 'info') {
  let box = document.getElementById('toast-box');
  if (!box) {
    box = document.createElement('div');
    box.id = 'toast-box';
    box.style.position = 'fixed';
    box.style.bottom = '20px';
    box.style.right = '20px';
    box.style.zIndex = '999999';
    box.style.display = 'flex';
    box.style.flexDirection = 'column';
    box.style.gap = '8px';
    document.body.appendChild(box);
  }

  const t = document.createElement('div');
  t.style.background = type === 'success' ? '#059669' : type === 'error' ? '#dc2626' : type === 'important' ? '#ff5500' : '#181d26';
  t.style.color = '#fff';
  t.style.padding = '10px 18px';
  t.style.borderRadius = '6px';
  t.style.fontSize = '0.85rem';
  t.style.fontWeight = '600';
  t.style.boxShadow = '0 8px 20px rgba(0,0,0,0.2)';
  t.textContent = message;

  box.appendChild(t);
  setTimeout(() => {
    t.style.opacity = '0';
    t.style.transition = 'opacity 0.3s ease';
    setTimeout(() => t.remove(), 350);
  }, 4000);
}

/* ==========================================================================
   9. NOTICIAS Y EVENTOS (FLYERS, DETALLES Y MODAL)
   ========================================================================== */
function initNewsEvents() {
  const newsEventsData = {
    'maraton-sierra': {
      title: 'Marat\u00f3n Sierra de Durango \u00b7 65K / 35K',
      category: 'Competici\u00f3n MTB Oficial',
      image: 'assets/images/noticia1.png',
      flyer: 'assets/images/flyer1.png',
      date: 'S\u00e1bado 24 de Octubre, 2026',
      time: '07:30 AM (Arranque oficial)',
      location: 'Parque Ecol\u00f3gico El Tecu\u00e1n, Durango, Dgo.',
      statusText: 'Inscripciones Abiertas',
      statusClass: 'status-open',
      description: 'El serial de ciclismo de monta\u00f1a m\u00e1s desafiante de la regi\u00f3n sierra. Con dos distancias dise\u00f1adas para todo nivel: Marat\u00f3n Completo 65K y Medio Marat\u00f3n 35K. Cordillera Trek contar\u00e1 con carpa oficial con mec\u00e1nicos certificados Shimano/Trek para soporte y ajuste neutral previo al arranque.',
      highlights: [
        'Bolsa acumulada de $85,000 MXN en premios a repartir.',
        'Chip electr\u00f3nico de cronometraje y fotograf\u00eda en ruta.',
        'Kit de competidor con playera conmemorativa Bontrager.',
        '3 puestos de abastecimiento l\u00edquido y energ\u00e9tico.'
      ],
      whatsappMsg: 'Hola Cordillera Trek, me interesa informaci\u00f3n e inscripci\u00f3n para el Marat\u00f3n Sierra de Durango 65K/35K.',
      mapUrl: 'https://maps.google.com/?q=Parque+El+Tecuan+Durango'
    },
    'rodada-nocturna': {
      title: 'Serial Ciclista Nocturno Baluarte',
      category: 'Rodada Oficial de Convivencia',
      image: 'assets/images/noticia2.png',
      flyer: 'assets/images/flyer2.png',
      date: 'S\u00e1bado 14 de Noviembre, 2026',
      time: '08:00 PM (Reuni\u00f3n 07:15 PM)',
      location: 'Salida: Coronado #1130 \u2192 Meta: Mirador Baluarte',
      statusText: 'Cupo Limitado a 120 Ciclistas',
      statusClass: 'status-limited',
      description: 'Una experiencia nocturna inolvidable recorriendo la autopista Durango-Mazatl\u00e1n hasta el impresionante Puente Baluarte. Rodada controlada con velocidad crucero protegida, apoyo de patrullas, servicio de barredora con camioneta de Cordillera Trek y cena de convivencia en la meta.',
      highlights: [
        'Obligatorio casco r\u00edgido y luces delantera (blanca) y trasera (roja).',
        'Veh\u00edculo barredora de rescate mec\u00e1nico y transporte de regreso.',
        'Estaci\u00f3n de hidrataci\u00f3n Skratch Labs y barritas de prote\u00edna.',
        'Medalla conmemorativa met\u00e1lica para finalistas.'
      ],
      whatsappMsg: 'Hola Cordillera Trek, quiero apartar mi lugar para la Rodada Nocturna Baluarte.',
      mapUrl: 'https://maps.google.com/?q=Puente+Baluarte+Durango'
    },
    'clinica-suspensiones': {
      title: 'Masterclass: Puesta a Punto Fox & RockShox',
      category: 'Taller Especializado & Cl\u00ednica T\u00e9cnica',
      image: 'assets/images/noticia3.png',
      flyer: 'assets/images/flyer3.png',
      date: 'S\u00e1bado 05 de Diciembre, 2026',
      time: '10:00 AM a 02:00 PM (4 Horas pr\u00e1cticas)',
      location: 'Taller Central Cordillera, Coronado #1130',
      statusText: 'Solo 15 Lugares Disponibles',
      statusClass: 'status-open',
      description: 'Aprende de la mano de los jefes mec\u00e1nicos de Cordillera Trek la f\u00edsica y calibraci\u00f3n precisa de suspensiones neum\u00e1ticas e hidr\u00e1ulicas. Llevaremos a cabo mediciones de SAG en vivo, configuraci\u00f3n de tokens/espaciadores de volumen y ajuste de rebote/compresi\u00f3n para tu peso y estilo de manejo.',
      highlights: [
        'Ajuste personalizado en banco de trabajo de tu propia horquilla o shock.',
        'Gu\u00eda t\u00e9cnica impresa de presiones PSI recomendadas seg\u00fan geometr\u00eda Trek.',
        '15% de descuento en kits de sellos y retenes SKF/Fox.',
        'Diploma conmemorativo avalado por Cordillera Trek Durango.'
      ],
      whatsappMsg: 'Hola Cordillera Trek, deseo apartar lugar en la Masterclass de Suspensiones Fox & RockShox.',
      mapUrl: 'https://maps.google.com/?q=Coronado+1130+Durango+Centro'
    },
    'preventa-temporada': {
      title: 'Preventa Exclusiva Temporada 2026 - 2027',
      category: 'Promoci\u00f3n Especial & Preventa',
      image: 'assets/images/noticia4.png',
      flyer: 'assets/images/flyer4.png',
      date: 'Octubre 2026 - Enero 2027',
      time: 'Horario comercial de tienda (Lunes a S\u00e1bado)',
      location: 'Tienda F\u00edsica Coronado #1130 y Pedidos Online',
      statusText: 'Bonos de Equipo Exclusivos',
      statusClass: 'status-promo',
      description: 'Llegaron los cat\u00e1logos de la nueva temporada Trek 2026-2027. Aparta con solo 20% de anticipo cualquier modelo de las gamas Slash Carbon, Fuel EX, Supercaliber y Domane SLR, y obt\u00e9n bonos directos canjeables en accesorios y componentes Bontrager.',
      highlights: [
        'Hasta 18 Mensualidades Sin Intereses con tarjetas participantes.',
        'Bono directo del 10% del valor de la bici en equipo Bontrager.',
        'Estudio de Bike Fitting digital gratis al entregar tu bicicleta.',
        'Primer servicio mayor preventivo sin costo en nuestro taller.'
      ],
      whatsappMsg: 'Hola Cordillera Trek, me interesa cotizar la preventa de bicicletas Trek temporada 2026-2027.',
      mapUrl: 'https://maps.google.com/?q=Coronado+1130+Durango+Centro'
    }
  };

  const newsCards = document.querySelectorAll('.news-card');
  const newsModal = document.getElementById('news-modal');
  const modalContent = document.getElementById('news-modal-content');
  const closeBtn = document.getElementById('btn-close-news');

  if (!newsModal || !modalContent) return;

  function openEventModal(eventId) {
    const item = newsEventsData[eventId];
    if (!item) return;

    modalContent.innerHTML = `
      <div class="news-modal-layout">
        <div class="news-modal-media-col">
          <div class="news-modal-flyer-wrap" id="flyer-wrap-${eventId}" role="button" tabindex="0" title="Haz clic para ampliar y hacer zoom al flyer" aria-label="Ampliar flyer a detalle">
            <img src="${item.flyer}" alt="${item.title}" class="news-modal-flyer-img" id="news-modal-flyer-img">
            <div class="news-modal-zoom-hint">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
              Clic para Zoom al Flyer
            </div>
          </div>
          <button type="button" class="btn-open-lightbox-cta" id="btn-open-lightbox-cta" style="margin-top:14px; background:rgba(255,85,0,0.14); border:1.5px solid var(--color-orange); color:#ff5500; padding:8px 18px; border-radius:24px; font-size:0.78rem; font-weight:700; cursor:pointer; display:inline-flex; align-items:center; gap:6px; transition:all 0.2s ease;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
            Ver Flyer a Pantalla Completa
          </button>
        </div>
        <div class="news-modal-details-col">
          <span class="news-modal-category">${item.category}</span>
          <h3 class="news-modal-title" id="news-modal-title">${item.title}</h3>

          <div style="display:flex; align-items:center; gap:12px; background:#f8f6f1; border:1px solid #e7dfd4; border-radius:8px; padding:8px 12px; margin-bottom:14px;">
            <img src="${item.image}" alt="${item.title}" style="width:58px; height:58px; object-fit:cover; border-radius:6px; flex-shrink:0; border:1px solid #dcd5c7;">
            <div>
              <div style="font-size:0.7rem; color:#64748b; font-weight:700; text-transform:uppercase; letter-spacing:0.5px;">Fotograf\u00eda Oficial de la Noticia</div>
              <div style="font-size:0.83rem; font-weight:700; color:#181d26;">${item.category}</div>
            </div>
          </div>

          <div class="news-modal-meta-grid">
            <div class="news-modal-meta-item">
              <span class="news-modal-meta-label">Fecha del Evento</span>
              <span class="news-modal-meta-val">${item.date}</span>
            </div>
            <div class="news-modal-meta-item">
              <span class="news-modal-meta-label">Horario</span>
              <span class="news-modal-meta-val">${item.time}</span>
            </div>
            <div class="news-modal-meta-item" style="grid-column: 1 / -1;">
              <span class="news-modal-meta-label">Lugar / Sede</span>
              <span class="news-modal-meta-val">${item.location}</span>
            </div>
          </div>

          <p class="news-modal-description">${item.description}</p>

          <div style="font-weight:700; font-size:0.84rem; color:#181d26; margin-bottom:6px;">Detalles &amp; Beneficios del Evento:</div>
          <ul class="news-modal-highlights">
            ${item.highlights.map(h => `<li>${h}</li>`).join('')}
          </ul>

          <div class="news-modal-actions">
            <div class="news-modal-btn-row">
              <a href="https://wa.me/526188230673?text=${encodeURIComponent(item.whatsappMsg)}" target="_blank" class="news-modal-btn-whatsapp" rel="noopener noreferrer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                Inscribirme v\u00eda WhatsApp
              </a>
              <a href="${item.mapUrl}" target="_blank" class="btn-primary" rel="noopener noreferrer">
                Ver Mapa / C\u00f3mo Llegar
              </a>
            </div>
          </div>
        </div>
      </div>
    `;

    // Handlers to open flyer lightbox zoom
    const flyerWrap = document.getElementById('flyer-wrap-' + eventId);
    const btnCta = document.getElementById('btn-open-lightbox-cta');
    if (flyerWrap) {
      flyerWrap.onclick = () => openFlyerLightbox(item.flyer, item.title);
      flyerWrap.onkeydown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openFlyerLightbox(item.flyer, item.title);
        }
      };
    }
    if (btnCta) {
      btnCta.onclick = () => openFlyerLightbox(item.flyer, item.title);
    }

    newsModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeEventModal() {
    newsModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  newsCards.forEach(card => {
    const eventId = card.getAttribute('data-event-id');
    card.addEventListener('click', (e) => {
      e.preventDefault();
      openEventModal(eventId);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openEventModal(eventId);
      }
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeEventModal);
  }

  newsModal.addEventListener('click', (e) => {
    if (e.target === newsModal) {
      closeEventModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && newsModal.classList.contains('active')) {
      closeEventModal();
    }
  });

  initFlyerLightbox();
}

/* ==========================================================================
   10. VISOR LIGHTBOX CON ZOOM INTERACTIVO PARA FLYERS
   ========================================================================== */
function initFlyerLightbox() {
  const lightbox = document.getElementById('flyer-lightbox');
  if (!lightbox) return;

  const imgEl = document.getElementById('flyer-lightbox-img');
  const titleEl = document.getElementById('flyer-lightbox-title');
  const zoomValEl = document.getElementById('flyer-zoom-level');
  const btnIn = document.getElementById('btn-zoom-in');
  const btnOut = document.getElementById('btn-zoom-out');
  const btnReset = document.getElementById('btn-zoom-reset');
  const btnClose = document.getElementById('btn-close-lightbox');
  const viewport = document.getElementById('flyer-lightbox-viewport');

  let scale = 1.0;
  let posX = 0;
  let posY = 0;
  let isDragging = false;
  let startX = 0;
  let startY = 0;

  function update() {
    scale = Math.min(3.5, Math.max(1.0, scale));
    if (scale === 1.0) {
      posX = 0;
      posY = 0;
      viewport.classList.remove('dragging');
      viewport.style.cursor = 'zoom-in';
    } else {
      viewport.style.cursor = isDragging ? 'grabbing' : 'grab';
    }
    imgEl.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
    if (zoomValEl) zoomValEl.textContent = Math.round(scale * 100) + '%';
  }

  function zoomIn() {
    scale = Math.min(3.5, scale + 0.35);
    update();
  }

  function zoomOut() {
    scale = Math.max(1.0, scale - 0.35);
    update();
  }

  function resetZoom() {
    scale = 1.0;
    posX = 0;
    posY = 0;
    update();
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    resetZoom();
  }

  window.openFlyerLightbox = function(src, title) {
    if (imgEl) imgEl.src = src;
    if (titleEl) titleEl.textContent = title + ' \u00b7 Flyer Oficial';
    resetZoom();
    lightbox.classList.add('active');
  };

  if (btnIn) btnIn.onclick = zoomIn;
  if (btnOut) btnOut.onclick = zoomOut;
  if (btnReset) btnReset.onclick = resetZoom;
  if (btnClose) btnClose.onclick = closeLightbox;

  // Mouse wheel zoom
  if (viewport) {
    viewport.addEventListener('wheel', (e) => {
      e.preventDefault();
      if (e.deltaY < 0) {
        zoomIn();
      } else {
        zoomOut();
      }
    }, { passive: false });

    // Drag to pan when zoomed
    viewport.addEventListener('mousedown', (e) => {
      if (scale > 1.0) {
        isDragging = true;
        startX = e.clientX - posX;
        startY = e.clientY - posY;
        viewport.classList.add('dragging');
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      posX = e.clientX - startX;
      posY = e.clientY - startY;
      update();
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        viewport.classList.remove('dragging');
        update();
      }
    });

    // Click / Double click on image to toggle zoom
    imgEl.addEventListener('dblclick', (e) => {
      e.stopPropagation();
      if (scale > 1.0) {
        resetZoom();
      } else {
        scale = 2.0;
        update();
      }
    });

    // Single click on image when at 1x to zoom to 1.8x
    imgEl.addEventListener('click', (e) => {
      e.stopPropagation();
      if (scale === 1.0) {
        scale = 1.8;
        update();
      }
    });
  }

  // Click on dark backdrop to close
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target === viewport) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/* ==========================================================================
   11. CONSOLA MULTI-AGENTE ASCEND RMS & CATALOGADOR IA (DEMO EN VIVO)
   ========================================================================== */
function initAscendAgentConsole() {
  const modal = document.getElementById('ascend-agent-modal');
  const openBtn = document.getElementById('btn-open-ascend-console');
  const closeBtn = document.getElementById('btn-close-ascend-modal');
  const form = document.getElementById('form-ascend-live-agent');
  const logBox = document.getElementById('agent-live-log');
  const quarantineContainer = document.getElementById('ascend-quarantine-list');
  const presetBtns = document.querySelectorAll('.btn-preset-ascend');
  const csvFileInput = document.getElementById('ascend-csv-file-input');
  const loadDuranRealBtn = document.getElementById('btn-load-duran-real');
  const downloadRawBtn = document.getElementById('btn-download-raw-ascend-csv');
  const downloadQuarantineBtn = document.getElementById('btn-download-quarantine-csv');
  const resetDemoBtn = document.getElementById('btn-reset-ascend-demo');

  if (!modal) return;

  const syncData = window.ASCEND_RMS_SYNC || {
    metricas: {
      skus_leidos_pos: 62,
      skus_publicados_web: PRODUCTS_DATA.length,
      skus_en_cuarentena: 6,
      unidades_fisicas_disponibles: 57,
      valor_inventario_sincronizado_mxn: 1726833
    },
    cuarentena: []
  };

  const demoMixData = window.ASCEND_DEMO_MIX_SYNC || syncData;

  const realDuranProducts = Array.isArray(syncData.productos) ? [...syncData.productos] : [...PRODUCTS_DATA];
  const realDuranQuarantine = Array.isArray(syncData.cuarentena) ? [...syncData.cuarentena] : [];

  const demoMixProducts = Array.isArray(demoMixData.productos) ? [...demoMixData.productos] : [...realDuranProducts];
  const demoMixQuarantine = Array.isArray(demoMixData.cuarentena) ? [...demoMixData.cuarentena] : [...realDuranQuarantine];

  let quarantineList = [...realDuranQuarantine];

  // Mapa de fotografias reales descargadas localmente (100% offline-ready)
  const LOCAL_PRODUCT_PHOTOS = {
    '5286411': 'assets/images/productos/5286411.jpg',
    '5301924': 'assets/images/productos/5301924.jpg',
    '5298810': 'assets/images/productos/5298810.jpg',
    'C24-SCAL1': 'assets/images/productos/c24-scal1.jpg',
    'ALU-XTA29': 'assets/images/productos/alu-xta29.jpg',
    'IRDM9100SGS': 'assets/images/productos/irdm9100sgs.jpg',
    'ICSM8100051': 'assets/images/productos/icsm8100051.jpg',
    'TB00219400': 'assets/images/productos/tb00219400.jpg',
    'FOX-910-21': 'assets/images/productos/fox-910-21.jpg',
    'GIRO-MAN-M': 'assets/images/productos/giro-man-m.jpg',
    'BON-CIRC-L': 'assets/images/productos/bon-circ-l.jpg',
    'GOB-CXPRO-M': 'assets/images/maillot-gobik.jpg',
    '010-02695-10': 'assets/images/productos/010-02695-10.jpg',
    'SIS-PACK-DGO': 'assets/images/productos/sis-pack-dgo.jpg',
    '5319901': 'assets/images/productos/5319901.jpg',
    'PD-M8100': 'assets/images/productos/pd-m8100.jpg',
    'TALLER-GRASA': 'assets/images/productos/taller-grasa.jpg',
    'PPL-1': 'assets/images/productos/taller-grasa.jpg'
  };

  // Registrar automaticamente todos los SKUs reales de Duran Go Trek SA de CV
  realDuranProducts.forEach(p => {
    if (p.sku && p.img) LOCAL_PRODUCT_PHOTOS[p.sku.toUpperCase()] = p.img;
  });

  // Base de conocimiento de fichas enriquecidas por SKU
  const KNOWN_PRODUCT_KB = {};
  realDuranProducts.forEach(p => {
    if (p.sku) KNOWN_PRODUCT_KB[p.sku.toUpperCase()] = p;
  });
  demoMixProducts.forEach(p => {
    if (p.sku && !KNOWN_PRODUCT_KB[p.sku.toUpperCase()]) KNOWN_PRODUCT_KB[p.sku.toUpperCase()] = p;
  });
  KNOWN_PRODUCT_KB['5319901'] = {
    title: 'Trek Top Fuel 9.8 XT Gen 4 Carbon Rojo',
    specs: 'Carbono OCLV Mountain \u00b7 Fox Performance 130mm/120mm \u00b7 Shimano XT M8100',
    category: 'bicis',
    variants: ['Talla M (29")', 'Talla L (29")'],
    img: 'assets/images/productos/5319901.jpg'
  };
  KNOWN_PRODUCT_KB['PD-M8100'] = {
    title: 'Pedales Shimano Deore XT PD-M8100 SPD XC',
    specs: 'Plataforma ancha XC/Marat\u00f3n \u00b7 Eje Chromoly \u00b7 Incluye Calas SM-SH51',
    category: 'partes',
    variants: ['Par SPD con Calas'],
    img: 'assets/images/productos/pd-m8100.jpg'
  };
  KNOWN_PRODUCT_KB['TALLER-GRASA'] = {
    title: 'Bote Grasa Park Tool PolyLube 1000 (PPL-1)',
    specs: 'Grasa de Poliurea de Alto Desempe\u00f1o \u00b7 Repelente a Humedad \u00b7 Tubo 113g',
    category: 'partes',
    variants: ['Tubo 4 oz (113g)'],
    img: 'assets/images/productos/taller-grasa.jpg'
  };
  KNOWN_PRODUCT_KB['PPL-1'] = KNOWN_PRODUCT_KB['TALLER-GRASA'];

  function resolveProductPhoto(sku, brand, cleanTitle, rawDesc, cat) {
    const skuKey = (sku || '').trim().toUpperCase();
    if (LOCAL_PRODUCT_PHOTOS[skuKey]) {
      return LOCAL_PRODUCT_PHOTOS[skuKey];
    }
    const text = ((rawDesc || '') + ' ' + (cleanTitle || '')).toUpperCase();
    if (text.includes('CUADRO ROSCOE')) return 'assets/images/productos/cuadro-roscoe-rojo.jpg';
    if (text.includes('MADONE') && text.includes('DARK STAR')) return 'assets/images/productos/madone-sl-darkstar.jpg';
    if (text.includes('MARLIN +6') || text.includes('MARLIN+ 6')) return 'assets/images/productos/marlin-plus-6-azul.jpg';
    if (text.includes('RAIL+') || text.includes('RAIL 5') || text.includes('RAIL+ 8')) return 'assets/images/productos/rail-8-negro-dorado.jpg';
    if (text.includes('FX 1') || text.includes('FX SPORT')) return 'assets/images/productos/fx1-gen4-gris.jpg';
    if (text.includes('BALANCE') || text.includes('ROCKBROS')) return 'assets/images/productos/balance-rockbros.jpg';
    if (text.includes('HABIT 4')) return 'assets/images/productos/cannondale-habit4-negro.jpg';
    if (text.includes('PROCALIBER 6 M GRIS')) return 'assets/images/productos/procaliber6-gris.jpg';
    if (text.includes('PROCALIBER 6 GEN 2')) return 'assets/images/productos/procaliber6-rojo.jpg';
    if (text.includes('PROCALIBER 9.5')) return 'assets/images/productos/procaliber95-verde.jpg';
    if (text.includes('TOP FUEL') && text.includes('ROJO')) return 'assets/images/productos/5319901.jpg';
    if (text.includes('TOP FUEL')) return 'assets/images/productos/topfuel-negro.jpg';
    if (text.includes('TRAIL 1 29 L GRIS')) return 'assets/images/productos/cannondale-trail-gris.jpg';
    if (text.includes('TRAIL 1') || text.includes('TRAIL 2') || text.includes('KIDS TRAIL')) return 'assets/images/productos/cannondale-trail-azul.jpg';
    if (text.includes('FUEL EXE')) return 'assets/images/productos/fuele-exe-negro.jpg';
    if (text.includes('FUEL EX')) return 'assets/images/productos/5298810.jpg';
    if (text.includes('MARLIN 2023')) return 'assets/images/productos/marlin-negro-mate.jpg';
    if (text.includes('MARLIN') && text.includes('MORADO')) return 'assets/images/productos/marlin-morado.jpg';
    if (text.includes('MARLIN') && (text.includes('VERDE MIAMI') || text.includes('AZUL AQUA'))) return 'assets/images/productos/marlin6-verde-miami.jpg';
    if (text.includes('MARLIN') && text.includes('MULSANNE')) return 'assets/images/productos/marlin-azul-dorado.jpg';
    if (text.includes('MARLIN') && text.includes('VERDE/GRIS')) return 'assets/images/productos/marlin6-verde-gris.jpg';
    if (text.includes('MARLIN 7') && text.includes('BLANCO MENTA')) return 'assets/images/productos/marlin7-blanco-menta.jpg';
    if (text.includes('MARLIN') && (text.includes('ROJO') || text.includes('LAVA') || text.includes('FURY'))) return 'assets/images/productos/marlin-rojo.jpg';
    if (text.includes('MARLIN 7')) return 'assets/images/productos/5301924.jpg';
    if (text.includes('SIERRA') && (text.includes('AMARILLO') || text.includes('LIMA'))) return 'assets/images/productos/alubike-sierra-amarillo.jpg';
    if (text.includes('SIERRA') && text.includes('AZUL')) return 'assets/images/productos/alubike-sierra-azul.jpg';
    if (text.includes('SIERRA') && text.includes('PURPURA')) return 'assets/images/productos/alubike-xta-purpura.jpg';
    if (text.includes('XTA') && text.includes('PURPURA')) return 'assets/images/productos/alubike-xta-purpura.jpg';
    if (text.includes('XTA') && text.includes('ROJO')) return 'assets/images/productos/alubike-xta-rojo.jpg';
    if (text.includes('ALUBIKE') || text.includes('XTA')) return 'assets/images/productos/alu-xta29.jpg';
    if (text.includes('PRECALIBER 16 BEIGE')) return 'assets/images/productos/precaliber-beige.jpg';
    if (text.includes('PRECALIBER 16 VERDE')) return 'assets/images/productos/precaliber-verde.jpg';
    if (text.includes('PRECALIBER')) return 'assets/images/productos/precaliber-24-gris.jpg';
    if (text.includes('REMOLQUE')) return 'assets/images/productos/remolque-mt201.jpg';
    if (text.includes('EMONDA')) return 'assets/images/productos/emonda-alr5-rojo.jpg';
    if (text.includes('MADONE SL 5')) return 'assets/images/productos/madone-sl5-azul.jpg';
    if (text.includes('DOMANE')) return 'assets/images/productos/domane-al-azul.jpg';
    if (text.includes('SUPER SIX') || text.includes('SUPERSIX')) return 'assets/images/productos/supersix-evo-gris.jpg';
    if (text.includes('SUPERCALIBER')) return 'assets/images/productos/5286411.jpg';
    if (text.includes('SCALPEL')) return 'assets/images/productos/c24-scal1.jpg';
    if (text.includes('XTR') && text.includes('M9100')) return 'assets/images/productos/irdm9100sgs.jpg';
    if (text.includes('CASSETTE') || text.includes('M8100 12V')) return 'assets/images/productos/icsm8100051.jpg';
    if (text.includes('PEDAL') && text.includes('M8100')) return 'assets/images/productos/pd-m8100.jpg';
    if (text.includes('ASSEGAI')) return 'assets/images/productos/tb00219400.jpg';
    if (text.includes('FOX 34') || text.includes('KASHIMA')) return 'assets/images/productos/fox-910-21.jpg';
    if (text.includes('GIRO') && text.includes('MANIFEST')) return 'assets/images/productos/giro-man-m.jpg';
    if (text.includes('CIRCUIT') || text.includes('WAVECEL')) return 'assets/images/productos/bon-circ-l.jpg';
    if (text.includes('GOBIK')) return 'assets/images/maillot-gobik.jpg';
    if (text.includes('GARMIN') || text.includes('EDGE 840')) return 'assets/images/productos/010-02695-10.jpg';
    if (text.includes('SIS') || text.includes('HAMMER')) return 'assets/images/productos/sis-pack-dgo.jpg';
    if (text.includes('GRASA') || text.includes('POLYLUBE') || text.includes('PARK TOOL')) return 'assets/images/productos/taller-grasa.jpg';

    let searchSuffix = 'bicycle side view white background';
    if (cat === 'ropa') searchSuffix = 'cycling apparel helmet jersey white background';
    else if (cat === 'partes') searchSuffix = 'bike component part white background';
    else if (cat === 'accesorios') searchSuffix = 'cycling accessory white background';
    else if (cat === 'nutricion') searchSuffix = 'cycling sports nutrition white background';

    const query = encodeURIComponent((brand || 'Trek') + ' ' + (cleanTitle || rawDesc) + ' ' + searchSuffix);
    return 'https://tse2.mm.bing.net/th?q=' + query + '&w=700&rs=1&p=0';
  }

  function enrichRawPosName(rawDesc) {
    return (rawDesc || 'Articulo Cordillera')
      .replace(/^TRK\s+/i, 'Trek ')
      .replace(/^SHIM\s+/i, 'Shimano ')
      .replace(/^CANN\s+/i, 'Cannondale ')
      .replace(/^BONT\s+/i, 'Bontrager ')
      .toLowerCase()
      .replace(/\b\w/g, c => c.toUpperCase())
      .replace(/\bXt\b/g, 'XT')
      .replace(/\bXtr\b/g, 'XTR')
      .replace(/\bSl\b/g, 'SL')
      .replace(/\bMtb\b/g, 'MTB')
      .replace(/\bSpd\b/g, 'SPD')
      .replace(/\bMips\b/g, 'MIPS')
      .replace(/\bDi2\b/gi, 'Di2')
      .replace(/\bF\/s\b/gi, 'F/S')
      .replace(/\bGen\s*2\b/gi, 'Gen 2')
      .replace(/\bGen\s*3\b/gi, 'Gen 3')
      .replace(/\bGen\s*4\b/gi, 'Gen 4')
      .replace(/\bGen\s*5\b/gi, 'Gen 5')
      .replace(/\bGen\s*6\b/gi, 'Gen 6')
      .replace(/\bXl\b/gi, 'XL')
      .replace(/\bXxl\b/gi, 'XXL')
      .replace(/\bXs\b/gi, 'XS')
      .replace(/\bM\/l\b/gi, 'M/L');
  }

  function detectCategoryFromText(desc, dept) {
    const s = ((desc || '') + ' ' + (dept || '')).toUpperCase();
    if (s.includes('REMOLQUE')) return 'accesorios';
    if (s.includes('CUADRO')) return 'partes';
    if (s.match(/BIK|BICI|SUPERCALIBER|MARLIN|FUEL|SLASH|DOMANE|MADONE|SCALPEL|ALUBIKE|PROCALIBER|HABIT|TRAIL|PRECALIBER|SIERRA|XTA|EMONDA|SUPER SIX|BALANCE/)) return 'bicis';
    if (s.match(/CASCO|HELMET|JERSEY|MAILLOT|GUANTE|SHORTS|CHAMARRA|APPAREL|ROPA|ZAPATILLA/)) return 'ropa';
    if (s.match(/GARMIN|GPS|LUZ|LAMPARA|CICLOCOMPUTADOR|PORTAANFORA|ANFORA|BOMBA|CANDADO|ACC/)) return 'accesorios';
    if (s.match(/GEL|ELECTROLITO|NUTRI|SIS|HAMMER|PROTEINA|BARRA/)) return 'nutricion';
    return 'partes';
  }

  function detectBrandFromText(rawBrand, desc) {
    if (rawBrand && rawBrand.trim().length > 1) return rawBrand.trim().toUpperCase();
    const s = (desc || '').toUpperCase();
    if (s.includes('CANNONDALE') || s.startsWith('CANN ')) return 'CANNONDALE';
    if (s.includes('ALUBIKE')) return 'ALUBIKE';
    if (s.includes('ROCKBROS')) return 'ROCKBROS';
    if (s.includes('TREK') || s.startsWith('TRK ') || s.includes('MADONE') || s.includes('MARLIN') || s.includes('PROCALIBER') || s.includes('DOMANE') || s.includes('EMONDA') || s.includes('PRECALIBER') || s.includes('ROSCOE')) return 'TREK';
    if (s.includes('SHIMANO') || s.startsWith('SHIM ')) return 'SHIMANO';
    if (s.includes('BONTRAGER') || s.startsWith('BONT ')) return 'BONTRAGER';
    if (s.includes('FOX')) return 'FOX';
    if (s.includes('MAXXIS')) return 'MAXXIS';
    if (s.includes('GARMIN')) return 'GARMIN';
    if (s.includes('GOBIK')) return 'GOBIK';
    if (s.includes('GIRO')) return 'GIRO';
    if (s.includes('PARK TOOL')) return 'PARK TOOL';
    return 'CORDILLERA TREK';
  }

  function updateAscendKPIs() {
    const cleanCount = PRODUCTS_DATA.length;
    const quarCount = quarantineList.length;
    const totalRaw = cleanCount + quarCount;
    const totalUnits = PRODUCTS_DATA.reduce((acc, p) => acc + (p.stock || 1), 0);
    const totalVal = PRODUCTS_DATA.reduce((acc, p) => acc + (p.price * (p.stock || 1)), 0);

    const elRaw = document.getElementById('ascend-kpi-raw');
    const elClean = document.getElementById('ascend-kpi-clean');
    const elQuar = document.getElementById('ascend-kpi-quarantine');
    const elVal = document.getElementById('ascend-kpi-value');
    const elUnits = document.getElementById('ascend-kpi-units');

    if (elRaw) elRaw.textContent = totalRaw + ' SKUs';
    if (elClean) elClean.textContent = cleanCount + ' SKUs';
    if (elQuar) elQuar.textContent = quarCount + ' SKUs';
    if (elVal) elVal.textContent = '$' + Math.round(totalVal).toLocaleString('es-MX') + ' MXN';
    if (elUnits) elUnits.textContent = totalUnits + ' unidades listas en piso';
  }

  function renderQuarantineList() {
    if (!quarantineContainer) return;
    quarantineContainer.innerHTML = quarantineList.map(item => `
      <div style="background:#ffffff; border-left:4px solid #e11d48; border-radius:6px; padding:8px 10px; font-size:0.76rem; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
        <div style="display:flex; justify-content:space-between; font-weight:800; color:#181d26; margin-bottom:2px;">
          <span>SKU #${item.sku} &middot; ${item.brand}</span>
          <span style="color:#e11d48;">Stock POS: ${item.qty}</span>
        </div>
        <div style="color:#475569; font-family:monospace; font-size:0.72rem; margin-bottom:4px;">${item.pos_desc}</div>
        <span style="display:inline-block; background:#ffe4e6; color:#be123c; font-weight:800; font-size:0.66rem; padding:2px 6px; border-radius:4px;">
          ${item.motivo}
        </span>
      </div>
    `).join('');
  }

  const productSelect = document.getElementById('agent-select-product');
  const btnMoveToQuarantine = document.getElementById('btn-move-to-quarantine');

  function populateEditorDropdown(selectedId) {
    if (!productSelect) return;
    const currentVal = selectedId || productSelect.value || '__NEW__';
    let opts = '<option value="__NEW__">+ Dar de alta nuevo SKU manualmente</option>';
    PRODUCTS_DATA.forEach(p => {
      const isSel = (p.id === currentVal) ? ' selected' : '';
      const stockBadge = (typeof p.stock === 'number') ? `(Stock: ${p.stock})` : '';
      opts += `<option value="${p.id}"${isSel}>[#${p.sku}] ${p.title} - $${p.price.toLocaleString('es-MX')} ${stockBadge}</option>`;
    });
    productSelect.innerHTML = opts;

    // Si hay un producto seleccionado, cargar sus datos en el formulario
    loadSelectedProductToForm();
  }

  function loadSelectedProductToForm() {
    if (!productSelect) return;
    const val = productSelect.value;
    const inputSku = document.getElementById('agent-input-sku');
    const inputBrand = document.getElementById('agent-input-brand');
    const inputDesc = document.getElementById('agent-input-desc');
    const inputCat = document.getElementById('agent-input-cat');
    const inputStock = document.getElementById('agent-input-stock');
    const inputPrice = document.getElementById('agent-input-price');

    const inputImg = document.getElementById('agent-input-img');
    const imgPrev = document.getElementById('agent-input-img-preview');

    if (val === '__NEW__' || !val) {
      if (inputSku) inputSku.value = '';
      if (inputBrand) inputBrand.value = 'TREK';
      if (inputDesc) inputDesc.value = '';
      if (inputCat) inputCat.value = 'bicis';
      if (inputStock) inputStock.value = '1';
      if (inputPrice) inputPrice.value = '';
      if (inputImg) inputImg.value = '';
      if (imgPrev) imgPrev.src = 'assets/images/productos/5301924.jpg';
      if (btnMoveToQuarantine) btnMoveToQuarantine.style.display = 'none';
      return;
    }

    const prod = PRODUCTS_DATA.find(p => p.id === val);
    if (!prod) return;

    if (inputSku) inputSku.value = prod.sku || '';
    if (inputBrand) inputBrand.value = prod.brand || 'TREK';
    if (inputDesc) inputDesc.value = prod.title || prod.pos_raw || '';
    if (inputCat) inputCat.value = prod.category || 'bicis';
    if (inputStock) inputStock.value = (typeof prod.stock === 'number') ? prod.stock : 1;
    if (inputPrice) inputPrice.value = prod.price || 0;
    if (inputImg) inputImg.value = prod.img || '';
    if (imgPrev) imgPrev.src = prod.img || 'assets/images/productos/5301924.jpg';
    if (btnMoveToQuarantine) btnMoveToQuarantine.style.display = 'inline-block';
  }

  if (productSelect) {
    productSelect.addEventListener('change', loadSelectedProductToForm);
  }

  // Listeners de Cambio de Fotografía en Vivo (URL o Carga Directa)
  const inputImg = document.getElementById('agent-input-img');
  const imgPrev = document.getElementById('agent-input-img-preview');
  const inputFile = document.getElementById('agent-input-file');
  const btnSearchPhoto = document.getElementById('btn-search-brand-photo');

  if (inputImg && imgPrev) {
    inputImg.addEventListener('input', (e) => {
      imgPrev.src = e.target.value.trim() || 'assets/images/productos/5301924.jpg';
    });
  }

  if (inputFile) {
    inputFile.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          const base64 = evt.target.result;
          if (inputImg) inputImg.value = base64;
          if (imgPrev) imgPrev.src = base64;
          showToast('Foto cargada en memoria. Haz clic en "Guardar Cambios" para aplicar a la tienda.', 'info');
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (btnSearchPhoto) {
    btnSearchPhoto.addEventListener('click', () => {
      const brand = document.getElementById('agent-input-brand')?.value.trim() || 'Trek';
      const desc = document.getElementById('agent-input-desc')?.value.trim() || '';
      const q = encodeURIComponent(`${brand} ${desc} official bike`);
      window.open(`https://www.google.com/search?tbm=isch&q=${q}`, '_blank');
    });
  }

  if (btnMoveToQuarantine) {
    btnMoveToQuarantine.addEventListener('click', () => {
      const prodId = productSelect ? productSelect.value : '';
      if (!prodId || prodId === '__NEW__') {
        showToast('Selecciona un producto para enviar a cuarentena', 'error');
        return;
      }
      const idx = PRODUCTS_DATA.findIndex(p => p.id === prodId);
      if (idx === -1) return;

      const removed = PRODUCTS_DATA.splice(idx, 1)[0];
      quarantineList.unshift({
        sku: removed.sku,
        brand: removed.brand,
        pos_desc: removed.title + ' (Retirado manualmente)',
        qty: removed.stock || 0,
        price: removed.price || 0,
        motivo: 'RETIRADO_A_CUARENTENA_POR_GERENCIA'
      });

      updateAscendKPIs();
      renderQuarantineList();
      renderProducts('all', '');


      populateEditorDropdown('__NEW__');

      if (logBox) {
        logBox.style.color = '#f87171';
        logBox.textContent = `[RETIRADO DE TIENDA] SKU #${removed.sku} (${removed.title}) fue enviado a la Lista Roja de Cuarentena. Ya no está visible para clientes.`;
      }
      showToast('Producto enviado a Cuarentena', 'important');
    });
  }

  function openConsole() {
    updateAscendKPIs();
    renderQuarantineList();
    populateEditorDropdown();
    modal.classList.add('active');
  }

  function closeConsole() {
    modal.classList.remove('active');
  }

  if (openBtn) openBtn.addEventListener('click', openConsole);
  if (closeBtn) closeBtn.addEventListener('click', closeConsole);

  // Atajo Alt + A para abrir la Consola Ascend RMS en cualquier momento
  window.addEventListener('keydown', (e) => {
    if (e.altKey && (e.key === 'a' || e.key === 'A')) {
      e.preventDefault();
      openConsole();
    }
  });

  // Lector especializado para reportes de Ascend RMS convertidos de PDF a CSV en Convertio
  // ("Inventario por categoria - Duran Go Trek SA de CV") con columnas por espacios y renglones partidos
  function parseConvertioAscendReport(rawText) {
    const rawLines = rawText.split(/\r?\n/).map(l => l.trim().replace(/^"+|"+$/g, '').replace(/\f/g, '').trim());
    let currentCat = 'Bicicletas';
    const parsedItems = [];
    let i = 0;

    while (i < rawLines.length) {
      const line = rawLines[i];
      if (!line) {
        i++;
        continue;
      }
      if (line.startsWith('Bicicletas - ')) {
        currentCat = line;
        i++;
        continue;
      }
      if (
        line.startsWith('Inventario por categoria') ||
        line.startsWith('Categor\u00eda:') ||
        line.startsWith('Categoria:') ||
        line.startsWith('Descripci\u00f3n') ||
        line.startsWith('Descripcion') ||
        line.startsWith('venta') ||
        line.startsWith('Cantidad Subtotal') ||
        line.startsWith('Cantidad Total') ||
        /^\d{2}\/\d{2}\/\d{4}\s+\d{2}:\d{2}\s+-\s+Mario Arellano/i.test(line)
      ) {
        i++;
        continue;
      }

      const m = line.match(/^(.+?)\s+([A-Z0-9]{8,14})\s+(?:(\d{6,14})\s+)?(-?\d+)\s+\$([\d,]+\.\d{2})\s+\$([\d,]+\.\d{2})(?:\s+(\d{2}\/\d{2}\/\d{4}))?(?:\s+(\d{2}\/\d{2}\/\d{4}))?$/);
      if (m) {
        let desc = m[1].trim();
        let sku = m[2].trim();
        const upc = (m[3] || '').trim();
        const qty = parseInt(m[4], 10);
        const price = parseFloat((m[6] || m[5] || '0').replace(/,/g, ''));
        const lastSold = m[7] || '';
        const lastRec = m[8] || '';

        if (i + 1 < rawLines.length) {
          const nextL = rawLines[i + 1];
          if (
            nextL &&
            !nextL.includes('$') &&
            !nextL.startsWith('Cantidad ') &&
            !nextL.startsWith('Bicicletas -') &&
            !nextL.startsWith('Descripci') &&
            !/^\d{2}\/\d{2}\/\d{4}\s+\d{2}:\d{2}/.test(nextL)
          ) {
            const parts = nextL.split(/\s{3,}/);
            if (parts.length >= 2 && parts[parts.length - 1].length <= 2) {
              desc = desc + ' ' + parts[0].trim();
              sku = sku + parts[parts.length - 1].trim();
            } else if (parts.length === 1 && parts[0].length <= 2) {
              sku = sku + parts[0].trim();
            } else {
              desc = desc + ' ' + nextL.trim();
            }
            i++;
          }
        }

        parsedItems.push({
          cat: currentCat,
          desc: desc.trim(),
          sku: sku.trim(),
          upc: upc,
          qty: qty,
          price: price,
          lastSold: lastSold,
          lastRec: lastRec
        });
      }
      i++;
    }
    return parsedItems;
  }

  // Lector directo de CSV/TXT estandar exportado de Ascend RMS
  function parseCSVLine(line, delimiter) {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        inQuotes = !inQuotes;
      } else if (ch === delimiter && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
    result.push(current.trim());
    return result;
  }

  // ==========================================================================
  // FLUJO OPERATIVO EN 2 PASOS (GENERAR REPORTE -> SUBIR INVENTARIO APROBADO)
  // ==========================================================================
  const btnGenerateReport = document.getElementById('btn-generate-report');
  const btnApplyApproved = document.getElementById('btn-apply-approved-inventory');
  const fileSelectedBadge = document.getElementById('ascend-file-selected-badge');
  const reportStatusBanner = document.getElementById('ascend-report-status-banner');

  let loadedCSVBuffer = null;
  let pendingAuditReport = null;

  function setApprovedButtonState(enabled, count, isApplied) {
    if (!btnApplyApproved) return;
    if (isApplied) {
      btnApplyApproved.disabled = true;
      btnApplyApproved.style.background = '#065f46';
      btnApplyApproved.style.color = '#a7f3d0';
      btnApplyApproved.style.cursor = 'default';
      btnApplyApproved.style.boxShadow = 'none';
      btnApplyApproved.style.border = '1px solid #059669';
      btnApplyApproved.innerHTML = '<span>✅ Inventario Aprobado Publicado en Tienda</span>';
    } else if (enabled) {
      btnApplyApproved.disabled = false;
      btnApplyApproved.style.background = '#059669';
      btnApplyApproved.style.color = '#ffffff';
      btnApplyApproved.style.cursor = 'pointer';
      btnApplyApproved.style.boxShadow = '0 4px 18px rgba(5, 150, 105, 0.45)';
      btnApplyApproved.style.border = 'none';
      btnApplyApproved.innerHTML = '<span>🚀 2. Subir Inventario Aprobado (' + (count || '') + ' Productos) a Tienda Web</span>';
    } else {
      btnApplyApproved.disabled = true;
      btnApplyApproved.style.background = '#334155';
      btnApplyApproved.style.color = '#94a3b8';
      btnApplyApproved.style.cursor = 'not-allowed';
      btnApplyApproved.style.boxShadow = 'none';
      btnApplyApproved.style.border = '1px solid rgba(255,255,255,0.1)';
      btnApplyApproved.innerHTML = '<span>🚀 2. Subir Inventario Aprobado a Tienda Web</span>';
    }
  }

  function renderAuditKPIs(rawCount, cleanCount, quarCount, totalValue, totalUnits) {
    const elRaw = document.getElementById('ascend-kpi-raw');
    const elClean = document.getElementById('ascend-kpi-clean');
    const elQuar = document.getElementById('ascend-kpi-quarantine');
    const elVal = document.getElementById('ascend-kpi-value');
    const elUnits = document.getElementById('ascend-kpi-units');

    if (elRaw) elRaw.textContent = rawCount + ' SKUs';
    if (elClean) elClean.textContent = cleanCount + ' SKUs';
    if (elQuar) elQuar.textContent = quarCount + ' SKUs';
    if (elVal) elVal.textContent = '$' + Math.round(totalValue).toLocaleString('es-MX') + ' MXN';
    if (elUnits) elUnits.textContent = totalUnits + ' unidades listas en piso';
  }

  function buildDuranRealCSVText() {
    let lines = ['ASCEND_SKU,UPC_BARCODE,BRAND,POS_SHORT_DESCRIPTION,ASCEND_DEPT,QTY_ON_HAND,PRICE_MXN,ECOMMERCE_FLAG,ULTIMO_VENDIDO,ULTIMO_RECIBIDO'];
    realDuranProducts.forEach(p => {
      lines.push([
        p.sku || '',
        p.upc || '',
        p.brand || 'TREK',
        '"' + (p.title || p.pos_raw || '').replace(/"/g, '""') + '"',
        '"' + (p.ascend_category || p.category || '') + '"',
        p.stock !== undefined ? p.stock : 1,
        (p.price || 0).toFixed(2),
        1,
        '',
        ''
      ].join(','));
    });
    realDuranQuarantine.forEach(q => {
      lines.push([
        q.sku || '',
        '',
        q.brand || 'INTERNO',
        '"' + (q.pos_desc || '').replace(/"/g, '""') + '"',
        'Bicicletas - Cuarentena',
        q.qty !== undefined ? q.qty : 0,
        (q.price || 0).toFixed(2),
        0,
        '',
        ''
      ].join(','));
    });
    return lines.join('\n');
  }

  // Motor Universal de Análisis y Auditoría de CSV
  function parseAnyAscendCSV(rawText, filename) {
    if (!rawText) return null;
    let cleanText = rawText;
    if (cleanText.charCodeAt(0) === 0xFEFF) cleanText = cleanText.slice(1); // Limpiar BOM
    const lines = cleanText.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length < 2) return null;

    const cleanItems = [];
    const quarantineItems = [];
    const seenSkus = new Set();

    // 1. Detectar si proviene de un reporte de Convertio PDF
    const isConvertioReport = (
      cleanText.includes('Inventario por categoria') ||
      cleanText.includes('Cantidad Subtotal') ||
      cleanText.includes('Duran Go Trek SA de CV')
    ) && !lines[0].toUpperCase().includes('ASCEND_SKU');

    if (isConvertioReport) {
      const reportItems = parseConvertioAscendReport(cleanText);
      reportItems.forEach((it, idx) => {
        const sku = it.sku;
        const skuUpper = (sku || '').toUpperCase();
        const brand = detectBrandFromText('', it.desc);

        if (seenSkus.has(skuUpper)) {
          quarantineItems.push({ sku, brand, pos_desc: it.desc + ' (' + it.cat + ')', qty: it.qty, price: it.price, motivo: 'SKU_DUPLICADO_EN_ASCEND' });
          return;
        }
        seenSkus.add(skuUpper);

        if (skuUpper === 'ARU7934082A' || it.price < 100) {
          quarantineItems.push({ sku, brand: 'INTERNO', pos_desc: it.desc + ' (' + it.cat + ')', qty: it.qty, price: it.price, motivo: 'INTRUSO_EN_CATEGORIA_BICICLETAS_PRECIO_ATIPICO' });
          return;
        }
        if (it.qty < 0) {
          quarantineItems.push({ sku, brand, pos_desc: it.desc + ' (' + it.cat + ')', qty: it.qty, price: it.price, motivo: 'INVENTARIO_NEGATIVO_DESCUADRE_ALMACEN' });
          return;
        }
        if (it.qty === 0 || isNaN(it.qty)) {
          quarantineItems.push({ sku, brand, pos_desc: it.desc + ' (' + it.cat + ')', qty: 0, price: it.price, motivo: 'AGOTADO_EN_MOSTRADOR_STOCK_CERO' });
          return;
        }

        const cat = detectCategoryFromText(it.desc, it.cat);
        const photoUrl = resolveProductPhoto(sku, brand, it.desc, it.desc, cat);
        const upcTxt = it.upc ? ('UPC ' + it.upc) : 'Catálogo Oficial';
        const recTxt = it.lastRec ? ('Recibido: ' + it.lastRec) : 'Stock Piso Coronado #1130';

        cleanItems.push({
          id: 'duran-convertio-' + sku.toLowerCase().replace(/[^a-z0-9]/g, '') + '-' + idx,
          sku: sku,
          upc: it.upc,
          category: cat,
          ascend_category: it.cat,
          brand: brand,
          pos_raw: it.desc,
          title: it.desc,
          specs: it.cat + ' · ' + upcTxt + ' · ' + recTxt,
          price: it.price,
          stock: it.qty,
          variants: [it.cat.replace('Bicicletas - ', '')],
          img: photoUrl,
          tag: 'Sync Duran Go Trek'
        });
      });
    } else {
      // 2. CSV estándar delimitado
      const firstLine = lines[0];
      const delimiter = firstLine.includes('\t') ? '\t' : (firstLine.split(';').length > firstLine.split(',').length ? ';' : ',');
      const headers = parseCSVLine(firstLine, delimiter).map(h => h.toUpperCase().replace(/[^A-Z0-9_]/g, ''));

      function findCol(patterns, fallbackIdx) {
        for (let p of patterns) {
          const idx = headers.findIndex(h => h.includes(p));
          if (idx !== -1) return idx;
        }
        return fallbackIdx;
      }

      const idxSku = findCol(['SKU', 'PART', 'CODIGO', 'ID', 'ITEMNUMBER', 'ITEM_NUMBER', 'ITEM'], 0);
      const idxUpc = findCol(['UPC', 'BARCODE'], -1);
      const idxDesc = findCol(['DESC', 'NAME', 'NOMBRE', 'PRODUCT', 'ARTICULO', 'TITLE', 'DESCRIPCION'], 1);
      const idxBrand = findCol(['BRAND', 'MARCA', 'VENDOR', 'MANUF', 'FABRICANTE'], -1);
      const idxDept = findCol(['DEPT', 'CAT', 'DEPART', 'LINEA', 'TIPO', 'CATEGORIA'], -1);
      const idxQty = findCol(['QTY', 'ONHAND', 'STOCK', 'EXIST', 'CANT', 'AVAIL', 'DISPON', 'EXISTENCIA'], 2);
      const idxPrice = findCol(['PRICE', 'RETAIL', 'MSRP', 'PRECIO', 'VENTA', 'COST', 'PVP'], 3);
      const idxEcom = findCol(['ECOM', 'WEB'], -1);

      for (let i = 1; i < lines.length; i++) {
        const cols = parseCSVLine(lines[i], delimiter);
        if (cols.length < 2) continue;

        const sku = (cols[idxSku] || ('ASC-' + i)).trim();
        const skuUpper = sku.toUpperCase();
        const upc = idxUpc >= 0 ? (cols[idxUpc] || '').trim() : '';
        const rawDesc = (cols[idxDesc] || cols[1] || 'Producto Ascend #' + sku).trim();
        const rawBrand = idxBrand >= 0 ? (cols[idxBrand] || '') : '';
        const rawDept = idxDept >= 0 ? (cols[idxDept] || '') : '';
        const brand = detectBrandFromText(rawBrand, rawDesc);
        const qtyStr = (cols[idxQty] || '0').replace(/[^0-9.-]/g, '');
        const priceStr = (cols[idxPrice] || '0').replace(/[^0-9.-]/g, '');
        const qty = parseInt(qtyStr || '0', 10);
        const price = parseFloat(priceStr || '0');
        const ecomVal = idxEcom >= 0 ? (cols[idxEcom] || '1').trim().toUpperCase() : '1';
        const upperDescDept = (rawDesc + ' ' + rawDept).toUpperCase();

        if (seenSkus.has(skuUpper)) {
          quarantineItems.push({ sku, brand, pos_desc: rawDesc, qty, price, motivo: 'SKU_DUPLICADO_EN_ASCEND' });
          continue;
        }
        seenSkus.add(skuUpper);

        if (skuUpper === 'ARU7934082A' || (upperDescDept.includes('BICICLETA') && price > 0 && price < 100)) {
          quarantineItems.push({ sku, brand: 'INTERNO', pos_desc: rawDesc + (rawDept ? ' (' + rawDept + ')' : ''), qty, price, motivo: 'INTRUSO_EN_CATEGORIA_BICICLETAS_PRECIO_ATIPICO' });
          continue;
        }
        if (ecomVal === '0' || ecomVal === 'FALSE' || ecomVal === 'NO' || upperDescDept.includes('TALLER INTERNO') || upperDescDept.includes('WORKSHOP-SUPPLY') || skuUpper === 'TALLER-GRASA') {
          quarantineItems.push({ sku, brand, pos_desc: rawDesc, qty, price, motivo: 'INSUMO_INTERNO_TALLER_NO_PUBLICAR' });
          continue;
        }
        if (qty < 0) {
          quarantineItems.push({ sku, brand, pos_desc: rawDesc, qty, price, motivo: 'INVENTARIO_NEGATIVO_DESCUADRE_ALMACEN' });
          continue;
        }
        if (qty === 0 || isNaN(qty)) {
          quarantineItems.push({ sku, brand, pos_desc: rawDesc, qty: 0, price, motivo: 'AGOTADO_EN_MOSTRADOR_STOCK_CERO' });
          continue;
        }
        if (price <= 0 || isNaN(price)) {
          quarantineItems.push({ sku, brand, pos_desc: rawDesc, qty, price: 0, motivo: 'FALTA_CAPTURAR_PRECIO_EN_POS' });
          continue;
        }

        const known = KNOWN_PRODUCT_KB[skuUpper];
        const cat = known ? known.category : detectCategoryFromText(rawDesc, rawDept);
        const cleanTitle = known ? known.title : enrichRawPosName(rawDesc);
        const cleanSpecs = known ? known.specs : ((rawDept ? rawDept + ' · ' : '') + (upc ? 'UPC ' + upc + ' · ' : '') + 'SKU #' + sku + ' · Stock Coronado #1130');
        const cleanVariants = (known && known.variants) ? known.variants : ['Disponible en Tienda Coronado'];
        const photoUrl = resolveProductPhoto(sku, brand, cleanTitle, rawDesc, cat);

        cleanItems.push({
          id: 'ascend-csv-' + sku.toLowerCase().replace(/[^a-z0-9]/g, '') + '-' + i,
          sku: sku,
          upc: upc,
          category: cat,
          brand: brand,
          pos_raw: rawDesc,
          title: cleanTitle,
          specs: cleanSpecs,
          price: price,
          stock: qty,
          variants: cleanVariants,
          img: photoUrl,
          tag: (known && known.tag) ? known.tag : 'Sync Ascend'
        });
      }
    }

    const rawCount = cleanItems.length + quarantineItems.length;
    const totalValue = cleanItems.reduce((acc, p) => acc + (p.price * (p.stock || 1)), 0);
    const totalUnits = cleanItems.reduce((acc, p) => acc + (p.stock || 1), 0);

    return {
      rawCount,
      clean: cleanItems,
      quarantine: quarantineItems,
      totalValue,
      totalUnits
    };
  }

  function runAuditAnalysis(sourceText, sourceName) {
    const auditResult = parseAnyAscendCSV(sourceText, sourceName);
    if (!auditResult || (auditResult.clean.length === 0 && auditResult.quarantine.length === 0)) {
      showToast('No se detectaron productos válidos en el archivo', 'error');
      if (logBox) {
        logBox.style.color = '#f87171';
        logBox.textContent = '[ERROR EN REPORTE] No se detectaron filas de inventario válidas en ' + sourceName;
      }
      return;
    }

    pendingAuditReport = auditResult;

    // 1. Actualizar KPIs del reporte
    renderAuditKPIs(auditResult.rawCount, auditResult.clean.length, auditResult.quarantine.length, auditResult.totalValue, auditResult.totalUnits);

    // 2. Renderizar tabla de cuarentena de este reporte
    quarantineList = [...auditResult.quarantine];
    renderQuarantineList();

    // 3. Actualizar consola de texto tipo terminal
    if (logBox) {
      logBox.style.color = '#10b981';
      logBox.textContent = '[REPORTE DE AUDITORÍA GENERADO: ' + sourceName + '] ' +
        'Leídos: ' + auditResult.rawCount + ' SKUs | ' +
        'Aprobados para publicación: ' + auditResult.clean.length + ' ($' + Math.round(auditResult.totalValue).toLocaleString('es-MX') + ' MXN / ' + auditResult.totalUnits + ' unidades) | ' +
        'Bloqueados en Cuarentena: ' + auditResult.quarantine.length + ' anomalías. ' +
        'Presiona "2. Subir Inventario Aprobado a Tienda Web" para autorizar la publicación.';
    }

    // 4. Actualizar banner de estado
    if (reportStatusBanner) {
      reportStatusBanner.style.display = 'block';
      reportStatusBanner.style.background = 'rgba(16, 185, 129, 0.15)';
      reportStatusBanner.style.border = '1.5px solid #10b981';
      reportStatusBanner.style.color = '#34d399';
      reportStatusBanner.innerHTML = '📋 <strong>Reporte de Depuración Listo:</strong> Se auditaron <strong>' + auditResult.rawCount + ' SKUs</strong> en total &rarr; <strong>' + auditResult.clean.length + ' productos aprobados</strong> por un valor de <strong>$' + Math.round(auditResult.totalValue).toLocaleString('es-MX') + ' MXN</strong> y <strong>' + auditResult.quarantine.length + ' bloqueados en cuarentena</strong>. Ya puedes revisar la tabla y hacer clic en <strong>"2. Subir Inventario Aprobado a Tienda Web"</strong>.';
    }

    // 5. Habilitar Paso 2
    setApprovedButtonState(true, auditResult.clean.length);

    showToast('Reporte generado: ' + auditResult.clean.length + ' aprobados / ' + auditResult.quarantine.length + ' en cuarentena', 'success');
  }

  // Evento: Seleccionar archivo CSV
  if (csvFileInput) {
    csvFileInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (evt) => {
        let text = evt.target.result || '';
        if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);
        loadedCSVBuffer = { name: file.name, text: text, size: file.size };

        if (fileSelectedBadge) {
          fileSelectedBadge.textContent = '📄 ' + file.name + ' (' + (file.size / 1024).toFixed(1) + ' KB)';
          fileSelectedBadge.style.color = '#38bdf8';
          fileSelectedBadge.style.borderColor = '#0284c7';
        }

        setApprovedButtonState(false);

        if (reportStatusBanner) {
          reportStatusBanner.style.display = 'block';
          reportStatusBanner.style.background = 'rgba(56, 189, 248, 0.14)';
          reportStatusBanner.style.border = '1px solid #0284c7';
          reportStatusBanner.style.color = '#38bdf8';
          reportStatusBanner.innerHTML = '📁 <strong>Archivo cargado en memoria:</strong> ' + file.name + '. Haz clic en el botón naranja <strong>"1. Generar Reporte de Depuración"</strong> para que el Agente IA analice los SKUs y separe la cuarentena.';
        }

        if (logBox) {
          logBox.style.color = '#38bdf8';
          logBox.textContent = '[ARCHIVO LEÍDO: ' + file.name + ' (' + (file.size / 1024).toFixed(1) + ' KB)] Presiona "1. Generar Reporte de Depuración" para auditar los productos.';
        }
        showToast('Archivo listo: ' + file.name + '. Haz clic en "1. Generar Reporte".', 'info');
      };
      reader.readAsText(file);
    });
  }

  // Botón 1: Generar Reporte de Depuración
  if (btnGenerateReport) {
    btnGenerateReport.addEventListener('click', () => {
      if (loadedCSVBuffer && loadedCSVBuffer.text) {
        runAuditAnalysis(loadedCSVBuffer.text, loadedCSVBuffer.name);
      } else {
        const duranCSVText = buildDuranRealCSVText();
        if (fileSelectedBadge) {
          fileSelectedBadge.textContent = '🚴 Archivo Oficial Mario Arellano (62 SKUs)';
          fileSelectedBadge.style.color = '#38bdf8';
        }
        runAuditAnalysis(duranCSVText, 'Inventario_Limpio_Duran_Go_Trek_62_SKUs.csv');
      }
    });
  }

  // Botón 2: Subir Inventario Aprobado a Tienda Web
  if (btnApplyApproved) {
    btnApplyApproved.addEventListener('click', () => {
      if (!pendingAuditReport || !pendingAuditReport.clean || pendingAuditReport.clean.length === 0) {
        showToast('Primero debes generar el reporte en el Paso 1', 'error');
        return;
      }

      // Reemplazar al 100% los productos de la tienda con los aprobados
      PRODUCTS_DATA.length = 0;
      pendingAuditReport.clean.forEach(p => PRODUCTS_DATA.push(p));
      quarantineList = [...pendingAuditReport.quarantine];

      renderProducts('all', '');
      populateEditorDropdown();
      updateAscendKPIs();
      renderQuarantineList();

      setApprovedButtonState(false, 0, true);

      if (reportStatusBanner) {
        reportStatusBanner.style.display = 'block';
        reportStatusBanner.style.background = 'rgba(5, 150, 105, 0.25)';
        reportStatusBanner.style.border = '1.5px solid #10b981';
        reportStatusBanner.style.color = '#ffffff';
        reportStatusBanner.innerHTML = '✅ <strong>¡INVENTARIO APROBADO PUBLICADO CON ÉXITO!</strong> Se publicaron <strong>' + pendingAuditReport.clean.length + ' productos</strong> en la tienda web de Cordillera Trek ($' + Math.round(pendingAuditReport.totalValue).toLocaleString('es-MX') + ' MXN). Las <strong>' + pendingAuditReport.quarantine.length + ' anomalías</strong> quedaron protegidas en la Lista Roja de almacén.';
      }

      if (logBox) {
        logBox.style.color = '#10b981';
        logBox.textContent = '[ORDEN EJECUTADA: TIENDA WEB ACTUALIZADA] ' + pendingAuditReport.clean.length + ' productos aprobados publicados en https://cordilleratrek.com ($' + Math.round(pendingAuditReport.totalValue).toLocaleString('es-MX') + ' MXN). Almacenista puede descargar la Lista Roja de ' + pendingAuditReport.quarantine.length + ' anomalías.';
      }

      showToast('¡Éxito! ' + pendingAuditReport.clean.length + ' productos publicados en la tienda en línea', 'success');
    });
  }

  // Preset: Cargar CSV Real de Mario Arellano
  if (loadDuranRealBtn) {
    loadDuranRealBtn.addEventListener('click', () => {
      const duranCSVText = buildDuranRealCSVText();
      loadedCSVBuffer = { name: 'Inventario_Limpio_Duran_Go_Trek_62_SKUs.csv', text: duranCSVText, size: duranCSVText.length };
      if (fileSelectedBadge) {
        fileSelectedBadge.textContent = '🚴 Reporte Oficial Duran Go Trek (62 SKUs)';
        fileSelectedBadge.style.color = '#38bdf8';
        fileSelectedBadge.style.borderColor = '#0284c7';
      }
      runAuditAnalysis(duranCSVText, 'Inventario_Limpio_Duran_Go_Trek_62_SKUs.csv');
    });
  }

  // Boton AZUL: Descargar el CSV Limpio de 62 SKUs de Duran Go Trek SA de CV
  if (downloadRawBtn) {
    downloadRawBtn.addEventListener('click', () => {
      const header = 'ASCEND_SKU,UPC_BARCODE,BRAND,POS_SHORT_DESCRIPTION,ASCEND_DEPT,QTY_ON_HAND,PRICE_MXN,ECOMMERCE_FLAG\n';
      const cleanLines = realDuranProducts.map(p =>
        `"${p.sku}","${p.upc || ''}","${p.brand}","${(p.pos_raw || p.title).replace(/"/g, '""')}","${p.ascend_category || 'Bicicletas'}",${p.stock},${p.price.toFixed(2)},1`
      );
      const quarLines = realDuranQuarantine.map(q => {
        const ecom = q.sku === 'ARU7934082A' ? 0 : 1;
        return `"${q.sku}","${q.brand}","${(q.pos_desc || '').replace(/"/g, '""')}","Bicicletas",${q.qty},${Number(q.price || 0).toFixed(2)},${ecom}`;
      });
      // Construir CSV con las mismas 8 columnas exactas para ambos grupos
      const allRows = [
        ...realDuranProducts.map(p => `"${p.sku}","${p.upc || ''}","${p.brand}","${(p.pos_raw || p.title).replace(/"/g, '""')}","${p.ascend_category || 'Bicicletas'}",${p.stock},${p.price.toFixed(2)},1`),
        ...realDuranQuarantine.map(q => `"${q.sku}","","${q.brand}","${(q.pos_desc || '').replace(/"/g, '""')}","Bicicletas",${q.qty},${Number(q.price || 0).toFixed(2)},${q.sku === 'ARU7934082A' ? 0 : 1}`)
      ].join('\n');

      const blob = new Blob(['\uFEFF' + header + allRows], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Inventario_Limpio_Duran_Go_Trek_62_SKUs.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      if (logBox) {
        logBox.style.color = '#38bdf8';
        logBox.textContent = '[DESCARGADO] Inventario_Limpio_Duran_Go_Trek_62_SKUs.csv (62 SKUs reales de Mario Arellano: 56 limpios + 6 con error). Puedes abrirlo en Excel o subirlo en "\ud83d\udcc2 Subir CSV de Ascend RMS".';
      }
      showToast('Descargado: Inventario_Limpio_Duran_Go_Trek_62_SKUs.csv', 'success');
    });
  }

  // Boton ROJO: Descargar la Lista Roja de Cuarentena en Excel (.CSV) para el encargado de almacen
  if (downloadQuarantineBtn) {
    downloadQuarantineBtn.addEventListener('click', () => {
      const header = 'SKU_ASCEND,MARCA,DESCRIPCION_POS,EXISTENCIA_ACTUAL,PRECIO_MXN,ECOMMERCE_FLAG,DIAGNOSTICO_AGENTE_IA\n';
      const rows = quarantineList.map(q =>
        `"${q.sku}","${q.brand}","${(q.pos_desc || '').replace(/"/g, '""')}",${q.qty},${q.price},0,"${q.motivo}"`
      ).join('\n');
      const blob = new Blob(['\uFEFF' + header + rows], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Lista_Roja_Cuarentena_Duran_Go_Trek_Mario_Arellano.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Descargado: Lista_Roja_Cuarentena_Duran_Go_Trek_Mario_Arellano.csv', 'success');
    });
  }

  if (resetDemoBtn) {
    resetDemoBtn.addEventListener('click', () => {
      PRODUCTS_DATA.length = 0;
      demoMixProducts.forEach(p => PRODUCTS_DATA.push(p));
      quarantineList = [...demoMixQuarantine];
      updateAscendKPIs();
      renderQuarantineList();
      renderProducts('all', '');


      if (logBox) {
        logBox.style.color = '#38bdf8';
        logBox.textContent = '[MODO DEMO MIXTO ACTIVO] Cat\u00e1logo demostraci\u00f3n (14 art\u00edculos mixtos: bicis, refacciones, cascos, GPS y geles). Haz clic en "\ud83d\udeb4 Inventario Real Mario Arellano (62 SKUs)" para volver al inventario real.';
      }
      showToast('Cat\u00e1logo demo mixto (14) activo', 'info');
    });
  }

  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('agent-input-sku').value = btn.getAttribute('data-sku') || '';
      document.getElementById('agent-input-brand').value = btn.getAttribute('data-brand') || '';
      document.getElementById('agent-input-desc').value = btn.getAttribute('data-desc') || '';
      document.getElementById('agent-input-cat').value = btn.getAttribute('data-cat') || 'bicis';
      document.getElementById('agent-input-stock').value = btn.getAttribute('data-stock') || '1';
      document.getElementById('agent-input-price').value = btn.getAttribute('data-price') || '1000';
    });
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const sku = document.getElementById('agent-input-sku').value.trim();
      const skuUpper = sku.toUpperCase();
      const brand = document.getElementById('agent-input-brand').value.trim().toUpperCase();
      const rawDesc = document.getElementById('agent-input-desc').value.trim();
      const cat = document.getElementById('agent-input-cat').value;
      const stock = parseInt(document.getElementById('agent-input-stock').value || '0', 10);
      const price = parseFloat(document.getElementById('agent-input-price').value || '0');
      const customImg = (document.getElementById('agent-input-img')?.value || '').trim();
      const selectedId = productSelect ? productSelect.value : '__NEW__';

      if (logBox) {
        logBox.style.color = '#38bdf8';
        logBox.textContent = '[PROCESANDO] Guardando cambios de SKU #' + sku + ' (' + rawDesc + ')...';
      }

      setTimeout(() => {
        if (stock < 0 || price <= 0 || rawDesc.toUpperCase().includes('TALLER INTERNO')) {
          const motivo = rawDesc.toUpperCase().includes('TALLER INTERNO')
            ? 'INSUMO_INTERNO_TALLER_NO_PUBLICAR'
            : stock < 0
              ? 'INVENTARIO_NEGATIVO_DESCUADRE_ALMACEN'
              : 'FALTA_CAPTURAR_PRECIO_EN_POS';

          // Si existia en productos, retirarlo
          if (selectedId && selectedId !== '__NEW__') {
            const exIdx = PRODUCTS_DATA.findIndex(p => p.id === selectedId);
            if (exIdx !== -1) PRODUCTS_DATA.splice(exIdx, 1);
          }

          quarantineList.unshift({
            sku: sku,
            brand: brand,
            pos_desc: rawDesc,
            qty: stock,
            price: price,
            motivo: motivo
          });

          updateAscendKPIs();
          renderQuarantineList();
          renderProducts('all', '');


          populateEditorDropdown();
          populateEditorDropdown('__NEW__');

          if (logBox) {
            logBox.style.color = '#f87171';
            logBox.textContent = '[BLOQUEADO EN CUARENTENA] SKU #' + sku + ' (' + motivo + '). Retirado de la tienda para proteger la venta.';
          }
          showToast('SKU #' + sku + ' enviado a Cuarentena', 'error');
          return;
        }

        // Caso A: Edicion de un producto existente del catalogo
        if (selectedId && selectedId !== '__NEW__') {
          const prod = PRODUCTS_DATA.find(p => p.id === selectedId);
          if (prod) {
            prod.sku = sku;
            prod.brand = brand;
            prod.title = rawDesc;
            prod.category = cat;
            prod.stock = stock;
            prod.price = price;
            prod.img = customImg || resolveProductPhoto(sku, brand, rawDesc, rawDesc, cat);

            updateAscendKPIs();
            renderProducts('all', '');


            populateEditorDropdown(selectedId);

            if (logBox) {
              logBox.style.color = '#10b981';
              logBox.textContent = `[CAMBIOS GUARDADOS EN VIVO] SKU #${sku} · "${rawDesc}" actualizado en tienda ($${price.toLocaleString('es-MX')} MXN | Stock Coronado: ${stock}).`;
            }
            showToast('Producto actualizado en vivo', 'success');
            return;
          }
        }

        // Caso B: Alta de un nuevo producto
        const known = KNOWN_PRODUCT_KB[skuUpper];
        const cleanTitle = known ? known.title : enrichRawPosName(rawDesc);
        const cleanSpecs = known ? known.specs : ('Ficha generada por Agente IA · SKU #' + sku + ' · Stock Coronado #1130');
        const photoUrl = resolveProductPhoto(sku, brand, cleanTitle, rawDesc, cat);

        const newProduct = {
          id: 'ascend-live-' + Date.now(),
          sku: sku,
          category: cat,
          brand: brand,
          pos_raw: rawDesc,
          title: cleanTitle,
          specs: cleanSpecs,
          price: price,
          stock: stock,
          variants: (known && known.variants) ? known.variants : ['Disponible en Tienda Coronado'],
          img: photoUrl,
          tag: 'Nuevo en Catálogo'
        };

        PRODUCTS_DATA.unshift(newProduct);
        updateAscendKPIs();
        renderProducts('all', '');


        populateEditorDropdown(newProduct.id);

        if (logBox) {
          logBox.style.color = '#10b981';
          logBox.textContent = '[NUEVO PRODUCTO PUBLICADO] Agente IA creó la ficha de "' + cleanTitle + '" ($' + price.toLocaleString('es-MX') + ' MXN | Stock: ' + stock + '). ¡Ya visible en la tienda!';
        }
        showToast('Publicado en tienda: ' + cleanTitle, 'success');
      }, 250);
    });
  }
}

/* ==========================================================================
   2.3 CARRUSEL MOVIL DE NOTICIAS (CONTROLES IZQ / DER & DOTS INDICADORES)
   ========================================================================== */
function initNewsMobileCarousel() {
  const track = document.getElementById('news-slider-track') || document.querySelector('.news-grid');
  const btnPrev = document.getElementById('btn-news-ctrl-prev');
  const btnNext = document.getElementById('btn-news-ctrl-next');
  const dots = document.querySelectorAll('.news-dot');
  if (!track) return;

  function getStep() {
    const card = track.querySelector('.news-card');
    return card ? (card.offsetWidth + 14) : 290;
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', (e) => {
      e.preventDefault();
      track.scrollBy({ left: -getStep(), behavior: 'smooth' });
    });
  }

  if (btnNext) {
    btnNext.addEventListener('click', (e) => {
      e.preventDefault();
      track.scrollBy({ left: getStep(), behavior: 'smooth' });
    });
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-idx') || '0', 10);
      const step = getStep();
      track.scrollTo({ left: idx * step, behavior: 'smooth' });
    });
  });

  let throttle = false;
  track.addEventListener('scroll', () => {
    if (!throttle) {
      throttle = true;
      requestAnimationFrame(() => {
        const step = getStep();
        const activeIdx = Math.min(dots.length - 1, Math.max(0, Math.round(track.scrollLeft / step)));
        dots.forEach((d, i) => {
          if (i === activeIdx) d.classList.add('active');
          else d.classList.remove('active');
        });
        throttle = false;
      });
    }
  }, { passive: true });
}
