
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LogOut, Menu, Home, Users, Award, 
  MessageSquare, Settings, Vote, Calendar 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import VoiceAssistant from './VoiceAssistant';

interface LayoutProps {
  children: React.ReactNode;
  userRole?: 'admin' | 'voter';
}

const Layout: React.FC<LayoutProps> = ({ children, userRole = 'voter' }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const location = useLocation();
  const { toast } = useToast();
  
  // Check if user is on auth pages
  const isAuthPage = ['/login', '/register', '/forgot-password'].includes(location.pathname);
  
  // Determine home link based on user role
  const homeLink = userRole === 'admin' ? '/admin/dashboard' : '/dashboard';
  
  useEffect(() => {
    // Get current user from session
    const userSession = localStorage.getItem('userSession');
    if (userSession) {
      setCurrentUser(JSON.parse(userSession));
    }

    // Handle responsive sidebar
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
        setIsMobile(true);
      } else {
        setSidebarOpen(true);
        setIsMobile(false);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('userSession');
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account"
    });
    setTimeout(() => {
      window.location.href = '/login';
    }, 1000);
  };
  
  // If on auth pages, don't show the full layout
  if (isAuthPage) {
    return <div className="min-h-screen bg-white">{children}</div>;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-udom-blue flex items-center justify-between py-2 px-4 z-10">
        <div className="flex items-center">
          {isMobile && (
            <button className="mr-2 text-white" onClick={toggleSidebar}>
              <Menu size={24} />
            </button>
          )}
          <Link to={homeLink} className="text-white text-xl font-semibold">
            GEEVES
          </Link>
          <Link to={homeLink} className="ml-8 text-white">
            HOME
          </Link>
        </div>
        <div className="flex items-center">
          <div className="flex items-center ml-4">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-udom-blue font-bold mr-2">
              {currentUser ? `${currentUser.firstName?.[0] || ''}${currentUser.lastName?.[0] || ''}` : 'FN'}
            </div>
            <span className="text-white mr-4">
              {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Firstname Lastname'}
            </span>
            <button 
              onClick={handleLogout}
              className="text-white hover:text-gray-200"
            >
              <LogOut size={20} />
              <span className="ml-1">LOGOUT</span>
            </button>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        {sidebarOpen && (
          <aside className="w-64 flex-shrink-0 overflow-y-auto bg-white border-r border-gray-200">
            <div className="p-4">
              <div className="flex items-center mb-8 mt-4">
                <div className="w-8 h-8 bg-udom-blue rounded-full flex items-center justify-center mr-2">
                  <img src="/lovable-uploads/df7df768-ce24-43ba-b317-557a34ae679d.png" alt="Logo" className="w-6 h-6" />
                </div>
                <div className="flex items-center">
                  <span className="status-dot online"></span>
                  <span className="text-black">Online</span>
                </div>
              </div>
              
              <nav>
                <ul className="space-y-2">
                  <li>
                    <Link 
                      to={userRole === 'admin' ? '/admin/dashboard' : '/dashboard'} 
                      className={`flex items-center p-2 rounded hover:bg-gray-100 text-black ${location.pathname === (userRole === 'admin' ? '/admin/dashboard' : '/dashboard') ? 'bg-gray-100' : ''}`}
                    >
                      <Home className="mr-3 text-udom-blue" size={20} />
                      Dashboard
                    </Link>
                  </li>
                  
                  {userRole === 'voter' ? (
                    <>
                      <li>
                        <Link 
                          to="/voting" 
                          className={`flex items-center p-2 rounded hover:bg-gray-100 text-black ${location.pathname === '/voting' ? 'bg-gray-100' : ''}`}
                        >
                          <Vote className="mr-3 text-udom-blue" size={20} />
                          Voting Portal
                        </Link>
                      </li>
                      <li>
                        <Link 
                          to="/results" 
                          className={`flex items-center p-2 rounded hover:bg-gray-100 text-black ${location.pathname === '/results' ? 'bg-gray-100' : ''}`}
                        >
                          <Calendar className="mr-3 text-udom-blue" size={20} />
                          Results
                        </Link>
                      </li>
                      <li>
                        <Link 
                          to="/feedback" 
                          className={`flex items-center p-2 rounded hover:bg-gray-100 text-black ${location.pathname === '/feedback' ? 'bg-gray-100' : ''}`}
                        >
                          <MessageSquare className="mr-3 text-udom-blue" size={20} />
                          Feedback
                        </Link>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <Link 
                          to="/votes" 
                          className={`flex items-center p-2 rounded hover:bg-gray-100 text-black ${location.pathname === '/votes' ? 'bg-gray-100' : ''}`}
                        >
                          <Vote className="mr-3 text-udom-blue" size={20} />
                          Votes
                        </Link>
                      </li>
                      <li>
                        <Link 
                          to="/voters" 
                          className={`flex items-center p-2 rounded hover:bg-gray-100 text-black ${location.pathname === '/voters' ? 'bg-gray-100' : ''}`}
                        >
                          <Users className="mr-3 text-udom-blue" size={20} />
                          Voters
                        </Link>
                      </li>
                      <li>
                        <Link 
                          to="/positions" 
                          className={`flex items-center p-2 rounded hover:bg-gray-100 text-black ${location.pathname === '/positions' ? 'bg-gray-100' : ''}`}
                        >
                          <Settings className="mr-3 text-udom-blue" size={20} />
                          Positions
                        </Link>
                      </li>
                      <li>
                        <Link 
                          to="/candidates" 
                          className={`flex items-center p-2 rounded hover:bg-gray-100 text-black ${location.pathname === '/candidates' ? 'bg-gray-100' : ''}`}
                        >
                          <Award className="mr-3 text-udom-blue" size={20} />
                          Candidates
                        </Link>
                      </li>
                      <li>
                        <Link 
                          to="/results" 
                          className={`flex items-center p-2 rounded hover:bg-gray-100 text-black ${location.pathname === '/results' ? 'bg-gray-100' : ''}`}
                        >
                          <Calendar className="mr-3 text-udom-blue" size={20} />
                          Results
                        </Link>
                      </li>
                      <li>
                        <Link 
                          to="/feedback-management" 
                          className={`flex items-center p-2 rounded hover:bg-gray-100 text-black ${location.pathname === '/feedback-management' ? 'bg-gray-100' : ''}`}
                        >
                          <MessageSquare className="mr-3 text-udom-blue" size={20} />
                          Feedback Management
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </nav>
            </div>
          </aside>
        )}
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-white p-6">
          {children}
        </main>

        {/* Voice Assistant with proper props */}
        <VoiceAssistant userRole={userRole} />
      </div>
    </div>
  );
};

export default Layout;
