import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Eye, EyeOff, KeyRound, Mail, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login, isLoading, forgotPassword } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [sentOtp, setSentOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      toast.error('Please enter your email and password');
      return;
    }
    
    try {
      setLocalLoading(true);
      await login({
        identifier: email,
        password,
        role: 'admin'
      });
      
      navigate('/admin');
    } catch (error) {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      
      if (newAttempts >= 3 && !showForgotPassword) {
        toast.error('Multiple failed login attempts. You can use the forgot password option.', {
          duration: 5000
        });
        setShowForgotPassword(true);
      }
    } finally {
      setLocalLoading(false);
    }
  };
  
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resetEmail.trim()) {
      toast.error('Please enter your email');
      return;
    }
    
    try {
      setLocalLoading(true);
      await forgotPassword(resetEmail);
      setSentOtp(true);
    } catch (error) {
      toast.error('Failed to send reset instructions. Please try again.');
    } finally {
      setLocalLoading(false);
    }
  };
  
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp.trim() || !newPassword.trim() || !confirmNewPassword.trim()) {
      toast.error('Please fill all fields');
      return;
    }
    
    if (newPassword !== confirmNewPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    try {
      setLocalLoading(true);
      toast.success('Password reset successful! You can now login with your new password.');
      setShowForgotPassword(false);
      setSentOtp(false);
    } catch (error) {
      toast.error('Failed to reset password. Please try again.');
    } finally {
      setLocalLoading(false);
    }
  };
  
  const isButtonLoading = isLoading || localLoading;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex flex-col">
      <Link to="/login" className="absolute top-4 left-6 z-10">
        <Button variant="ghost" size="sm" className="flex items-center gap-1 hover:bg-black/5">
          <ChevronLeft className="h-4 w-4" />
          Back to Selection
        </Button>
      </Link>
      
      <div className="flex-grow flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {!showForgotPassword ? (
            <Card className="border-0 shadow-card overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-red-400 to-red-600" />
              <CardHeader className="space-y-1 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <ShieldCheck className="h-6 w-6 text-red-600" />
                  <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
                </div>
                <CardDescription>
                  Enter your email and password to access the admin dashboard
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-9 form-input-transition"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      {loginAttempts >= 3 && (
                        <Button 
                          variant="link" 
                          size="sm" 
                          className="px-0 text-xs text-red-600" 
                          type="button"
                          onClick={() => setShowForgotPassword(true)}
                        >
                          Forgot password?
                        </Button>
                      )}
                    </div>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="pl-9 pr-10 form-input-transition"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1 h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-red-600 hover:bg-red-700" 
                    disabled={isButtonLoading}
                  >
                    {isButtonLoading ? 
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Logging in...</span>
                      </div> : 
                      'Log In'
                    }
                  </Button>
                  <div className="text-center text-sm">
                    <div className="flex items-center justify-center gap-1 text-red-600">
                      <ShieldCheck className="h-4 w-4" />
                      <span>Secure Administrator Portal</span>
                    </div>
                  </div>
                </CardFooter>
              </form>
            </Card>
          ) : (
            <Card className="border-0 shadow-card overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-red-400 to-red-600" />
              <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
                {!sentOtp ? (
                  <CardDescription>
                    Enter your email to receive a password reset OTP
                  </CardDescription>
                ) : (
                  <CardDescription>
                    Enter the OTP sent to your email and set a new password
                  </CardDescription>
                )}
              </CardHeader>
              {!sentOtp ? (
                <form onSubmit={handleForgotPassword}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reset-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="reset-email"
                          type="email"
                          placeholder="Enter your email"
                          className="pl-9 form-input-transition"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-4">
                    <Button 
                      type="submit" 
                      className="w-full bg-red-600 hover:bg-red-700" 
                      disabled={isButtonLoading}
                    >
                      {isButtonLoading ? 'Sending...' : 'Send OTP'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowForgotPassword(false)}
                    >
                      Back to Login
                    </Button>
                  </CardFooter>
                </form>
              ) : (
                <form onSubmit={handleResetPassword}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="otp">OTP Code</Label>
                      <Input
                        id="otp"
                        placeholder="Enter OTP received via email"
                        className="form-input-transition"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <div className="relative">
                        <Input
                          id="new-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter new password"
                          className="form-input-transition"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <div className="relative">
                        <Input
                          id="confirm-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Confirm new password"
                          className="form-input-transition"
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1 h-8 w-8 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-4">
                    <Button 
                      type="submit" 
                      className="w-full bg-red-600 hover:bg-red-700" 
                      disabled={isButtonLoading}
                    >
                      {isButtonLoading ? 'Resetting...' : 'Reset Password'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setShowForgotPassword(false);
                        setSentOtp(false);
                      }}
                    >
                      Back to Login
                    </Button>
                  </CardFooter>
                </form>
              )}
            </Card>
          )}
        </motion.div>
      </div>
      
      <footer className="py-6 text-center text-sm text-gray-600 border-t">
        <p>© {new Date().getFullYear()} Campus Bus Assistant. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AdminLogin;
