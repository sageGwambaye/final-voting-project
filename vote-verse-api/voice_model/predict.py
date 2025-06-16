import sys
import os
import numpy as np
import librosa
import tensorflow as tf
from tensorflow.keras.models import load_model
import requests
from io import BytesIO
import tempfile

def download_audio(url):
    """Download audio file from URL and save to temporary file"""
    response = requests.get(url)
    if response.status_code != 200:
        raise Exception(f"Failed to download audio file: {response.status_code}")
    
    # Create a temporary file
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.wav')
    temp_file.write(response.content)
    temp_file.close()
    return temp_file.name

def extract_features(audio_path):
    """Extract MFCC features from audio file"""
    # Load audio file
    y, sr = librosa.load(audio_path, sr=None)
    
    # Extract MFCC features
    mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
    
    # Normalize features
    mfccs = (mfccs - np.mean(mfccs)) / np.std(mfccs)
    
    return mfccs

def compare_voices(recorded_features, stored_features):
    """Compare two voice samples using cosine similarity"""
    # Flatten features
    recorded_flat = recorded_features.flatten()
    stored_flat = stored_features.flatten()
    
    # Calculate cosine similarity
    similarity = np.dot(recorded_flat, stored_flat) / (np.linalg.norm(recorded_flat) * np.linalg.norm(stored_flat))
    
    # Threshold for verification (can be adjusted)
    return similarity > 0.85

def main():
    if len(sys.argv) != 3:
        print("Usage: python predict.py <recorded_audio_path> <stored_sample_url>")
        sys.exit(1)
    
    recorded_audio_path = sys.argv[1]
    stored_sample_url = sys.argv[2]
    
    try:
        # Download stored sample
        stored_audio_path = download_audio(stored_sample_url)
        
        # Extract features from both samples
        recorded_features = extract_features(recorded_audio_path)
        stored_features = extract_features(stored_audio_path)
        
        # Compare voices
        is_match = compare_voices(recorded_features, stored_features)
        
        # Clean up temporary file
        os.unlink(stored_audio_path)
        
        # Exit with appropriate code
        sys.exit(0 if is_match else 1)
        
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main() 