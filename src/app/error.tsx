'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-blue-dark px-4">
      <div className="text-center max-w-md">
        <AlertTriangle className="h-24 w-24 mx-auto text-amber-500 mb-6" />
        <h1 className="text-4xl font-bold mb-4">Algo deu errado</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Desculpe, ocorreu um erro ao processar sua solicitação. Nossa equipe foi notificada.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={reset} className="bg-blue-highlight hover:bg-blue-medium">
            Tentar novamente
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Voltar para o início</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
