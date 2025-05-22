// ... existing code ... <parte inicial do arquivo>

// Adicionar o ícone Mail na lista de imports do lucide-react
import {
  // ... existing icons ... <outros ícones>
  Mail,
  // ... existing icons ... <outros ícones>
} from 'lucide-react';

// ... existing code ... <parte do arquivo com o array de links>

const adminLinks = [
  // ... existing links ... <links existentes>
  {
    title: 'Logs de Email',
    href: '/admin/email-logs',
    icon: <Mail className="h-5 w-5" />,
  },
  // ... existing links ... <outros links>
];

// ... existing code ... <resto do arquivo>
