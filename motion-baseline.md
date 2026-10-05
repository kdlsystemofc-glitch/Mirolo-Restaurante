# Baseline de Motion — Mirolo Restaurante

Data: 2026-10-05  
Estado: Pré-implementação de animações (Layout Estático Aprovado e Responsivo)

---

## 1. Métricas Iniciais de Performance (Lighthouse Mobile)

Auditoria realizada via servidor HTTP local (emulação móvel 4G, CPU throttling 4x):

- **Performance**: 68 / 100
  - First Contentful Paint (FCP): 3.3 s
  - Largest Contentful Paint (LCP): 5.7 s
  - Total Blocking Time (TBT): 0 ms
  - Cumulative Layout Shift (CLS): 0.00
  - Speed Index: 5.9 s
- **Accessibility**: 98 / 100
- **Best Practices**: 92 / 100
- **SEO**: 100 / 100

### Top 3 Oportunidades Identificadas (pré-motion)
1. **Render-blocking requests / CSS & Font loading**: Fontes externas do Google e múltiplos arquivos CSS na `<head>`.
2. **Improve image delivery & LCP sizing**: Oportunidade de `srcset` por breakpoint e `fetchpriority="high"` na foto principal do Hero.
3. **Cache lifetimes e compressão**: Ausência de cabeçalhos de expiração de cache no ambiente local e oportunidade de minificação de CSS.

---

## 2. Estado de Responsividade (12 Viewports Validados)

Todos os 12 viewports aprovados com 0px de rolagem horizontal, 0 erros no console e alvos de toque >= 44x44px:
- `2560x1440` (Ultrawide)
- `1920x1080` (Full HD)
- `1440x900` (MacBook)
- `1366x768` (Laptop)
- `1280x720` (HD)
- `1024x768` (iPad Landscape)
- `768x1024` (iPad Portrait)
- `430x932` (iPhone Max)
- `390x844` (iPhone Standard)
- `360x740` (Android)
- `320x568` (iPhone SE)
- `844x390` (Mobile Landscape)

---

## 3. Diretrizes e Arquitetura de Motion

1. **Auto-hospedagem Estrita (Zero CDN)**:
   - `site/vendor/gsap.min.js` (GSAP 3.14+)
   - `site/vendor/ScrollTrigger.min.js`
   - `site/vendor/lenis.min.js`
   - `site/vendor/lenis.css`
   - Scripts clássicos (compatíveis com protocolo `file://` e web server).

2. **Carregamento Não-Bloqueante**:
   - Os scripts de motion NÃO bloqueiam a renderização da página. Carregam após o evento `load` da janela ou no primeiro toque/interação do usuário (o que ocorrer primeiro).
   - **Zero dependência de JS para visibilidade inicial**: Nenhum elemento acima da dobra (Hero) ou abaixo dela fica oculto (`opacity: 0` ou `display: none`) por padrão caso o JS falhe ou seja desativado.

3. **Camadas e Performance**:
   - Apenas propriedades `transform` e `opacity` em nós-folha (leaf elements).
   - Elementos decorativos contínuos/pesados (`.hero__table-surface`, `.ripped-divider`, `.footer__banner`, texturas de fundo) são estáticos e isolados de ancestrais com `transform` ou `opacity < 1`.

4. **Três Modos de Movimento**:
   - `full`: Animações completas de entrada, parallax sutil e micro-loops flutuantes.
   - `reduced`: Ativado via media query `prefers-reduced-motion: reduce`. Sem loops, sem parallax; apenas fades de 200ms.
   - `paused`: Botão flutuante acessível para congelamento e retomada global de animações.

5. **Níveis de Qualidade (`high` vs `low`)**:
   - Detecção via `hardwareConcurrency < 4`, `deviceMemory < 4`, `saveData: true` ou largura de tela reduzida.
   - No modo `low`: micro-loops e parallax são desativados para preservar bateria e 60fps.
