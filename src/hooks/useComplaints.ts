
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast.tsx';

export interface Complaint {
  id: string;
  type: string;
  description: string;
  status: 'pending' | 'in_review' | 'resolved' | 'rejected';
  createdAt: Date;
  busId?: string;
  busNumber?: string;
}

export type ComplaintType = 'delay' | 'cleanliness' | 'behavior' | 'safety' | 'other';

interface SubmitComplaintData {
  type: ComplaintType;
  description: string;
  busId?: string;
}

export function useComplaints() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) return;
    
    async function fetchComplaints() {
      try {
        setIsLoading(true);
        
        // Fetch user's complaints
        const { data: complaintsData, error: complaintsError } = await supabase
          .from('complaints')
          .select(`
            id,
            complaint_type,
            description,
            status,
            created_at,
            bus_id,
            buses:bus_id (
              bus_number
            )
          `)
          .eq('student_id', user.id)
          .order('created_at', { ascending: false });
          
        if (complaintsError) throw complaintsError;
        
        // Format the complaints
        const formattedComplaints: Complaint[] = (complaintsData || []).map(complaint => ({
          id: complaint.id,
          type: complaint.complaint_type,
          description: complaint.description,
          status: complaint.status as 'pending' | 'in_review' | 'resolved' | 'rejected',
          createdAt: new Date(complaint.created_at),
          busId: complaint.bus_id,
          busNumber: complaint.buses?.bus_number
        }));
        
        setComplaints(formattedComplaints);
      } catch (err: any) {
        console.error('Error fetching complaints:', err);
        setError(err);
        toast.error('Failed to load complaints');
      } finally {
        setIsLoading(false);
      }
    }

    fetchComplaints();
  }, [user]);

  const submitComplaint = async (data: SubmitComplaintData) => {
    if (!user) {
      toast.error('You must be logged in to submit a complaint');
      return false;
    }
    
    try {
      setIsSubmitting(true);
      
      // Submit complaint to Supabase
      const { data: newComplaint, error } = await supabase
        .from('complaints')
        .insert({
          student_id: user.id,
          complaint_type: data.type,
          description: data.description,
          bus_id: data.busId,
          status: 'pending'
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Fetch bus number if a bus ID is provided
      let busNumber = '';
      if (data.busId) {
        const { data: busData } = await supabase
          .from('buses')
          .select('bus_number')
          .eq('id', data.busId)
          .single();
          
        if (busData) {
          busNumber = busData.bus_number;
        }
      }
      
      // Add the new complaint to local state
      const formattedComplaint: Complaint = {
        id: newComplaint.id,
        type: newComplaint.complaint_type,
        description: newComplaint.description,
        status: newComplaint.status as 'pending' | 'in_review' | 'resolved' | 'rejected',
        createdAt: new Date(newComplaint.created_at),
        busId: newComplaint.bus_id,
        busNumber
      };
      
      setComplaints(prev => [formattedComplaint, ...prev]);
      
      toast.success('Complaint submitted successfully');
      return true;
    } catch (err: any) {
      console.error('Error submitting complaint:', err);
      toast.error('Failed to submit complaint');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { 
    complaints, 
    submitComplaint,
    isLoading,
    isSubmitting,
    error 
  };
}
