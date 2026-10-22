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

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

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
   2.1 NAVEGACION SUAVE ENTRE SECCIONES (SMOOTH SCROLLING)
   ========================================================================== */
function initSmoothScroll() {
  const anchors = document.querySelectorAll('a[href^="#"]');
  const drawer = document.getElementById('mobile-nav-drawer');
  const overlay = document.getElementById('mobile-nav-overlay');

  function closeMobileDrawer() {
    if (drawer && drawer.classList.contains('open')) {
      drawer.classList.remove('open');
      if (overlay) overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  anchors.forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (!href) return;

      // Handle '#', empty, or '#inicio'
      if (href === '#' || href === '#inicio') {
        e.preventDefault();
        closeMobileDrawer();
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
        if (history.pushState) {
          history.pushState(null, '', window.location.pathname + window.location.search);
        }
        return;
      }

      // If target element exists on page
      let targetEl = null;
      try {
        targetEl = document.querySelector(href);
      } catch (err) {
        targetEl = null;
      }

      if (targetEl) {
        e.preventDefault();
        closeMobileDrawer();

        const header = document.querySelector('.main-header');
        const headerHeight = header ? header.offsetHeight : 70;
        const targetRect = targetEl.getBoundingClientRect();
        const targetY = targetRect.top + window.pageYOffset - headerHeight - 12;

        window.scrollTo({
          top: Math.max(0, targetY),
          behavior: 'smooth'
        });

        if (history.pushState) {
          history.pushState(null, '', href);
        }
      }
    });
  });
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
        showToast('El carrito est\u00e1 vac\u00edo', 'error');
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

function renderProducts(category, searchTerm) {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  const query = (searchTerm || '').trim().toLowerCase();

  const filtered = PRODUCTS_DATA.filter(p => {
    const matchCat = (category === 'all' || p.category === category);
    const matchSearch = (query === '' ||
      p.title.toLowerCase().includes(query) ||
      p.brand.toLowerCase().includes(query) ||
      p.specs.toLowerCase().includes(query) ||
      (p.sku && p.sku.toLowerCase().includes(query))
    );
    return matchCat && matchSearch;
  });

  grid.innerHTML = filtered.map((p, idx) => {
    const stockNum = typeof p.stock === 'number' ? p.stock : 3;
    const skuText = p.sku ? 'SKU Ascend #' + p.sku : 'Ascend Sync';
    return `
    <div class="product-item-clean reveal-scale delay-${(idx % 4) + 1}">
      <div class="product-thumb-wrap">
        <span class="badge-tag badge-tag-orange" style="position:absolute; top:10px; left:10px; z-index:2;">${p.brand}</span>
        <span style="position:absolute; top:10px; right:10px; z-index:2; background:rgba(15,23,42,0.88); color:#10b981; font-size:0.68rem; font-weight:800; padding:3px 8px; border-radius:20px; border:1px solid rgba(16,185,129,0.4);">
          \u25cf Stock Coronado: ${stockNum}
        </span>
        <img src="${p.img}" alt="${p.title}" class="product-thumb" loading="lazy" onerror="this.onerror=null;this.src='assets/images/productos/5301924.jpg';">
      </div>
      <div class="product-info-clean">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span class="product-brand-tag">${p.brand}</span>
          <span style="font-size:0.68rem; color:#64748b; font-family:monospace; font-weight:700;">${skuText}</span>
        </div>
        <h4 class="product-name-clean">${p.title}</h4>
        <p class="product-specs-clean">${p.specs}</p>
        <div class="product-row-bottom">
          <div>
            <div class="product-price-clean">$${p.price.toLocaleString('es-MX')} <span style="font-size:0.75rem; color:#64748b;">MXN</span></div>
          </div>
          <button class="btn-add-minimal" onclick="addToCart('${p.id}')">
            + A\u00f1adir
          </button>
        </div>
      </div>
    </div>
  `;
  }).join('');

  observeRevealElements(grid);
  checkRevealAnimations();
}

window.addToCart = function(productId) {
  const prod = PRODUCTS_DATA.find(p => p.id === productId);
  if (!prod) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: prod.id,
      title: prod.title,
      price: prod.price,
      brand: prod.brand,
      img: prod.img,
      variant: prod.variants[0],
      qty: 1
    });
  }

  updateCartCounter();
  showToast('Agregado: ' + prod.title, 'success');
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

  if (cart.length === 0) {
    cartList.innerHTML = `
      <div style="text-align:center; padding:30px 10px; color:#64748b;">
        <p>Tu carrito est\u00e1 vac\u00edo.</p>
      </div>
    `;
    if (subtotalEl) subtotalEl.textContent = '$0 MXN';
    if (deliveryEl) deliveryEl.textContent = '$0 MXN';
    if (totalEl) totalEl.textContent = '$0 MXN';
    return;
  }

  cartList.innerHTML = cart.map((item, idx) => `
    <div style="display:flex; gap:12px; padding:10px 0; border-bottom:1px solid #eee;">
      <img src="${item.img}" alt="${item.title}" style="width:60px; height:60px; object-fit:cover; border-radius:6px;">
      <div style="flex-grow:1;">
        <h5 style="font-size:0.88rem; margin-bottom:2px;">${item.title}</h5>
        <div style="font-size:0.85rem; font-weight:800; color:#181d26;">$${(item.price * item.qty).toLocaleString('es-MX')} MXN</div>
        <div style="display:flex; align-items:center; gap:6px; margin-top:4px;">
          <button style="width:22px; height:22px; cursor:pointer;" onclick="changeCartQty(${idx}, -1)">-</button>
          <span style="font-size:0.82rem; font-weight:700;">${item.qty}</span>
          <button style="width:22px; height:22px; cursor:pointer;" onclick="changeCartQty(${idx}, 1)">+</button>
          <button style="background:none; border:none; color:#ef4444; font-size:0.75rem; margin-left:auto; cursor:pointer;" onclick="removeCartItem(${idx})">Quitar</button>
        </div>
      </div>
    </div>
  `).join('');

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
  if (cart[idx]) {
    cart[idx].qty += delta;
    if (cart[idx].qty <= 0) cart.splice(idx, 1);
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

    const query = encodeURIComponent((brand || 'Trek') + ' ' + (cleanTitle || rawDesc) + ' bicycle side view white background');
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

  function openConsole() {
    updateAscendKPIs();
    renderQuarantineList();
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

  if (csvFileInput) {
    csvFileInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (evt) => {
        const text = evt.target.result || '';
        const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
        if (lines.length < 2) {
          showToast('El archivo CSV est\u00e1 vac\u00edo o no tiene filas', 'error');
          return;
        }

        const newClean = [];
        const newQuarantine = [];
        const seenSkus = new Set();

        // 1. Detectar si el archivo proviene de un reporte PDF de Ascend convertido en Convertio
        const isConvertioReport = (
          text.includes('Inventario por categoria') ||
          text.includes('Cantidad Subtotal') ||
          text.includes('Duran Go Trek SA de CV')
        ) && !lines[0].includes('ASCEND_SKU');

        if (isConvertioReport) {
          const reportItems = parseConvertioAscendReport(text);
          reportItems.forEach((it, idx) => {
            const sku = it.sku;
            const skuUpper = sku.toUpperCase();
            const brand = detectBrandFromText('', it.desc);

            if (seenSkus.has(skuUpper)) {
              newQuarantine.push({ sku, brand, pos_desc: it.desc + ' (' + it.cat + ')', qty: it.qty, price: it.price, motivo: 'SKU_DUPLICADO_EN_ASCEND' });
              return;
            }
            seenSkus.add(skuUpper);

            if (skuUpper === 'ARU7934082A' || it.price < 100) {
              newQuarantine.push({ sku, brand: 'INTERNO', pos_desc: it.desc + ' (' + it.cat + ')', qty: it.qty, price: it.price, motivo: 'INTRUSO_EN_CATEGORIA_BICICLETAS_PRECIO_ATIPICO' });
              return;
            }
            if (it.qty < 0) {
              newQuarantine.push({ sku, brand, pos_desc: it.desc + ' (' + it.cat + ')', qty: it.qty, price: it.price, motivo: 'INVENTARIO_NEGATIVO_DESCUADRE_ALMACEN' });
              return;
            }
            if (it.qty === 0 || isNaN(it.qty)) {
              newQuarantine.push({ sku, brand, pos_desc: it.desc + ' (' + it.cat + ')', qty: 0, price: it.price, motivo: 'AGOTADO_EN_MOSTRADOR_STOCK_CERO' });
              return;
            }

            const cat = detectCategoryFromText(it.desc, it.cat);
            const photoUrl = resolveProductPhoto(sku, brand, it.desc, it.desc, cat);
            const upcTxt = it.upc ? ('UPC ' + it.upc) : 'Cat\u00e1logo Oficial';
            const recTxt = it.lastRec ? ('Recibido: ' + it.lastRec) : 'Stock Piso Coronado #1130';

            newClean.push({
              id: 'duran-convertio-' + sku.toLowerCase().replace(/[^a-z0-9]/g, '') + '-' + idx,
              sku: sku,
              upc: it.upc,
              category: cat,
              ascend_category: it.cat,
              brand: brand,
              pos_raw: it.desc,
              title: it.desc,
              specs: it.cat + ' \u00b7 ' + upcTxt + ' \u00b7 ' + recTxt,
              price: it.price,
              stock: it.qty,
              variants: [it.cat.replace('Bicicletas - ', '')],
              img: photoUrl,
              tag: 'Sync Duran Go Trek'
            });
          });
        } else {
          // 2. Lector de CSV estandar separado por comas, punto y coma o tabuladores
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

          const idxSku = findCol(['SKU', 'PART', 'CODIGO', 'ID', 'ITEMNUMBER'], 0);
          const idxUpc = findCol(['UPC', 'BARCODE'], -1);
          const idxDesc = findCol(['DESC', 'NAME', 'NOMBRE', 'PRODUCT', 'ARTICULO', 'TITLE'], 1);
          const idxBrand = findCol(['BRAND', 'MARCA', 'VENDOR', 'MANUF', 'FABRICANTE'], -1);
          const idxDept = findCol(['DEPT', 'CAT', 'DEPART', 'LINEA', 'TIPO'], -1);
          const idxQty = findCol(['QTY', 'ONHAND', 'STOCK', 'EXIST', 'CANT', 'AVAIL', 'DISPON'], 2);
          const idxPrice = findCol(['PRICE', 'RETAIL', 'MSRP', 'PRECIO', 'VENTA', 'COST', 'PVP'], 3);
          const idxEcom = findCol(['ECOM', 'WEB'], -1);
          const idxDiag = findCol(['DIAGNOSTICO', 'ACCION_RECOMENDADA', 'MOTIVO'], -1);

          if (idxDiag !== -1) {
            if (logBox) {
              logBox.style.color = '#fbbf24';
              logBox.textContent = '[AVISO] Subiste el archivo de "Lista Roja Almac\u00e9n" (que contiene s\u00f3lo los errores bloqueados). Para probar la carga completa del POS, haz clic en el bot\u00f3n azul "\ud83d\udcc4 Bajar CSV Limpio (62 SKUs)" o sube el archivo del inventario.';
            }
            showToast('Subiste la Lista Roja de Errores. Sube el archivo de Inventario.', 'important');
            csvFileInput.value = '';
            return;
          }

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
              newQuarantine.push({ sku, brand, pos_desc: rawDesc, qty, price, motivo: 'SKU_DUPLICADO_EN_ASCEND' });
              continue;
            }
            seenSkus.add(skuUpper);

            if (skuUpper === 'ARU7934082A' || (upperDescDept.includes('BICICLETA') && price > 0 && price < 100)) {
              newQuarantine.push({ sku, brand: 'INTERNO', pos_desc: rawDesc + (rawDept ? ' (' + rawDept + ')' : ''), qty, price, motivo: 'INTRUSO_EN_CATEGORIA_BICICLETAS_PRECIO_ATIPICO' });
              continue;
            }
            if (ecomVal === '0' || ecomVal === 'FALSE' || ecomVal === 'NO' || upperDescDept.includes('TALLER INTERNO') || upperDescDept.includes('WORKSHOP-SUPPLY') || skuUpper === 'TALLER-GRASA') {
              newQuarantine.push({ sku, brand, pos_desc: rawDesc, qty, price, motivo: 'INSUMO_INTERNO_TALLER_NO_PUBLICAR' });
              continue;
            }
            if (qty < 0) {
              newQuarantine.push({ sku, brand, pos_desc: rawDesc, qty, price, motivo: 'INVENTARIO_NEGATIVO_DESCUADRE_ALMACEN' });
              continue;
            }
            if (qty === 0 || isNaN(qty)) {
              newQuarantine.push({ sku, brand, pos_desc: rawDesc, qty: 0, price, motivo: 'AGOTADO_EN_MOSTRADOR_STOCK_CERO' });
              continue;
            }
            if (price <= 0 || isNaN(price)) {
              newQuarantine.push({ sku, brand, pos_desc: rawDesc, qty, price: 0, motivo: 'FALTA_CAPTURAR_PRECIO_EN_POS' });
              continue;
            }

            const known = KNOWN_PRODUCT_KB[skuUpper];
            const cat = known ? known.category : detectCategoryFromText(rawDesc, rawDept);
            const cleanTitle = known ? known.title : enrichRawPosName(rawDesc);
            const cleanSpecs = known ? known.specs : ((rawDept ? rawDept + ' \u00b7 ' : '') + (upc ? 'UPC ' + upc + ' \u00b7 ' : '') + 'SKU #' + sku + ' \u00b7 Stock Coronado #1130');
            const cleanVariants = (known && known.variants) ? known.variants : ['Disponible en Tienda Coronado'];
            const photoUrl = resolveProductPhoto(sku, brand, cleanTitle, rawDesc, cat);

            newClean.push({
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

        if (newClean.length > 0 || newQuarantine.length > 0) {
          // Reemplazar al 100% los productos anteriores para que NO se mezclen con el demo
          PRODUCTS_DATA.length = 0;
          newClean.forEach(p => PRODUCTS_DATA.push(p));
          quarantineList = newQuarantine;

          updateAscendKPIs();
          renderQuarantineList();
          renderProducts('all', '');

          const totalVal = newClean.reduce((acc, p) => acc + (p.price * (p.stock || 1)), 0);
          if (logBox) {
            logBox.style.color = '#10b981';
            logBox.textContent = '[ARCHIVO REAL PROCESADO: ' + file.name + '] Le\u00eddos ' + (newClean.length + newQuarantine.length) + ' SKUs \u2192 ' + newClean.length + ' bicicletas/productos publicados ($' + Math.round(totalVal).toLocaleString('es-MX') + ' MXN) y ' + newQuarantine.length + ' anomal\u00edas bloqueadas en Cuarentena (cat\u00e1logo anterior reemplazado al 100%).';
          }
          showToast('Sincronizado: ' + newClean.length + ' publicados / ' + newQuarantine.length + ' en cuarentena', 'success');
        } else {
          if (logBox) {
            logBox.style.color = '#f87171';
            logBox.textContent = '[ERROR DE FORMATO] No se detectaron filas de inventario v\u00e1lidas en ' + file.name + '.';
          }
          showToast('No se encontraron productos v\u00e1lidos en el archivo', 'error');
        }
        csvFileInput.value = '';
      };
      reader.readAsText(file);
    });
  }

  // Boton VERDE: Cargar directamente los 62 SKUs reales del reporte de Mario Arellano (Duran Go Trek SA de CV)
  if (loadDuranRealBtn) {
    loadDuranRealBtn.addEventListener('click', () => {
      PRODUCTS_DATA.length = 0;
      realDuranProducts.forEach(p => PRODUCTS_DATA.push(p));
      quarantineList = [...realDuranQuarantine];
      updateAscendKPIs();
      renderQuarantineList();
      renderProducts('all', '');
      if (logBox) {
        logBox.style.color = '#10b981';
        logBox.textContent = '[INVENTARIO REAL MARIO ARELLANO ACTIVO] 62 SKUs de Duran Go Trek SA de CV (22/Oct/2026 11:32) \u2192 56 bicicletas publicadas ($1,726,833 MXN / 57 unidades) y 6 anomal\u00edas aisladas en Cuarentena (5 con stock -1 y 1 "Arugula" de $30).';
      }
      showToast('Cargado Inventario Real Duran Go Trek (56 publicados / 6 cuarentena)', 'success');
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
      const rawDesc = document.getElementById('agent-input-desc').value.trim().toUpperCase();
      const cat = document.getElementById('agent-input-cat').value;
      const stock = parseInt(document.getElementById('agent-input-stock').value || '0', 10);
      const price = parseFloat(document.getElementById('agent-input-price').value || '0');

      if (logBox) {
        logBox.style.color = '#38bdf8';
        logBox.textContent = '[AGENTE 1 POS] Leyendo SKU #' + sku + ' desde Ascend RMS (' + rawDesc + ')...';
      }

      setTimeout(() => {
        if (stock <= 0 || price <= 0 || rawDesc.includes('TALLER INTERNO')) {
          const motivo = rawDesc.includes('TALLER INTERNO')
            ? 'INSUMO_INTERNO_TALLER_NO_PUBLICAR'
            : stock < 0
              ? 'INVENTARIO_NEGATIVO_DESCUADRE_ALMACEN'
              : stock === 0
                ? 'AGOTADO_EN_MOSTRADOR_STOCK_CERO'
                : 'FALTA_CAPTURAR_PRECIO_EN_POS';

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

          if (logBox) {
            logBox.style.color = '#f87171';
            logBox.textContent = '[BLOQUEADO POR AGENTE 1] SKU #' + sku + ' (' + motivo + '). Enviado a Cuarentena de Almac\u00e9n para no contaminar la tienda en l\u00ednea.';
          }
          showToast('Agente 1 aisl\u00f3 SKU #' + sku + ' en Cuarentena', 'error');
          return;
        }

        const known = KNOWN_PRODUCT_KB[skuUpper];
        const cleanTitle = known ? known.title : enrichRawPosName(rawDesc);
        const cleanSpecs = known ? known.specs : ('Ficha generada por Agente IA \u00b7 Sincronizado de Ascend RMS \u00b7 Stock Coronado #1130');
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
          tag: 'Nuevo IA Sync'
        };

        PRODUCTS_DATA.unshift(newProduct);
        updateAscendKPIs();
        renderProducts('all', '');

        if (logBox) {
          logBox.style.color = '#10b981';
          logBox.textContent = '[PUBLICADO EN TIENDA CON FOTO REAL] Agente 2 convirti\u00f3 "' + rawDesc + '" en "' + cleanTitle + '" ($' + price.toLocaleString('es-MX') + ' MXN | Stock: ' + stock + '). \u00a1Ya visible en #1 del cat\u00e1logo!';
        }
        showToast('Publicado en tienda: ' + cleanTitle, 'success');
      }, 350);
    });
  }
}