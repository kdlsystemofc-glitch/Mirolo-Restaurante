# DESIGN.md — Mirolo Restaurante
> Gerado em 2026-10-02. Leitura pré-código: obrigatória antes de tocar em HTML/CSS.

---

## a) Leitura honesta do mockup vs. realidade

### O que o mockup INVENTOU (não usar no site)

| Elemento no mockup | Realidade |
|--------------------|-----------|
| **Foto hero**: feijoada em panela de barro com torresmo, gomos de laranja e bolinhos verdes — composição impecável sobre fundo neutro | **Stock image** de banco. Nenhuma foto real do acervo mostra esse arranjo de estúdio. A feijoada real existe (`imgi_54`) mas é no buffet em cuba, sem laranja nem apresentação. |
| **Bolinhos de espinafre fumegantes** (seção 2) | **Stock image**. Os bolinhos existem no restaurante (citados em 26+ menções no Google), mas nenhuma foto real os mostra. |
| **Logo no mockup**: versão vetorial clean, laureira branca sobre fundo transparente | **Real** — idêntico ao logo do cliente (`imgi_2`), porém o arquivo é JPG 80×80 px em fundo preto, muito pequeno para uso em alta qualidade. Precisa de versão PNG sem fundo. |
| **Slogan**: "MIROLO // O ALMOÇO COM ALMA DE DOMINGO" | **Inventado** pelo designer. Sem confirmação do cliente. O texto real nos banners da fachada é "Comida Caseira — Venha Experimentar". Usar como placeholder comentado. |
| **"Receita do chef"** (cadernos, ingredientes, caligrafia) | **Placeholder / lorem ipsum traduzido**. O texto das receitas é gibberish ("Creito de espinafre ou tem candaie"). Nada pode ir ao ar. |
| **Avaliações** nas notinhas (seção 4) | O texto das 3 avaliações no mockup é falso. Existem avaliações reais no CLIENTE.md (Kelly Petrussi, João Vitor Malafaia, Maria Fernanda Lisauskas) — usar essas. |
| **Telefone no footer** do mockup: `(61) 237-8823` | **Errado**. Dado real: `(11) 2758-2354`. |
| **"Chef Robson D'Vieira"** assinando receitas fictícias | O chef é real (nome aparece bordado no jaleco em todas as fotos). O uso da assinatura em texto inventado é problemático — usar apenas como atribuição de foto real. |
| **Ambiente** do mockup: fundo bege clean, sem refrigeradores | A realidade mostra salão funcional com geladeiras expostas, banners de marca, TV, sinalizações. O ambiente é acolhedor mas não é a estética minimalista do mockup. |
| **"26+ Menções no Google"** no crachá verde | Dado verificável no CLIENTE.md (palavra-chave "espinafre" com 26 menções). Pode usar. |
| **"4.8 Google stars" e "615 reviews"** | **Real** — confirmado no CLIENTE.md. |

### O que o mockup ACERTOU (manter)
- Paleta quente terrosa com tipografia display serifada/script
- Estrutura em 4 seções + footer
- Decoração "caderno/receita" como conceito narrativo
- Carimbo "SOBREMESA CORTESIA" e "RECEITA DO CHEF" como elementos de prova social visual
- Horário "Almoço das 11:30 às 15:00" — confirmado na fachada real (`imgi_22`, `imgi_35`)
- Endereço "R. Esperico, 60 – Jardim do Mar, SBC" — confirmado no CLIENTE.md

---

## b) Paleta em HEX — amostrada do mockup

| Token CSS | HEX | Papel | Contraste vs. branco | Contraste vs. preto | Status WCAG AA |
|-----------|-----|-------|---------------------|---------------------|----------------|
| `--c-cream` | `#F5EDD8` | Fundo hero / geral | 1.10:1 | 17.08:1 | ✅ texto preto |
| `--c-brown-dark` | `#5C2D0E` | Texto display, botões | 15.73:1 | 1.33:1 | ✅ texto branco |
| `--c-brown-mid` | `#8B4513` | Acentos, links hover | 10.78:1 | 1.95:1 | ✅ texto branco |
| `--c-gold` | `#C8882A` | Decorativo, bordas de selo | 3.53:1 | 5.95:1 vs preto | ⚠️ só decorativo |
| `--c-gold-text` | `#8B5E10` | Versão corrigida p/ texto | 6.91:1 vs cream | — | ✅ corrigido |
| `--c-olive` | `#4A5C1A` | Verde accent (bolinhos) | 9.94:1 | 2.11:1 | ✅ texto branco |
| `--c-red-stamp` | `#B22222` | Carimbo "CORTESIA" | 11.99:1 | 1.75:1 | ✅ texto branco |
| `--c-paper` | `#FFF9F0` | Fundo cartões/cadernos | 1.03:1 vs branco | 20.00:1 vs preto | ✅ texto preto |
| `--c-text-body` | `#2C1A0E` | Corpo de texto | 18.23:1 | — | ✅ |

**Correção WCAG**: `#C8882A` sobre `#F5EDD8` = 2.27:1 — reprova AA. Token separado `--c-gold-text: #8B5E10` para qualquer ouro sobre texto. `#C8882A` apenas em bordas e elementos não-textuais.

---

## c) Tipografia — 2 candidatas por papel

### Display / Headline grande
| Candidata | Decisão |
|-----------|---------|
| **Playfair Display** | Descartada — mais genérica |
| **Cormorant Garamond** ✅ | **Escolhida.** Traço fino dramático, caráter mais quente. Case ALL CAPS funciona como o mockup. |

`--font-display: 'Cormorant Garamond', Georgia, serif`

### Script / Caligrafia (assinaturas, "Receita do Chef")
| Candidata | Decisão |
|-----------|---------|
| **Dancing Script** | Descartada — legível mas genérica |
| **Great Vibes** ✅ | **Escolhida.** Mais fluida, reproduz bem a caligrafia do mockup. Usar apenas em ≥ 2rem. |

`--font-script: 'Great Vibes', cursive`

### Body / UI
`--font-body: 'Lato', system-ui, sans-serif` (pesos 300/400)
*CLAUDE.md proíbe Inter/Roboto/Arial. Lato tem personalidade própria e boa neutralidade.*

---

## d) Tabela de camadas por seção

| Seção | Fundo | Decorativo | Foto real | Plate gerado |
|-------|-------|------------|-----------|--------------|
| **01 Hero** | CSS `--c-cream` | SVG: grão de papel + fita adesiva CSS | Logo (PNG limpo) + foto hero | Plate 1 (feijoada) se foto real insuficiente |
| **02 Bolinho** | CSS `--c-cream` leve | CSS/SVG: borda caderno espiral + papel pautado | Nenhuma disponível | Plate 2 (bolinho espinafre) obrigatório |
| **03 Buffet** | CSS `#2C1A0E` escuro | — | 3–4 fotos do cliente em polaroid CSS | — |
| **04 Depoimentos** | CSS `--c-paper` | SVG: linhas de notinha horizontal | Foto chef como avatar | — |
| **05 Footer** | CSS `--c-brown-dark` | SVG: laureira inline | — | — |

---

## e) Reinterpretação de elementos decorativos como CSS/SVG

### 1. Fita adesiva ("tape")
```css
.tape {
  display: block; width: 60px; height: 22px;
  background: rgba(212,169,106,0.55);
  border-radius: 2px;
  transform: rotate(-4deg);
  position: absolute; top: -10px; left: 50%; translate: -50% 0;
  box-shadow: inset 0 0 0 1px rgba(0,0,0,0.06);
}
```

### 2. Papel pautado (caderno de receitas)
```css
.recipe-card {
  background-color: var(--c-paper);
  background-image: repeating-linear-gradient(
    transparent, transparent 27px, #D4C9B0 27px, #D4C9B0 28px
  );
  background-size: 100% 28px;
  border-radius: 4px;
  box-shadow: 2px 4px 12px rgba(44,26,14,0.18);
}
```

### 3. Carimbo ("SOBREMESA CORTESIA" / "RECEITA DO CHEF")
```css
.stamp {
  display: inline-block;
  border: 3px solid var(--c-red-stamp);
  color: var(--c-red-stamp);
  font-family: var(--font-display);
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 6px 10px;
  transform: rotate(-8deg);
  opacity: 0.88;
  border-radius: 3px;
  font-size: clamp(0.7rem, 2vw, 1rem);
}
```

### 4. Grão de papel (textura hero — SVG filter)
```html
<svg style="display:none"><filter id="grain">
  <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
  <feColorMatrix type="saturate" values="0"/>
  <feBlend in="SourceGraphic" mode="multiply"/>
</filter></svg>
```
```css
.hero::before { content:''; inset:0; position:absolute;
  filter:url(#grain); opacity:0.04; pointer-events:none; }
```

### 5. Espiral de caderno (seção 02 — SVG inline)
```svg
<svg viewBox="0 0 20 320" width="20" aria-hidden="true">
  <!-- repetir: círculo a cada 32px de altura -->
  <circle cx="10" cy="16" r="8" fill="none" stroke="#8B7355" stroke-width="2"/>
  <circle cx="10" cy="48" r="8" fill="none" stroke="#8B7355" stroke-width="2"/>
  <!-- ... até preencher a altura do card -->
</svg>
```

---

## f) Especificação de animação por seção (fase motion)

> Regra CLAUDE.md: elementos contínuos de fundo NÃO animam. Só camadas-folha.

| Seção | Elemento | Animação | Duração | Trigger |
|-------|----------|----------|---------|---------|
| 01 Hero | `h1` | `opacity 0→1` + `translateY(24px→0)` | 600ms ease-out, delay 200ms | após load |
| 01 Hero | Foto hero | `opacity 0→1` + `scale(0.97→1)` | 800ms, delay 100ms | após load |
| 01 Hero | Carimbo "CORTESIA" | `scale(0→1)` + `rotate(-8deg)` | 400ms mola, delay 900ms | após load |
| 02 Bolinho | Foto bolinho | `translateX(-40px→0)` + `opacity 0→1` | 600ms | IntersectionObserver |
| 02 Bolinho | Caderno receita | `translateX(40px→0)` + `opacity 0→1` | 600ms, delay 150ms | IntersectionObserver |
| 02 Bolinho | Badge "26+ Menções" | `scale(0→1)` mola | delay 700ms | IntersectionObserver |
| 03 Buffet | Cards polaroid | `translateY(30px→0)` + `opacity 0→1`, escalonado 100ms×índice | 500ms each | IntersectionObserver |
| 03 Buffet | Hover em card | `scale(1→1.03)` + `rotate(±1deg)` | 250ms ease | :hover |
| 04 Depoimentos | Notinhas | `opacity 0→1` | 500ms | IntersectionObserver |
| 04 Depoimentos | Contador "615 reviews" | count 0→615 | 1.2s | IntersectionObserver |
| 05 Footer | — | Sem animação | — | — |

---

## g) PLANO DE IMAGENS

### Slots por seção

| Slot | Seção | Tipo | Arquivo | Ação |
|------|-------|------|---------|------|
| Logo nav/footer | Todas | FOTO REAL | `imgi_2` | Ajuste C: remover fundo preto → PNG transparente |
| Hero food | 01 | PLATE GERADO¹ | — | Prompt PLATE 1 |
| Bolinho espinafre | 02 | PLATE GERADO | — | Prompt PLATE 2 (obrigatório) |
| Chef + merengue morango | 02/04 | FOTO REAL | `imgi_13` | Ajuste A: remover logo+endereço |
| Chef fachada braços abertos | 01 ou 03 | FOTO REAL | `imgi_35` | Ajuste A |
| Chef braços cruzados (marrom) | 04 avatar | FOTO REAL | `imgi_41` | Ajuste A |
| Chef braços cruzados (exterior azul) | 04 avatar alt | FOTO REAL | `imgi_18` | Sem overlay ✅ direto |
| Chef com merengue (salão) | 02 ou 04 | FOTO REAL | `imgi_57` | Sem overlay ✅ direto |
| Buffet salada colorida | 03 | FOTO REAL | `imgi_21` | Ajuste A |
| Buffet quentes (torresmo/frango) | 03 | FOTO REAL | `imgi_43` | Ajuste A |
| Interior salão | 03/Sobre | FOTO REAL | `imgi_28` | Ajuste A |
| Fachada externa | Footer/Sobre | FOTO REAL | `imgi_22` | Ajuste A |
| Sobremesas (copa/gelatinas) | 04 | FOTO REAL | `imgi_40` | Ajuste A |
| Feijoada em bandeja | Hero alt | FOTO REAL | `imgi_34` | Ajuste A + Ajuste B (brilho) |
| Prato completo feijoada | 01 hero (opção 2) | FOTO REAL | `imgi_54` | Ajuste A |
| Prato montado (frango+bolinho) | 02 alt | FOTO REAL | `imgi_56` | Ajuste A |

¹ *Priorizar foto real tratada (`imgi_54` ou `imgi_34`). O plate é fallback se o resultado do tratamento for insuficiente.*

---

### PROMPTS PRONTOS — Plates a gerar

#### PLATE 1 — Hero food (fallback se foto real insuficiente)
```
Top-down food photograph on warm cream linen background. Brazilian feijoada served in a traditional clay pot (panela de barro), dark black bean stew with cuts of beef and linguiça sausage visible. Beside it: a small white plate with golden pork torresmo (crispy crackling), and on the right a white ceramic plate with 3 round dark-green spinach balls (bolinhos de espinafre). No orange slices, no garnish. Warm amber studio lighting, shallow depth of field, no people, no text, no logos, no watermarks, photorealistic. Aspect ratio 4:3. High resolution.
```

#### PLATE 2 — Bolinho de espinafre (obrigatório — sem foto real disponível)
```
Close-up food photograph of 2–3 Brazilian spinach balls (bolinhos de espinafre) on a dark rustic wooden board. Balls are dark green, slightly crispy exterior, one cut open revealing bright green interior. Light steam rising. Warm golden-hour side lighting, shallow depth of field, bokeh background. No text, no logos, no watermarks, no hands, no people. Square format 1:1. Photorealistic, high resolution.
```

---

### PROMPTS PRONTOS — Ajustes em fotos reais

#### Ajuste A — Remover logo+endereço (13 fotos)
```
[ANEXAR FOTO]. Remove the white logo "MIROLO RESTAURANTE" and the address text "R. Esperico, 60 · Jardim do Mar, São Bernardo do Campo · SP" from the lower-left corner of the image. Fill the removed area with the surrounding background seamlessly, matching colors, lighting and texture. Keep everything else in the image exactly identical — same food, same colors, same composition, same lighting. No other changes.
```
Aplicar em: `imgi_13`, `imgi_21`, `imgi_22`, `imgi_28`, `imgi_29`, `imgi_34`, `imgi_35`, `imgi_40`, `imgi_41`, `imgi_43`, `imgi_54`, `imgi_55`, `imgi_56`.

#### Ajuste B — Brilho feijoada em bandeja (`imgi_34`)
```
[ANEXAR imgi_34_624655874_18051068279478024_2942430752113811458_n.jpg]. This is a photo of beef and black bean feijoada in a steel buffet tray. The image is too dark. Increase overall brightness by approximately +25% and add a subtle warm fill light from the upper left to make the dish look more appetizing and visible. Keep all shapes, textures, colors and composition identical. No other changes. No text, no logos.
```

#### Ajuste C — Logo sem fundo (`imgi_2`)
```
[ANEXAR imgi_2_274182972_1298079214020458_4652549069801418602_n.jpg]. Remove the solid black background from this logo image. Keep the white crown/laurel wreath, white cutlery icon, and white text "MIROLO" and "RESTAURANTE" exactly as they are, with all their details preserved. Output: PNG with transparent background. No other changes to the logo artwork.
```

---

## h) PERGUNTAS PARA VOCÊ (máximo 5)

1. **Slogan oficial**: "O Almoço com Alma de Domingo" é invenção do designer. Aprovo como está, substituo por "Comida Caseira — Venha Experimentar" (texto real da fachada), ou pede aprovação do cliente antes de fechar?

2. **Foto hero**: priorizo foto real tratada (`imgi_54` prato feijoada, ou `imgi_34` buffet) mesmo sem apresentação de estúdio — ou aceito o plate gerado (mais polido, mas não é do restaurante) como opção principal?

3. **Seção "Caderno Secreto"**: o mockup lista ingredientes fictícios do bolinho. Para o site real, transformo em depoimentos Google sobre o bolinho (sem lista de ingredientes), ou mantemos a ideia de receita parcial — e se sim, o cliente fornece os ingredientes reais?

4. **WhatsApp**: o botão CTA principal leva para WhatsApp. O número não está no CLIENTE.md. Uso `(11) 2758-2354` (telefone fixo) como fallback com link `tel:`, ou deixo o botão desabilitado (comentado) até o cliente fornecer o WA?

5. **Segunda unidade "Mirolo Kennedy"**: menciono no site (link ou rodapé) ou é site exclusivo da unidade R. Esperico, 60?

---

## i) PENDÊNCIAS-CLIENTE

| Item | Bloqueio | Impacto |
|------|----------|---------|
| Logo PNG fundo transparente (≥ 400px) | Não bloqueia construção | Bloqueia publicação com logo de qualidade |
| WhatsApp para reservas | Não bloqueia construção | Botão CTA fica com fallback `tel:` |
| Slogan oficial aprovado | Não bloqueia construção | Placeholder comentado no HTML |
| Nome exato do chef | Não bloqueia | Risco de erro de grafia no site |
| Self-service por kg ou preço fixo? | Não bloqueia | Afeta copy da seção de benefícios |
| Horário sábado e feriados | Não bloqueia | Horário no hero e footer |
| Segunda unidade: incluir no site? | Não bloqueia | Pode mudar estrutura de nav |
| Autorização de uso das avaliações do Google (nomes e textos) | Não bloqueia construção | Bloqueia publicação da seção de depoimentos |
| Autorização de uso da assinatura do chef | Não bloqueia construção | Bloqueia assinatura nas seções |

### Mensagem pronta para o cliente

---

**Assunto: Informações para o site do Mirolo 🍽️**

Olá! Estamos avançando bem no site. Para não travar a publicação, precisamos de alguns dados da sua parte. Não é urgente para a construção, mas será necessário antes de colocar o site no ar:

1. **Logo em PNG** (fundo transparente, qualidade alta). O arquivo atual que temos é muito pequeno. Você tem o logo em formato editável (AI, SVG ou PNG grande)?

2. **WhatsApp para reservas**: qual número devo colocar no botão "Reservar pelo WhatsApp"? É o mesmo `(11) 2758-2354` ou tem outro?

3. **Slogan**: o designer sugeriu _"O Almoço com Alma de Domingo"_. Gosta? Quer mudar? Ou prefere usar _"Comida Caseira — Venha Experimentar"_ (que já está nos seus banners)?

4. **Sistema de cobrança**: o restaurante é self-service **por kg** ou tem **preço fixo** por pessoa (o Google mostra "R$40–60 por pessoa")?

5. **Horários completos**: funciona de segunda a sábado, 11h30 às 15h00? Tem funcionamento em domingos ou feriados?

6. **Segunda unidade (Mirolo Kennedy)**: quer que o site mencione essa unidade também?

7. **Nome do Chef**: confirma que o nome correto é **Robson D'Vieira**?

Muito obrigado! Qualquer dúvida, é só chamar. 🙏

---

## Referências de arquivo — mapa rápido

| Apelido | Arquivo completo |
|---------|-----------------|
| `imgi_2` | `imgi_2_274182972_1298079214020458_4652549069801418602_n.jpg` |
| `imgi_13` | `imgi_13_426473415_18293013925156792_2849356420887757564_n.jpg` |
| `imgi_18` | `imgi_18_432929647_18296247661156792_3109168439601538929_n.jpg` |
| `imgi_20` | `imgi_20_628001472_18313793359267676_6534684116578174177_n.jpg` |
| `imgi_21` | `imgi_21_625107992_18108351715731418_7739018170723431962_n.jpg` |
| `imgi_22` | `imgi_22_625161118_18095033722763031_1602180985124637657_n.jpg` |
| `imgi_28` | `imgi_28_627351638_18110683411659322_5985189417989454614_n.jpg` |
| `imgi_29` | `imgi_29_625051476_18077828909523574_6708818536144606952_n.jpg` |
| `imgi_34` | `imgi_34_624655874_18051068279478024_2942430752113811458_n.jpg` |
| `imgi_35` | `imgi_35_624208552_18076400957615897_6605636491068263743_n.jpg` |
| `imgi_40` | `imgi_40_626416011_18084567193942648_8403504670851462413_n.jpg` |
| `imgi_41` | `imgi_41_623358524_18100918831677251_8316788417836461602_n.jpg` |
| `imgi_43` | `imgi_43_623294700_17990538785916250_2897129099803608199_n.jpg` |
| `imgi_54` | `imgi_54_367987946_18268671025156792_4376307858334298288_n.jpg` |
| `imgi_55` | `imgi_55_366349716_18267751780156792_5361211678426016712_n.jpg` |
| `imgi_56` | `imgi_56_365745621_18267495133156792_2806336237399416339_n.jpg` |
| `imgi_57` | `imgi_57_361169282_18264153472156792_2624378100428075689_n.jpg` |
| `imgi_58` | `imgi_58_360084081_18263868412156792_8523820527212567824_n.jpg` |
