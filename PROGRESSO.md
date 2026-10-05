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
