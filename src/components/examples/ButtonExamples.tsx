import React from "react";
import { Button } from "@/components/ui/button";

export default function ButtonExamples() {
  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Variantes de Botão Padrão</h2>
        <div className="flex flex-wrap gap-4">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button variant="success">Success</Button>
          <Button variant="warning">Warning</Button>
          <Button variant="info">Info</Button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Variantes de Alto Contraste</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="high-contrast">High Contrast</Button>
          <Button variant="high-contrast-outline">High Contrast Outline</Button>
          <Button variant="high-contrast-primary">High Contrast Primary</Button>
          <Button variant="high-contrast-destructive">High Contrast Destructive</Button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Modificadores de Contraste</h2>
        <div className="flex flex-wrap gap-4">
          <Button contrast="default">Contraste Normal</Button>
          <Button contrast="increased">Contraste Aumentado</Button>
          <Button contrast="maximum">Contraste Máximo</Button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Combinações de Variantes e Contraste</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="destructive" contrast="increased">
            Destructive + Increased
          </Button>
          <Button variant="primary" contrast="maximum">
            Primary + Maximum
          </Button>
          <Button variant="outline" contrast="increased">
            Outline + Increased
          </Button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Tamanhos</h2>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </Button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Pesos de Fonte</h2>
        <div className="flex flex-wrap gap-4">
          <Button weight="default">Default</Button>
          <Button weight="semibold">Semibold</Button>
          <Button weight="bold">Bold</Button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Botões Desabilitados</h2>
        <div className="flex flex-wrap gap-4">
          <Button disabled>Default Disabled</Button>
          <Button variant="high-contrast" disabled>
            High Contrast Disabled
          </Button>
          <Button variant="destructive" contrast="maximum" disabled>
            Combined Disabled
          </Button>
        </div>
      </div>
    </div>
  );
}