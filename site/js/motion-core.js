/**
 * motion-core.js — Mirolo Restaurante
 * Sistema de Motion Cinematográfico Nível Awwwards
 *
 * Características:
 * - Scroll fluido e macio via Lenis sincronizado ao GSAP Ticker e ScrollTrigger
 * - Sequência de abertura coreografada no Hero (pratos, cartões manuscritos, carimbo com impacto elástico)
 * - Efeito leque dinâmico (fan-out scatter) nas fotos Polaroid da Seção Buffet
 * - Micro-interação tátil 3D Tilt magnético com tracking de cursor
 * - Fitas adesivas e notas com física de mola (spring overshoot)
 * - WCAG 2.2 acessível: suporte total a prefers-reduced-motion e botão Pausar/Retomar
 * - Performance 60-120fps: animações exclusivas em transform e opacity, pausa automática fora da tela
 */
(function() {
  'use strict';

  if (!window.gsap || !window.ScrollTrigger) {
    console.warn('Mirolo Motion: GSAP ou ScrollTrigger não encontrados.');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const STATE = {
    initialized: false,
    mode: 'full', // 'full' | 'reduced' | 'paused'
    quality: 'high', // 'high' | 'low'
    userPaused: false,
    tabHidden: false,
    lenis: null,
    loops: [],
    parallaxes: [],
    tweens: []
  };

  /**
   * Avalia capacidade do hardware e preferência de economia de dados
   */
  function evaluateQuality() {
    const cores = navigator.hardwareConcurrency || 4;
    const memory = navigator.deviceMemory || 4;
    const connection = navigator.connection || {};
    const isSaveData = connection.saveData === true;
    const isNarrow = window.innerWidth < 768;

    if (cores < 4 || memory < 4 || isSaveData || isNarrow) {
      return 'low';
    }
    return 'high';
  }

  /**
   * Avalia prefers-reduced-motion
   */
  function evaluateReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Inicialização do Lenis sincronizado com GSAP ScrollTrigger
   */
  function initLenis() {
    if (STATE.mode === 'reduced' || !window.Lenis) {
      STATE.lenis = null;
      return;
    }

    try {
      const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

      STATE.lenis = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponencial suave Awwwards
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 0.95,
        touchMultiplier: 1.2,
        syncTouch: false,
        infinite: false
      });

      // Sincronizar Lenis com ScrollTrigger
      STATE.lenis.on('scroll', ScrollTrigger.update);

      // Conectar ciclo de RAF do Lenis ao GSAP Ticker para eliminar descompasso de quadros
      gsap.ticker.add((time) => {
        if (STATE.lenis && !STATE.userPaused && !STATE.tabHidden) {
          STATE.lenis.raf(time * 1000);
        }
      });

      gsap.ticker.lagSmoothing(0);
    } catch (e) {
      console.warn('Falha ao inicializar Lenis, mantendo scroll nativo:', e);
      STATE.lenis = null;
    }
  }

  /**
   * Gerenciador de Pausa / Retomada
   */
  function pauseMotion(isTabSwitch = false) {
    if (!isTabSwitch) {
      STATE.userPaused = true;
      STATE.mode = 'paused';
    }
    document.documentElement.setAttribute('data-motion-paused', 'true');
    gsap.globalTimeline.pause();
    if (STATE.lenis) STATE.lenis.stop();
    updatePauseButtons(true);
  }

  function resumeMotion(isTabSwitch = false) {
    if (!isTabSwitch) {
      STATE.userPaused = false;
      STATE.mode = evaluateReducedMotion() ? 'reduced' : 'full';
    }
    if (STATE.userPaused) return;

    document.documentElement.removeAttribute('data-motion-paused');
    gsap.globalTimeline.resume();
    if (STATE.lenis) STATE.lenis.start();
    updatePauseButtons(false);
  }

  function togglePause() {
    if (STATE.userPaused || STATE.mode === 'paused') {
      resumeMotion(false);
    } else {
      pauseMotion(false);
    }
  }

  function updatePauseButtons(isPaused) {
    const buttons = document.querySelectorAll('[data-motion-toggle]');
    buttons.forEach(btn => {
      btn.setAttribute('aria-pressed', isPaused ? 'true' : 'false');
      const textEl = btn.querySelector('.motion-toggle__text') || btn;
      if (isPaused) {
        btn.classList.add('is-paused');
        if (textEl.textContent.trim()) textEl.textContent = '▶ Retomar';
      } else {
        btn.classList.remove('is-paused');
        if (textEl.textContent.trim()) textEl.textContent = '⏸ Pausar';
      }
    });
  }

  /**
   * Sequência Cinematográfica de Abertura do Hero
   */
  function animateHeroIntro() {
    if (STATE.mode === 'reduced') return;

    const logo = document.querySelector('.hero__logo');
    const badge = document.querySelector('.hero__badge');
    const headline = document.querySelector('.hero__headline');
    const dishes = document.querySelector('.hero__dishes');
    const noteLeft = document.querySelector('.hero__note--left');
    const noteRight = document.querySelector('.hero__note--right');
    const stamp = document.querySelector('.hero__stamp');

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // 1. Top bar: Logo e Badge descem suavemente
    if (logo) {
      tl.fromTo(logo, 
        { opacity: 0, y: -22 }, 
        { opacity: 1, y: 0, duration: 0.8 }, 
        0.05
      );
    }
    if (badge) {
      tl.fromTo(badge, 
        { opacity: 0, y: -22, scale: 0.95 }, 
        { opacity: 1, y: 0, scale: 1, duration: 0.8 }, 
        0.15
      );
    }

    // 2. Headline: Revelação imponente e elegante
    if (headline) {
      tl.fromTo(headline, 
        { opacity: 0, y: 28, letterSpacing: '0.08em' }, 
        { opacity: 1, y: 0, letterSpacing: '0.04em', duration: 1.1, ease: 'power4.out' }, 
        0.25
      );
    }

    // 3. Pratos: assentam na mesa de madeira com física suave
    if (dishes) {
      tl.fromTo(dishes,
        { opacity: 0, y: 40, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 1.0, ease: 'power3.out' },
        0.4
      );
    }

    // 4. Cartão da Esquerda: pousa com leve inclinação de papel
    if (noteLeft) {
      tl.fromTo(noteLeft,
        { opacity: 0, y: -35, rotation: -8, scale: 0.92 },
        { opacity: 1, y: 0, rotation: -4, scale: 1, duration: 0.9, ease: 'back.out(1.4)' },
        0.6
      );
    }

    // 5. Cartão da Direita: pousa equilibrando a composição
    if (noteRight) {
      tl.fromTo(noteRight,
        { opacity: 0, y: -35, rotation: 8, scale: 0.92 },
        { opacity: 1, y: 0, rotation: 4.5, scale: 1, duration: 0.9, ease: 'back.out(1.4)' },
        0.7
      );
    }

    // 6. Carimbo Vermelho: impacto tátil de carimbo real (slam elástico)
    if (stamp) {
      tl.fromTo(stamp,
        { opacity: 0, scale: 1.6, rotation: -16 },
        { opacity: 1, scale: 1, rotation: -7, duration: 0.65, ease: 'elastic.out(1.1, 0.55)' },
        0.95
      );
    }
  }

  /**
   * Revelações Coreografadas ao Rolar (ScrollTrigger)
   */
  function setupScrollAnimations() {
    if (STATE.mode === 'reduced') return;

    // Seção 2: Caderno Secreto (Bolinho de Espinafre)
    const sec2 = document.querySelector('#bolinho, #receita, .bolinho, .receita');
    if (sec2) {
      const tag2 = sec2.querySelector('.section-tag');
      const cookbook = sec2.querySelector('.cookbook');
      const receipt = sec2.querySelector('.receipt');
      const mentionsBadge = sec2.querySelector('.mentions-badge');
      const chefStamp = sec2.querySelector('.cookbook__stamp');
      const peeking = sec2.querySelector('.peeking-sketch');

      if (tag2) {
        gsap.fromTo(tag2,
          { opacity: 0, y: 20 },
          {
            opacity: 1, y: 0, duration: 0.75, ease: 'power3.out',
            scrollTrigger: { trigger: tag2, start: 'top 88%', once: true }
          }
        );
      }

      if (cookbook) {
        gsap.fromTo(cookbook,
          { opacity: 0, y: 40, scale: 0.97 },
          {
            opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: cookbook, start: 'top 85%', once: true }
          }
        );
      }

      if (receipt) {
        gsap.fromTo(receipt,
          { opacity: 0, y: -25, rotation: -6 },
          {
            opacity: 1, y: 0, rotation: -2, duration: 0.85, ease: 'back.out(1.5)',
            scrollTrigger: { trigger: cookbook || receipt, start: 'top 80%', once: true }
          }
        );
      }

      if (mentionsBadge) {
        gsap.fromTo(mentionsBadge,
          { opacity: 0, scale: 0.8, rotation: 8 },
          {
            opacity: 1, scale: 1, rotation: 3, duration: 0.7, ease: 'back.out(1.6)',
            scrollTrigger: { trigger: cookbook || mentionsBadge, start: 'top 75%', once: true }
          }
        );
      }

      if (chefStamp) {
        gsap.fromTo(chefStamp,
          { opacity: 0, scale: 1.5, rotation: -12 },
          {
            opacity: 1, scale: 1, rotation: -6, duration: 0.6, ease: 'elastic.out(1.1, 0.5)',
            scrollTrigger: { trigger: cookbook || chefStamp, start: 'top 70%', once: true }
          }
        );
      }

      if (peeking) {
        gsap.fromTo(peeking,
          { opacity: 0, x: -30, rotation: -8 },
          {
            opacity: 1, x: 0, rotation: -4, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: peeking, start: 'top 85%', once: true }
          }
        );
      }
    }

    // Seção 3: Buffet Livre — Efeito Leque (Fan-out Scatter) nas Polaroids
    const sec3 = document.querySelector('#buffet, .buffet');
    if (sec3) {
      const tag3 = sec3.querySelector('.section-tag');
      const polaroids = sec3.querySelectorAll('.polaroid');

      if (tag3) {
        gsap.fromTo(tag3,
          { opacity: 0, y: 20 },
          {
            opacity: 1, y: 0, duration: 0.75, ease: 'power3.out',
            scrollTrigger: { trigger: tag3, start: 'top 88%', once: true }
          }
        );
      }

      if (polaroids.length) {
        polaroids.forEach((card, index) => {
          const targetRot = parseFloat(card.style.getPropertyValue('--rot') || '0');
          const delay = index * 0.08;

          gsap.fromTo(card,
            {
              opacity: 0,
              y: 50,
              scale: 0.92,
              rotation: targetRot * 0.2
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              rotation: targetRot,
              duration: 0.85,
              delay: delay,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: card.closest('.polaroid-cascade') || card,
                start: 'top 82%',
                once: true
              }
            }
          );
        });
      }
    }

    // Seção 4: Depoimentos (Cartões de Avaliação Lined Paper)
    const sec4 = document.querySelector('#depoimentos, .depoimentos');
    if (sec4) {
      const tag4 = sec4.querySelector('.section-tag');
      const reviewCards = sec4.querySelectorAll('.review-card');
      const roundStamp = sec4.querySelector('.review-card__stamp-round');
      const rectStamp = sec4.querySelector('.review-card__stamp-rect');

      if (tag4) {
        gsap.fromTo(tag4,
          { opacity: 0, y: 20 },
          {
            opacity: 1, y: 0, duration: 0.75, ease: 'power3.out',
            scrollTrigger: { trigger: tag4, start: 'top 88%', once: true }
          }
        );
      }

      if (reviewCards.length) {
        reviewCards.forEach((card, i) => {
          const targetRot = parseFloat(card.style.getPropertyValue('--rot') || '0');
          gsap.fromTo(card,
            { opacity: 0, y: 40, rotation: 0, scale: 0.95 },
            {
              opacity: 1, y: 0, rotation: targetRot, scale: 1,
              duration: 0.85, delay: i * 0.12, ease: 'power3.out',
              scrollTrigger: {
                trigger: card.closest('.reviews-grid') || card,
                start: 'top 82%',
                once: true
              }
            }
          );
        });
      }

      if (roundStamp) {
        gsap.fromTo(roundStamp,
          { opacity: 0, scale: 1.6, rotation: 25 },
          {
            opacity: 1, scale: 1, rotation: 10, duration: 0.65, ease: 'elastic.out(1.1, 0.5)',
            scrollTrigger: { trigger: roundStamp, start: 'top 80%', once: true }
          }
        );
      }

      if (rectStamp) {
        gsap.fromTo(rectStamp,
          { opacity: 0, scale: 1.5, rotation: -10 },
          {
            opacity: 1, scale: 1, rotation: 6, duration: 0.65, ease: 'elastic.out(1.1, 0.5)',
            scrollTrigger: { trigger: rectStamp, start: 'top 80%', once: true }
          }
        );
      }
    }
  }

  /**
   * Micro-Interação Tátil 3D Tilt Magnético (Tracking de Cursor Awwwards)
   * Aplica física de inclinação suave ao passar o mouse sobre cards e fotos
   */
  function setupInteractiveTilt() {
    if (STATE.quality === 'low' || STATE.mode === 'reduced') return;

    // Apenas em dispositivos de ponteiro preciso (mouse/trackpad), nunca touch
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const tiltElements = document.querySelectorAll('.polaroid, .hero__note, .review-card');

    tiltElements.forEach(el => {
      let bounds;

      function onMouseEnter() {
        bounds = el.getBoundingClientRect();
      }

      function onMouseMove(e) {
        if (!bounds) bounds = el.getBoundingClientRect();
        const x = e.clientX - bounds.left;
        const y = e.clientY - bounds.top;

        const xPct = (x / bounds.width - 0.5) * 2; // -1 a +1
        const yPct = (y / bounds.height - 0.5) * 2; // -1 a +1

        const baseRot = parseFloat(el.style.getPropertyValue('--rot') || '0');
        const tiltX = -yPct * 6; // max 6deg
        const tiltY = xPct * 6;

        gsap.to(el, {
          rotationX: tiltX,
          rotationY: tiltY,
          rotationZ: baseRot + xPct * 1.5,
          y: -6,
          scale: 1.025,
          duration: 0.35,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      }

      function onMouseLeave() {
        const baseRot = parseFloat(el.style.getPropertyValue('--rot') || '0');
        gsap.to(el, {
          rotationX: 0,
          rotationY: 0,
          rotationZ: baseRot,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: 'elastic.out(1, 0.6)',
          overwrite: 'auto'
        });
      }

      el.addEventListener('mouseenter', onMouseEnter, { passive: true });
      el.addEventListener('mousemove', onMouseMove, { passive: true });
      el.addEventListener('mouseleave', onMouseLeave, { passive: true });
    });
  }

  /**
   * Micro-Loops Orgânicos Flutuantes (data-loop)
   * Pausa automaticamente quando fora da tela via IntersectionObserver
   */
  function setupLoops() {
    if (STATE.quality === 'low' || STATE.mode === 'reduced') return;

    const elements = document.querySelectorAll('[data-loop="float"]');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const tween = entry.target._loopTween;
        if (!tween) return;
        if (entry.isIntersecting && !STATE.userPaused && !STATE.tabHidden) {
          tween.play();
        } else {
          tween.pause();
        }
      });
    }, { threshold: 0.1 });

    elements.forEach((el, index) => {
      const duration = 3.8 + (index % 3) * 0.6;
      const yDist = 4;

      const tween = gsap.to(el, {
        y: `+=${yDist}`,
        duration: duration,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        paused: true
      });

      el._loopTween = tween;
      STATE.loops.push(tween);
      observer.observe(el);
    });
  }

  /**
   * Ouvinte de Mudança de Visibilidade da Aba
   */
  function setupTabVisibility() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        STATE.tabHidden = true;
        pauseMotion(true);
      } else {
        STATE.tabHidden = false;
        resumeMotion(true);
      }
    });
  }

  /**
   * Ouvinte de Mudança Dinâmica em prefers-reduced-motion
   */
  function setupMediaListener() {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', () => {
      if (mediaQuery.matches) {
        STATE.mode = 'reduced';
        if (STATE.lenis) {
          STATE.lenis.destroy();
          STATE.lenis = null;
        }
        STATE.loops.forEach(t => t.kill());
      } else if (!STATE.userPaused) {
        STATE.mode = 'full';
        initLenis();
        setupScrollAnimations();
        setupInteractiveTilt();
        setupLoops();
      }
    });
  }

  /**
   * Inicialização Global do Sistema de Motion
   */
  function init() {
    if (STATE.initialized) return;
    STATE.initialized = true;

    STATE.quality = evaluateQuality();
    STATE.mode = evaluateReducedMotion() ? 'reduced' : 'full';

    document.documentElement.setAttribute('data-motion-quality', STATE.quality);
    document.documentElement.setAttribute('data-motion-mode', STATE.mode);

    // 1. Iniciar smooth scroll sincronizado
    initLenis();

    // 2. Sequência de abertura coreografada no Hero
    animateHeroIntro();

    // 3. Revelações coreografadas ao rolar
    setupScrollAnimations();

    // 4. Micro-interação tátil 3D Tilt
    setupInteractiveTilt();

    // 5. Loops flutuantes sutis
    setupLoops();

    // 6. Ouvintes de sistema
    setupTabVisibility();
    setupMediaListener();

    // 7. Botão de controle de acessibilidade (WCAG 2.2)
    document.querySelectorAll('[data-motion-toggle]').forEach(btn => {
      btn.addEventListener('click', togglePause);
    });

    console.log(`Mirolo Motion Awwwards ativado: modo=${STATE.mode}, qualidade=${STATE.quality}`);
  }

  window.MiroloMotion = {
    init,
    pause: pauseMotion,
    resume: resumeMotion,
    togglePause,
    getState: () => ({ ...STATE })
  };

})();
