import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Volume2, Play, X, Users, CheckCircle } from 'lucide-react';
import { mockPositionsData, mockCandidatesData, mockVotersData } from '@/data/mockData';
import UserHeader from '@/components/UserHeader';
import VoiceVerification from '@/components/VoiceVerification';

interface Position {
  id: number;
  title: string;
  description: string;
  maxVotes: number;
}

interface Candidate {
  id: number;
  firstName: string;
  lastName: string;
  name: string;
  position: string;
  manifesto: string;
  platform: string;
  imageUrl: string;
  videoUrl?: string;
  regNumber: string;
  voteCount: number;
  program: string;
  college: string;
}

interface UserVote {
  positionId: number;
  candidateId: number;
}

const VotingPortal: React.FC = () => {
  const [positionsList, setPositionsList] = useState<Position[]>([]);
  const [candidatesList, setCandidatesList] = useState<{ [key: string]: Candidate[] }>({});
  const [currentPositionIndex, setCurrentPositionIndex] = useState(0);
  const [userVotes, setUserVotes] = useState<UserVote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [voiceVerified, setVoiceVerified] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showVoiceVerification, setShowVoiceVerification] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Get current user from session
    const userSession = localStorage.getItem('userSession');
    if (userSession) {
      setCurrentUser(JSON.parse(userSession));
    }

    loadVotingData();
    setupVoiceEventListeners();
    
    return () => {
      removeVoiceEventListeners();
    };
  }, []);

  const loadVotingData = async () => {
    try {
      setIsLoading(true);
      
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Set positions data
      setPositionsList(mockPositionsData);
      
      // Group candidates by position
      const candidatesMap: { [key: string]: Candidate[] } = {};
      mockPositionsData.forEach(position => {
        const positionCandidates = mockCandidatesData.filter(
          candidate => candidate.position === position.title
        );
        candidatesMap[position.title] = positionCandidates;
      });
      
      setCandidatesList(candidatesMap);
      
      // Announce the first position when data loads
      if (mockPositionsData.length > 0) {
        setTimeout(() => announceCurrentPosition(), 1000);
      }
    } catch (error) {
      console.error('Error loading voting data:', error);
      toast({
        title: "Error",
        description: "Failed to load voting data. Please refresh and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const announceCurrentPosition = () => {
    const currentPosition = positionsList[currentPositionIndex];
    if (!currentPosition) return;
    
    const positionCandidates = candidatesList[currentPosition.title] || [];
    
    let announcement = `Now voting for ${currentPosition.title}. `;
    announcement += `The candidates are: `;
    
    positionCandidates.forEach((candidate, index) => {
      announcement += `Number ${index + 1}, ${candidate.firstName} ${candidate.lastName}. `;
    });
    
    announcement += `Please select your preferred candidate by saying the candidate number.`;
    
    speak(announcement);
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      // Stop any ongoing speech
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const setupVoiceEventListeners = () => {
    window.addEventListener('voiceSelectCandidate', handleVoiceCandidateSelection);
    window.addEventListener('voiceConfirm', handleVoiceConfirmation);
    window.addEventListener('voiceVerification', handleVoiceVerification);
  };

  const removeVoiceEventListeners = () => {
    window.removeEventListener('voiceSelectCandidate', handleVoiceCandidateSelection);
    window.removeEventListener('voiceConfirm', handleVoiceConfirmation);
    window.removeEventListener('voiceVerification', handleVoiceVerification);
  };

  const handleVoiceCandidateSelection = (event: any) => {
    const { candidateIndex } = event.detail;
    const currentPosition = positionsList[currentPositionIndex];
    const positionCandidates = candidatesList[currentPosition.title] || [];
    
    if (candidateIndex < positionCandidates.length) {
      const candidate = positionCandidates[candidateIndex];
      selectCandidate(currentPosition.id, candidate.id);
      
      // Announce selection and auto-advance after a short delay
      speak(`You selected ${candidate.firstName} ${candidate.lastName}.`);
      
      setTimeout(() => {
        if (currentPositionIndex < positionsList.length - 1) {
          const nextIndex = currentPositionIndex + 1;
          setCurrentPositionIndex(nextIndex);
          setTimeout(() => announceCurrentPosition(), 1000);
        } else {
          showFinalConfirmation();
        }
      }, 2000);
    }
  };

  const handleVoiceConfirmation = (event: any) => {
    const { response } = event.detail;
    if (showConfirmation) {
      if (response === 'yes') {
        speak("Please say 'I love my university' for voice verification.");
      } else if (response === 'no') {
        setShowConfirmation(false);
        setCurrentPositionIndex(0);
        speak("Let's start over. Please select your candidates again.");
        setTimeout(() => announceCurrentPosition(), 1000);
      }
    }
  };

  const handleVoiceVerification = (event: any) => {
    const { passphrase } = event.detail;
    if (passphrase === 'i love my university' && showConfirmation) {
      setVoiceVerified(true);
      submitVotes();
    }
  };

  const selectCandidate = (positionId: number, candidateId: number) => {
    const newVotes = userVotes.filter(vote => vote.positionId !== positionId);
    newVotes.push({ positionId, candidateId });
    setUserVotes(newVotes);
    
    const candidate = Object.values(candidatesList)
      .flat()
      .find(c => c.id === candidateId);
    
    if (candidate) {
      setSelectedCandidate(candidate);
    }
  };

  const showFinalConfirmation = () => {
    setShowConfirmation(true);
    setShowVoiceVerification(true);
    speak("Please verify your voice to confirm your votes.");
  };

  const handleVoiceVerificationComplete = (success: boolean) => {
    if (success) {
      setVoiceVerified(true);
      submitVotes();
    } else {
      setShowVoiceVerification(false);
      setShowConfirmation(false);
      setCurrentPositionIndex(0);
      speak("Voice verification failed. Let's start over. Please select your candidates again.");
      setTimeout(() => announceCurrentPosition(), 1000);
    }
  };

  const submitVotes = async () => {
    try {
      setIsSubmitting(true);
      
      // Simulate vote submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if user is recognized (simple validation)
      if (!currentUser || !currentUser.id) {
        speak("Voter not recognised. Please log in again.");
        toast({
          title: "Error",
          description: "Voter not recognised. Please log in again.",
          variant: "destructive"
        });
        return;
      }
      
      // Update vote counts for candidates
      userVotes.forEach(vote => {
        const candidate = mockCandidatesData.find(c => c.id === vote.candidateId);
        if (candidate) {
          candidate.voteCount += 1;
          candidate.votes += 1;
        }
      });

      // Update voter status
      const voter = mockVotersData.find(v => v.id === currentUser.id);
      if (voter) {
        voter.votingStatus = 'Voted';
      }
      
      speak("Voted successfully! Thank you for participating in the election!");
      
      toast({
        title: "Success!",
        description: "Voted successfully! Your votes have been submitted.",
      });
      
      // Reset the voting state
      setUserVotes([]);
      setCurrentPositionIndex(0);
      setShowConfirmation(false);
      setVoiceVerified(false);
      setSelectedCandidate(null);
      
    } catch (error: any) {
      console.error('Error submitting votes:', error);
      
      toast({
        title: "Error",
        description: "Failed to submit votes. Please try again.",
        variant: "destructive"
      });
      
      speak("There was an error submitting your votes. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWatchVideo = (videoUrl: string) => {
    setSelectedVideoUrl(videoUrl);
    setShowVideoModal(true);
  };

  const closeVideoModal = () => {
    setShowVideoModal(false);
    setSelectedVideoUrl('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UserHeader />
        <div className="flex items-center justify-center min-h-screen bg-white">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-700">Loading voting portal...</span>
        </div>
      </div>
    );
  }

  if (positionsList.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UserHeader />
        <div className="container mx-auto p-6 bg-white min-h-screen">
          <Card className="bg-white border border-gray-200">
            <CardContent className="text-center p-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">No Active Elections</h2>
              <p className="text-gray-600">There are currently no active elections available for voting.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UserHeader />
        <div className="container mx-auto p-6 bg-white min-h-screen">
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Volume2 className="h-6 w-6 text-blue-600" />
                Confirm Your Votes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-lg font-semibold text-gray-900">Please review your selections:</p>
                {userVotes.map(vote => {
                  const position = positionsList.find(p => p.id === vote.positionId);
                  const candidate = Object.values(candidatesList)
                    .flat()
                    .find(c => c.id === vote.candidateId);
                  
                  return position && candidate ? (
                    <div key={vote.positionId} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <img 
                          src={candidate.imageUrl} 
                          alt={candidate.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-gray-900 font-medium">
                            <strong>{position.title}:</strong> {candidate.firstName} {candidate.lastName}
                          </p>
                          <p className="text-sm text-gray-600">{candidate.regNumber} • {candidate.program}</p>
                        </div>
                      </div>
                    </div>
                  ) : null;
                })}
                
                {showVoiceVerification && !voiceVerified && (
                  <VoiceVerification onVerificationComplete={handleVoiceVerificationComplete} />
                )}

                {!showVoiceVerification && !voiceVerified && (
                  <div className="flex gap-4 mt-6">
                    <Button 
                      onClick={() => {
                        setShowConfirmation(false);
                        setCurrentPositionIndex(0);
                        speak("Let's start over. Please select your candidates again.");
                        setTimeout(() => announceCurrentPosition(), 500);
                      }}
                      disabled={isSubmitting}
                      className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Edit Votes
                    </Button>
                    <Button 
                      onClick={showFinalConfirmation}
                      disabled={isSubmitting}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Submitting...
                        </>
                      ) : (
                        'Confirm Votes'
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentPosition = positionsList[currentPositionIndex];
  const positionCandidates = candidatesList[currentPosition.title] || [];
  const currentVote = userVotes.find(vote => vote.positionId === currentPosition.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <UserHeader />
      <div className="container mx-auto p-6 bg-white min-h-screen">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Voting Portal</h1>
            <Button
              onClick={announceCurrentPosition}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              <Volume2 className="h-4 w-4" />
              Voice Instructions
            </Button>
          </div>
          
          {/* Progress Indicator */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-blue-800">
                Position {currentPositionIndex + 1} of {positionsList.length}
              </p>
              <p className="text-sm text-blue-600">
                {userVotes.length} of {positionsList.length} positions completed
              </p>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${((currentPositionIndex + 1) / positionsList.length) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-blue-700 mt-2">
              Say candidate numbers (1, 2, 3...) to select. The system will automatically move to the next position.
            </p>
          </div>
        </div>

        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Volume2 className="h-6 w-6 text-blue-600" />
              {currentPosition.title}
            </CardTitle>
            {currentPosition.description && (
              <p className="text-gray-600">{currentPosition.description}</p>
            )}
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
              {positionCandidates.map((candidate, index) => (
                <Card
                  key={candidate.id}
                  className={`cursor-pointer transition-all hover:shadow-lg border-2 ${
                    currentVote?.candidateId === candidate.id
                      ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-300' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => selectCandidate(currentPosition.id, candidate.id)}
                >
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="text-3xl font-bold text-blue-600 bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center">
                          {index + 1}
                        </div>
                        
                        {/* Candidate Photo */}
                        <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
                          {candidate.imageUrl ? (
                            <img
                              src={candidate.imageUrl}
                              alt={candidate.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <Users size={24} />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {candidate.firstName} {candidate.lastName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {candidate.regNumber} • {candidate.program}
                          </p>
                          <p className="text-sm text-gray-500">{candidate.college}</p>
                        </div>
                        
                        {currentVote?.candidateId === candidate.id && (
                          <CheckCircle className="h-8 w-8 text-blue-600" />
                        )}
                      </div>
                      
                      {/* Platform */}
                      <div className="bg-gray-50 p-3 rounded-md">
                        <h4 className="font-medium text-gray-900 mb-1">Platform:</h4>
                        <p className="text-sm text-gray-700">{candidate.platform}</p>
                      </div>
                      
                      {/* Manifesto */}
                      {candidate.manifesto && (
                        <div className="bg-blue-50 p-3 rounded-md">
                          <h4 className="font-medium text-blue-900 mb-1">Vision:</h4>
                          <p className="text-sm text-blue-800">
                            {candidate.manifesto.substring(0, 150)}
                            {candidate.manifesto.length > 150 ? '...' : ''}
                          </p>
                        </div>
                      )}
                      
                      {/* Campaign Video Button */}
                      {candidate.videoUrl && (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleWatchVideo(candidate.videoUrl);
                          }}
                          variant="outline"
                          size="sm"
                          className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Watch Campaign Video
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-between mt-8">
              <Button
                onClick={() => {
                  if (currentPositionIndex > 0) {
                    setCurrentPositionIndex(currentPositionIndex - 1);
                    setTimeout(() => announceCurrentPosition(), 500);
                  }
                }}
                disabled={currentPositionIndex === 0}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Previous Position
              </Button>
              
              <Button
                onClick={() => {
                  const currentVote = userVotes.find(vote => vote.positionId === currentPosition.id);
                  
                  if (!currentVote) {
                    toast({
                      title: "Selection Required",
                      description: "Please select a candidate before proceeding.",
                      variant: "destructive"
                    });
                    return;
                  }

                  if (currentPositionIndex < positionsList.length - 1) {
                    setCurrentPositionIndex(currentPositionIndex + 1);
                    setTimeout(() => announceCurrentPosition(), 500);
                  } else {
                    showFinalConfirmation();
                  }
                }}
                disabled={!currentVote}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {currentPositionIndex === positionsList.length - 1 ? 'Review Votes' : 'Next Position'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Video Modal */}
        {showVideoModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Campaign Video</h3>
                <Button
                  onClick={closeVideoModal}
                  variant="outline"
                  size="sm"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="aspect-video">
                <iframe
                  src={selectedVideoUrl}
                  className="w-full h-full rounded-lg"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VotingPortal;
