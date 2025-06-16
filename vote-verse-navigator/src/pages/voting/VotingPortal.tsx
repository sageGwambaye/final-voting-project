import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Paper,
    Grid,
    Card,
    CardContent,
    CardActions,
    Button,
    CircularProgress,
    Alert,
    Box,
    Tabs,
    Tab,
} from '@mui/material';
import { usePositions, useCandidatesByPosition, useCastVote } from '../../hooks/useApi';
import type { Position, Candidate, Vote } from '../../services/api';

const VotingPortal: React.FC = () => {
    const navigate = useNavigate();
    const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
    const [selectedTab, setSelectedTab] = useState(0);

    // Fetch positions
    const { data: positions, isLoading: positionsLoading, error: positionsError } = usePositions();

    // Fetch candidates for selected position
    const { data: candidates, isLoading: candidatesLoading, error: candidatesError } = useCandidatesByPosition(
        selectedPosition?.id || 0,
        {
            queryKey: ['candidates', { positionId: selectedPosition?.id }],
            enabled: !!selectedPosition,
        }
    );

    // Cast vote mutation
    const { mutate: castVote, isPending: isVoting, error: voteError } = useCastVote({
        onSuccess: () => {
            navigate('/results');
        },
    });

    // Handle position selection
    const handlePositionChange = (_event: React.SyntheticEvent, newValue: number) => {
        setSelectedTab(newValue);
        setSelectedPosition(positions?.[newValue] || null);
    };

    // Handle vote submission
    const handleVote = (candidate: Candidate) => {
        if (!selectedPosition) return;

        // Create a partial vote object with required fields
        const vote: Omit<Vote, 'id' | 'timestamp' | 'voteHash'> = {
            voter: {
                regNo: 'USER_REG_NO', // TODO: Get from auth context
                name: 'Test User', // TODO: Get from auth context
                college: 'Test College', // TODO: Get from auth context
                programme: 'Test Programme', // TODO: Get from auth context
                yearOfStudy: 1, // TODO: Get from auth context
                dormBlock: 'Test Block', // TODO: Get from auth context
            },
            position: selectedPosition,
            candidate: candidate,
            ipAddress: '127.0.0.1', // TODO: Get from client
            deviceInfo: navigator.userAgent,
        };

        castVote(vote);
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
                Voting Portal
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

            {/* Candidates Grid */}
            {candidatesLoading ? (
                <Box sx={{ textAlign: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : candidatesError ? (
                <Alert severity="error">Failed to load candidates. Please try again later.</Alert>
            ) : (
                <Grid container spacing={3}>
                    {candidates?.map((candidate) => (
                        <Grid item xs={12} sm={6} md={4} key={candidate.id}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        {candidate.voter.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        {candidate.manifesto}
                                    </Typography>
                                    {candidate.campaignVideoUrl && (
                                        <Typography variant="body2">
                                            <a
                                                href={candidate.campaignVideoUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                Watch Campaign Video
                                            </a>
                                        </Typography>
                                    )}
                                </CardContent>
                                <CardActions>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleVote(candidate)}
                                        disabled={isVoting}
                                    >
                                        {isVoting ? <CircularProgress size={24} /> : 'Vote'}
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {voteError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    Failed to cast vote. Please try again later.
                </Alert>
            )}
        </Container>
    );
};

export default VotingPortal; 