import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import VotingPortal from './pages/voting/VotingPortal';
import ResultsPage from './pages/voting/ResultsPage';

const App: React.FC = () => {
    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <Routes>
                <Route path="/" element={<Navigate to="/voting" replace />} />
                <Route path="/voting" element={<VotingPortal />} />
                <Route path="/results" element={<ResultsPage />} />
            </Routes>
        </Box>
    );
};

export default App; 