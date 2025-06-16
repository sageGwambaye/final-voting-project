
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell, Legend 
} from 'recharts';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DataTable from '@/components/ui/datatable';
import { CalendarClock, Clock, Download, Users } from 'lucide-react';
import { mockCandidatesData, mockElection, mockPositionsData, mockResults, COLORS } from '@/data/mockData';
import { useQuery } from '@tanstack/react-query';

// Types for data
interface Position {
  id: number;
  title: string;
  maxVotes: number;
}

interface Candidate {
  id: number;
  firstName: string;
  lastName: string;
  position: string;
  imageUrl: string;
  votes: number;
  program?: string;
}

const ResultsPage = () => {
  const [selectedPosition, setSelectedPosition] = useState<string>(mockPositionsData[0].title);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { toast } = useToast();
  
  // Format data for chart based on selected position
  const chartData = filteredCandidates.map(candidate => ({
    name: `${candidate.firstName} ${candidate.lastName}`,
    votes: candidate.votes
  }));
  
  // Effect to filter candidates by selected position
  useEffect(() => {
    const filtered = mockCandidatesData.filter(
      candidate => candidate.position === selectedPosition
    );
    setFilteredCandidates(filtered);
  }, [selectedPosition]);
  
  // Handle position tab change
  const handlePositionChange = (position: string) => {
    setSelectedPosition(position);
  };
  
  // Handle download results
  const handleDownloadResults = () => {
    // In a real app, this would generate a PDF or CSV
    toast({
      title: "Results Downloaded",
      description: "Election results have been downloaded successfully.",
    });
  };
  
  // Calculate voting statistics from mock election data
  const participationRate = Math.round((mockElection.votedVoters / mockElection.totalVoters) * 100);
  
  // Sort candidates by votes
  const sortedCandidates = [...filteredCandidates].sort((a, b) => b.votes - a.votes);
  const winner = sortedCandidates.length > 0 ? sortedCandidates[0] : null;
  
  // Define table columns
  const candidatesColumns = [
    {
      id: 'candidate',
      header: 'Candidate',
      cell: (row: Candidate) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full overflow-hidden">
            <img 
              src={row.imageUrl} 
              alt={`${row.firstName} ${row.lastName}`}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <div className="font-medium name">{row.firstName} {row.lastName}</div>
            <div className="text-sm text-gray-500">{row.program || 'BSc. Software Engineering'}</div>
          </div>
        </div>
      ),
      sortable: true
    },
    {
      id: 'position',
      header: 'Position',
      cell: (row: Candidate) => <span>{row.position}</span>,
      sortable: true
    },
    {
      id: 'votes',
      header: 'Votes',
      cell: (row: Candidate) => (
        <div className="flex items-center gap-2">
          <span className="font-medium votes">{row.votes}</span>
          <div className="w-24 h-2 rounded-full bg-gray-200">
            <div 
              className="h-2 rounded-full bg-udom-blue" 
              style={{ width: `${(row.votes / mockElection.votedVoters) * 100}%` }}
            ></div>
          </div>
          <span className="text-xs text-gray-500">
            {((row.votes / mockElection.votedVoters) * 100).toFixed(1)}%
          </span>
        </div>
      ),
      sortable: true
    }
  ];
  
  // Search function for table
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };
  
  // Get all candidates for table view
  const allCandidates = searchTerm 
    ? mockCandidatesData.filter(
        candidate => 
          `${candidate.firstName} ${candidate.lastName}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          candidate.position.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : mockCandidatesData;
    
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Election Results</h1>
        <div className="text-sm breadcrumbs text-gray-600">
          <ul className="flex">
            <li><Link to="/" className="hover:text-gray-900">Home</Link></li>
            <li className="before:content-['/'] before:mx-2">Results</li>
          </ul>
        </div>
      </div>
      
      {/* Election Info Card */}
      <Card className="bg-white border-gray-200">
        <CardHeader className="border-b border-gray-100">
          <div className="flex justify-between items-center">
            <CardTitle className="text-gray-800">{mockElection.title}</CardTitle>
            <Button 
              variant="outline"
              onClick={handleDownloadResults}
              className="flex items-center gap-2 bg-white"
            >
              <Download size={16} />
              <span>Download Results</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="bg-udom-blue/10 text-udom-blue p-3 rounded-full">
                <CalendarClock size={20} />
              </div>
              <div>
                <div className="text-sm text-gray-500">Period</div>
                <div className="font-medium">
                  {new Date(mockElection.startDate).toLocaleDateString()} - {new Date(mockElection.endDate).toLocaleDateString()}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="bg-udom-orange/10 text-udom-orange p-3 rounded-full">
                <Users size={20} />
              </div>
              <div>
                <div className="text-sm text-gray-500">Voter Turnout</div>
                <div className="font-medium">
                  {mockElection.votedVoters} / {mockElection.totalVoters} ({participationRate}%)
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="bg-green-100 text-green-600 p-3 rounded-full">
                <Clock size={20} />
              </div>
              <div>
                <div className="text-sm text-gray-500">Status</div>
                <div className="font-medium">
                  {mockElection.status === "active" ? "In Progress" : "Completed"}
                </div>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="charts" className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="charts">Charts</TabsTrigger>
              <TabsTrigger value="table">Table View</TabsTrigger>
            </TabsList>
            
            <TabsContent value="charts" className="space-y-6">
              <div className="bg-white rounded-md p-6 border border-gray-200">
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Results by Position</h3>
                  <div className="flex flex-wrap gap-2">
                    {mockPositionsData.map(position => (
                      <Button
                        key={position.id}
                        variant={selectedPosition === position.title ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePositionChange(position.title)}
                        className={selectedPosition === position.title ? "bg-udom-blue hover:bg-blue-700" : "bg-white"}
                      >
                        {position.title}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="h-[400px] bg-white">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 60,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fill: '#6B7280' }}
                        tickLine={{ stroke: '#E5E7EB' }}
                        axisLine={{ stroke: '#E5E7EB' }}
                        angle={-45}
                        textAnchor="end"
                        height={70}
                      />
                      <YAxis 
                        tick={{ fill: '#6B7280' }}
                        tickLine={{ stroke: '#E5E7EB' }}
                        axisLine={{ stroke: '#E5E7EB' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #E5E7EB',
                          borderRadius: '0.375rem',
                        }}
                        itemStyle={{ color: '#111827' }}
                        labelStyle={{ color: '#4B5563', fontWeight: 'bold' }}
                      />
                      <Legend />
                      <Bar dataKey="votes" name="Votes">
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Winner Card */}
              {winner && (
                <div className="bg-white rounded-md border border-gray-200 p-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">
                    {selectedPosition} Winner
                  </h3>
                  <div className="flex items-center gap-6">
                    <div className="h-20 w-20 rounded-full overflow-hidden border-4 border-udom-blue">
                      <img 
                        src={winner.imageUrl} 
                        alt={`${winner.firstName} ${winner.lastName}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900 candidate-result">
                        <span className="name">{winner.firstName} {winner.lastName}</span>
                      </h4>
                      <div className="text-udom-blue">BSc. Software Engineering</div>
                      <div className="flex items-center gap-2 mt-2 text-gray-700">
                        <span className="votes font-medium">{winner.votes} votes</span>
                        <span className="text-sm text-gray-500">
                          ({((winner.votes / mockElection.votedVoters) * 100).toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Results List */}
              <div className="bg-white rounded-md border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  Detailed Results: {selectedPosition}
                </h3>
                
                <div className="space-y-4">
                  {sortedCandidates.map((candidate, index) => (
                    <div 
                      key={candidate.id}
                      className={`p-4 rounded-md border candidate-result ${
                        index === 0 ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-full overflow-hidden">
                            <img 
                              src={candidate.imageUrl} 
                              alt={`${candidate.firstName} ${candidate.lastName}`}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 name">
                              {candidate.firstName} {candidate.lastName}
                            </h4>
                            <div className="text-sm text-gray-500">BSc. Software Engineering</div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="votes font-semibold text-lg">{candidate.votes} votes</div>
                          <div className="text-sm text-gray-500">
                            {((candidate.votes / mockElection.votedVoters) * 100).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-3 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full"
                          style={{
                            width: `${(candidate.votes / mockElection.votedVoters) * 100}%`,
                            backgroundColor: COLORS[index % COLORS.length]
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="table">
              <DataTable 
                columns={candidatesColumns}
                data={allCandidates}
                searchable={true}
                showExport={true}
                onSearch={handleSearch}
                onExport={handleDownloadResults}
              />
            </TabsContent>
          </Tabs>
          
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsPage;
