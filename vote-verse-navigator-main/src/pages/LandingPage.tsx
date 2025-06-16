
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col dark">
      {/* Hero Section */}
      <div className="relative bg-fyp-dark-blue text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-purple-900/40 z-0"></div>
        <header className="relative z-10 container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center">
            <img src="/lovable-uploads/df7df768-ce24-43ba-b317-557a34ae679d.png" alt="FYP Logo" className="w-10 h-10 mr-2" />
            <h1 className="text-2xl font-bold">FYP Voting System</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-white hover:text-gray-200">Login</Link>
            <Link to="/register">
              <Button className="bg-blue-600 hover:bg-blue-700">Register</Button>
            </Link>
          </div>
        </header>
        
        <div className="relative z-10 container mx-auto px-4 py-20 md:py-32 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">AI-Enhanced Voting System</h2>
            <p className="text-xl mb-8">Secure, transparent and accessible voting for everyone. Experience the next generation of digital democracy.</p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/register">
                <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3">Get Started</Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" className="w-full sm:w-auto text-lg px-8 py-3 border-white text-white hover:bg-white/10">Learn More</Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 md:pl-10">
            <img 
              src="/lovable-uploads/a162013d-ef31-46f6-8bd2-b09dfe38e848.png" 
              alt="Voting System" 
              className="w-full max-w-lg mx-auto rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-white mb-16">Key Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
              <div className="bg-blue-600 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-7 h-7 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Secure Voting</h3>
              <p className="text-gray-300">Advanced encryption and verification processes ensure your vote is secure and tamper-proof.</p>
            </div>
            
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
              <div className="bg-green-600 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-7 h-7 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Real-time Results</h3>
              <p className="text-gray-300">Watch as results are tallied and displayed in real-time with intuitive visualizations.</p>
            </div>
            
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
              <div className="bg-purple-600 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-7 h-7 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Customizable Elections</h3>
              <p className="text-gray-300">Create and manage various types of elections with flexible options and configurations.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-white mb-16">How It Works</h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center mb-12">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold mb-4 md:mb-0 md:mr-6">1</div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Register your account</h3>
                <p className="text-gray-300">Create your secure account with your personal details and verification.</p>
              </div>
            </div>
            
            <div className="w-px h-12 bg-gray-700 ml-8 md:ml-8 my-2 hidden md:block"></div>
            
            <div className="flex flex-col md:flex-row items-center mb-12">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold mb-4 md:mb-0 md:mr-6">2</div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Browse available elections</h3>
                <p className="text-gray-300">View ongoing and upcoming elections that you're eligible to participate in.</p>
              </div>
            </div>
            
            <div className="w-px h-12 bg-gray-700 ml-8 md:ml-8 my-2 hidden md:block"></div>
            
            <div className="flex flex-col md:flex-row items-center mb-12">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold mb-4 md:mb-0 md:mr-6">3</div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Cast your vote securely</h3>
                <p className="text-gray-300">Follow the simple steps to cast your vote with multi-factor authentication.</p>
              </div>
            </div>
            
            <div className="w-px h-12 bg-gray-700 ml-8 md:ml-8 my-2 hidden md:block"></div>
            
            <div className="flex flex-col md:flex-row items-center">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold mb-4 md:mb-0 md:mr-6">4</div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">View real-time results</h3>
                <p className="text-gray-300">Access the live dashboard to see results as they come in.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-white mb-16">What Users Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-8 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">J</div>
                <div>
                  <h4 className="text-white font-medium">John Smith</h4>
                  <p className="text-gray-400 text-sm">Election Administrator</p>
                </div>
              </div>
              <p className="text-gray-300">"This platform has transformed how we run our organization's elections. The real-time results and security features are outstanding."</p>
            </div>
            
            <div className="bg-gray-800 p-8 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">S</div>
                <div>
                  <h4 className="text-white font-medium">Sarah Johnson</h4>
                  <p className="text-gray-400 text-sm">Voter</p>
                </div>
              </div>
              <p className="text-gray-300">"Voting has never been easier or more secure. I appreciate being able to see the results immediately after the election closes."</p>
            </div>
            
            <div className="bg-gray-800 p-8 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">M</div>
                <div>
                  <h4 className="text-white font-medium">Michael Brown</h4>
                  <p className="text-gray-400 text-sm">University Representative</p>
                </div>
              </div>
              <p className="text-gray-300">"We've increased student participation in campus elections by 45% since adopting this platform. The interface is intuitive and engaging."</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-20 bg-blue-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to get started?</h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">Join thousands of organizations that trust our platform for their voting needs.</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/register">
              <Button className="w-full sm:w-auto bg-white text-blue-700 hover:bg-gray-100 text-lg px-8 py-3">Create Account</Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10 text-lg px-8 py-3">Contact Us</Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-10 md:mb-0">
              <div className="flex items-center mb-4">
                <img src="/lovable-uploads/df7df768-ce24-43ba-b317-557a34ae679d.png" alt="FYP Logo" className="w-8 h-8 mr-2" />
                <h3 className="text-xl font-bold text-white">FYP Voting System</h3>
              </div>
              <p className="max-w-xs">Secure, transparent and accessible online voting platform powered by AI.</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">Product</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-white">Features</a></li>
                  <li><a href="#" className="hover:text-white">Security</a></li>
                  <li><a href="#" className="hover:text-white">Pricing</a></li>
                  <li><a href="#" className="hover:text-white">Testimonials</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">Company</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-white">About Us</a></li>
                  <li><a href="#" className="hover:text-white">Blog</a></li>
                  <li><a href="#" className="hover:text-white">Careers</a></li>
                  <li><a href="#" className="hover:text-white">Contact</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">Legal</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                  <li><a href="#" className="hover:text-white">Cookie Policy</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p>© 2025 FYP Voting System. All rights reserved.</p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
