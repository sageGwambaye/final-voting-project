
import React, { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VoiceAssistantProps {
  userRole?: 'admin' | 'voter';
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ userRole = 'voter' }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          }
        }
        if (finalTranscript) {
          setTranscript(finalTranscript);
          handleVoiceCommand(finalTranscript);
        }
      };

      recognitionInstance.onstart = () => {
        setIsListening(true);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event);
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const handleVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase().trim();
    
    console.log('Voice command received:', lowerCommand);
    
    // Navigation commands
    if (lowerCommand.includes('navigate to dashboard') || lowerCommand.includes('go to dashboard')) {
      window.location.href = '/dashboard';
    } else if (lowerCommand.includes('navigate to voting') || lowerCommand.includes('go to voting')) {
      window.location.href = '/voting';
    } else if (lowerCommand.includes('navigate to results') || lowerCommand.includes('go to results')) {
      window.location.href = '/results';
    } else if (lowerCommand.includes('navigate to feedback') || lowerCommand.includes('go to feedback')) {
      window.location.href = '/feedback';
    }

    // Voting page commands - dispatch custom events for the voting portal to handle
    if (window.location.pathname === '/voting') {
      // Candidate selection commands with more variations
      if (lowerCommand.includes('one') || lowerCommand.includes('1') || lowerCommand.includes('candidate one') || lowerCommand.includes('select one') || lowerCommand.includes('first')) {
        window.dispatchEvent(new CustomEvent('voiceSelectCandidate', { detail: { candidateIndex: 0 } }));
      } else if (lowerCommand.includes('two') || lowerCommand.includes('2') || lowerCommand.includes('candidate two') || lowerCommand.includes('select two') || lowerCommand.includes('second')) {
        window.dispatchEvent(new CustomEvent('voiceSelectCandidate', { detail: { candidateIndex: 1 } }));
      } else if (lowerCommand.includes('three') || lowerCommand.includes('3') || lowerCommand.includes('candidate three') || lowerCommand.includes('select three') || lowerCommand.includes('third')) {
        window.dispatchEvent(new CustomEvent('voiceSelectCandidate', { detail: { candidateIndex: 2 } }));
      } else if (lowerCommand.includes('four') || lowerCommand.includes('4') || lowerCommand.includes('candidate four') || lowerCommand.includes('select four') || lowerCommand.includes('fourth')) {
        window.dispatchEvent(new CustomEvent('voiceSelectCandidate', { detail: { candidateIndex: 3 } }));
      }
      
      // Confirmation commands
      else if (lowerCommand.includes('yes') || lowerCommand.includes('confirm') || lowerCommand.includes('correct')) {
        window.dispatchEvent(new CustomEvent('voiceConfirm', { detail: { response: 'yes' } }));
      } else if (lowerCommand.includes('no') || lowerCommand.includes('incorrect') || lowerCommand.includes('wrong')) {
        window.dispatchEvent(new CustomEvent('voiceConfirm', { detail: { response: 'no' } }));
      }
      
      // Voice verification - updated passphrase
      else if (lowerCommand.includes('i love my university') || lowerCommand.includes('love my university')) {
        window.dispatchEvent(new CustomEvent('voiceVerification', { detail: { passphrase: 'i love my university' } }));
      }
    }

    // Clear transcript after processing
    setTimeout(() => setTranscript(''), 2000);
  };

  const toggleListening = () => {
    if (!recognition) {
      alert('Speech recognition is not supported in your browser');
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
    return null; // Don't render if speech recognition is not supported
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        onClick={toggleListening}
        variant={isListening ? "destructive" : "default"}
        size="icon"
        className={`rounded-full h-14 w-14 shadow-lg transition-all ${
          isListening 
            ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
        title={isListening ? "Stop listening" : "Start voice assistant"}
      >
        {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
      </Button>
      {transcript && (
        <div className="absolute bottom-16 right-0 bg-white border rounded-lg p-3 shadow-lg max-w-xs">
          <p className="text-sm font-medium text-gray-800">You said:</p>
          <p className="text-sm text-gray-600 mt-1">{transcript}</p>
        </div>
      )}
      {isListening && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
          Listening...
        </div>
      )}
    </div>
  );
};

export default VoiceAssistant;
