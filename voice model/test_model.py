import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import pickle

# Load the extracted MFCC features
data = pd.read_csv('features.csv')

# Check if 'label' exists
if 'label' not in data.columns:
    raise ValueError("The dataset must contain a 'label' column.")

# Separate features and labels
X = data.drop('label', axis=1).values
y = data['label'].values

# Split into training and testing sets (80% train, 20% test)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Initialize the model
model = RandomForestClassifier(n_estimators=100, random_state=42)

# Train the model
model.fit(X_train, y_train)

# Evaluate on the test set
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)

print(" Accuracy:", accuracy)
print("\n Classification Report:\n")
print(classification_report(y_test, y_pred))

# Save the trained model
with open('voice_train_model.pkl', 'wb') as f:
    pickle.dump(model, f)

print("\n Model saved as 'voice_train_model.pkl'")
