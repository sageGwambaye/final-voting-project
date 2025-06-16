
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import {
  Table, TableBody, TableCaption, TableCell,
  TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  PlusCircle, MoreVertical, Edit, Trash2, ListChecks,
  Search, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { mockElection, mockPositionsData } from '@/data/mockData';
import { useQuery } from '@tanstack/react-query';
import { positions } from '@/services/supabaseService';

interface PositionFormData {
  id?: number;
  title: string;
  description: string;
  maxVotes?: number;
}

const PositionsManagement = () => {
  const [positionsList, setPositionsList] = useState(mockPositionsData);
  const [filteredPositions, setFilteredPositions] = useState(mockPositionsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<any>(null);
  const [formData, setFormData] = useState<PositionFormData>({
    title: '',
    description: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  
  const { toast } = useToast();

  // Fetch positions from Supabase
  const { data: supabasePositions, isLoading } = useQuery({
    queryKey: ['positions'],
    queryFn: async () => {
      try {
        const { data, error } = await positions.getAll();
        if (error) throw error;
        return data;
      } catch (error) {
        console.error("Error fetching positions:", error);
        // Fall back to mock data on error
        return null;
      }
    }
  });

  // When Supabase data is available, use it
  useEffect(() => {
    if (supabasePositions && supabasePositions.length > 0) {
      // Map to the format expected by the component
      const mappedPositions = supabasePositions.map((pos: any, index: number) => ({
        id: pos.id || index + 1,
        title: pos.title || '',
        description: pos.description || '',
        maxVotes: pos.max_votes || 1
      }));
      setPositionsList(mappedPositions);
    }
  }, [supabasePositions]);
  
  // Filter positions based on search term
  useEffect(() => {
    const filtered = positionsList.filter(position => {
      const searchString = searchTerm.toLowerCase();
      return (
        position.title.toLowerCase().includes(searchString) ||
        position.description.toLowerCase().includes(searchString)
      );
    });
    
    setFilteredPositions(filtered);
    setCurrentPage(1); // Reset to first page when searching
  }, [searchTerm, positionsList]);
  
  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPositions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPositions.length / itemsPerPage);
  
  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
  
  // Handle form change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value
    }));
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    if (formData.id) {
      // Update existing position
      const updatedPositions = positionsList.map(position => 
        position.id === formData.id ? { ...position, ...formData } : position
      );
      setPositionsList(updatedPositions);
      toast({
        title: 'Position Updated',
        description: 'Position has been updated successfully.',
      });
    } else {
      // Add new position
      const newPosition = {
        ...formData,
        id: positionsList.length > 0 ? Math.max(...positionsList.map(p => p.id)) + 1 : 1,
        maxVotes: formData.maxVotes || 1
      };
      setPositionsList([...positionsList, newPosition]);
      toast({
        title: 'Position Added',
        description: 'New position has been added successfully.',
      });
    }
    
    setIsAddDialogOpen(false);
    resetForm();
  };
  
  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
    });
    setErrors({});
  };
  
  // Handle edit position
  const handleEdit = (position: any) => {
    setFormData({
      id: position.id,
      title: position.title,
      description: position.description,
      maxVotes: position.maxVotes
    });
    setIsAddDialogOpen(true);
  };
  
  // Handle delete position
  const handleDeleteClick = (position: any) => {
    setSelectedPosition(position);
    setIsDeleteDialogOpen(true);
  };
  
  // Confirm delete
  const confirmDelete = () => {
    if (selectedPosition) {
      const updatedPositions = positionsList.filter(position => position.id !== selectedPosition.id);
      setPositionsList(updatedPositions);
      setIsDeleteDialogOpen(false);
      setSelectedPosition(null);
      toast({
        title: 'Position Deleted',
        description: 'Position has been removed successfully.',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading positions...</span>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-udom-black">Positions Management</h1>
        <div className="text-sm breadcrumbs text-gray-600">
          <ul className="flex">
            <li><Link to="/" className="hover:text-udom-blue">Home</Link></li>
            <li className="before:content-['/'] before:mx-2">Positions</li>
          </ul>
        </div>
      </div>
      
      <Card className="border border-gray-200">
        <div className="p-6">
          {/* Election Details Banner */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-md font-medium text-blue-800 mb-2">Current Election: {mockElection.title}</h3>
            <div className="text-sm text-blue-700">
              <p>Status: <span className="font-medium">{mockElection.status === 'active' ? 'Active' : 'Completed'}</span></p>
              <p>Period: {new Date(mockElection.startDate).toLocaleDateString()} - {new Date(mockElection.endDate).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="Search positions..."
                className="pl-10 border-gray-200 w-full sm:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              className="bg-udom-blue hover:bg-blue-700"
              onClick={() => {
                resetForm();
                setIsAddDialogOpen(true);
              }}
            >
              <PlusCircle size={18} className="mr-2" />
              New Position
            </Button>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableCaption>
                {filteredPositions.length === 0 ? (
                  "No positions found matching your search."
                ) : (
                  `Showing ${indexOfFirstItem + 1} to ${Math.min(indexOfLastItem, filteredPositions.length)} of ${filteredPositions.length} positions`
                )}
              </TableCaption>
              <TableHeader>
                <TableRow className="border-gray-200">
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Max Votes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-10 text-gray-500">
                      <ListChecks size={48} className="mx-auto mb-3 opacity-50" />
                      <p>No positions found. Add a new position to get started.</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  currentItems.map((position) => (
                    <TableRow key={position.id} className="border-gray-200">
                      <TableCell className="font-medium">{position.title}</TableCell>
                      <TableCell>{position.description}</TableCell>
                      <TableCell>{position.maxVotes}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleEdit(position)}
                              className="flex items-center cursor-pointer"
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteClick(position)}
                              className="flex items-center text-red-500 cursor-pointer"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination */}
          {filteredPositions.length > 0 && (
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-500">
                Show 
                <select 
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="mx-2 border border-gray-200 rounded"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                </select>
                entries
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={16} />
                </Button>
                
                <div className="text-gray-500">
                  Page {currentPage} of {totalPages}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
      
      {/* Add/Edit Position Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{formData.id ? 'Edit Position' : 'Add New Position'}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <label htmlFor="title">Position Title</label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`${errors.title ? 'border-red-500' : ''}`}
                />
                {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full p-2 rounded-md border ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="maxVotes">Maximum Votes</label>
                <Input
                  id="maxVotes"
                  name="maxVotes"
                  type="number"
                  min="1"
                  value={formData.maxVotes || 1}
                  onChange={handleChange}
                />
                <p className="text-xs text-gray-500">The maximum number of votes a voter can cast for this position</p>
              </div>
            </div>
            
            <DialogFooter className="mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  resetForm();
                  setIsAddDialogOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-udom-blue hover:bg-blue-700">
                {formData.id ? 'Update' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p>Are you sure you want to delete this position?</p>
            {selectedPosition && (
              <p className="mt-2 font-medium text-red-500">
                {selectedPosition.title}
              </p>
            )}
            <p className="mt-4 text-gray-500 text-sm">
              This action cannot be undone. All data associated with this position will be permanently removed.
            </p>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PositionsManagement;
