import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import type { DetailedPoliticianData } from '../data/politicians';
import { mockPoliticians } from '../data/politicians';

const isSupabaseConfigured = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_URL !== 'https://placeholder-url.supabase.co';

export function usePoliticians() {
  return useQuery({
    queryKey: ['politicians'],
    queryFn: async (): Promise<DetailedPoliticianData[]> => {
      if (!isSupabaseConfigured) {
        console.warn('Supabase not configured, using mock data.');
        return mockPoliticians;
      }
      
      const { data, error } = await supabase
        .from('politicians')
        .select('*')
        .order('aiScore', { ascending: false });

      if (error || !data || data.length === 0) {
        console.warn('Supabase fetch failed or empty, using mock data.', error);
        return mockPoliticians;
      }

      return data as DetailedPoliticianData[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function usePolitician(id: string | undefined) {
  return useQuery({
    queryKey: ['politician', id],
    queryFn: async (): Promise<DetailedPoliticianData> => {
      if (!id) throw new Error('ID is required');
      
      if (!isSupabaseConfigured) {
        const mock = mockPoliticians.find((p) => p.id === id);
        if (!mock) throw new Error('Not found in mock');
        return mock;
      }
      
      const { data, error } = await supabase
        .from('politicians')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        const mock = mockPoliticians.find((p) => p.id === id);
        if (!mock) throw new Error('Not found');
        return mock;
      }

      return data as DetailedPoliticianData;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
