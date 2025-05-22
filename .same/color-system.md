## Updated CSS Variables for globals.css

```css
@layer base {
  :root {
    --font-sans: 'Inter', sans-serif;

    --background: 0 0% 100%;
    --foreground: 222 14% 7%;

    --card: 0 0% 100%;
    --card-foreground: 222 14% 7%;

    --popover: 0 0% 100%;
    --popover-foreground: 222 14% 7%;

    --primary: 241 65% 59%;
    --primary-foreground: 0 0% 100%;

    --secondary: 198 80% 92%;
    --secondary-foreground: 241 65% 59%;

    --muted: 210 20% 98%;
    --muted-foreground: 220 14% 48%; /* Improved contrast */

    --accent: 210 20% 97%;
    --accent-foreground: 222 14% 7%;

    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 100%;

    /* New semantic colors */
    --success: 142 76% 36%;
    --success-foreground: 0 0% 100%;

    --warning: 38 92% 50%;
    --warning-foreground: 0 0% 100%;

    --info: 214 100% 50%;
    --info-foreground: 0 0% 100%;

    --border: 220 13% 91%;
    --input: 220 13% 91%;
    --ring: 224 71% 45%;

    --radius: 5px;
  }

  .dark {
    --background: 222 14% 7%;
    --foreground: 0 0% 100%;

    --card: 222 14% 7%;
    --card-foreground: 0 0% 100%;

    --popover: 222 14% 7%;
    --popover-foreground: 0 0% 100%;

    --primary: 241 65% 59%;
    --primary-foreground: 0 0% 100%;

    --secondary: 217 33% 17%;
    --secondary-foreground: 0 0% 100%;

    --muted: 217 33% 17%;
    --muted-foreground: 215 20% 70%; /* Improved contrast */

    --accent: 217 33% 17%;
    --accent-foreground: 0 0% 100%;

    --destructive: 0 63% 31%;
    --destructive-foreground: 0 0% 100%;

    /* New semantic colors in dark mode */
    --success: 142 76% 36%;
    --success-foreground: 0 0% 100%;

    --warning: 38 92% 50%;
    --warning-foreground: 0 0% 100%;

    --info: 214 100% 50%;
    --info-foreground: 0 0% 100%;

    --border: 217 33% 17%;
    --input: 217 33% 17%;
    --ring: 224 71% 45%;
  }
}
```

## Updated Tailwind Colors for tailwind.config.ts

```js
colors: {
  /* Unified color system using HSL values */
  primary: {
    DEFAULT: "hsl(var(--primary))",
    foreground: "hsl(var(--primary-foreground))",
  },
  secondary: {
    DEFAULT: "hsl(var(--secondary))",
    foreground: "hsl(var(--secondary-foreground))",
  },
  background: "hsl(var(--background))",
  foreground: "hsl(var(--foreground))",
  border: "hsl(var(--border))",
  input: "hsl(var(--input))",
  ring: "hsl(var(--ring))",
  destructive: {
    DEFAULT: "hsl(var(--destructive))",
    foreground: "hsl(var(--destructive-foreground))",
  },
  muted: {
    DEFAULT: "hsl(var(--muted))",
    foreground: "hsl(var(--muted-foreground))",
  },
  accent: {
    DEFAULT: "hsl(var(--accent))",
    foreground: "hsl(var(--accent-foreground))",
  },
  popover: {
    DEFAULT: "hsl(var(--popover))",
    foreground: "hsl(var(--popover-foreground))",
  },
  card: {
    DEFAULT: "hsl(var(--card))",
    foreground: "hsl(var(--card-foreground))",
  },
  /* Theme-specific semantic colors */
  success: {
    DEFAULT: "hsl(var(--success))",
    foreground: "hsl(var(--success-foreground))",
  },
  warning: {
    DEFAULT: "hsl(var(--warning))",
    foreground: "hsl(var(--warning-foreground))",
  },
  info: {
    DEFAULT: "hsl(var(--info))",
    foreground: "hsl(var(--info-foreground))",
  },
},
```

## Updated Custom Components Section (To Replace ms-* classes)

```css
@layer components {
  /* Standardized component styles compatible with shadcn/ui */
  .app-header {
    @apply sticky top-0 z-50 w-full border-b border-border bg-background py-4;
  }

  .app-container {
    @apply container mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-xl;
  }

  .app-section {
    @apply py-16 md:py-24;
  }

  .app-section-alt {
    @apply bg-secondary py-16 md:py-24;
  }

  .app-card {
    @apply bg-card rounded-md border border-border shadow-sm overflow-hidden transition-shadow hover:shadow-md;
  }

  .app-feature-icon {
    @apply h-12 w-12 rounded-full bg-secondary p-2.5 text-primary;
  }

  /* Typography in app style */
  .app-title {
    @apply text-4xl font-semibold leading-tight tracking-tight text-foreground;
  }

  .app-subtitle {
    @apply text-xl text-muted-foreground mt-4 mb-8 max-w-2xl;
  }

  .app-badge {
    @apply inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground;
  }
}
```

## Responsive Trading Panel Updates

```jsx
// Layout for main trading view - add sm and md breakpoints
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
  {/* Gráfico - responsive sizing */}
  <div className="sm:col-span-2 md:col-span-2 lg:col-span-3 space-y-4 md:space-y-6">
    {/* Chart container with responsive height */}
    <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]" ref={chartContainerRef}></div>
  </div>
</div>

// Responsive table container
<div className="overflow-x-auto -mx-4 sm:mx-0">
  <div className="inline-block min-w-full align-middle">
    <table className="min-w-full">
      {/* table content */}
    </table>
  </div>
</div>
```

## Color Standardization Examples

Replace:
```jsx
<div className={`text-green-500`}>Positive</div>
<div className={`text-red-500`}>Negative</div>
```

With:
```jsx
<div className={`text-success`}>Positive</div>
<div className={`text-destructive`}>Negative</div>
```

Replace:
```jsx
<div className="border-blue-highlight"></div>
<div className="bg-blue-highlight"></div>
```

With:
```jsx
<div className="border-info"></div>
<div className="bg-info/10"></div>
```