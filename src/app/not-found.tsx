import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-blue-dark px-4">
      <div className="text-center max-w-md">
        <AlertCircle className="h-24 w-24 mx-auto text-blue-highlight mb-6" />
        <h1 className="text-4xl font-bold mb-4">Página não encontrada</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          A página que você está procurando não existe ou foi movida para outro endereço.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-blue-highlight hover:bg-blue-medium">
            <Link href="/">Voltar para o início</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard">Ir para Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
