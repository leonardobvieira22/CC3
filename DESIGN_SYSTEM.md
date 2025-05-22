# AI Crypto Trading Platform - Design System

Este documento serve como guia de referência para o sistema de design da plataforma AI Crypto Trading, garantindo consistência visual, acessibilidade e qualidade da experiência do usuário.

## Princípios de Design

- **Clareza**: Informações importantes devem ser facilmente identificáveis
- **Consistência**: Elementos similares devem se comportar de maneira similar
- **Acessibilidade**: A interface deve ser utilizável por pessoas com diferentes habilidades
- **Responsividade**: Adaptação a diferentes tamanhos de tela e dispositivos
- **Eficiência**: Minimizar o esforço necessário para completar tarefas

## Sistema de Cores

Nossa paleta de cores é definida usando variáveis CSS em HSL para maior flexibilidade e consistência entre temas claro e escuro.

### Cores Primárias

| Nome | Claro | Escuro | Uso |
|------|-------|--------|-----|
| `--primary` | `241 65% 59%` | `241 65% 59%` | Ações principais, destaque |
| `--secondary` | `198 80% 92%` | `217 33% 17%` | Seções alternadas, elementos secundários |
| `--accent` | `210 20% 97%` | `217 33% 17%` | Estados de hover, elementos interativos |

### Cores Semânticas

| Nome | Valor | Uso |
|------|-------|-----|
| `--success` | `142 76% 36%` | Confirmações, valores positivos, lucro |
| `--destructive` | `0 84% 60%` | Erros, alertas críticos, valores negativos, perdas |
| `--warning` | `38 92% 50%` | Avisos, atenção necessária |
| `--info` | `214 100% 60%` | Informações, dicas, ajuda |

### Cores Neutras

| Nome | Claro | Escuro | Uso |
|------|-------|--------|-----|
| `--background` | `0 0% 100%` | `222 14% 7%` | Fundo da página |
| `--foreground` | `222 14% 7%` | `0 0% 100%` | Texto principal |
| `--muted` | `210 20% 98%` | `217 33% 17%` | Áreas secundárias |
| `--muted-foreground` | `220 14% 48%` | `215 20% 75%` | Texto secundário |

### Uso Correto das Cores

```jsx
// ✅ Correto: Usando variáveis de cor
<Button className="bg-primary text-primary-foreground">
  Comprar
</Button>

// ❌ Incorreto: Usando valores hexadecimais fixos
<Button className="bg-[#5957D5] text-white">
  Comprar
</Button>
```

Para valores de lucro/perda:

```jsx
// ✅ Correto: Usando cores semânticas
<span className="text-success">+2.5%</span>
<span className="text-destructive">-1.8%</span>

// ❌ Incorreto: Usando valores fixos
<span className="text-green-500">+2.5%</span>
<span className="text-red-500">-1.8%</span>
```

## Tipografia

Usamos a família de fontes Inter com uma escala tipográfica responsiva.

### Hierarquia de Texto

| Elemento | Tamanho | Peso | Uso |
|----------|---------|------|-----|
| `h1` | `clamp(2rem, 5vw, 2.75rem)` | `600` | Título principal da página |
| `h2` | `clamp(1.75rem, 4vw, 2.25rem)` | `600` | Título de seção |
| `h3` | `clamp(1.5rem, 3vw, 1.75rem)` | `600` | Subtítulo de seção |
| `h4` | `clamp(1.25rem, 2.5vw, 1.5rem)` | `600` | Título de card |
| `h5` | `clamp(1.125rem, 2vw, 1.25rem)` | `600` | Título de elemento |
| `h6` | `clamp(1rem, 1.5vw, 1.125rem)` | `600` | Subtítulo de elemento |
| `p` | `1rem` | `400` | Texto geral |
| `small` | `0.875rem` | `400` | Informações secundárias |

### Recomendações

- Manter um bom contraste entre texto e fundo (mínimo 4.5:1 para texto normal)
- Evitar textos muito longos sem quebras ou espaçamento
- Usar peso adequado para enfatizar informações importantes
- Manter consistência no alinhamento (preferencialmente à esquerda para conteúdo longo)

## Componentes

Usamos componentes padronizados de shadcn/ui com algumas personalizações específicas.

### Botões

| Variante | Uso |
|----------|-----|
| `default` | Ação principal na interface |
| `secondary` | Ação secundária ou alternativa |
| `destructive` | Ação de remoção ou cancelamento |
| `outline` | Ação menos importante |
| `ghost` | Ação em menus ou barras de navegação |
| `link` | Navegação em texto |
| `success` | Confirmação ou ação positiva |
| `warning` | Ação que requer atenção |
| `info` | Ação informativa |

#### Variantes de Alto Contraste

Para melhorar a acessibilidade e legibilidade, temos variantes de alto contraste:

| Variante | Uso |
|----------|-----|
| `high-contrast` | Alto contraste base (texto branco em fundo preto ou inverso no modo escuro) |
| `high-contrast-outline` | Contorno de alto contraste (texto preto com borda preta, ou branco no modo escuro) |
| `high-contrast-primary` | Cor primária com melhor contraste e texto branco |
| `high-contrast-destructive` | Cor destrutiva com melhor contraste e texto branco |

```jsx
<Button>Ação principal</Button>
<Button variant="secondary">Ação secundária</Button>
<Button variant="destructive">Excluir</Button>

{/* Exemplos de alto contraste */}
<Button variant="high-contrast">Alto Contraste</Button>
<Button variant="high-contrast-outline">Contorno Contrastante</Button>
<Button variant="high-contrast-primary">Primário Contrastante</Button>
```

#### Modificador de Contraste

Você pode aplicar um modificador de contraste a qualquer variante para aumentar a legibilidade:

```jsx
<Button contrast="increased">Contraste Aumentado</Button>
<Button variant="destructive" contrast="maximum">Contraste Máximo</Button>
```

#### Tamanhos
- `default`: Tamanho padrão para a maioria dos casos
- `sm`: Para áreas com espaço limitado
- `lg`: Para chamadas à ação destacadas
- `icon`: Para botões que contêm apenas ícones

```jsx
<Button size="sm">Pequeno</Button>
<Button>Padrão</Button>
<Button size="lg">Grande</Button>
```

#### Pesos
- `default`: Peso médio (medium)
- `semibold`: Peso semi-negrito
- `bold`: Peso negrito

```jsx
<Button weight="semibold">Semi-negrito</Button>
<Button weight="bold">Negrito</Button>
```

### Cards

Usados para agrupar informações relacionadas.

```jsx
<Card>
  <CardHeader>
    <CardTitle>Título do Card</CardTitle>
    <CardDescription>Descrição do card</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Conteúdo principal */}
  </CardContent>
  <CardFooter>
    {/* Ações ou informações adicionais */}
  </CardFooter>
</Card>
```

### Formulários

Para garantir acessibilidade, sempre use:
- Labels explícitos para cada campo
- Descrições para explicar o propósito do campo
- Mensagens de erro claras

```jsx
<FormField
  control={form.control}
  name="email"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Email</FormLabel>
      <FormControl>
        <Input placeholder="seuemail@exemplo.com" {...field} />
      </FormControl>
      <FormDescription>
        Usamos seu email para login e recuperação de conta.
      </FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>
```

## Layouts e Espaçamento

### Grid System

Utilizamos Tailwind CSS para criar layouts responsivos:

```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
  {/* Itens do grid */}
</div>
```

### Breakpoints

| Nome | Tamanho | Uso |
|------|---------|-----|
| `sm` | `640px` | Tablets pequenos e celulares em landscape |
| `md` | `768px` | Tablets |
| `lg` | `1024px` | Laptops e desktops pequenos |
| `xl` | `1280px` | Desktops médios |
| `2xl` | `1536px` | Telas grandes |

### Espaçamento

Seguimos uma escala de espaçamento baseada em múltiplos de 4px:

| Classe | Valor | Uso |
|--------|-------|-----|
| `p-1`, `m-1` | `0.25rem` (4px) | Espaçamento mínimo |
| `p-2`, `m-2` | `0.5rem` (8px) | Espaçamento pequeno |
| `p-3`, `m-3` | `0.75rem` (12px) | Espaçamento médio-pequeno |
| `p-4`, `m-4` | `1rem` (16px) | Espaçamento padrão |
| `p-5`, `m-5` | `1.25rem` (20px) | Espaçamento médio |
| `p-6`, `m-6` | `1.5rem` (24px) | Espaçamento médio-grande |
| `p-8`, `m-8` | `2rem` (32px) | Espaçamento grande |
| `p-10`, `m-10` | `2.5rem` (40px) | Espaçamento muito grande |
| `p-12`, `m-12` | `3rem` (48px) | Espaçamento extra grande |

## Acessibilidade

### Princípios Básicos

1. **Contraste**: O texto deve ter contraste adequado com o fundo (WCAG AA - 4.5:1 para texto normal, 3:1 para texto grande)
2. **Navegação por Teclado**: Todos os elementos interativos devem ser acessíveis via teclado
3. **Atributos ARIA**: Usar atributos ARIA quando necessário para melhorar a acessibilidade
4. **Descrições**: Incluir descrições para elementos não-textuais

### Exemplos de Implementação

```jsx
// Botão acessível
<Button
  aria-label="Comprar Bitcoin"
  className="focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
>
  <CoinIcon className="mr-2" aria-hidden="true" />
  Comprar BTC
</Button>

// Input com label e descrição
<div>
  <Label htmlFor="amount" id="amount-label">Quantidade</Label>
  <Input
    id="amount"
    aria-labelledby="amount-label amount-description"
    type="number"
  />
  <p id="amount-description" className="text-sm text-muted-foreground">
    Insira a quantidade em USDT
  </p>
</div>
```

## Tema Escuro

Nosso sistema suporta tema claro e escuro. Para garantir boa experiência em ambos os temas:

1. **Não assumir tema**: Sempre usar as variáveis CSS para cores
2. **Testar contraste**: Verificar contraste em ambos os temas
3. **Evitar cores absolutas**: Não usar cores fixas que não se adaptem ao tema

```jsx
// ✅ Correto: Adaptável a ambos os temas
<div className="bg-card text-card-foreground">
  Conteúdo
</div>

// ❌ Incorreto: Não se adapta ao tema escuro
<div className="bg-white text-black">
  Conteúdo
</div>
```

## Regras de Estilização

1. **Preferir Utility Classes**: Usar classes utilitárias do Tailwind CSS sempre que possível
2. **Composição com `cn()`**: Usar a função `cn()` para compor classes condicionalmente
3. **Seletores Customizados**: Evitar seletores CSS customizados quando possível
4. **Consistência**: Manter o mesmo padrão de estilização em todo o projeto

```jsx
// Exemplo de composição com cn()
<button
  className={cn(
    "px-4 py-2 rounded-md",
    active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
    disabled && "opacity-50 cursor-not-allowed"
  )}
>
  Botão
</button>
```

## Considerações sobre Desempenho

1. **Lazy Loading**: Usar lazy loading para componentes pesados
2. **Responsividade Eficiente**: Evitar redimensionar imagens no cliente
3. **Animações Otimizadas**: Preferir animações via transform e opacity

---

## Recursos e Referências

- [Documentação do Tailwind CSS](https://tailwindcss.com/docs)
- [Componentes shadcn/ui](https://ui.shadcn.com/docs)
- [Diretrizes WCAG 2.1](https://www.w3.org/TR/WCAG21/)
- [Chakra UI Color Contrast Checker](https://chakra-ui.com/color-contrast-checker)

---

Este documento é um guia vivo e será atualizado conforme o sistema de design evolui.
