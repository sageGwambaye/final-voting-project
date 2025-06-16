import librosa
import joblib
import numpy as np
import sys
import os

def verify_voice(audio_path):
    try:
        # Load model
        model_path = os.path.join(os.path.dirname(__file__), 'voice_model.pkl')
        model = joblib.load(model_path)

        # Load and process audio
        y, sr = librosa.load(audio_path, sr=None)
        mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
        mfccs_mean = np.mean(mfccs.T, axis=0).reshape(1, -1)

        # Predict
        predicted_label = model.predict(mfccs_mean)
        
        # Return 0 for success (match), 1 for failure (no match)
        return 0 if predicted_label[0] == 1 else 1

    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        return 1

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python predict.py <audio_file_path>", file=sys.stderr)
        sys.exit(1)
    
    audio_path = sys.argv[1]
    sys.exit(verify_voice(audio_path))
