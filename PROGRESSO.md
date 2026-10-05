# PROGRESSO.md — Mirolo Restaurante

## Status Geral: Construção Estática Concluída ✅

Data: 2026-10-02
Último commit: `99ff5db - final screenshots script`

---

## 1. O que foi feito

1. **Repositório & Setup**:
   - `git init`, `.gitignore` configurado excluindo `node_modules/` e `screenshots/`.
   - Dependências instaladas: `sharp`, `playwright`, `@playwright/test`, navegadores Chromium.

2. **Inventário de Assets (`site/assets.md`)**:
   - Todos os 17 slots do `DESIGN.md` foram mapeados e convertidos para WebP em 800px e 1600px via Sharp (`scripts/convert-assets.js`).
   - Logotipo tratado com canal alpha limpo (`site/assets/logo.png`) em castanho escuro para fundos claros.
   - Nenhuma imagem de `/design` utilizada como `<img>` ou `background-image`.

3. **Fundação Web**:
   - `site/tokens.css`: Sistema de variáveis de design fiéis ao mockup e paleta WCAG corrigida (`--c-gold-text: #8B5E10`).
   - `site/reset.css`: Reset moderno com suporte nativo a `prefers-reduced-motion: reduce`, padrões pontilhados de tecido/papel, masking tape em CSS e carimbos vetoriais.
   - `site/index.html`: Marcação semântica HTML5 completa, sem lorem ipsum, com dados reais do `CLIENTE.md`.

4. **Construção Seção por Seção (com screenshots 1440px e 390px, costura e commits individuais)**:
   - **Hero (`01-hero`)**: Barra superior com logotipo e badge oval de horário, título em Cormorant Garamond, prato central sobre tampo de madeira, notas de receitas com fita adesiva e carimbo "Sobremesa Cortesia". Commit: `809f472 hero pronta`.
   - **Bolinho (`02-bolinho`)**: Livro de receitas aberto ("O Caderno Secreto") com encadernação em couro, foto dos bolinhos de espinafre, recibo amarelo com código de barras, badge "26+ Menções no Google", folha pautada com sombra de dobra central e carimbo "Receita do Chef". Commit: `c3deace bolinho pronta`.
   - **Buffet (`03-buffet`)**: Fileira contínua e orgânica de fotos estilo Polaroid reais do restaurante, com tachinhas (pushpins) em 3D, leve rotação, efeito hover e legendas em caligrafia `Great Vibes`. Commit: `b424498 buffet pronta`.
   - **Depoimentos (`04-depoimentos`)**: Três fichas de caderno presas por fita adesiva com avaliações reais de clientes do Google Maps (João Vitor Malafaia, Kelly Petrussi, Maria Fernanda Lisauskas), carimbo circular "615 Reviews" e carimbo "Receita do Chef". Commit: `ec2f1e8 depoimentos pronta`.
   - **Footer (`05-footer`)**: Faixa terracota superior, corpo em gradiente de madeira clara com endereço, telefone real `(11) 2758-2354` e botão estilizado `[ RESERVAR ALMOÇO // WHATSAPP ]`. Commit: `0e9c5df footer pronta`.

5. **Screenshots Finais**:
   - Capturas de página inteira em 1440px, 768px e 390px geradas em `screenshots/final_full_*.png`.

6. **Push**:
   - Conforme regra do CLAUDE.md, a variável de ambiente `GH_TOKEN` não foi detectada no ambiente. Os commits foram registrados localmente e estão prontos para envio.

---

## 2. Histórico de Commits

```text
99ff5db final screenshots script
0e9c5df footer pronta
ec2f1e8 depoimentos pronta
b424498 buffet pronta
c3deace bolinho pronta
809f472 hero pronta
17eddcd design pronto
```

---

---

## 4. Rodada de Refinamento Visual & Texturas Táteis (Fidelidade Máxima ao Mockup)

1. **Novos Plates Integrados**:
   - `plate-hero-perspective.jpg`: Foto em perspectiva 35° da feijoada em caldeirão de barro sobre madeira rústica, com torresmo sequinho, bolinhos e laranjas cortadas. Substituiu a foto aérea plana anterior.
   - `plate-recipe-sketch.jpg`: Folha espiral pautada com croquis e ilustrações culinárias a lápis (panela, folha de louro, cebola, alho), vazando por trás do livro de receitas aberto na Seção 2.
2. **Texturas & Camadas**:
   - Padrão de tecido linho/canvas orgânico aplicado via CSS em todo o fundo do site.
   - Fita crepe adesiva artesanal com fibras translúcidas e chanfros nas bordas.
   - Carimbos com efeito estêncil e textura de borracha desgastada.
   - Divisória de papel rasgado artesanal (deckle edge) em SVG com ondas suaves e sombra suave superior, fazendo a transição perfeita entre a bancada de madeira do Hero e a Seção 2.
3. **Tratamento das Imagens do Buffet**:
   - Corte dos 12% inferiores das fotos para eliminação completa das marcas d'água/logos do Instagram.
   - Gradação de cor com saturação (+25%) e brilho (+6%) para realçar o frescor das saladas e o dourado dos pratos quentes.
   - Disposição em cascata de 7 Polaroids sobrepostas com tachinhas 3D vermelhas e de madeira.
4. **Remoção de Placeholders**:
   - Faixa terracota do rodapé convertida em friso decorativo limpo, eliminando o texto placeholder "FOOTER".

---

## 5. Rodada Final de Integração Orgânica e Matéria Física Real (Plates de Textura)

1. **Texturas Reais Integradas**:
   - `plate-textura-linho.jpg` ➔ `site/assets/texture-linen.webp`: Trama real de tecido de linho cru com fibras visíveis aplicada como fundo de toda a página, substituindo padrões computacionais de CSS.
   - `plate-madeira-hero.png` ➔ `site/assets/texture-wood-table-1600.webp` e `800.webp`: Superfície panorâmica de tábuas de carvalho rústico com veios horizontais e iluminação quente de taverna.
2. **Integração das Imagens (Fim das "Caixas Brutas / Coladas")**:
   - **Hero**: A foto da feijoada recebeu máscara elíptica de degradê suave nas bordas laterais e superiores (`mask-image: radial-gradient`), fundindo a madeira da foto na bancada do site sem NENHUMA borda retangular ou moldura.
   - **Notas do Hero**: As notas ("Recipe de família" e "Receita do chef") agora cruzam a linha do horizonte entre a parede de linho e a bancada de madeira, presas com fita crepe rasgada à mão.
   - **Fita Crepe Artesanal**: Recorte denteado em zigue-zague nas pontas (`clip-path`) simulando fita puxada do rolo manualmente, com fibras longitudinais e transparência.
   - **Recibo Amarelo**: Base recortada com dentes de impressora térmica (`clip-path`).
   - **Tachinhas 3D**: Esferas com reflexo especular de luz branca pura e sombra oblíqua projetada sobre a foto e sobre o linho.
   - **Carimbos**: Efeito de desgaste e porosidade de almofada de tinta de borracha em papel kraft.



---

## 6. Passada Responsiva Geral & Auditoria de Robustez

1. **Bateria de 12 Resoluções Testadas (Playwright)**:
   - `2560x1440` (Ultrawide Desktop): Rolagem H: OK | Erros: 0 | Alvos de toque < 44px: 0
   - `1920x1080` (Full HD Desktop): Rolagem H: OK | Erros: 0 | Alvos de toque < 44px: 0
   - `1440x900` (MacBook Standard): Rolagem H: OK | Erros: 0 | Alvos de toque < 44px: 0
   - `1366x768` (Laptop Comum): Rolagem H: OK | Erros: 0 | Alvos de toque < 44px: 0
   - `1280x720` (HD 720p): Rolagem H: OK | Erros: 0 | Alvos de toque < 44px: 0
   - `1024x768` (iPad Landscape): Rolagem H: OK | Erros: 0 | Alvos de toque < 44px: 0
   - `768x1024` (iPad Portrait): Rolagem H: OK | Erros: 0 | Alvos de toque < 44px: 0
   - `430x932` (iPhone Pro Max): Rolagem H: OK | Erros: 0 | Alvos de toque < 44px: 0
   - `390x844` (iPhone Standard): Rolagem H: OK | Erros: 0 | Alvos de toque < 44px: 0
   - `360x740` (Android Standard): Rolagem H: OK | Erros: 0 | Alvos de toque < 44px: 0
   - `320x568` (iPhone SE / Telas Estreitas): Rolagem H: OK | Erros: 0 | Alvos de toque < 44px: 0
   - `844x390` (Mobile Deitado / Landscape): Rolagem H: OK | Erros: 0 | Alvos de toque < 44px: 0

2. **Ajustes de Robustez & Overflow**:
   - Alvos de toque (links do rodapé e botão WhatsApp) definidos com mínimo estrito de `44x44px` (`min-height: 44px; min-width: 44px; display: inline-flex`).
   - Elementos contínuos e decorativos (`.hero__table-surface`, `.ripped-divider`, `.footer__banner`, `.peeking-sketch`) contidos com `overflow-x: clip` nos containers de seção (`.hero`, `.bolinho`, `.buffet`, `.depoimentos`, `.footer`), eliminando sangramento em telas estreitas e ultra-largas.
   - Ajuste de offsets das notas de receita no mobile (`right: 8px; left: 8px;`) compensando a rotação de 4° que ultrapassava as margens.
   - Zoom de texto a 200% verificado: layout permanece íntegro sem transbordamento horizontal.
   - Revisão Safari/iOS: prefixes `-webkit-clip-path` e `-webkit-backdrop-filter` aplicados; `color-scheme: light` fixado para proteção de tons de papel contra inversões de dark mode forçadas pelo OS.

3. **Resultados Lighthouse Mobile**:
   - Performance: 68
   - Accessibility: 98
   - Best Practices: 92
   - SEO: 100

   *Top 3 Oportunidades Identificadas (relatadas sem otimização prévia)*:
   1. **Render-blocking requests / CSS & Font loading** (Economia estimada: ~2.390 ms em rede móvel): Fontes externas do Google e múltiplos arquivos CSS na `<head>`.
   2. **Improve image delivery & LCP sizing** (Economia estimada: ~398 KiB / LCP): Imagens de alta densidade no Hero servidas com mesma resolução no mobile, beneficiando-se futuramente de `srcset` por breakpoint e `fetchpriority="high"`.
   3. **Cache lifetimes e compressão** (Economia estimada: ~786 KiB): Ausência de cabeçalhos de expiração de cache no servidor de desenvolvimento e oportunidade de minificação de CSS.

---

## 7. Fase 1 de Motion Concluída — Base Global (Tag: `motion-base`)

1. **Baseline Documentado**:
   - Criado `motion-baseline.md` com pontuações pré-motion (Lighthouse Mobile 68/98/92/100).
2. **Bibliotecas Auto-hospedadas (Zero CDN)**:
   - `site/vendor/gsap.min.js`
   - `site/vendor/ScrollTrigger.min.js`
   - `site/vendor/lenis.min.js` e `lenis.css`
3. **Núcleo de Motion Construído**:
   - `site/js/motion-loader.js`: Carregamento diferido após `window.load` ou na primeira interação do usuário (`pointerdown`, `touchstart`, `scroll`), garantindo zero impacto bloqueante.
   - `site/js/motion-core.js`: Sistema completo contendo:
     - 3 modos: `full`, `reduced` (via `prefers-reduced-motion: reduce`) e `paused` (via API / botão).
     - Qualidade adaptativa (`high` vs `low`) avaliando `hardwareConcurrency`, `deviceMemory`, `saveData` e largura de tela.
     - Smooth scroll com Lenis integrado ao ticker do GSAP e ScrollTrigger (somente em `high` e `full`).
     - Sistema unificado de atributos: `data-reveal`, `data-parallax` e `data-loop`.
     - Gerenciamento de abas: pausa automática via `visibilitychange` quando a aba fica oculta.
     - Pausa de micro-loops fora da viewport via `IntersectionObserver`.
4. **Validação & Regressão**:
   - `scripts/test-motion-base.js` executado com 100% de sucesso.
   - 0 erros no console, 0 rolagem horizontal em 6 resoluções de referência (2560px a 320px).
   - Pontuação Lighthouse pós-base: Performance 66 (delta de apenas -2 pontos, dentro da tolerância de 3 pontos).

---

## 8. Fase 2 de Motion Concluída — Animações Seção por Seção

Todas as 5 seções foram animadas e validadas individualmente com commits isolados:
1. **Hero (`ae8d36c hero motion pronta`)**:
   - Logo, badge e headline revelados com leve translateY e fade.
   - Notas de receita pousando e iniciando micro-flutuação lenta em `high quality`.
   - Carimbo de cortesia com sutil parallax e transição limpa.
2. **Bolinho (`7b78dfb bolinho motion pronta`)**:
   - Caderno secreto com abertura e elevação suave.
   - Recibo amarelo com flutuação sutil; badge de 26+ menções e carimbo do chef com entrada escalonada.
   - Esboço a lápis (`peeking-sketch`) com parallax sutil (0.08) deslizando por trás da página.
3. **Buffet (`cd291fd buffet motion pronta`)**:
   - Tag de seção e cascata de 7 Polaroids com revelação escalonada a 35% de visibilidade.
   - Rotações em CSS (`--rot`) preservadas pelo GSAP durante e após a interpolação.
4. **Depoimentos (`42d5995 depoimentos motion pronta`)**:
   - 3 cartões de caderno pousando com seus respectivos ângulos naturais.
   - Carimbo redondo de 615 reviews com leve profundidade parallax.
5. **Footer (`4dc210a footer motion pronta`)**:
   - Endereço, telefone e botão WhatsApp com reveal suave.
   - Faixa terracota contínua mantida 100% estática e imutável.

---

## 9. Fase 3 de Motion Concluída — Coerência, Inventário e Pausa (Tag: `motion-pronto`)

1. **Botão de Pausa Acessível**:
   - Componente `.motion-toggle` adicionado (fixo no canto inferior direito, alvo de toque >= 44x44px, contraste WCAG aprovado, suporte a teclado).
   - Alterna instantaneamente o estado da página entre congelamento (`data-motion-paused`) e reprodução fluida.
2. **Inventário & Orçamento de Loops (`motion-inventario.md`)**:
   - 29 animações catalogadas com propriedades, gatilhos e comportamento em movimento reduzido.
   - Orçamento estrito: máximo de 2 loops simultâneos no pico (Hero), caindo para 1 ou 0 nas demais seções via `IntersectionObserver`.
3. **Gravação e Auditoria de Vídeo**:
   - Script `scripts/record-motion-coherence.js` gravou a rolagem completa em `screenshots/video/motion-coherence.webm`.
   - Ritmo suave e consistente de leitura, sem saltos bruscos ou seções apressadas/agitadas.
4. **Pontuações Lighthouse Consolidadas**:
   - **Performance**: 66 (Baseline: 68 -> Delta final de apenas -2 pontos)
   - **Accessibility**: 98
   - **Best Practices**: 92
   - **SEO**: 100
   - **CLS**: 0.00 | **TBT**: 70ms

---

## 10. Etapa de Otimização Concluída — Performance Mobile 94 (Meta 90-92 Superada)

1. **Resultados Lighthouse Mobile (Antes vs Depois)**:
   | Métrica | Baseline (Pré-Otimização) | Otimizado (Final) | Ganho |
   | :--- | :---: | :---: | :---: |
   | **Performance Score** | **67** / 100 | **94** / 100 | **+27 pontos** 🚀 |
   | **Accessibility** | 98 / 100 | **100** / 100 | +2 pontos (Perfeito) |
   | **Best Practices** | 92 / 100 | **96** / 100 | +4 pontos |
   | **SEO** | 100 / 100 | **100** / 100 | Mantido 100 |
   | **First Contentful Paint (FCP)** | 3.8 s | **1.5 s** | -60% tempo |
   | **Largest Contentful Paint (LCP)** | 5.8 s | **3.0 s** | -48% tempo |
   | **Total Blocking Time (TBT)** | 70 ms | **0 ms** | 100% livre |
   | **Cumulative Layout Shift (CLS)** | 0.00 | **0.00** | Impecável |
   | **Speed Index** | 5.5 s | **2.0 s** | -63% tempo |

2. **Fontes Tipográficas Locais (Zero Dependência Externa)**:
   - Baixados subconjuntos `latin` e `latin-ext` em formato WOFF2 para `site/fonts/`:
     - Cormorant Garamond 700 (~45 KiB total)
     - Great Vibes 400 (~43 KiB total)
     - Lato 400 & Lato 700 (~94 KiB total)
   - Eliminados todos os links e preconnects do Google Fonts CDN.
   - Declarado `@font-face` com `font-display: swap` e `unicode-range` em `site/fonts.css` e inlinado no CSS crítico.
   - Preload estritamente das fontes críticas acima da dobra (`cormorant-garamond-700` e `lato-400`).

3. **Arquitetura de CSS Crítico & Minificação**:
   - Compilado `site/critical.css` (11 KiB) e inlinado diretamente no `<head>` do `site/index.html`.
   - Gerado `site/style.min.css` (22 KiB) combinando tokens, reset, style e lenis minificados com preservação de fallbacks (`-webkit-mask`, `-webkit-clip-path`).
   - Carregamento assíncrono não-bloqueante via `<link rel="preload" as="style">` com fallback `<noscript>`.

4. **Imagens Responsivas & Otimização de Assets**:
   - Degraus móveis gerados via Sharp:
     - `hero-food-480.webp` (24 KiB), `hero-food-600.webp` (31 KiB), `hero-food-800.webp` (44 KiB), `hero-food-1200.webp` (90 KiB).
     - `texture-wood-table-480.webp` (10 KiB) vs `texture-wood-table-1600.webp` (93 KiB).
     - `bolinho-500.webp` (36 KiB) e `bolinho-800.webp` (61 KiB).
     - 7 Polaroids em `-400.webp` (15-36 KiB vs 60-120 KiB originais).
     - Textura de linho do body `texture-linen.webp` otimizada de 185 KiB para 42 KiB (-77%).
   - `fetchpriority="high"` e `link rel="preload"` com `imagesrcset` calibrado aplicados exclusivamente no candidato a LCP.
   - `loading="lazy"` e `decoding="async"` rigorosamente mantidos em todas as imagens abaixo da dobra.
   - Background do Hero transformado em mobile-first, eliminando o download inútil da textura desktop de 93 KiB no mobile.

5. **Minificação de JavaScript & Execução Cooperativa**:
   - `motion-loader.js` (2.0 KiB -> `motion-loader.min.js`: 960 B, -54%).
   - `motion-core.js` (9.3 KiB -> `motion-core.min.js`: 4.2 KiB, -54%).
   - Carregamento assíncrono diferido com `requestIdleCallback` após o load e gatilho instantâneo na primeira interação (`pointerdown`, `scroll`, etc.).
   - Em qualidade `low` (mobile), elementos acima da dobra mantêm renderização estática nativa instantânea, sem atraso de LCP e sem FOUC.

6. **Semântica HTML & Acessibilidade**:
   - Landmark `<main id="main-content">` adicionado envolvendo as seções centrais de conteúdo.
   - Score de Acessibilidade elevado para **100/100**.

7. **Guia de Cabeçalhos e Cache (`DEPLOY.md`)**:
   - Criado documento detalhado com cabeçalhos HTTP agnósticos recomendados por tipo de arquivo (HTML com `must-revalidate`, WOFF2/Imagens com `max-age=31536000, immutable`, CSS/JS com `stale-while-revalidate`, compressão Brotli e CSP).

8. **Validação Responsiva em 12 Resoluções**:
   - Script `scripts/test-responsive.js` validou 100% de sucesso nas 12 resoluções:
     - 2560x1440, 1920x1080, 1440x900, 1366x768, 1280x720, 1024x768, 768x1024, 430x932, 390x844, 360x740, 320x568, 844x390.
     - 0 rolagem horizontal, 0 erros no console, alvos de toque >= 44px, zoom 200% sem quebra, dark mode e reduced motion intactos.

---

## 11. Etapa de SEO Local Concluída (Commit: `seo pronto`)

1. **Configuração Centralizada de Domínio (`seo.config.json`)**:
   - Arquivo único na raiz contendo:
     - `siteUrl`: `"https://www.mirolorestaurante.com.br"`
     - `domainConfigured`: `false` (sinalizando que o domínio oficial ainda aguarda publicação final em DNS/hospedagem).
     - Dados cadastrais auditados e confirmados exclusivamente do `CLIENTE.md` (endereço, telefone, coordenadas geográficas, horários confirmados e notas de precificação/reviews).

2. **Metadados Head, Localização & Mobile**:
   - `<title>` específico: `Mirolo Restaurante — O Almoço com Alma de Domingo | SBC`.
   - `<meta name="description">` factual e conciso com endereço, horário e telefone.
   - `<html lang="pt-BR">` e `<meta name="theme-color" content="#3C2212">`.
   - Geo-tags específicas para indexação regional:
     - `geo.region`: `BR-SP`
     - `geo.placename`: `São Bernardo do Campo`
     - `geo.position` e `ICBM`: `-23.693444, -46.554167`
   - Canonical e tags dependentes de domínio mantidas comentadas com instrução explícita de ativação para quando `domainConfigured: true`.

3. **Open Graph & Twitter Card (Composição Aprovada 1200x630)**:
   - Gerada via script Sharp (`scripts/generate-og-image.js`):
     - `site/assets/og-image.jpg` (1200x630, 100 KiB) e `site/assets/og-image.webp`.
     - Baseada na foto aprovada da feijoada em caldeirão de barro + bolinhos de espinafre sobre madeira rústica, sem texto minúsculo, com contraste aprimorado e logo Mirolo nítido.
   - Metatags `og:type` (`restaurant.restaurant`), `og:title`, `og:description`, `og:image`, `og:image:width`, `og:image:height`, `og:image:alt`.
   - Metatags `twitter:card` (`summary_large_image`), `twitter:title`, `twitter:description`, `twitter:image`.

4. **Dados Estruturados Schema.org (JSON-LD — Tipo `Restaurant`)**:
   - Tipo rigoroso `Restaurant` com 100% dos dados confirmados no `CLIENTE.md`:
     - Nome, telefone com DDI/DDD (`+55-11-2758-2354`), tipos de culinária (`servesCuisine`).
     - Endereço completo (`PostalAddress`: R. Esperico, 60, Jardim do Mar, SBC - SP, 09750-310).
     - Coordenadas geográficas (`GeoCoordinates`: lat -23.693444, long -46.554167).
     - Horários de funcionamento confirmados (`openingHoursSpecification`: Mo-Sa 11:30 às 15:00).
     - Comodidades confirmadas (`amenityFeature`: refeição no local, retirada na porta, entrega sem contato).
   - **Campos incertos / diretrizes de busca**:
     - Preço `R$ 40-60` (estimativa de frequentadores no Google Maps) não publicado como fixo; restaurante opera por quilo.
     - Avaliações de terceiros (nota 4.8 e 615 reviews do Google Maps) não inseridas como `aggregateRating` no schema próprio, em estrito cumprimento às diretrizes contra "self-serving reviews" do Google.

5. **Arquivos de Rastreamento & PWA/Favicons**:
   - `site/robots.txt`: padrão universal RFC 9309 (`User-agent: *`, `Allow: /`), com diretiva de Sitemap canônica comentada conforme dependência do domínio oficial em `seo.config.json`.
   - `site/sitemap.xml`: schema sitemap.org válido com `<loc>` apontando para a URL raiz com prioridade `1.0` e frequência `weekly`.
   - Favicons completos gerados em `scripts/generate-favicons.js`:
     - `site/favicon.ico` (multi-resolução 16/32/48)
     - `site/favicon-16x16.png` e `site/favicon-32x32.png`
     - `site/apple-touch-icon.png` (180x180)
     - `site/android-chrome-192x192.png` e `site/android-chrome-512x512.png`
     - `site/site.webmanifest`
   - Zero dependência externa, totalmente funcional localmente e em qualquer hospedagem.

6. **Hierarquia Semântica HTML & Acessibilidade de Imagens**:
   - Exatamente um `<h1>` no topo do Hero: `"Mirolo // O Almoço Com Alma de Domingo"`.
   - Quatro `<h2>` em ordem estritamente lógica pelas seções:
     1. `"O Caderno Secreto (Bolinho de Espinafre)"`
     2. `"O Buffet Colorido"`
     3. `"Prova Social Afetiva"`
     4. `"Localização, Horário e Reservas"` (utiliza `.visually-hidden` para estruturação semântica sem alterar o visual).
   - 100% das 11 imagens informativas possuem atributos `alt` minuciosos e descritivos em português.

7. **Resultados Lighthouse Auditados**:
   - **SEO**: **100 / 100** 🏆
   - **Accessibility**: **100 / 100** 🏆
   - **Best Practices**: **100 / 100** 🏆
   - **Performance**: Mantido de acordo com a otimização.
   - Validação em 12 viewports responsivos: 100% aprovado.

