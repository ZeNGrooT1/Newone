
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { addDays } from 'date-fns';

export interface VotingTopic {
  id: string;
  title: string;
  description: string;
  destination: string;
  time: string;
  votes: number;
  requiredVotes: number;
  hasVoted: boolean;
  status: 'active' | 'completed' | 'upcoming' | 'approved' | 'rejected';
  createdAt: Date;
  endDate: Date;
  region?: string;
  rejectionReason?: string;
}

export function useRealVotingTopics() {
  const { user } = useAuth();
  const [votingTopics, setVotingTopics] = useState<VotingTopic[]>([]);
  const [pastVotingTopics, setPastVotingTopics] = useState<VotingTopic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) return;
    
    async function fetchVotingTopics() {
      try {
        setIsLoading(true);
        
        // Fetch active voting topics
        const { data: activeTopics, error: activeTopicsError } = await supabase
          .from('voting_topics')
          .select(`
            id,
            title,
            description,
            status,
            start_date,
            end_date,
            created_at,
            created_by,
            profiles:created_by (region)
          `)
          .eq('status', 'active');
          
        if (activeTopicsError) throw activeTopicsError;
        
        // Fetch past voting topics (completed, approved, rejected)
        const { data: pastTopics, error: pastTopicsError } = await supabase
          .from('voting_topics')
          .select(`
            id,
            title,
            description,
            status,
            start_date,
            end_date,
            created_at,
            created_by,
            profiles:created_by (region)
          `)
          .in('status', ['completed', 'approved', 'rejected'])
          .order('created_at', { ascending: false })
          .limit(10);
          
        if (pastTopicsError) throw pastTopicsError;
        
        if (activeTopics && activeTopics.length > 0) {
          // Process active topics with votes
          const activeTopicsWithVotes = await Promise.all(
            activeTopics.map(async (topic) => {
              const { count, error: countError } = await supabase
                .from('votes')
                .select('id', { count: 'exact', head: true })
                .eq('topic_id', topic.id);
                
              if (countError) throw countError;
              
              // Check if user has voted
              const { data: userVote, error: userVoteError } = await supabase
                .from('votes')
                .select('id')
                .eq('topic_id', topic.id)
                .eq('student_id', user.id)
                .maybeSingle();
                
              if (userVoteError) throw userVoteError;
              
              // Extract destination from title
              const destination = topic.title.includes('to') 
                ? topic.title.split('to')[1].trim() 
                : topic.title.includes('To') 
                  ? topic.title.split('To')[1].trim() 
                  : 'Campus';
              
              return {
                id: topic.id,
                title: topic.title,
                description: topic.description,
                destination,
                time: new Date(topic.end_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                votes: count || 0,
                requiredVotes: 25,
                hasVoted: !!userVote,
                status: topic.status as 'active' | 'completed' | 'upcoming' | 'approved' | 'rejected',
                createdAt: new Date(topic.created_at),
                endDate: new Date(topic.end_date),
                region: topic.profiles?.region || 'Hubli'
              };
            })
          );
          
          setVotingTopics(activeTopicsWithVotes);
        } else {
          setVotingTopics([]);
        }
        
        if (pastTopics && pastTopics.length > 0) {
          // Format past topics for display
          const pastTopicsFormatted = await Promise.all(
            pastTopics.map(async (topic) => {
              const { count, error: countError } = await supabase
                .from('votes')
                .select('id', { count: 'exact', head: true })
                .eq('topic_id', topic.id);
                
              if (countError) throw countError;
              
              // Extract destination from title
              const destination = topic.title.includes('to') 
                ? topic.title.split('to')[1].trim() 
                : topic.title.includes('To') 
                  ? topic.title.split('To')[1].trim() 
                  : 'Campus';
              
              return {
                id: topic.id,
                title: topic.title,
                description: topic.description,
                destination,
                time: new Date(topic.end_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                votes: count || 0,
                requiredVotes: 25,
                hasVoted: false, // Not relevant for past topics
                status: topic.status as 'active' | 'completed' | 'upcoming' | 'approved' | 'rejected',
                createdAt: new Date(topic.created_at),
                endDate: new Date(topic.end_date),
                region: topic.profiles?.region || 'Hubli',
                rejectionReason: topic.status === 'rejected' ? 'Insufficient driver availability' : undefined
              };
            })
          );
          
          setPastVotingTopics(pastTopicsFormatted);
        } else {
          setPastVotingTopics([]);
        }
      } catch (err: any) {
        console.error('Error fetching voting topics:', err);
        setError(err);
        toast.error("Error fetching voting topics: " + (err.message || "Please try again later."));
      } finally {
        setIsLoading(false);
      }
    }

    fetchVotingTopics();
    // Set up a polling interval to refresh data every 30 seconds
    const intervalId = setInterval(() => {
      fetchVotingTopics();
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, [user]);

  const castVote = async (topicId: string) => {
    if (!user) {
      toast.error("Authentication required. You must be logged in to vote");
      return false;
    }
    
    try {
      setIsSubmitting(true);
      
      // Check if user has already voted
      const { data: existingVote, error: checkError } = await supabase
        .from('votes')
        .select('id')
        .eq('topic_id', topicId)
        .eq('student_id', user.id)
        .maybeSingle();
        
      if (checkError) throw checkError;
      
      if (existingVote) {
        toast.error("You have already voted on this topic");
        return false;
      }
      
      // Get the first option for the topic
      const { data: options, error: optionsError } = await supabase
        .from('voting_options')
        .select('id')
        .eq('topic_id', topicId)
        .limit(1);
        
      if (optionsError) throw optionsError;
      
      let optionId;
      
      if (!options || options.length === 0) {
        // Create a default option if none exists
        const { data: newOption, error: createOptionError } = await supabase
          .from('voting_options')
          .insert({
            topic_id: topicId,
            option_text: 'Approve'
          })
          .select('id')
          .single();
          
        if (createOptionError) throw createOptionError;
        optionId = newOption.id;
      } else {
        optionId = options[0].id;
      }
      
      // Cast the vote
      const { error: voteError } = await supabase
        .from('votes')
        .insert({
          topic_id: topicId,
          option_id: optionId,
          student_id: user.id
        });
        
      if (voteError) throw voteError;
      
      // Update local state to reflect the new vote
      setVotingTopics(prev => 
        prev.map(topic => 
          topic.id === topicId 
            ? { ...topic, votes: topic.votes + 1, hasVoted: true } 
            : topic
        )
      );
      
      toast.success("Vote registered! Thank you for your input.");
      return true;
    } catch (err: any) {
      console.error('Error casting vote:', err);
      toast.error("Failed to cast vote: " + (err.message || "Please try again."));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const requestNewBus = async (data: {
    destination: string;
    description: string;
    date: Date;
    time: string;
  }) => {
    if (!user) {
      toast.error("Authentication required. You must be logged in to request a new bus");
      return false;
    }
    
    try {
      setIsSubmitting(true);
      
      // Format title based on destination
      const formattedTitle = `Additional Bus to ${data.destination}`;
      
      // Parse time in format "HH:MM" (e.g., "14:30")
      const [hours, minutes] = data.time.split(':').map(Number);
      const endDate = new Date(data.date);
      endDate.setHours(hours, minutes);
      
      // Set start date to now
      const startDate = new Date();
      
      // Create voting topic
      const { data: newTopic, error: topicError } = await supabase
        .from('voting_topics')
        .insert({
          title: formattedTitle,
          description: data.description,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          status: 'active',
          created_by: user.id
        })
        .select('id')
        .single();
        
      if (topicError) throw topicError;
      
      // Create default option
      const { error: optionError } = await supabase
        .from('voting_options')
        .insert({
          topic_id: newTopic.id,
          option_text: 'Approve'
        });
        
      if (optionError) throw optionError;
      
      toast.success("Bus request created! Your request is now open for voting.");
      
      // Add new topic to the list
      const newVotingTopic: VotingTopic = {
        id: newTopic.id,
        title: formattedTitle,
        description: data.description,
        destination: data.destination,
        time: endDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        votes: 0,
        requiredVotes: 25,
        hasVoted: false,
        status: 'active',
        createdAt: startDate,
        endDate: endDate,
        region: user.region || 'Hubli'
      };
      
      setVotingTopics(prev => [newVotingTopic, ...prev]);
      
      return true;
    } catch (err: any) {
      console.error('Error requesting new bus:', err);
      toast.error("Failed to create bus request: " + (err.message || "Please try again."));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { 
    votingTopics, 
    pastVotingTopics,
    castVote,
    requestNewBus,
    isLoading, 
    isSubmitting,
    error 
  };
}
