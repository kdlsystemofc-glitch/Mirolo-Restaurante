/**
 * motion-core.js — Mirolo Restaurante
 * Núcleo do sistema de motion: modos, qualidade, Lenis, data-reveal,
 * data-parallax, data-loop, pausa fora da tela e aba oculta.
 */
(function() {
  'use strict';

  if (!window.gsap || !window.ScrollTrigger) {
    console.warn('Mirolo Motion: GSAP ou ScrollTrigger não encontrados.');
    return;
  }

  // Registrar plugins do GSAP
  gsap.registerPlugin(ScrollTrigger);

  const STATE = {
    initialized: false,
    mode: 'full', // 'full' | 'reduced' | 'paused'
    quality: 'high', // 'high' | 'low'
    userPaused: false,
    tabHidden: false,
    lenis: null,
    loops: [],
    reveals: [],
    parallaxes: []
  };

  /**
   * Avalia capacidade do hardware e preferência de dados
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
   * Scroll 100% Nativo e Suave (Sem sequestro de roda do mouse)
   */
  function initLenis() {
    // O scroll nativo do navegador garante 60-120fps fluidos, sem inércia pesada nem travamentos.
    STATE.lenis = null;
    return;
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
    if (STATE.userPaused) return; // Se o usuário pausou manualmente, não retoma no tab switch

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
   * Sistema de Revelação ao Rolar (data-reveal)
   */
  function setupReveals() {
    const elements = document.querySelectorAll('[data-reveal]');
    if (!elements.length) return;

    elements.forEach((el) => {
      const delay = parseFloat(el.getAttribute('data-reveal-delay') || '0');
      const yOffset = parseInt(el.getAttribute('data-reveal-y') || '20', 10);
      const isAboveFold = el.getBoundingClientRect().top < window.innerHeight * 0.85;

      if (STATE.mode === 'reduced') {
        if (!isAboveFold) {
          gsap.fromTo(el, 
            { opacity: 0 },
            {
              opacity: 1,
              duration: 0.2,
              ease: 'none',
              scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                once: true
              }
            }
          );
        }
        return;
      }

      // Elementos acima da dobra: já renderizados com estabilidade pelo HTML/CSS estático.
      // Nunca forçar opacity: 0 retrospectiva para não causar glitch, piscada ou falsa sensação de lentidão.
      if (isAboveFold) {
        return;
      }
 else {
        // Abaixo da dobra: gatilho a 35% de visibilidade (top 75%)
        gsap.fromTo(el,
          { opacity: 0, y: yOffset },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            delay: delay,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 75%',
              once: true,
              clearProps: 'transform,opacity'
            }
          }
        );
      }
    });
  }

  /**
   * Sistema de Parallax Sutil (data-parallax)
   * Leve (0.05-0.10, máx 24px, nunca sobre texto legível)
   */
  function setupParallax() {
    if (STATE.quality === 'low' || STATE.mode === 'reduced') return;

    const elements = document.querySelectorAll('[data-parallax]');
    elements.forEach((el) => {
      const speed = Math.min(0.12, Math.max(0.04, parseFloat(el.getAttribute('data-parallax') || '0.08')));
      const travel = Math.min(24, Math.round(window.innerHeight * speed));

      const tween = gsap.fromTo(el,
        { y: travel },
        {
          y: -travel,
          ease: 'none',
          scrollTrigger: {
            trigger: el.closest('section, header, footer') || el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        }
      );
      STATE.parallaxes.push(tween);
    });
  }

  /**
   * Sistema de Micro-Loops Flutuantes (data-loop)
   * Pausa automaticamente quando o elemento sai da tela via IntersectionObserver
   */
  function setupLoops() {
    if (STATE.quality === 'low' || STATE.mode === 'reduced') return;

    const elements = document.querySelectorAll('[data-loop]');
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
      const duration = 3.6 + (index % 3) * 0.5;
      const yDist = 3.5;
      const rotDist = 0.8;

      const tween = gsap.to(el, {
        y: `+=${yDist}`,
        rotation: `+=${rotDist}`,
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
        STATE.parallaxes.forEach(t => t.kill());
      } else if (!STATE.userPaused) {
        STATE.mode = 'full';
        initLenis();
        setupParallax();
        setupLoops();
      }
    });
  }

  /**
   * Inicialização Global
   */
  function init() {
    if (STATE.initialized) return;
    STATE.initialized = true;

    STATE.quality = evaluateQuality();
    STATE.mode = evaluateReducedMotion() ? 'reduced' : 'full';

    document.documentElement.setAttribute('data-motion-quality', STATE.quality);
    document.documentElement.setAttribute('data-motion-mode', STATE.mode);

    initLenis();
    setupReveals();
    setupParallax();
    setupLoops();
    setupTabVisibility();
    setupMediaListener();

    // Configurar botão de pausa se já existir
    document.querySelectorAll('[data-motion-toggle]').forEach(btn => {
      btn.addEventListener('click', togglePause);
    });

    console.log(`Mirolo Motion ativado: modo=${STATE.mode}, qualidade=${STATE.quality}`);
  }

  // Exportar API global
  window.MiroloMotion = {
    init,
    pause: pauseMotion,
    resume: resumeMotion,
    togglePause,
    getState: () => ({ ...STATE })
  };

})();
