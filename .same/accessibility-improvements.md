# Melhorias de Acessibilidade - Contraste de Texto

## Resumo das Melhorias

Foram realizadas várias correções no contraste de texto em toda a página inicial do site para garantir melhor legibilidade e acessibilidade para todos os usuários, especialmente aqueles com deficiências visuais. As correções seguem as diretrizes WCAG (Web Content Accessibility Guidelines) para garantir contraste adequado entre texto e fundo.

## Problemas Identificados

1. **Textos com contraste insuficiente**: Diversos textos na página inicial estavam usando classes como `text-gray-700` (no tema claro) e `text-gray-200` (no tema escuro) que não forneciam contraste suficiente contra o fundo, tornando o texto difícil de ler.

2. **Inconsistência de cores**: Algumas seções usavam diferentes tons de cinza, criando uma experiência visual inconsistente.

3. **Problemas com tema escuro**: Particularmente no tema escuro, vários textos se tornavam quase invisíveis devido ao contraste insuficiente.

## Soluções Implementadas

### 1. Uso de Classes de Texto com Alto Contraste

Substituímos as classes específicas de cor com contraste insuficiente por classes semânticas consistentes:

```diff
- <p className="text-gray-700 dark:text-gray-200">
+ <p className="text-high-contrast dark:text-high-contrast">
```

As classes `text-high-contrast` e `text-medium-contrast` foram definidas no arquivo `globals.css` para garantir que:
- No tema claro, o texto seja suficientemente escuro
- No tema escuro, o texto seja suficientemente claro

### 2. Consistência Visual

Padronizamos as classes de texto em todos os componentes para garantir uma experiência visual consistente:

- Títulos principais: `text-foreground` (contraste máximo)
- Textos de parágrafo: `text-high-contrast`
- Textos secundários: `text-medium-contrast`

### 3. Componentes Corrigidos

Os seguintes componentes foram atualizados para melhorar o contraste:

1. **HowItWorks.tsx**: Seção "Como funciona nossa plataforma"
2. **Testimonials.tsx**: Seção "O que nossos traders dizem"
3. **Partners.tsx**: Seção "Parceiros de Confiança"
4. **FAQ.tsx**: Seção "Perguntas Frequentes"
5. **CTA.tsx**: Seção de chamada para ação
6. **Footer.tsx**: Rodapé do site

## Benefícios das Melhorias

1. **Maior legibilidade**: Textos agora são claramente legíveis em ambos os temas (claro e escuro).
2. **Conformidade com WCAG**: As alterações ajudam a atingir conformidade com os níveis AA e AAA das diretrizes WCAG.
3. **Experiência universal**: Melhora a experiência para todos os usuários, incluindo aqueles com baixa visão ou que utilizam o site em condições de iluminação desafiadoras.
4. **Consistência visual**: Cria uma hierarquia visual mais clara e consistente em todo o site.

## Recomendações Futuras

Para continuar melhorando a acessibilidade do site, recomendamos:

1. **Teste com usuários reais**: Realizar testes com usuários que possuem diferentes necessidades de acessibilidade.
2. **Auditoria de acessibilidade completa**: Verificar outros aspectos de acessibilidade como navegação por teclado, textos alternativos em imagens, etc.
3. **Documentação de design**: Atualizar a documentação de design para incluir diretrizes de contraste para desenvolvedores.
4. **Testes automáticos**: Implementar testes automatizados de contraste como parte do processo de CI/CD.

## Classes de Contraste Utilizadas

A seguir, as definições das classes de contraste usadas:

```css
/* Em globals.css */
@layer components {
  /* Estilos específicos para melhorar legibilidade de texto */
  .text-high-contrast {
    @apply text-foreground font-medium;
  }

  .text-medium-contrast {
    @apply text-muted-foreground font-medium;
  }
}
```

Estas classes utilizam as variáveis de cor definidas no sistema de tema, garantindo que o contraste seja mantido independentemente do tema (claro ou escuro) que o usuário escolher.
