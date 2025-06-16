
import React, { useState, useEffect } from 'react';
import { LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const UserHeader = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const userSession = localStorage.getItem('userSession');
    if (userSession) {
      setCurrentUser(JSON.parse(userSession));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userSession');
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
    });
    navigate('/login');
  };

  if (!currentUser) return null;

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <img src="/lovable-uploads/df7df768-ce24-43ba-b317-557a34ae679d.png" alt="Logo" className="h-8 w-8" />
          <h1 className="text-xl font-bold text-gray-800">GEEVES Voting System</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-gray-700">
            <User size={18} />
            <span className="font-medium">{currentUser.firstName} {currentUser.lastName}</span>
            <span className="text-sm text-gray-500">({currentUser.role})</span>
          </div>
          
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <LogOut size={16} className="mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserHeader;
