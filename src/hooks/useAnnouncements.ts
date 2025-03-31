
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast.tsx';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: Date;
  important: boolean;
}

export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchAnnouncements() {
      try {
        setIsLoading(true);
        
        // In a real implementation, this would fetch from an announcements table
        // For now, we'll use the alerts table from our database as announcements
        const { data: alertsData, error: alertsError } = await supabase
          .from('alerts')
          .select('*')
          .is('target_role', null)
          .or('target_role.eq.student');
          
        if (alertsError) throw alertsError;
        
        // Format the alerts as announcements
        const formattedAnnouncements: Announcement[] = (alertsData || []).map(alert => ({
          id: alert.id,
          title: alert.title,
          content: alert.message,
          date: new Date(alert.created_at),
          important: alert.severity === 'critical'
        }));
        
        setAnnouncements(formattedAnnouncements);
      } catch (err: any) {
        console.error('Error fetching announcements:', err);
        setError(err);
        toast.error('Failed to load announcements');
      } finally {
        setIsLoading(false);
      }
    }

    fetchAnnouncements();
  }, []);

  return { announcements, isLoading, error };
}
