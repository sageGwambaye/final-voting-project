
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, UserPlus, ListChecks, Award,
  PieChartIcon, BarChart2, Activity, ArrowRight 
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { mockPositionsData, mockCandidatesData, mockVotersData, mockFeedbacks, COLORS } from '../../data/mockData';

// Recharts components
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

// Mock data
const mockVotingTrend = [
  { time: '8 AM', votes: 12 },
  { time: '9 AM', votes: 25 },
  { time: '10 AM', votes: 41 },
  { time: '11 AM', votes: 35 },
  { time: '12 PM', votes: 22 },
  { time: '1 PM', votes: 18 },
  { time: '2 PM', votes: 32 },
  { time: '3 PM', votes: 45 },
  { time: '4 PM', votes: 30 },
  { time: '5 PM', votes: 18 },
];

const mockVotersByDemo = [
  { name: 'First Year', value: 120 },
  { name: 'Second Year', value: 80 },
  { name: 'Third Year', value: 70 },
  { name: 'Fourth Year', value: 50 },
];

const AdminDashboard = () => {
  const [positionExpanded, setPositionExpanded] = useState(false);
  const [statistics, setStatistics] = useState({
    positions: 0,
    candidates: 0,
    totalVoters: 0,
    votersVoted: 0,
    pendingVoters: 0,
    voterTurnout: 0,
    totalElections: 1,
    activeElections: 1,
    completedElections: 0,
    feedback: 0
  });
  
  useEffect(() => {
    // Calculate statistics from mock data
    const voted = mockVotersData.filter(voter => voter.votingStatus === 'Voted').length;
    const total = mockVotersData.length;
    const turnout = total > 0 ? (voted / total) * 100 : 0;
    
    setStatistics({
      positions: mockPositionsData.length,
      candidates: mockCandidatesData.length,
      totalVoters: total,
      votersVoted: voted,
      pendingVoters: total - voted,
      voterTurnout: parseFloat(turnout.toFixed(1)),
      totalElections: 1,
      activeElections: 1,
      completedElections: 0,
      feedback: mockFeedbacks.length
    });
  }, []);
  
  const { toast } = useToast();
  
  const handleMoreInfo = (type: string) => {
    toast({
      title: `${type} Information`,
      description: `Detailed information about ${type.toLowerCase()} will be shown here.`,
    });
  };

  // Format positions data for chart
  const formatPositionsData = () => {
    return mockPositionsData.map(position => {
      const candidates = mockCandidatesData.filter(c => c.position === position.title);
      const votes = candidates.reduce((sum, c) => sum + c.votes, 0);
      
      return {
        name: position.title,
        candidates: candidates.length,
        votes: votes
      };
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-udom-black">Admin Dashboard</h1>
        <div className="text-sm breadcrumbs text-gray-600">
          <ul className="flex">
            <li><Link to="/admin/dashboard" className="hover:text-udom-blue">Home</Link></li>
            <li className="before:content-['/'] before:mx-2">Admin Dashboard</li>
          </ul>
        </div>
      </div>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-positions">
          <CardHeader className="pb-2">
            <CardTitle className="text-4xl font-bold text-white">{statistics.positions}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white">No. of Positions</p>
            <button 
              className="mt-4 text-sm flex items-center text-white"
              onClick={() => handleMoreInfo('Positions')}
            >
              More info <ArrowRight size={14} className="ml-1" />
            </button>
          </CardContent>
        </Card>
        
        <Card className="card-candidates">
          <CardHeader className="pb-2">
            <CardTitle className="text-4xl font-bold text-udom-black">{statistics.candidates}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>No. of Candidates</p>
            <button 
              className="mt-4 text-sm flex items-center text-udom-blue"
              onClick={() => handleMoreInfo('Candidates')}
            >
              More info <ArrowRight size={14} className="ml-1" />
            </button>
          </CardContent>
        </Card>
        
        <Card className="card-voters">
          <CardHeader className="pb-2">
            <CardTitle className="text-4xl font-bold text-white">{statistics.totalVoters}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white">Total Voters</p>
            <button 
              className="mt-4 text-sm flex items-center text-white"
              onClick={() => handleMoreInfo('Voters')}
            >
              More info <ArrowRight size={14} className="ml-1" />
            </button>
          </CardContent>
        </Card>
        
        <Card className="card-voted">
          <CardHeader className="pb-2">
            <CardTitle className="text-4xl font-bold text-white">{statistics.votersVoted}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white">Voters Voted</p>
            <button 
              className="mt-4 text-sm flex items-center text-white"
              onClick={() => handleMoreInfo('Votes')}
            >
              More info <ArrowRight size={14} className="ml-1" />
            </button>
          </CardContent>
        </Card>
      </div>
      
      {/* Additional Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border border-gray-200 bg-white">
          <CardHeader>
            <CardTitle className="text-udom-black flex items-center">
              <Users className="mr-2" /> Voter Turnout
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-udom-blue">{statistics.voterTurnout}%</div>
              <p className="text-gray-600 mt-2">{statistics.votersVoted} of {statistics.totalVoters} voters</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                <div className="bg-udom-blue h-2.5 rounded-full" style={{ width: `${statistics.voterTurnout}%` }}></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-gray-200 bg-white">
          <CardHeader>
            <CardTitle className="text-udom-black flex items-center">
              <ListChecks className="mr-2" /> University Election
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-3xl font-bold text-udom-blue">{statistics.totalElections}</div>
                <p className="text-gray-500 text-sm">Total</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-udom-blue">{statistics.activeElections}</div>
                <p className="text-gray-500 text-sm">Active</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-udom-orange">{statistics.completedElections}</div>
                <p className="text-gray-500 text-sm">Completed</p>
              </div>
            </div>
            <div className="mt-4">
              <Link to="/positions">
                <Button variant="outline" className="w-full border-udom-blue text-udom-blue hover:bg-udom-blue hover:text-white">Manage Election</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Analytics Tabs */}
      <Card className="border border-gray-200 bg-white">
        <CardHeader>
          <CardTitle className="text-udom-black">Analytics</CardTitle>
          <CardDescription className="text-gray-600">
            Detailed insights into voting patterns and user engagement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="voting-trends">
            <TabsList className="mb-4">
              <TabsTrigger value="voting-trends">Voting Trends</TabsTrigger>
              <TabsTrigger value="candidate-performance">Candidate Performance</TabsTrigger>
              <TabsTrigger value="voter-demographics">Voter Demographics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="voting-trends">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={mockVotingTrend}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="time" stroke="#333" />
                    <YAxis stroke="#333" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="votes" stroke="#0052CC" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="candidate-performance">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={mockCandidatesData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis 
                      dataKey={(data) => `${data.firstName} ${data.lastName}`}
                      stroke="#333"
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis stroke="#333" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="votes" fill="#0052CC" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="voter-demographics">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mockVotersByDemo}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, percent}) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {mockVotersByDemo.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Positions Table */}
      <Card className="border border-gray-200 bg-white">
        <CardHeader className="pb-0">
          <div className="flex justify-between items-center">
            <CardTitle className="text-udom-black">Positions</CardTitle>
            <Button 
              variant="ghost" 
              className="h-8 w-8 p-0 text-udom-black"
              onClick={() => setPositionExpanded(!positionExpanded)}
            >
              {positionExpanded ? <Activity /> : <Activity />}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className={`overflow-x-auto ${positionExpanded ? 'max-h-none' : 'max-h-[200px]'}`}>
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="text-xs uppercase bg-gray-100">
                <tr>
                  <th scope="col" className="px-6 py-3">Position</th>
                  <th scope="col" className="px-6 py-3">Candidates</th>
                  <th scope="col" className="px-6 py-3">Total Votes</th>
                </tr>
              </thead>
              <tbody>
                {formatPositionsData().map((position, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="px-6 py-3">{position.name}</td>
                    <td className="px-6 py-3">{position.candidates}</td>
                    <td className="px-6 py-3">{position.votes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-udom-black">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/voters">
            <Card className="bg-udom-blue hover:bg-blue-700 transition-colors border-none text-white cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <UserPlus size={36} className="mb-2" />
                <h3 className="text-lg font-medium">Manage Voters</h3>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/candidates">
            <Card className="bg-udom-blue hover:bg-blue-700 transition-colors border-none text-white cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Award size={36} className="mb-2" />
                <h3 className="text-lg font-medium">Manage Candidates</h3>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/positions">
            <Card className="bg-udom-blue hover:bg-blue-700 transition-colors border-none text-white cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <ListChecks size={36} className="mb-2" />
                <h3 className="text-lg font-medium">Manage Positions</h3>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/votes">
            <Card className="bg-udom-orange hover:bg-orange-600 transition-colors border-none text-white cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <PieChartIcon size={36} className="mb-2" />
                <h3 className="text-lg font-medium">View Results</h3>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
