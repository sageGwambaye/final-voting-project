
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Vote, BarChart3, Calendar, MessageSquare, Users, CheckCircle, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { mockCandidatesData, mockPositionsData, mockVotersData } from '@/data/mockData';
import UserHeader from '@/components/UserHeader';

const VoterDashboard = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  useEffect(() => {
    // Get current user from session
    const userSession = localStorage.getItem('userSession');
    if (userSession) {
      setCurrentUser(JSON.parse(userSession));
    }

    // Set recent activities
    setRecentActivities([
      {
        id: 1,
        type: 'vote',
        description: 'Voted for University President',
        timestamp: new Date().toISOString(),
        icon: Vote
      },
      {
        id: 2,
        type: 'feedback',
        description: 'Submitted feedback about voting process',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        icon: MessageSquare
      }
    ]);
  }, []);

  // Calculate voting statistics
  const totalVoters = mockVotersData.length;
  const votedVoters = mockVotersData.filter(voter => voter.votingStatus === 'Voted').length;
  const participationRate = Math.round((votedVoters / totalVoters) * 100);

  // Prepare data for charts
  const candidateVoteData = mockPositionsData.map(position => {
    const positionCandidates = mockCandidatesData.filter(c => c.position === position.title);
    const totalVotes = positionCandidates.reduce((sum, c) => sum + c.voteCount, 0);
    
    return {
      position: position.title,
      totalVotes: totalVotes,
      candidates: positionCandidates.length
    };
  });

  const participationData = [
    { name: 'Voted', value: votedVoters, color: '#3b82f6' },
    { name: 'Not Voted', value: totalVoters - votedVoters, color: '#e5e7eb' }
  ];

  const timelineData = [
    { time: '8:00', votes: 45 },
    { time: '10:00', votes: 120 },
    { time: '12:00', votes: 180 },
    { time: '14:00', votes: 250 },
    { time: '16:00', votes: 320 },
    { time: '18:00', votes: votedVoters }
  ];

  const userVotingStatus = currentUser ? 
    mockVotersData.find(voter => voter.id === currentUser.id)?.votingStatus || 'Not Voted' 
    : 'Not Voted';

  return (
    <div className="min-h-screen bg-gray-50">
      <UserHeader />
      <div className="container mx-auto p-6 bg-white min-h-screen">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {currentUser?.firstName || 'Voter'}!
          </h1>
          <p className="text-gray-600">Here's your voting dashboard and election overview</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Your Status</p>
                  <p className="text-2xl font-bold">{userVotingStatus}</p>
                </div>
                <div className={`p-3 rounded-full ${userVotingStatus === 'Voted' ? 'bg-green-500' : 'bg-yellow-500'}`}>
                  <CheckCircle className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Total Positions</p>
                  <p className="text-2xl font-bold">{mockPositionsData.length}</p>
                </div>
                <div className="bg-green-400 bg-opacity-50 p-3 rounded-full">
                  <Vote className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Total Candidates</p>
                  <p className="text-2xl font-bold">{mockCandidatesData.length}</p>
                </div>
                <div className="bg-purple-400 bg-opacity-50 p-3 rounded-full">
                  <Users className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Participation Rate</p>
                  <p className="text-2xl font-bold">{participationRate}%</p>
                </div>
                <div className="bg-orange-400 bg-opacity-50 p-3 rounded-full">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/voting')}>
            <CardContent className="p-6 text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Vote className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Cast Your Vote</h3>
              <p className="text-gray-600 text-sm mb-4">
                {userVotingStatus === 'Voted' ? 'You have already voted' : 'Start voting for your preferred candidates'}
              </p>
              <Button 
                className={`w-full ${userVotingStatus === 'Voted' ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                disabled={userVotingStatus === 'Voted'}
              >
                {userVotingStatus === 'Voted' ? 'Voted' : 'Go to Voting'}
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/results')}>
            <CardContent className="p-6 text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">View Results</h3>
              <p className="text-gray-600 text-sm mb-4">Check real-time election results and statistics</p>
              <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50">
                View Results
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/feedback')}>
            <CardContent className="p-6 text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Give Feedback</h3>
              <p className="text-gray-600 text-sm mb-4">Share your thoughts about the voting process</p>
              <Button variant="outline" className="w-full border-purple-600 text-purple-600 hover:bg-purple-50">
                Give Feedback
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Real-time Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Votes by Position
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={candidateVoteData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="position" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="totalVotes" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                Voter Participation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={participationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {participationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center mt-4 space-x-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Voted ({votedVoters})</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-300 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Not Voted ({totalVoters - votedVoters})</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Voting Timeline */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              Voting Timeline (Today)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="votes" stroke="#f59e0b" fill="#fbbf24" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Election Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Election Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Election Status</h3>
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full inline-block">
                  Active
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Voting Period</h3>
                <p className="text-gray-600">December 9, 2024</p>
                <p className="text-sm text-gray-500">8:00 AM - 6:00 PM</p>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Registered Voters</h3>
                <p className="text-2xl font-bold text-blue-600">{totalVoters}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VoterDashboard;
