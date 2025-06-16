
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DataTable from '@/components/ui/datatable';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Eye, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { admin } from '@/services/apiService';
import { mockVotersData } from '@/data/mockData';
import { useQuery } from '@tanstack/react-query';
import { fetchUniversityUsers } from '@/services/universityApi';

interface User {
  id: number;
  username: string;
  regNumber: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'VOTER';
  imageUrl?: string;
  voiceSampleUrl?: string;
}

const VotersManagement = () => {
  const [voters, setVoters] = useState<User[]>([]);
  const [selectedVoter, setSelectedVoter] = useState<User | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const { toast } = useToast();

  // Fetch data from both sources
  const { data: adminVoters, isLoading: adminLoading } = useQuery({
    queryKey: ['adminVoters'],
    queryFn: async () => {
      try {
        return await admin.getVoters();
      } catch (error) {
        console.error('Error loading admin voters:', error);
        return [];
      }
    },
  });

  const { data: universityData, isLoading: uniLoading } = useQuery({
    queryKey: ['universityUsers'],
    queryFn: async () => {
      try {
        const response = await fetchUniversityUsers();
        return response.data;
      } catch (error) {
        console.error('Error loading university users:', error);
        return [];
      }
    },
  });

  // Combine data when both sources are loaded
  useEffect(() => {
    const mergeData = () => {
      // Start with admin voters if available
      let mergedVoters: any[] = adminVoters || [];
      
      // If admin voters failed, use mock data
      if (!mergedVoters.length) {
        mergedVoters = [...mockVotersData];
      }

      // Enhance with university data if available
      if (universityData && universityData.length > 0) {
        mergedVoters = mergedVoters.map((voter) => {
          const uniUser = universityData.find((u: any) => 
            u.regNumber === voter.regNumber || 
            u.regNumber === voter.studentId
          );

          if (uniUser) {
            return {
              ...voter,
              voiceSampleUrl: uniUser.voiceSampleUrl || voter.voiceSampleUrl,
              phone: uniUser.phone || voter.phone,
              program: uniUser.program || voter.program
            };
          }
          return voter;
        });
      }
      
      // Map all data to consistent format
      const formattedVoters = mergedVoters.map((voter: any) => ({
        id: voter.id || Math.floor(Math.random() * 1000),
        username: voter.username || voter.email?.split('@')[0] || '',
        regNumber: voter.regNumber || voter.student_id || voter.studentId || '',
        name: voter.name || `${voter.firstName || voter.first_name || ''} ${voter.lastName || voter.last_name || ''}`.trim(),
        email: voter.email || '',
        role: (voter.role || 'VOTER').toUpperCase(),
        imageUrl: voter.imageUrl || voter.image_url || '',
        voiceSampleUrl: voter.voiceSampleUrl || '',
        phone: voter.phone || '',
        program: voter.program || ''
      }));
      
      setVoters(formattedVoters || []);
    };

    // Only merge when at least one source is loaded
    if (!adminLoading || !uniLoading) {
      mergeData();
    }
  }, [adminVoters, universityData, adminLoading, uniLoading]);

  const handleView = (voter: User) => {
    setSelectedVoter(voter);
    setIsViewDialogOpen(true);
  };

  const columns = [
    {
      id: 'id',
      header: 'ID',
      cell: (item: User) => item.id,
      sortable: true,
    },
    {
      id: 'regNumber',
      header: 'Registration Number',
      cell: (item: User) => item.regNumber,
      sortable: true,
    },
    {
      id: 'name',
      header: 'Full Name',
      cell: (item: User) => item.name,
      sortable: true,
    },
    {
      id: 'username',
      header: 'Username',
      cell: (item: User) => item.username,
      sortable: true,
    },
    {
      id: 'email',
      header: 'Email',
      cell: (item: User) => item.email,
      sortable: true,
    },
    {
      id: 'role',
      header: 'Role',
      cell: (item: User) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          item.role === 'ADMIN' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
        }`}>
          {item.role}
        </span>
      ),
      sortable: true,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (item: User) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleView(item)}
          className="bg-white hover:bg-gray-50 border-gray-200"
        >
          <Eye className="h-4 w-4 mr-2" />
          View
        </Button>
      ),
    },
  ];

  if (adminLoading && uniLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading voters...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Voters Management</h1>
        <div className="text-sm breadcrumbs text-gray-600">
          <ul className="flex space-x-2">
            <li><Link to="/" className="hover:text-blue-600">Home</Link></li>
            <li className="before:content-['/'] before:mx-2 text-gray-400">Voters</li>
          </ul>
        </div>
      </div>

      <Card className="bg-white border-gray-200 shadow-sm">
        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">All Voters</h2>
            </div>
            <p className="text-gray-600 text-sm">
              Voters are automatically loaded from the database. No manual registration required.
            </p>
          </div>

          <DataTable
            columns={columns}
            data={voters}
            searchable={true}
            showExport={true}
            onSearch={(searchTerm) => {
              // Filter logic can be implemented here if needed
              console.log('Search term:', searchTerm);
            }}
            onExport={() => {
              toast({
                title: 'Export Started',
                description: 'Voters data is being exported...',
              });
            }}
          />
        </div>
      </Card>

      {/* View Voter Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="bg-white border-gray-200 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Voter Details</DialogTitle>
          </DialogHeader>

          {selectedVoter && (
            <div className="space-y-4">
              <div className="flex justify-center mb-4">
                {selectedVoter.imageUrl ? (
                  <img
                    src={selectedVoter.imageUrl}
                    alt={selectedVoter.name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center border-2 border-gray-200">
                    <span className="text-2xl font-bold text-gray-600">
                      {selectedVoter.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">ID:</span>
                  <span className="text-gray-900">{selectedVoter.id}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Registration Number:</span>
                  <span className="text-gray-900 font-mono">{selectedVoter.regNumber}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Full Name:</span>
                  <span className="text-gray-900">{selectedVoter.name}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Username:</span>
                  <span className="text-gray-900">{selectedVoter.username}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Email:</span>
                  <span className="text-gray-900">{selectedVoter.email}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Role:</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    selectedVoter.role === 'ADMIN' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {selectedVoter.role}
                  </span>
                </div>

                {selectedVoter.voiceSampleUrl && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Voice Sample:</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(selectedVoter.voiceSampleUrl, '_blank')}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Play Sample
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end mt-6">
            <Button
              onClick={() => setIsViewDialogOpen(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VotersManagement;
