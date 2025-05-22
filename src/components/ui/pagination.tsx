// src/components/ui/pagination.tsx
import type * as React from "react"

export function Pagination({ totalPages, currentPage, onPageChange, className = '', ...props }: {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  className?: string;
  [key: string]: unknown;
}) {
  if (totalPages <= 1) return null;

  // Lógica para mostrar até 5 páginas, com elipses
  let pages: (number | string)[] = [];
  if (totalPages <= 5) {
    pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else {
    if (currentPage <= 3) {
      pages = [1, 2, 3, 4, '...', totalPages];
    } else if (currentPage >= totalPages - 2) {
      pages = [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    } else {
      pages = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
    }
  }

  return (
    <nav role="navigation" aria-label="Paginação" className={`flex items-center gap-1 ${className}`} {...props}>
      <a
        className={`px-3 py-1 rounded transition-colors ${currentPage === 1 ? 'pointer-events-none opacity-50' : 'hover:bg-muted'}`}
        aria-label="Página anterior"
        href="#"
        onClick={e => {
          e.preventDefault();
          if (currentPage > 1) onPageChange(currentPage - 1);
        }}
      >
        &lt;
      </a>
      {pages.map((page, idx) =>
        page === '...'
          ? <span key={idx} className="px-2">...</span>
          : (
            <a
              key={page}
              className={`px-3 py-1 rounded transition-colors ${page === currentPage ? 'bg-primary text-white' : 'hover:bg-muted'}`}
              aria-current={page === currentPage ? 'page' : undefined}
              href="#"
              onClick={e => {
                e.preventDefault();
                if (typeof page === 'number' && page !== currentPage) onPageChange(page);
              }}
            >
              {page}
            </a>
          )
      )}
      <a
        className={`px-3 py-1 rounded transition-colors ${currentPage === totalPages ? 'pointer-events-none opacity-50' : 'hover:bg-muted'}`}
        aria-label="Próxima página"
        href="#"
        onClick={e => {
          e.preventDefault();
          if (currentPage < totalPages) onPageChange(currentPage + 1);
        }}
      >
        &gt;
      </a>
    </nav>
  );
}

export function PaginationContent({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul className="flex items-center gap-1" {...props}>
      {children}
    </ul>
  )
}

export function PaginationItem({ children, ...props }: React.LiHTMLAttributes<HTMLLIElement>) {
  return (
    <li {...props}>
      {children}
    </li>
  )
}

export function PaginationLink({ isActive, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { isActive?: boolean }) {
  return (
    <a
      className={`px-3 py-1 rounded ${isActive ? 'bg-primary text-white' : 'hover:bg-muted'} transition-colors`}
      aria-current={isActive ? 'page' : undefined}
      {...props}
    >
      {children}
    </a>
  )
}

export function PaginationPrevious(props: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a aria-label="Página anterior" {...props}>
      &lt;
    </a>
  )
}

export function PaginationNext(props: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a aria-label="Próxima página" {...props}>
      &gt;
    </a>
  )
}
