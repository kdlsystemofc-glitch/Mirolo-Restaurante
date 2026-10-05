# DEPLOY.md — Guia de Cabeçalhos e Otimização para Servidores de Produção

Este documento especifica os cabeçalhos HTTP recomendados para servir o site **Mirolo Restaurante** em ambientes de produção de alta performance, de forma agnóstica a provedor de hospedagem (Nginx, Apache, Caddy, Cloudflare, AWS CloudFront, etc.).

---

## 1. Estratégia de Cache por Tipo de Arquivo

### 1.1 Documento Principal (HTML)
- **Caminho**: `/index.html`
- **Cabeçalho**:
  ```http
  Cache-Control: public, max-age=0, must-revalidate
  ETag: W/"<hash-da-versao>"
  ```
- **Racional**: Garante que os usuários sempre recebam as atualizações de conteúdo imediatamente após o deploy, utilizando validação `304 Not Modified` via ETag para evitar re-download desnecessário de bytes.

---

### 1.2 Fontes Locais (WOFF2)
- **Caminhos**: `/fonts/*.woff2`
- **Cabeçalho**:
  ```http
  Cache-Control: public, max-age=31536000, immutable
  Access-Control-Allow-Origin: *
  ```
- **Racional**: Fontes tipográficas locais nunca sofrem alteração sem alteração de nome de arquivo. Devem ser cacheadas agressivamente por 1 ano (`31.536.000s`) no navegador e em bordas de CDN, com a flag `immutable` para dispensar revalidação.

---

### 1.3 Imagens e Texturas (WebP, PNG, SVG)
- **Caminhos**: `/assets/*.webp`, `/assets/*.png`, `/assets/*.svg`
- **Cabeçalho**:
  ```http
  Cache-Control: public, max-age=31536000, immutable
  ```
- **Racional**: Imagens com degraus de resolução (`-480.webp`, `-800.webp`, `-1600.webp`) são estáticas e se beneficiam do cache máximo de 1 ano.

---

### 1.4 Estilos e Scripts Minificados (CSS e JS)
- **Caminhos**: `/style.min.css`, `/js/*.min.js`, `/vendor/*.min.js`
- **Cabeçalho**:
  ```http
  Cache-Control: public, max-age=2592000, stale-while-revalidate=86400
  ```
- **Racional**: Cache de 30 dias com `stale-while-revalidate` de 24 horas, permitindo que a CDN sirva a versão em cache imediatamente enquanto atualiza em segundo plano se houver deploy recente. (Caso a pipeline adicione hash no nome do arquivo, alterar para `max-age=31536000, immutable`).

---

## 2. Compressão e Codificação de Rede

- **Brotli (`br`)**: Prioridade máxima para arquivos de texto:
  - `text/html`, `text/css`, `application/javascript`, `image/svg+xml`.
- **Gzip**: Fallback automático para clientes sem suporte a Brotli.
- **Exceções de compressão**:
  - **NÃO** recomprimir arquivos `.webp`, `.png` e `.woff2`. Esses formatos já utilizam compressão interna otimizada (Huffman / Brotli nativo em WOFF2), e aplicar gzip/brotli sobre eles apenas gasta ciclos de CPU sem reduzir bytes.

---

## 3. Cabeçalhos de Segurança Recomendados

```http
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), camera=(), microphone=(), payment=()
Content-Security-Policy: default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; font-src 'self'; script-src 'self';
```

---

## 4. Exemplos Práticos de Configuração

### Nginx (`nginx.conf`)
```nginx
# HTML
location = /index.html {
    add_header Cache-Control "public, max-age=0, must-revalidate";
}

# Assets estáticos imutáveis
location ~* \.(woff2|webp|png|jpg|jpeg|svg)$ {
    expires 1y;
    add_header Cache-Control "public, max-age=31536000, immutable";
    access_log off;
}

# CSS e JS
location ~* \.(css|js)$ {
    expires 30d;
    add_header Cache-Control "public, max-age=2592000, stale-while-revalidate=86400";
}
```

### Caddy (`Caddyfile`)
```caddy
@static {
    path *.woff2 *.webp *.png *.svg
}
header @static Cache-Control "public, max-age=31536000, immutable"

@code {
    path *.css *.js
}
header @code Cache-Control "public, max-age=2592000, stale-while-revalidate=86400"
```
