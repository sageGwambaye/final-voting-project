import os
import librosa
import numpy as np
import pandas as pd

DATASET_PATH = r"D:\votesystem\voice model\archive\50_speakers_audio_data"
all_features = []

def extract_features(file_path):
    try:
        audio, sr = librosa.load(file_path, sr=None)
        mfccs = librosa.feature.mfcc(y=audio, sr=sr, n_mfcc=13)
        return np.mean(mfccs.T, axis=0)
    except Exception as e:
        print(f"[ERROR] Failed to process {file_path}: {e}")
        return None

for speaker_folder in os.listdir(DATASET_PATH):
    speaker_path = os.path.join(DATASET_PATH, speaker_folder)
    if not os.path.isdir(speaker_path):
        continue

    for file_name in os.listdir(speaker_path):
        file_path = os.path.join(speaker_path, file_name)
        print(f"[INFO] Processing {file_path}")
        features = extract_features(file_path)
        if features is not None:
            all_features.append([speaker_folder] + list(features))

# Save to CSV
df = pd.DataFrame(all_features, columns=['label'] + [f'mfcc{i}' for i in range(13)])
df.to_csv('features.csv', index=False)
print(f"[DONE] Extracted {len(df)} samples to features.csv")
