import React from 'react';
import { Home, Calendar, Mail, ArrowRight } from 'lucide-react';
import { Button } from '../components/common/Button';

interface NotFoundPageProps {
  onNavigate: (path: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center space-y-6">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#F0F6F2] text-[#0E4D34]">
        <span className="font-serif text-xl font-bold">404</span>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
          Page Not Found
        </h1>
        <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
          The page you are looking for may have been moved, updated, or does not exist on the new Dawat-e-Islami Sheffield website.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Button
          variant="primary"
          size="md"
          onClick={() => onNavigate('/')}
          icon={<Home className="h-4 w-4" />}
          iconPosition="left"
        >
          Return Home
        </Button>
        <Button
          variant="outline"
          size="md"
          onClick={() => onNavigate('/events')}
          icon={<Calendar className="h-4 w-4" />}
          iconPosition="left"
        >
          View Events
        </Button>
        <Button
          variant="outline"
          size="md"
          onClick={() => onNavigate('/contact')}
          icon={<Mail className="h-4 w-4" />}
          iconPosition="left"
        >
          Contact Us
        </Button>
      </div>
    </div>
  );
};
