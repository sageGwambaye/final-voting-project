
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { mockVotersData } from '@/data/mockData';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    let isValid = true;

    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Simulate login request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check if user exists in mock data
      const user = mockVotersData.find(voter => voter.email === email);
      
      if (user) {
        // Group members and admin have specific passwords
        const validCredentials = [
          { email: 'rebeca.samanda@udom.ac.tz', password: 'password123' },
          { email: 'gehazi.gwambaye@udom.ac.tz', password: 'password123' },
          { email: 'godlisten.nanyaro@udom.ac.tz', password: 'password123' },
          { email: 'anderson.mollel@udom.ac.tz', password: 'password123' },
          { email: 'mengwa.katambi@udom.ac.tz', password: 'password123' },
          { email: 'daniel.mwalimu@udom.ac.tz', password: 'password123' },
          { email: 'grace.john@udom.ac.tz', password: 'password123' },
          { email: 'peter.michael@udom.ac.tz', password: 'password123' },
          { email: 'mary.joseph@udom.ac.tz', password: 'password123' },
          { email: 'admin@udom.ac.tz', password: 'admin123' }
        ];

        const validUser = validCredentials.find(cred => cred.email === email && cred.password === password);
        
        if (validUser) {
          // Store user session data
          localStorage.setItem('userSession', JSON.stringify({
            id: user.id,
            email: user.email,
            name: user.name,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            studentId: user.studentId
          }));

          toast({
            title: 'Login successful',
            description: `Welcome back, ${user.firstName}!`,
          });

          // Redirect based on role
          if (user.role === 'ADMIN') {
            navigate('/admin/dashboard');
          } else {
            navigate('/dashboard');
          }
        } else {
          toast({
            variant: 'destructive',
            title: 'Login failed',
            description: 'Invalid email or password',
          });
        }
      } else {
        toast({
          variant: 'destructive',
          title: 'Login failed',
          description: 'User not found in the system',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Login error',
        description: 'An error occurred during login',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="geeves-login-container">
      <div className="geeves-login-card">
        <h2 className="geeves-login-title">GEEVES</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="geeves-login-field">
            <label htmlFor="email">Email Address</label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className={`geeves-login-input ${errors.email ? 'border-red-500' : ''}`}
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
          </div>
          
          <div className="geeves-login-field">
            <label htmlFor="password">Password</label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className={`geeves-login-input ${errors.password ? 'border-red-500' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Checkbox
                id="remember-me"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                className="text-udom-blue"
              />
              <label htmlFor="remember-me" className="ml-2 text-sm text-gray-700">
                Remember me
              </label>
            </div>
          </div>
          
          <Button
            type="submit"
            className="geeves-login-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            ) : (
              <>
                <LogIn size={18} className="mr-2" />
                Sign in
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
