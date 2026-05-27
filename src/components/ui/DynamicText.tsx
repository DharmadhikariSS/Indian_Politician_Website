import React from 'react';
import { useDynamicTranslation } from '../../core';

interface DynamicTextProps {
  text: string | undefined | null;
  className?: string;
}

/**
 * A wrapper component that automatically translates its text content dynamically.
 * Useful for rendering data strings inside map() loops without violating the Rules of Hooks.
 */
export const DynamicText: React.FC<DynamicTextProps> = ({ text, className }) => {
  const translatedText = useDynamicTranslation(text);
  
  if (!translatedText) return null;
  
  return <span className={className}>{translatedText}</span>;
};
