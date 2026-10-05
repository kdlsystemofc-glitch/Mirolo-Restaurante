# Baseline da Etapa de Otimização — Mirolo Restaurante

Data: 2026-10-05  
Estado: Pós-implementação de todas as 3 fases de Motion (Pronto para Otimização de Performance)

---

## 1. Métricas Iniciais (Lighthouse Mobile)

Auditoria executada em emulação móvel padrão (4G throttled, CPU 4x slow-down):

- **Performance**: **67** / 100
  - **First Contentful Paint (FCP)**: 3.8 s
  - **Largest Contentful Paint (LCP)**: 5.8 s
  - **Total Blocking Time (TBT)**: 70 ms
  - **Cumulative Layout Shift (CLS)**: 0.00
  - **Speed Index**: 5.5 s
- **Accessibility**: **98** / 100
- **Best Practices**: **92** / 100
- **SEO**: **100** / 100

---

## 2. Gargalos Identificados para Resolução

1. **Fontes Externas (Google Fonts CDN)**:
   - Requisições externas para `fonts.googleapis.com` e `fonts.gstatic.com`.
   - Bloqueio de renderização de ~1.950 ms.
   - Resolução planejada: Hospedar localmente em WOFF2 apenas os pesos estritamente utilizados, com `font-display: swap` e preload crítico acima da dobra.

2. **CSS Bloqueante na `<head>`**:
   - 3 arquivos separados (`tokens.css`, `reset.css`, `style.css`).
   - Resolução planejada: Inline do CSS crítico no `<head>`, carregamento assíncrono não-bloqueante do restante e minificação rigorosa com preservação de fallbacks.

3. **Carga e Resolução de Imagens no Mobile**:
   - LCP atual de 5.8 s decorrente da carga de imagens de alta resolução (800px) em telas de smartphone (360px-390px).
   - Resolução planejada: Gerar degrau otimizado mobile (480px) com Sharp, definir `sizes` responsivos exatos por breakpoint, aplicar `fetchpriority="high"` com `link rel="preload"` exclusivamente no LCP candidate, e garantir `loading="lazy"` e `decoding="async"` em todas as imagens abaixo da dobra.

4. **Minificação de JavaScript Próprio**:
   - `motion-loader.js` e `motion-core.js` em formato expandido com comentários.
   - Resolução planejada: Minificar scripts próprios e relatar redução de bytes.
