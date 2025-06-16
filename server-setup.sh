#!/bin/bash

# Exit on error
set -e

echo "Starting VoteVerse Server Setup..."

# Update system packages
echo "Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y

# Install Java 17
echo "Installing Java 17..."
sudo apt-get install -y openjdk-17-jdk

# Install Node.js 16
echo "Installing Node.js 16..."
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Redis
echo "Installing Redis..."
sudo apt-get install -y redis-server

# Start and enable Redis
echo "Starting Redis service..."
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Install Python and dependencies
echo "Installing Python and dependencies..."
sudo apt-get install -y python3.8 python3.8-venv python3-pip
sudo apt-get install -y libsndfile1  # Required for librosa

# Create Python virtual environment
echo "Setting up Python virtual environment..."
python3 -m venv /opt/voteverse/venv
source /opt/voteverse/venv/bin/activate

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r voice_model/requirements.txt

# Create necessary directories
echo "Creating application directories..."
sudo mkdir -p /opt/voteverse/{logs,data,voice-model}
sudo chown -R $USER:$USER /opt/voteverse

# Copy voice model files
echo "Copying voice model files..."
cp voice_model/* /opt/voteverse/voice-model/

# Create systemd service for the backend
echo "Creating systemd service for backend..."
sudo tee /etc/systemd/system/voteverse-backend.service << EOF
[Unit]
Description=VoteVerse Backend Service
After=network.target redis.service

[Service]
User=$USER
WorkingDirectory=/opt/voteverse
ExecStart=/usr/bin/java -jar vote-verse-api.jar
Restart=always
Environment="SPRING_PROFILES_ACTIVE=prod"
Environment="ADMIN_PASSWORD=changeme"

[Install]
WantedBy=multi-user.target
EOF

# Create systemd service for the frontend
echo "Creating systemd service for frontend..."
sudo tee /etc/systemd/system/voteverse-frontend.service << EOF
[Unit]
Description=VoteVerse Frontend Service
After=network.target

[Service]
User=$USER
WorkingDirectory=/opt/voteverse/frontend
ExecStart=/usr/bin/npm start
Restart=always
Environment="NODE_ENV=production"

[Install]
WantedBy=multi-user.target
EOF

# Reload systemd
sudo systemctl daemon-reload

echo "Server setup completed!"
echo "Next steps:"
echo "1. Configure your environment variables in /opt/voteverse/.env"
echo "2. Start the services:"
echo "   sudo systemctl start voteverse-backend"
echo "   sudo systemctl start voteverse-frontend"
echo "3. Enable services to start on boot:"
echo "   sudo systemctl enable voteverse-backend"
echo "   sudo systemctl enable voteverse-frontend" 