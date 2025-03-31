
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast.tsx';
import { supabase } from '@/integrations/supabase/client';
import { LoginCredentials, RegisterData, Role, User } from '../types/auth';
import { findEmailByUsn, navigateToPath, getRoleDashboardPath, uploadProfilePhoto } from '../utils/auth-utils';

export const useAuthActions = (
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const navigate = useNavigate();

  const navigateToRoleDashboard = useCallback((role: Role) => {
    if (!role) return;
    
    const path = getRoleDashboardPath(role);
    navigateToPath(navigate, path);
  }, [navigate]);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      let identifier = credentials.identifier;
      let password = credentials.password;
      let email = identifier;
      
      // For students, we need to find their email using their USN
      if (credentials.role === 'student') {
        email = await findEmailByUsn(identifier) || '';
      }
      
      console.log('Attempting to sign in with email:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Sign in error:', error);
        setIsLoading(false); // Ensure loading state is cleared on error
        throw error;
      }
      
      if (data?.user) {
        console.log('Sign in successful, fetching profile');
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
          
        if (profileError) {
          console.error('Profile fetch error:', profileError);
          setIsLoading(false); // Ensure loading state is cleared on error
          throw profileError;
        }
        
        if (profile) {
          if (profile.role !== credentials.role) {
            console.error('Role mismatch:', profile.role, credentials.role);
            await supabase.auth.signOut();
            setIsLoading(false); // Ensure loading state is cleared on error
            throw new Error(`Invalid role. You are not registered as a ${credentials.role}.`);
          }
          
          console.log('Setting user from profile after login');
          setUser({
            id: profile.id,
            name: profile.name,
            role: profile.role,
            email: profile.email,
            usn: profile.usn,
            phone: profile.phone,
            region: profile.region
          });
          
          toast.success(`Welcome back, ${profile.name}!`);
          // Loading state will be cleared by the auth state change listener
        } else {
          // If no profile was found despite successful auth
          setIsLoading(false);
          throw new Error("User profile not found");
        }
      } else {
        // If no user data was returned despite no error
        setIsLoading(false);
        throw new Error("Login failed: No user data returned");
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      toast.error(error.message || 'Login failed. Please check your credentials and try again.');
      setIsLoading(false); // Ensure loading state is cleared on any error
      throw error;
    }
  }, [setIsLoading, setUser]);

  const logout = useCallback(async () => {
    try {
      console.log('Attempting to sign out');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      toast.default("You have been logged out");
      
      navigateToPath(navigate, '/');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error("Failed to log out. Please try again.");
    }
  }, [navigate, setUser]);

  const register = useCallback(async (userData: RegisterData) => {
    setIsLoading(true);
    try {
      console.log('Starting registration process with role:', userData.role);
      
      if (!userData.agreeToTerms) {
        throw new Error('You must agree to the terms and conditions.');
      }
      
      let email = userData.email;
      
      if (userData.role === 'student' && !userData.usn) {
        throw new Error('Student USN is required for registration.');
      }
      
      const userMetadata = {
        name: userData.name,
        role: userData.role,
        usn: userData.usn,
        phone: userData.phone,
        region: userData.region
      };
      
      console.log('Registering with metadata:', userMetadata);
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: userData.password,
        options: {
          data: userMetadata
        }
      });
      
      if (authError) {
        console.error('Auth error during registration:', authError);
        throw authError;
      }
      
      if (!authData?.user) {
        throw new Error('Registration failed. No user data returned.');
      }
      
      console.log('Auth registration successful, user:', authData.user.id);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Fetching newly created profile');
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();
        
      if (profileError) {
        console.error('Error fetching profile after registration:', profileError);
      }
      
      if (profile) {
        console.log('Profile fetched successfully:', profile);
        setUser({
          id: profile.id,
          name: profile.name,
          role: profile.role,
          email: profile.email,
          usn: profile.usn,
          phone: profile.phone,
          region: profile.region
        });
      }
      
      if (userData.profilePhoto && authData.user.id) {
        await uploadProfilePhoto(authData.user.id, userData.profilePhoto);
      }
      
      toast.success("Welcome aboard!");
      
      if (profile) {
        navigateToRoleDashboard(profile.role);
      }
    } catch (error: any) {
      console.error('Registration failed:', error);
      toast.error(error.message || 'Registration failed. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [navigateToRoleDashboard, setIsLoading, setUser]);

  const forgotPassword = useCallback(async (identifier: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(identifier, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      toast.success(`Recovery instructions sent to ${identifier}`);
    } catch (error: any) {
      console.error('Password reset request failed:', error);
      toast.error(error.message || 'Failed to process your request. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading]);

  const resetPassword = useCallback(async (token: string, newPassword: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      toast.success("Password has been successfully reset. You can now log in with your new password.");
    } catch (error: any) {
      console.error('Password reset failed:', error);
      toast.error(error.message || 'Failed to reset password. The link may have expired.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading]);

  return {
    login,
    logout,
    register,
    forgotPassword,
    resetPassword,
    navigateToRoleDashboard
  };
};
