
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Mail } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const validateEmail = () => {
    if (!email) {
      setError('Email is required');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email is invalid');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail()) return;

    setIsLoading(true);

    try {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock success response
      setIsSubmitted(true);
      toast({
        title: 'Reset link sent',
        description: 'Please check your email for password reset instructions.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Request failed',
        description: 'An error occurred. Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-fyp-dark-blue p-4">
      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="flex items-center">
              <img src="/lovable-uploads/df7df768-ce24-43ba-b317-557a34ae679d.png" alt="Logo" className="h-12 w-12" />
              <h1 className="ml-3 text-2xl font-bold text-white">FYP Voting System</h1>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-white text-center mb-2">Forgot Password</h2>
          <p className="text-gray-400 text-center mb-6">No worries, we'll send you reset instructions.</p>
          
          {!isSubmitted ? (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email Address</label>
                  <div className="mt-1">
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className={`bg-gray-700 border-gray-600 text-white placeholder-gray-400 ${error ? 'border-red-500' : ''}`}
                    />
                    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
                  </div>
                </div>
                
                <div>
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <Mail size={18} className="mr-2" />
                        Send Reset Link
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          ) : (
            <div className="text-center">
              <div className="bg-blue-600/20 text-blue-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail size={32} />
              </div>
              
              <h3 className="text-xl font-medium text-white mb-2">Check your email</h3>
              <p className="text-gray-400 mb-6">
                We've sent a password reset link to <span className="text-white font-medium">{email}</span>
              </p>
              
              <Button
                type="button"
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => setIsSubmitted(false)}
              >
                Resend email
              </Button>
            </div>
          )}
          
          <div className="mt-8 text-center">
            <Link to="/login" className="flex items-center justify-center text-sm text-gray-400 hover:text-white">
              <ArrowLeft size={16} className="mr-2" />
              Back to Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
