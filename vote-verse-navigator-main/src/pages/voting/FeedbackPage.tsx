
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Check, MessageSquare, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { mockFeedbacks } from '@/data/mockData';

const FeedbackPage = () => {
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    // Get current user from session
    const userSession = localStorage.getItem('userSession');
    if (userSession) {
      setCurrentUser(JSON.parse(userSession));
    }
  }, []);
  
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!comments.trim()) {
      newErrors.comments = 'Please provide some feedback';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Add feedback to mock data
      const newFeedback = {
        id: mockFeedbacks.length + 1,
        userId: currentUser?.id || 1,
        userName: currentUser?.name || 'Anonymous User',
        feedbackText: comments,
        createdDate: new Date().toISOString().split('T')[0]
      };
      
      mockFeedbacks.push(newFeedback);
      
      // Submission successful
      setSubmitted(true);
      toast({
        title: 'Feedback Submitted',
        description: 'Thank you for your valuable feedback.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: 'There was an error submitting your feedback. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleReset = () => {
    setComments('');
    setSubmitted(false);
    setErrors({});
  };
  
  if (submitted) {
    return (
      <Card className="bg-white border-gray-200 max-w-md mx-auto mt-16">
        <CardContent className="pt-10 pb-10 text-center">
          <div className="bg-green-100 text-green-600 rounded-full p-6 w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <Check size={48} />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Thank You!</h2>
          <p className="text-gray-600 mb-6">
            Your feedback has been submitted successfully. We appreciate your time and insights.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="outline" 
              onClick={handleReset}
              className="border-gray-300"
            >
              Submit Another Feedback
            </Button>
            <Link to="/dashboard">
              <Button className="bg-udom-blue hover:bg-blue-700 w-full">
                Return to Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Election Feedback</h1>
        <div className="text-sm breadcrumbs text-gray-500">
          <ul className="flex">
            <li><Link to="/" className="hover:text-gray-800">Home</Link></li>
            <li className="before:content-['/'] before:mx-2">Feedback</li>
          </ul>
        </div>
      </div>
      
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-800">Share Your Feedback</CardTitle>
          <CardDescription className="text-gray-500">
            Help us improve future elections by providing your thoughts and suggestions.
            {currentUser && (
              <span className="block mt-2 text-sm font-medium text-gray-700">
                Submitting as: {currentUser.name} ({currentUser.email})
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="comments" className="text-gray-700 font-medium">
                Comments and Suggestions <span className="text-red-500">*</span>
              </label>
              <Textarea
                id="comments"
                value={comments}
                onChange={(e) => {
                  setComments(e.target.value);
                  if (errors.comments) {
                    setErrors(prev => ({ ...prev, comments: '' }));
                  }
                }}
                placeholder="Please share your thoughts, suggestions, or concerns about the voting experience..."
                className={`min-h-[120px] bg-white border-gray-300 text-gray-800 ${errors.comments ? 'border-red-500' : ''}`}
              />
              {errors.comments && <p className="text-red-500 text-sm">{errors.comments}</p>}
            </div>
            
            <div className="pt-4 flex justify-end space-x-4">
              <Button 
                type="button" 
                variant="outline"
                onClick={handleReset}
                className="border-gray-300"
              >
                Reset
              </Button>
              <Button 
                type="submit"
                className="bg-udom-blue hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Send size={16} className="mr-2" />
                    Submit Feedback
                  </div>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-800 flex items-center">
            <MessageSquare className="mr-2" size={20} />
            Why Your Feedback Matters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-gray-800 font-medium mb-2">Improving Future Elections</h3>
              <p className="text-gray-600 text-sm">
                Your feedback helps us identify areas for improvement and enhance the voting experience for all users.
              </p>
            </div>
            
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-gray-800 font-medium mb-2">Addressing Issues</h3>
              <p className="text-gray-600 text-sm">
                By reporting problems or difficulties, you enable us to fix technical issues and streamline the process.
              </p>
            </div>
            
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-gray-800 font-medium mb-2">Shaping the Future</h3>
              <p className="text-gray-600 text-sm">
                Your suggestions for new features or enhancements will be considered for implementation in our system.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackPage;
