
import React, { useEffect, useRef } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Download, Search } from 'lucide-react';

interface Column {
  id: string;
  header: string;
  cell: (item: any) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  searchable?: boolean;
  showExport?: boolean;
  onSearch?: (searchTerm: string) => void;
  onExport?: () => void;
}

const DataTable: React.FC<DataTableProps> = ({ 
  columns, 
  data, 
  searchable = true,
  showExport = false,
  onSearch,
  onExport
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sortConfig, setSortConfig] = React.useState<{key: string, direction: 'asc' | 'desc'} | null>(null);
  const searchTimeout = useRef<NodeJS.Timeout>();
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    
    searchTimeout.current = setTimeout(() => {
      if (onSearch) {
        onSearch(value);
      }
    }, 300);
  };
  
  useEffect(() => {
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, []);
  
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig?.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    setSortConfig({ key, direction });
  };
  
  const sortedData = React.useMemo(() => {
    if (!sortConfig) return data;
    
    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);
  
  const handleDownload = () => {
    if (onExport) {
      onExport();
    } else {
      downloadAsCsv();
    }
  };
  
  const downloadAsCsv = () => {
    const headerRow = columns.map(col => col.header).join(',');
    const dataRows = data.map(item => 
      columns.map(col => {
        const cellValue = typeof item[col.id] === 'object' ? 
          JSON.stringify(item[col.id]).replace(/"/g, '""') : 
          String(item[col.id]).replace(/"/g, '""');
        return `"${cellValue}"`;
      }).join(',')
    ).join('\n');
    
    const csv = `${headerRow}\n${dataRows}`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      {(searchable || showExport) && (
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between gap-4">
          {searchable && (
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              />
            </div>
          )}
          {showExport && (
            <Button
              onClick={handleDownload}
              variant="outline"
              className="flex items-center gap-2 border-gray-300 bg-white hover:bg-gray-50 text-gray-700"
            >
              <Download size={16} />
              <span>Download Results</span>
            </Button>
          )}
        </div>
      )}
      
      <div className="max-h-[600px] overflow-auto">
        <Table>
          <TableHeader className="bg-gray-50 sticky top-0 z-10">
            <TableRow className="border-b border-gray-200">
              {columns.map(column => (
                <TableHead 
                  key={column.id}
                  className={`text-gray-700 font-semibold bg-gray-50 ${column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''}`}
                  onClick={() => column.sortable ? handleSort(column.id) : null}
                >
                  <div className="flex items-center">
                    {column.header}
                    {sortConfig?.key === column.id && (
                      <span className="ml-2 text-gray-500">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.length > 0 ? (
              sortedData.map((row, index) => (
                <TableRow key={index} className="bg-white hover:bg-gray-50 border-b border-gray-100">
                  {columns.map(column => (
                    <TableCell key={column.id} className="text-gray-800 py-3">
                      {column.cell(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-gray-500 bg-white">
                  No results found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="p-4 bg-gray-50 border-t border-gray-200 text-gray-600 text-sm">
        Showing {sortedData.length} {sortedData.length === 1 ? 'result' : 'results'}
      </div>
    </div>
  );
};

export default DataTable;
