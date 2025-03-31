
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast.tsx';

export interface Bus {
  id: string;
  number: string;
  name: string;
  route?: string;
  seats: number;
  status: 'on-time' | 'delayed' | 'cancelled';
  driver?: {
    name: string;
    phone?: string;
  };
  departureTime?: string;
}

export function useBuses() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchBuses() {
      try {
        setIsLoading(true);
        
        // Fetch buses from Supabase
        const { data: busesData, error: busesError } = await supabase
          .from('buses')
          .select(`
            id,
            name,
            bus_number,
            capacity,
            route,
            status,
            assigned_driver
          `);
          
        if (busesError) throw busesError;
        
        // If we have driver IDs, fetch their profiles
        const driverIds = busesData
          .filter(bus => bus.assigned_driver)
          .map(bus => bus.assigned_driver);
          
        let driversData: any[] = [];
        
        if (driverIds.length > 0) {
          const { data: drivers, error: driversError } = await supabase
            .from('profiles')
            .select('id, name, phone')
            .in('id', driverIds);
            
          if (driversError) throw driversError;
          driversData = drivers || [];
        }
        
        // Format the bus data
        const formattedBuses: Bus[] = busesData.map(bus => {
          const driver = driversData.find(d => d.id === bus.assigned_driver);
          
          return {
            id: bus.id,
            number: bus.bus_number,
            name: bus.name,
            route: bus.route,
            seats: bus.capacity,
            status: bus.status === 'active' ? 'on-time' : 'delayed', // Map status for display
            driver: driver ? {
              name: driver.name,
              phone: driver.phone
            } : undefined,
            departureTime: '4:30 PM' // This would come from schedules table in a real implementation
          };
        });
        
        setBuses(formattedBuses);
      } catch (err: any) {
        console.error('Error fetching buses:', err);
        setError(err);
        toast.error('Failed to load buses');
      } finally {
        setIsLoading(false);
      }
    }

    fetchBuses();
  }, []);

  return { buses, isLoading, error };
}
