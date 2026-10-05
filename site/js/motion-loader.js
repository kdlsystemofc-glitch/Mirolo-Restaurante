/**
 * motion-loader.js — Mirolo Restaurante
 * Carrega a suíte de motion (GSAP + ScrollTrigger + Lenis + motion-core)
 * estritamente após o window.load ou na primeira interação do usuário,
 * garantindo zero impacto no First Contentful Paint / LCP inicial.
 */
(function() {
  'use strict';

  let initialized = false;

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = false; // Preserva ordem estrita de execução clássica
      script.onload = () => resolve(src);
      script.onerror = (err) => reject(new Error('Falha ao carregar ' + src));
      document.body.appendChild(script);
    });
  }

  async function initMotion() {
    if (initialized) return;
    initialized = true;

    // Remover ouvintes de interação
    interactionEvents.forEach(evt => {
      window.removeEventListener(evt, triggerInit);
    });

    try {
      // Carregar bibliotecas clássicas auto-hospedadas na ordem estrita
      await loadScript('vendor/gsap.min.js');
      await loadScript('vendor/ScrollTrigger.min.js');
      await loadScript('vendor/lenis.min.js');
      await loadScript('js/motion-core.min.js');
      
      if (window.MiroloMotion && typeof window.MiroloMotion.init === 'function') {
        window.MiroloMotion.init();
      }
    } catch (err) {
      console.warn('Mirolo Motion: carregamento diferido ignorado ou falhou:', err);
    }
  }

  function triggerInit() {
    initMotion();
  }

  const interactionEvents = ['pointerdown', 'touchstart', 'keydown', 'wheel', 'scroll'];

  interactionEvents.forEach(evt => {
    window.addEventListener(evt, triggerInit, { once: true, passive: true });
  });

  function scheduleInit() {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(initMotion, { timeout: 4000 });
    } else {
      setTimeout(initMotion, 3000);
    }
  }

  if (document.readyState === 'complete') {
    scheduleInit();
  } else {
    window.addEventListener('load', scheduleInit, { once: true });
  }
})();
