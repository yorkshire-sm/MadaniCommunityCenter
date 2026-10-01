import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  return (
    <nav aria-label="Breadcrumb" className={`text-xs text-stone-500 py-3 ${className}`}>
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <a
            href="/"
            onClick={(e) => {
              if (items[0]?.onClick) {
                e.preventDefault();
                items[0].onClick();
              }
            }}
            className="flex items-center gap-1 hover:text-[#0E4D34] transition-colors"
          >
            <Home className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="sr-only">Home</span>
          </a>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-1.5">
              <ChevronRight className="h-3 w-3 text-stone-400 shrink-0" aria-hidden="true" />
              {isLast || (!item.href && !item.onClick) ? (
                <span className="font-medium text-stone-800 truncate max-w-[200px]" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <a
                  href={item.href || '#'}
                  onClick={(e) => {
                    if (item.onClick) {
                      e.preventDefault();
                      item.onClick();
                    }
                  }}
                  className="hover:text-[#0E4D34] transition-colors truncate max-w-[180px]"
                >
                  {item.label}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
