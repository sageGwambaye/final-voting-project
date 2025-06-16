import React, { useState } from 'react';
import {
    Container,
    Typography,
    Paper,
    Grid,
    CircularProgress,
    Alert,
    Box,
    Tabs,
    Tab,
    LinearProgress,
} from '@mui/material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { usePositions, useVoteResults } from '../../hooks/useApi';
import type { Position } from '../../services/api';

const ResultsPage: React.FC = () => {
    const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
    const [selectedTab, setSelectedTab] = useState(0);

    // Fetch positions
    const { data: positions, isLoading: positionsLoading, error: positionsError } = usePositions();

    // Fetch vote results for selected position
    const { data: voteResults, isLoading: resultsLoading, error: resultsError } = useVoteResults(
        selectedPosition?.id || 0,
        {
            queryKey: ['voteResults', { positionId: selectedPosition?.id }],
            enabled: !!selectedPosition,
        }
    );

    // Handle position selection
    const handlePositionChange = (_event: React.SyntheticEvent, newValue: number) => {
        setSelectedTab(newValue);
        setSelectedPosition(positions?.[newValue] || null);
    };

    if (positionsLoading) {
        return (
            <Container sx={{ mt: 4, textAlign: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    if (positionsError) {
        return (
            <Container sx={{ mt: 4 }}>
                <Alert severity="error">Failed to load positions. Please try again later.</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                Election Results
            </Typography>

            {/* Position Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
                <Tabs
                    value={selectedTab}
                    onChange={handlePositionChange}
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    {positions?.map((position) => (
                        <Tab key={position.id} label={position.name} />
                    ))}
                </Tabs>
            </Box>

            {/* Selected Position Info */}
            {selectedPosition && (
                <Paper sx={{ p: 2, mb: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        {selectedPosition.name}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        {selectedPosition.description}
                    </Typography>
                </Paper>
            )}

            {/* Results Display */}
            {resultsLoading ? (
                <Box sx={{ textAlign: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : resultsError ? (
                <Alert severity="error">Failed to load results. Please try again later.</Alert>
            ) : voteResults && selectedPosition ? (
                <Grid container spacing={4}>
                    {/* Bar Chart */}
                    <Grid item xs={12}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Vote Distribution
                            </Typography>
                            <Box sx={{ height: 400 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={voteResults.candidates}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="voteCount" fill="#2196f3" name="Votes" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Detailed Results */}
                    <Grid item xs={12}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Detailed Results
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                Total Votes: {voteResults.totalVotes}
                            </Typography>
                            <Grid container spacing={2}>
                                {voteResults.candidates.map((candidate) => (
                                    <Grid item xs={12} key={candidate.id}>
                                        <Box sx={{ mb: 2 }}>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    mb: 1,
                                                }}
                                            >
                                                <Typography variant="body1">{candidate.name}</Typography>
                                                <Typography variant="body1">
                                                    {candidate.voteCount} votes ({candidate.votePercentage.toFixed(1)}%)
                                                </Typography>
                                            </Box>
                                            <LinearProgress
                                                variant="determinate"
                                                value={candidate.votePercentage}
                                                sx={{ height: 10, borderRadius: 5 }}
                                            />
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            ) : null}
        </Container>
    );
};

export default ResultsPage; 