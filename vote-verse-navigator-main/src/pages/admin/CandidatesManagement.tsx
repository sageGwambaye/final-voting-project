
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { candidates, admin, positions } from '@/services/apiService';
import { Award, Eye, Loader2, Users, Play, Plus, Video } from 'lucide-react';
import DataTable from '@/components/ui/datatable';

interface Candidate {
  id: number;
  name: string;
  position: {
    id: number;
    title: string;
  };
  imageUrl: string;
  manifesto: string;
  regNumber: string;
  voteCount: number;
  videoUrl?: string;
}

interface User {
  id: number;
  username: string;
  regNumber: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'VOTER';
  imageUrl?: string;
}

interface Position {
  id: number;
  name: string;
  title: string;
  description: string;
}

const CandidatesManagement = () => {
  const [candidatesList, setCandidatesList] = useState<Candidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [votersList, setVotersList] = useState<User[]>([]);
  const [positionsList, setPositionsList] = useState<Position[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state for adding new candidate
  const [newCandidate, setNewCandidate] = useState({
    voterId: '',
    positionId: '',
    manifesto: '',
    imageUrl: '',
    videoUrl: ''
  });
  
  const { toast } = useToast();
  
  // Load data on component mount
  useEffect(() => {
    loadAllData();
  }, []);

  // Filter candidates based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredCandidates(candidatesList);
    } else {
      const filtered = candidatesList.filter(candidate => {
        const searchString = searchTerm.toLowerCase();
        return (
          candidate.name.toLowerCase().includes(searchString) ||
          candidate.position.title.toLowerCase().includes(searchString) ||
          candidate.regNumber.toLowerCase().includes(searchString) ||
          candidate.manifesto.toLowerCase().includes(searchString)
        );
      });
      setFilteredCandidates(filtered);
    }
  }, [searchTerm, candidatesList]);
  
  const loadAllData = async () => {
    try {
      setIsLoading(true);
      
      // Load candidates, voters, and positions in parallel
      const [candidatesData, votersData, positionsData] = await Promise.all([
        candidates.getAll(),
        admin.getVoters(),
        positions.getAll()
      ]);
      
      setCandidatesList(candidatesData || []);
      setVotersList(votersData || []);
      setPositionsList(positionsData || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load data from the server.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle view candidate
  const handleView = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsViewDialogOpen(true);
  };

  // Handle add new candidate
  const handleAddCandidate = () => {
    setNewCandidate({
      voterId: '',
      positionId: '',
      manifesto: '',
      imageUrl: '',
      videoUrl: ''
    });
    setIsAddDialogOpen(true);
  };

  // Submit new candidate
  const handleSubmitNewCandidate = async () => {
    if (!newCandidate.voterId || !newCandidate.positionId) {
      toast({
        title: "Error",
        description: "Please select both a voter and a position.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      const selectedVoter = votersList.find(v => v.id.toString() === newCandidate.voterId);
      if (!selectedVoter) throw new Error('Selected voter not found');

      const candidateData = {
        name: selectedVoter.name,
        regNumber: selectedVoter.regNumber,
        positionId: parseInt(newCandidate.positionId),
        manifesto: newCandidate.manifesto,
        imageUrl: newCandidate.imageUrl || selectedVoter.imageUrl || '',
        videoUrl: newCandidate.videoUrl
      };

      await candidates.save(candidateData);
      
      toast({
        title: "Success",
        description: "Candidate added successfully!",
      });
      
      setIsAddDialogOpen(false);
      loadAllData(); // Refresh the data
    } catch (error) {
      console.error('Error adding candidate:', error);
      toast({
        title: "Error",
        description: "Failed to add candidate. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle search
  const handleSearch = (searchValue: string) => {
    setSearchTerm(searchValue);
  };

  // Export candidates data
  const handleExport = () => {
    const csvData = candidatesList.map(candidate => ({
      'ID': candidate.id,
      'Name': candidate.name,
      'Registration Number': candidate.regNumber,
      'Position': candidate.position.title,
      'Vote Count': candidate.voteCount,
      'Manifesto': candidate.manifesto.substring(0, 100) + '...'
    }));

    const headers = Object.keys(csvData[0] || {}).join(',');
    const rows = csvData.map(row => Object.values(row).map(value => `"${value}"`).join(','));
    const csv = [headers, ...rows].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'candidates.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Define table columns
  const columns = [
    {
      id: 'imageUrl',
      header: 'Photo',
      cell: (candidate: Candidate) => (
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 border">
          {candidate.imageUrl ? (
            <img 
              src={candidate.imageUrl} 
              alt={candidate.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <Users size={16} />
            </div>
          )}
        </div>
      )
    },
    {
      id: 'name',
      header: 'Name',
      cell: (candidate: Candidate) => (
        <span className="font-medium text-gray-900">{candidate.name}</span>
      ),
      sortable: true
    },
    {
      id: 'regNumber',
      header: 'Registration Number',
      cell: (candidate: Candidate) => (
        <span className="text-gray-700">{candidate.regNumber}</span>
      ),
      sortable: true
    },
    {
      id: 'position',
      header: 'Position',
      cell: (candidate: Candidate) => (
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
          {candidate.position.title}
        </span>
      ),
      sortable: true
    },
    {
      id: 'voteCount',
      header: 'Vote Count',
      cell: (candidate: Candidate) => (
        <span className="font-semibold text-gray-900">{candidate.voteCount}</span>
      ),
      sortable: true
    },
    {
      id: 'videoUrl',
      header: 'Video',
      cell: (candidate: Candidate) => (
        candidate.videoUrl ? (
          <Video className="h-4 w-4 text-green-600" />
        ) : (
          <span className="text-gray-400 text-sm">No video</span>
        )
      )
    },
    {
      id: 'manifesto',
      header: 'Manifesto Preview',
      cell: (candidate: Candidate) => (
        <span className="text-gray-600 text-sm max-w-xs truncate block">
          {candidate.manifesto ? candidate.manifesto.substring(0, 50) + '...' : 'No manifesto'}
        </span>
      )
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (candidate: Candidate) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleView(candidate)}
          className="text-blue-600 border-blue-600 hover:bg-blue-50"
        >
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
      )
    }
  ];
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-700">Loading candidates...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Candidates Management</h1>
          <div className="text-sm breadcrumbs text-gray-600">
            <ul className="flex space-x-2">
              <li><Link to="/" className="hover:text-blue-600">Home</Link></li>
              <li className="before:content-['/'] before:mx-2">Candidates</li>
            </ul>
          </div>
        </div>
        
        <Card className="bg-white border border-gray-200 shadow-sm">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-4">
                <Award className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Candidates List</h2>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  Total: {candidatesList.length}
                </span>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleAddCandidate}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Plus size={16} className="mr-2" />
                  Add New Candidate
                </Button>
                <Button 
                  onClick={loadAllData}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Award size={16} className="mr-2" />
                  Refresh
                </Button>
              </div>
            </div>

            <DataTable
              columns={columns}
              data={filteredCandidates}
              searchable={true}
              showExport={true}
              onSearch={handleSearch}
              onExport={handleExport}
            />
          </div>
        </Card>
        
        {/* View Candidate Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="bg-white text-gray-900 border-gray-200 sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-gray-900">Candidate Details</DialogTitle>
            </DialogHeader>
            
            {selectedCandidate && (
              <div className="space-y-6">
                <div className="flex items-center space-x-6">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
                    {selectedCandidate.imageUrl ? (
                      <img 
                        src={selectedCandidate.imageUrl} 
                        alt={selectedCandidate.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Users size={32} />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {selectedCandidate.name}
                    </h3>
                    <p className="text-gray-600 mb-1">
                      <strong>Registration Number:</strong> {selectedCandidate.regNumber}
                    </p>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {selectedCandidate.position.title}
                    </span>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {selectedCandidate.voteCount}
                    </div>
                    <div className="text-gray-600 text-sm">Votes</div>
                  </div>
                </div>
                
                {selectedCandidate.videoUrl && (
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-lg font-semibold mb-3 text-gray-900">Campaign Video</h4>
                    <div className="aspect-video">
                      <iframe
                        src={selectedCandidate.videoUrl}
                        className="w-full h-full rounded-lg border"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                )}
                
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-lg font-semibold mb-3 text-gray-900">Manifesto</h4>
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <p className="text-gray-700 leading-relaxed">
                      {selectedCandidate.manifesto || 'No manifesto available for this candidate.'}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <DialogFooter className="mt-6">
              <Button 
                onClick={() => setIsViewDialogOpen(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add New Candidate Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="bg-white text-gray-900 border-gray-200 sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-gray-900">Add New Candidate</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="voter-select" className="text-gray-700">Select Voter</Label>
                <Select value={newCandidate.voterId} onValueChange={(value) => 
                  setNewCandidate(prev => ({ ...prev, voterId: value }))
                }>
                  <SelectTrigger className="bg-white border-gray-300">
                    <SelectValue placeholder="Choose a voter" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    {votersList.filter(voter => voter.role === 'VOTER').map(voter => (
                      <SelectItem key={voter.id} value={voter.id.toString()}>
                        {voter.name} ({voter.regNumber})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="position-select" className="text-gray-700">Select Position</Label>
                <Select value={newCandidate.positionId} onValueChange={(value) => 
                  setNewCandidate(prev => ({ ...prev, positionId: value }))
                }>
                  <SelectTrigger className="bg-white border-gray-300">
                    <SelectValue placeholder="Choose a position" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    {positionsList.map(position => (
                      <SelectItem key={position.id} value={position.id.toString()}>
                        {position.title || position.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="manifesto" className="text-gray-700">Manifesto</Label>
                <Textarea
                  id="manifesto"
                  placeholder="Enter candidate's manifesto..."
                  value={newCandidate.manifesto}
                  onChange={(e) => setNewCandidate(prev => ({ ...prev, manifesto: e.target.value }))}
                  className="bg-white border-gray-300 text-gray-900"
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="image-url" className="text-gray-700">Image URL (Optional)</Label>
                <Input
                  id="image-url"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={newCandidate.imageUrl}
                  onChange={(e) => setNewCandidate(prev => ({ ...prev, imageUrl: e.target.value }))}
                  className="bg-white border-gray-300 text-gray-900"
                />
              </div>

              <div>
                <Label htmlFor="video-url" className="text-gray-700">Campaign Video URL (Optional)</Label>
                <Input
                  id="video-url"
                  type="url"
                  placeholder="https://youtube.com/embed/video-id"
                  value={newCandidate.videoUrl}
                  onChange={(e) => setNewCandidate(prev => ({ ...prev, videoUrl: e.target.value }))}
                  className="bg-white border-gray-300 text-gray-900"
                />
              </div>
            </div>
            
            <DialogFooter className="mt-6">
              <Button 
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
                disabled={isSubmitting}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmitNewCandidate}
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Adding...
                  </>
                ) : (
                  'Add Candidate'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CandidatesManagement;
