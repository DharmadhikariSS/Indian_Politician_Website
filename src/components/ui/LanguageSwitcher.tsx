import React, { useState, useRef, useEffect } from 'react';
import { Languages, ChevronDown, Check } from 'lucide-react';
import { useI18n, LANGUAGES } from '../../i18n/translations';

export function LanguageSwitcher() {
  const { lang, setLang, langMeta } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border-subtle bg-bg-secondary hover:bg-bg-elevated transition-all text-text-secondary hover:text-text-primary group"
        title="Switch Language / भाषा बदलें"
        aria-label="Language Selector"
      >
        <Languages size={13} className="text-accent-gold" />
        <span className="text-[11px] font-mono font-bold tracking-wider">
          {langMeta.nativeName.slice(0, 4).toUpperCase()}
        </span>
        <ChevronDown
          size={10}
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 z-50 glass-elevated border border-border-subtle rounded-xl overflow-hidden shadow-2xl w-56">
          <div className="p-2 border-b border-border-subtle">
            <p className="text-[10px] font-mono text-text-muted uppercase tracking-widest px-2 py-1">
              भाषा चुनें / Choose Language
            </p>
          </div>
          <div className="max-h-72 overflow-y-auto py-1">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => { setLang(l.code); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-all hover:bg-white/5 ${
                  lang === l.code ? 'text-accent-gold' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <span className="text-base leading-none w-5 text-center flex-shrink-0">
                  {l.flag}
                </span>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-semibold ${lang === l.code ? 'text-accent-gold' : ''}`}>
                    {l.nativeName}
                  </div>
                  <div className="text-[10px] text-text-muted">
                    {l.states.slice(0, 2).join(', ')}
                  </div>
                </div>
                {lang === l.code && (
                  <Check size={12} className="text-accent-gold flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
          <div className="p-2 border-t border-border-subtle">
            <p className="text-[9px] font-mono text-text-muted text-center px-2">
              Powered by Bhashini + Native Translations
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
