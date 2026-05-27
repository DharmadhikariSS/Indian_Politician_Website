import { useQuery } from '@tanstack/react-query';
import { useI18n } from '../i18n/translations';

// Simple in-memory cache to avoid re-fetching the same translation across renders
const translationCache = new Map<string, string>();

/**
 * Fetches translation from the free Google Translate API.
 * Uses a simple fetch call.
 */
const fetchTranslation = async (text: string, targetLang: string): Promise<string> => {
  if (!text) return '';
  if (targetLang === 'en') return text; // Base data is in English

  const cacheKey = `${targetLang}:${text}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Translation failed');
    const data = await res.json();
    
    // The API returns an array of arrays, we need to stitch the translated parts together
    let translatedText = '';
    if (data && data[0]) {
      data[0].forEach((part: any) => {
        if (part[0]) translatedText += part[0];
      });
    }

    if (translatedText) {
      translationCache.set(cacheKey, translatedText);
      return translatedText;
    }
    return text; // Fallback to original
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Fallback to original on error
  }
};

/**
 * Hook to dynamically translate a single string.
 */
export function useDynamicTranslation(text: string | undefined | null) {
  const { lang } = useI18n();

  const query = useQuery({
    queryKey: ['translate', text, lang],
    queryFn: () => fetchTranslation(text || '', lang),
    enabled: !!text && lang !== 'en', // Only fetch if there is text and it's not English
    staleTime: Infinity, // Never stale during session
  });

  if (!text) return '';
  if (lang === 'en') return text;
  
  // Return the translated text if available, otherwise fallback to the original text
  return query.data || text;
}

/**
 * Hook to dynamically translate an array of strings.
 */
export function useDynamicTranslationArray(texts: string[] | undefined | null) {
  const { lang } = useI18n();

  const query = useQuery({
    queryKey: ['translate_array', texts, lang],
    queryFn: async () => {
      if (!texts || texts.length === 0) return [];
      const promises = texts.map(t => fetchTranslation(t, lang));
      return Promise.all(promises);
    },
    enabled: !!texts && texts.length > 0 && lang !== 'en',
    staleTime: Infinity,
  });

  if (!texts) return [];
  if (lang === 'en') return texts;
  
  return query.data || texts;
}
