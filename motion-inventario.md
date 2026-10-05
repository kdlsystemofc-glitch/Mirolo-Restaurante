# Inventário de Motion — Mirolo Restaurante

Data: 2026-10-05  
Versão: 1.0 (Fase 3 Concluída)

---

## 1. Tabela Geral de Animações

| # | Seção | Elemento | Atributo / Tipo | Propriedades Animadas | Duração & Easing | Gatilho / Trigger | Nível de Qualidade | Comportamento em Reduced Motion |
|---|---|---|---|---|---|---|---|---|
| 1 | Hero | `.hero__logo` | `data-reveal` | `opacity`, `translateY(16px)` | 750ms, `power2.out`, delay 50ms | Imediato pós-load | All | Fade 200ms |
| 2 | Hero | `.hero__badge` | `data-reveal` | `opacity`, `translateY(16px)` | 750ms, `power2.out`, delay 150ms | Imediato pós-load | All | Fade 200ms |
| 3 | Hero | `.hero__headline` | `data-reveal` | `opacity`, `translateY(20px)` | 750ms, `power2.out`, delay 250ms | Imediato pós-load | All | Fade 200ms |
| 4 | Hero | `.hero__food-img-wrap` | `data-reveal` | `opacity`, `translateY(24px)` | 750ms, `power2.out`, delay 300ms | Imediato pós-load | All | Fade 200ms |
| 5 | Hero | `.recipe-note--left` | `data-reveal` + `data-loop="float"` | Entrada: `opacity`, `translateY(20px)`. Loop: `y (+/-3.5px)`, `rot (+/-0.8deg)` | Entrada: 750ms. Loop: 3.6s `sine.inOut` contínuo | Imediato pós-load. Loop enquanto na tela | Entrada: All. Loop: `high` apenas | Entrada: Fade 200ms. Loop: Desativado |
| 6 | Hero | `.recipe-note--right` | `data-reveal` + `data-loop="float"` | Entrada: `opacity`, `translateY(20px)`. Loop: `y (+/-3.5px)`, `rot (+/-0.8deg)` | Entrada: 750ms. Loop: 4.1s `sine.inOut` contínuo | Imediato pós-load. Loop enquanto na tela | Entrada: All. Loop: `high` apenas | Entrada: Fade 200ms. Loop: Desativado |
| 7 | Hero | `.hero__stamp` | `data-reveal` + `data-parallax="0.06"` | Entrada: `opacity`, `translateY(16px)`. Parallax: `translateY (-14px a +14px)` | Entrada: 750ms. Parallax: Scrub vinculado ao scroll | Entrada: Imediato. Parallax: Scroll | Entrada: All. Parallax: `high` apenas | Entrada: Fade 200ms. Parallax: Desativado |
| 8 | Bolinho | `.section-tag` | `data-reveal` | `opacity`, `translateY(16px)` | 850ms, `power2.out`, delay 50ms | Scroll (top 75%) | All | Fade 200ms |
| 9 | Bolinho | `.cookbook` | `data-reveal` | `opacity`, `translateY(24px)` | 850ms, `power2.out`, delay 150ms | Scroll (top 75%) | All | Fade 200ms |
| 10 | Bolinho | `.receipt` | `data-reveal` + `data-loop="float"` | Entrada: `opacity`, `translateY(16px)`. Loop: `y (+/-3.5px)` | Entrada: 850ms. Loop: 4.6s `sine.inOut` | Scroll (top 75%) | Entrada: All. Loop: `high` apenas | Entrada: Fade 200ms. Loop: Desativado |
| 11 | Bolinho | `.mentions-badge` | `data-reveal` | `opacity`, `translateY(12px)` | 850ms, `power2.out`, delay 350ms | Scroll (top 75%) | All | Fade 200ms |
| 12 | Bolinho | `.cookbook__stamp` | `data-reveal` | `opacity`, `translateY(14px)` | 850ms, `power2.out`, delay 420ms | Scroll (top 75%) | All | Fade 200ms |
| 13 | Bolinho | `.peeking-sketch` | `data-reveal` + `data-parallax="0.08"` | Entrada: `opacity`, `translateY(20px)`. Parallax: `translateY` scrub (máx 20px) | Entrada: 850ms. Parallax: Scrub no scroll | Scroll (top 75%) | Entrada: All. Parallax: `high` apenas | Entrada: Fade 200ms. Parallax: Desativado |
| 14 | Buffet | `.section-tag` | `data-reveal` | `opacity`, `translateY(16px)` | 850ms, `power2.out`, delay 50ms | Scroll (top 75%) | All | Fade 200ms |
| 15-21 | Buffet | `.polaroid` (1 a 7) | `data-reveal` escalonado | `opacity`, `translateY(24px)` | 850ms, `power2.out`, delays 100ms a 460ms | Scroll (top 75%) | All | Fade 200ms |
| 22 | Depoimentos | `.section-tag` | `data-reveal` | `opacity`, `translateY(16px)` | 850ms, `power2.out`, delay 50ms | Scroll (top 75%) | All | Fade 200ms |
| 23-25 | Depoimentos | `.review-card` (1 a 3) | `data-reveal` escalonado | `opacity`, `translateY(24px)` | 850ms, `power2.out`, delays 120ms a 320ms | Scroll (top 75%) | All | Fade 200ms |
| 26 | Depoimentos | `.review-card__stamp-round` | `data-reveal` + `data-parallax="0.06"` | Entrada: `opacity`, `translateY(12px)`. Parallax: `translateY (-12px a +12px)` | Entrada: 850ms. Parallax: Scrub | Scroll (top 75%) | Entrada: All. Parallax: `high` apenas | Entrada: Fade 200ms. Parallax: Desativado |
| 27 | Depoimentos | `.review-card__stamp-rect` | `data-reveal` | `opacity`, `translateY(12px)` | 850ms, `power2.out`, delay 440ms | Scroll (top 75%) | All | Fade 200ms |
| 28 | Footer | `.footer__contact` | `data-reveal` | `opacity`, `translateY(16px)` | 850ms, `power2.out`, delay 80ms | Scroll (top 75%) | All | Fade 200ms |
| 29 | Footer | `.footer__action` | `data-reveal` | `opacity`, `translateY(16px)` | 850ms, `power2.out`, delay 180ms | Scroll (top 75%) | All | Fade 200ms |

---

## 2. Orçamento de Loops Simultâneos por Posição de Rolagem

Um dos maiores riscos de animações contínuas na web é a degradação de quadros por acúmulo de `requestAnimationFrame` em elementos fora da tela.
Para mitigar isso de forma determinística:
- Todo elemento com `data-loop="float"` é registrado em um `IntersectionObserver` com `threshold: 0.1`.
- Quando o elemento sai da área visível (viewport), seu tween correspondente do GSAP é pausado (`tween.pause()`).
- Quando reentra, é retomado (`tween.play()`).

### Contagem de Loops Ativos por Zona de Rolagem:

1. **Zona 1 (Topo / Hero — 0 a 600px)**:
   - Loops ativos: `.recipe-note--left`, `.recipe-note--right`
   - **Total de loops ativos: 2** (Orçamento: <= 3).

2. **Zona 2 (O Caderno Secreto — 600 a 1400px)**:
   - Loops do Hero saem da tela e pausam.
   - Loop ativo: `.receipt` (recibo amarelo).
   - **Total de loops ativos: 1** (Orçamento: <= 3).

3. **Zona 3 (Buffet / Polaroids — 1400 a 2000px)**:
   - Nenhum loop ativo (apenas transições interativas sob hover).
   - **Total de loops ativos: 0**.

4. **Zona 4 (Depoimentos / Prova Social — 2000 a 2600px)**:
   - Nenhum loop ativo.
   - **Total de loops ativos: 0**.

5. **Zona 5 (Rodapé — > 2600px)**:
   - Nenhum loop ativo.
   - **Total de loops ativos: 0**.

**Pico Máximo Simultâneo:** 2 loops (apenas na Seção Hero em modo `quality: high`). No modo `quality: low` ou `reduced`, o número de loops ativos é **zero**.

---

## 3. Avaliação de Efeitos Especiais (Critério Visual e de Custo)

- **Vapor / Fumaça Digital sobre a Feijoada**: **REJEITADO**.
  *Justificativa*: Partículas de fumaça geradas em Canvas ou CSS possuem estética genérica de "videogame/banco de imagem", que colide frontalmente com o projeto fotográfico de perspectiva quente e matéria orgânica do Mirolo. A foto real já traz a rusticidade exata da panela de barro.
- **Brilhos / Lens Flares Artificiais**: **REJEITADO**.
  *Justificativa*: Iluminação física do site é baseada em luz de sala e madeira natural, não em efeitos sci-fi.
- **Micro-flutuação de Papel e Tachinhas**: **APROVADO**.
  *Justificativa*: Oscilações de amplitude sub-milimétrica (3.5px) com período lento (>3.5s) que transmitem a sensação tátil de papel real repousando sobre a bancada sem agitar a leitura.
