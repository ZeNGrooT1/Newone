
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Role } from '../types/auth';
import { fetchUserProfile } from '../utils/auth-utils';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    let isMounted = true; // Track if component is mounted
    
    const checkAuth = async () => {
      try {
        console.log('Checking auth status on initial load');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting session:', sessionError);
          if (isMounted) setIsLoading(false);
          return;
        }
        
        if (session?.user) {
          console.log('Found existing session, fetching profile');
          try {
            const profile = await fetchUserProfile(session.user.id);
            if (isMounted) {
              if (profile) {
                setUser(profile);
              }
              setIsLoading(false);
            }
          } catch (error) {
            console.error('Error fetching profile:', error);
            if (isMounted) setIsLoading(false);
          }
        } else {
          console.log('No session found on initial load');
          if (isMounted) setIsLoading(false);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        if (isMounted) setIsLoading(false);
      }
    };
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session ? 'with session' : 'no session');
        
        if (event === 'SIGNED_IN' && session) {
          try {
            console.log('User signed in, fetching profile');
            if (isMounted) setIsLoading(true);
            const profile = await fetchUserProfile(session.user.id);
            if (isMounted) {
              if (profile) {
                setUser(profile);
              }
              setIsLoading(false);
            }
          } catch (err) {
            console.error('Error in auth state change handler:', err);
            if (isMounted) setIsLoading(false);
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out, clearing user state');
          if (isMounted) {
            setUser(null);
            setIsLoading(false);
          }
        } else if (event === 'TOKEN_REFRESHED') {
          // Just ensure we're not stuck in loading state
          if (isMounted && isLoading) {
            setIsLoading(false);
          }
        }
      }
    );
    
    checkAuth();
    
    return () => {
      isMounted = false; // Prevent state updates after unmount
      subscription.unsubscribe();
    };
  }, []);

  return { 
    user, 
    setUser, 
    isLoading, 
    setIsLoading,
    isAuthenticated: !!user,
    role: user?.role || null
  };
};
