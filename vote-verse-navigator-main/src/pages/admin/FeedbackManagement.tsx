
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table, TableBody, TableCaption, TableCell,
  TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  Search, MoreVertical, ChevronLeft, ChevronRight,
  MessageSquare, Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { mockFeedbacks } from '../../data/mockData';

const FeedbackManagement = () => {
  const [feedbacks, setFeedbacks] = useState(mockFeedbacks);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState(mockFeedbacks);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const { toast } = useToast();

  // Filter feedbacks based on search term
  useEffect(() => {
    const filtered = feedbacks.filter(feedback => {
      const searchString = searchTerm.toLowerCase();
      return (
        feedback.userName.toLowerCase().includes(searchString) ||
        feedback.feedbackText.toLowerCase().includes(searchString)
      );
    });

    setFilteredFeedbacks(filtered);
    setCurrentPage(1); // Reset to first page when searching
  }, [searchTerm, feedbacks]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredFeedbacks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredFeedbacks.length / itemsPerPage);

  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Handle delete feedback
  const handleDeleteFeedback = (id: number) => {
    const updatedFeedbacks = feedbacks.filter(feedback => feedback.id !== id);
    setFeedbacks(updatedFeedbacks);
    toast({
      title: 'Feedback Deleted',
      description: 'The feedback has been deleted successfully.',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Feedback Management</h1>
        <div className="text-sm breadcrumbs text-gray-500">
          <ul className="flex">
            <li><Link to="/admin/dashboard" className="hover:text-gray-800">Home</Link></li>
            <li className="before:content-['/'] before:mx-2">Feedback</li>
          </ul>
        </div>
      </div>

      <Card className="bg-white border-gray-200">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="Search feedback..."
                className="pl-10 bg-white border-gray-200 text-gray-800 w-full sm:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableCaption>
                {filteredFeedbacks.length === 0 ? (
                  "No feedbacks found matching your search."
                ) : (
                  `Showing ${indexOfFirstItem + 1} to ${Math.min(indexOfLastItem, filteredFeedbacks.length)} of ${filteredFeedbacks.length} feedbacks`
                )}
              </TableCaption>
              <TableHeader>
                <TableRow className="border-gray-200 bg-gray-50">
                  <TableHead className="text-gray-700">User</TableHead>
                  <TableHead className="text-gray-700">Feedback</TableHead>
                  <TableHead className="text-gray-700">Date</TableHead>
                  <TableHead className="text-gray-700 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-10 text-gray-500">
                      <MessageSquare size={48} className="mx-auto mb-3 opacity-50" />
                      <p>No feedbacks found.</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  currentItems.map((feedback) => (
                    <TableRow key={feedback.id} className="border-gray-200">
                      <TableCell className="font-medium text-gray-800">{feedback.userName}</TableCell>
                      <TableCell className="text-gray-700 max-w-xs truncate">{feedback.feedbackText}</TableCell>
                      <TableCell className="text-gray-700">{feedback.createdDate}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-white text-gray-800 border-gray-200">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-gray-200" />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteFeedback(feedback.id)}
                              className="flex items-center text-red-500 cursor-pointer hover:bg-gray-100"
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
          {filteredFeedbacks.length > 0 && (
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-600">
                Show 
                <select 
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="mx-2 bg-white border-gray-200 text-gray-700 rounded"
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
                  className="border-gray-200"
                >
                  <ChevronLeft size={16} />
                </Button>

                <div className="text-gray-600">
                  Page {currentPage} of {totalPages}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="border-gray-200"
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default FeedbackManagement;
