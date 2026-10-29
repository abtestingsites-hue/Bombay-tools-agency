import React, { useState } from 'react';
import { MessageCircle, AlertCircle } from 'lucide-react';
import { useBusiness } from '@/context/BusinessContext';
import { useLanguage } from '@/context/LanguageContext';
import { isWhatsAppAvailable, generateWhatsAppUrl } from '@/utils/whatsapp';

interface WhatsAppButtonProps {
  message: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'compact';
  label?: string;
  iconOnly?: boolean;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  message,
  className = '',
  variant = 'primary',
  label,
  iconOnly = false,
}) => {
  const { settings } = useBusiness();
  const { t } = useLanguage();
  const [showDevWarning, setShowDevWarning] = useState(false);

  const isConfigured = isWhatsAppAvailable(settings.whatsapp_number);
  const isDev = import.meta.env.DEV;

  const handleClick = (e: React.MouseEvent) => {
    if (!isConfigured) {
      e.preventDefault();
      if (isDev) {
        setShowDevWarning(true);
      }
    }
  };

  if (!isConfigured && !isDev) {
    // In production, hide or disable the corresponding action when number is not configured
    return null;
  }

  const url = isConfigured
    ? generateWhatsAppUrl(settings.whatsapp_number, message)
    : '#';

  const baseStyle =
    'inline-flex items-center justify-center font-medium transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded-lg';

  let variantStyle = '';
  if (variant === 'primary') {
    variantStyle = 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm';
  } else if (variant === 'secondary') {
    variantStyle = 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200';
  } else if (variant === 'outline') {
    variantStyle = 'border border-emerald-600 text-emerald-700 hover:bg-emerald-50';
  } else if (variant === 'compact') {
    variantStyle = 'bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-2.5 py-1.5';
  }

  const paddingStyle = variant === 'compact' ? '' : iconOnly ? 'p-2.5' : 'px-4 py-2.5 text-sm';

  return (
    <div className="relative inline-block">
      <a
        href={url}
        target={isConfigured ? '_blank' : '_self'}
        rel={isConfigured ? 'noopener noreferrer' : undefined}
        onClick={handleClick}
        className={`${baseStyle} ${variantStyle} ${paddingStyle} ${className}`}
        aria-label={label || t('enquire_whatsapp')}
      >
        <MessageCircle className={`${variant === 'compact' ? 'w-3.5 h-3.5' : 'w-4 h-4'} ${iconOnly ? '' : 'mr-2'}`} />
        {!iconOnly && <span>{label || t('enquire_whatsapp')}</span>}
      </a>

      {showDevWarning && isDev && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 bg-amber-50 border border-amber-300 rounded-lg p-3 text-xs text-amber-900 shadow-xl z-50 animate-fade-in">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Setup Notice (Development Only)</p>
              <p className="mt-0.5 text-slate-700">
                WhatsApp number is not configured in Business Settings. Set{' '}
                <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">VITE_WHATSAPP_NUMBER</code> in <code className="font-mono">.env</code> or configure it in the Admin Dashboard.
              </p>
              <button
                type="button"
                onClick={() => setShowDevWarning(false)}
                className="mt-2 text-xs font-semibold text-amber-800 hover:underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

