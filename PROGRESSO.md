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

