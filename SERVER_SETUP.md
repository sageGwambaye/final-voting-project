# VoteVerse Server Setup Guide

This guide provides instructions for setting up the VoteVerse server with voice verification on both Linux and Windows systems.

## Prerequisites

### For Linux:
- Ubuntu 20.04 LTS or later
- Sudo privileges
- Internet connection

### For Windows:
- Windows Server 2019 or later
- Administrator privileges
- Internet connection

## Quick Setup

### Linux Setup
1. Download the setup script:
   ```bash
   wget https://raw.githubusercontent.com/your-repo/voteverse/main/server-setup.sh
   ```

2. Make it executable:
   ```bash
   chmod +x server-setup.sh
   ```

3. Run the script:
   ```bash
   sudo ./server-setup.sh
   ```

### Windows Setup
1. Open PowerShell as Administrator
2. Run the setup script:
   ```powershell
   Set-ExecutionPolicy Bypass -Scope Process -Force
   .\server-setup-windows.ps1
   ```

## Manual Setup

### 1. Install Dependencies

#### Linux:
```bash
# Update system
sudo apt-get update
sudo apt-get upgrade -y

# Install Java 17
sudo apt-get install -y openjdk-17-jdk

# Install Node.js 16
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Redis
sudo apt-get install -y redis-server

# Install Python and dependencies
sudo apt-get install -y python3.8 python3.8-venv python3-pip
sudo apt-get install -y libsndfile1
```

#### Windows:
1. Install Chocolatey (Windows package manager)
2. Run the following commands:
   ```powershell
   choco install openjdk17 -y
   choco install nodejs-lts -y
   choco install redis-64 -y
   choco install python -y
   ```

### 2. Configure Redis

#### Linux:
```bash
# Start Redis
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Verify Redis is running
redis-cli ping
```

#### Windows:
```powershell
# Start Redis service
Start-Service Redis
Set-Service -Name Redis -StartupType Automatic
```

### 3. Set Up Python Environment

#### Linux:
```bash
# Create virtual environment
python3 -m venv /opt/voteverse/venv
source /opt/voteverse/venv/bin/activate

# Install dependencies
pip install -r voice_model/requirements.txt
```

#### Windows:
```powershell
# Create virtual environment
python -m venv C:\VoteVerse\venv
C:\VoteVerse\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r voice_model/requirements.txt
```

### 4. Configure Application

1. Create necessary directories:
   ```bash
   # Linux
   sudo mkdir -p /opt/voteverse/{logs,data,voice-model}
   
   # Windows
   New-Item -ItemType Directory -Force -Path C:\VoteVerse\{logs,data,voice-model}
   ```

2. Copy voice model files:
   ```bash
   # Linux
   cp voice_model/* /opt/voteverse/voice-model/
   
   # Windows
   Copy-Item -Path voice_model\* -Destination C:\VoteVerse\voice-model -Recurse
   ```

3. Configure environment variables:
   ```bash
   # Create .env file
   echo "SPRING_PROFILES_ACTIVE=prod
   ADMIN_PASSWORD=your_secure_password
   NODE_ENV=production" > /opt/voteverse/.env
   ```

### 5. Start Services

#### Linux:
```bash
# Start backend
sudo systemctl start voteverse-backend

# Start frontend
sudo systemctl start voteverse-frontend

# Enable services to start on boot
sudo systemctl enable voteverse-backend
sudo systemctl enable voteverse-frontend
```

#### Windows:
1. Open Services (services.msc)
2. Start "VoteVerse Backend" and "VoteVerse Frontend" services
3. Set both services to start automatically

## Verification

1. Check if services are running:
   ```bash
   # Linux
   sudo systemctl status voteverse-backend
   sudo systemctl status voteverse-frontend
   
   # Windows
   Get-Service voteverse-*
   ```

2. Test the API:
   ```bash
   curl http://localhost:8080/api/health
   ```

3. Test voice verification:
   ```bash
   curl -X POST -F "audio=@test_audio.wav" http://localhost:8080/api/verify-voice
   ```

## Troubleshooting

### Common Issues:

1. **Redis Connection Issues**
   - Check if Redis is running
   - Verify Redis port (default: 6379)
   - Check Redis logs

2. **Python Dependencies**
   - Ensure virtual environment is activated
   - Check Python version (3.8+ required)
   - Verify all dependencies are installed

3. **Service Start Failures**
   - Check service logs
   - Verify file permissions
   - Check environment variables

4. **Voice Model Issues**
   - Verify model files are in correct location
   - Check Python dependencies
   - Test model independently

## Security Considerations

1. Change default passwords in .env file
2. Configure firewall rules
3. Enable HTTPS
4. Regular security updates
5. Monitor system logs

## Maintenance

1. Regular updates:
   ```bash
   # Update system packages
   sudo apt-get update && sudo apt-get upgrade
   
   # Update Python dependencies
   pip install -r requirements.txt --upgrade
   ```

2. Backup:
   - Regular database backups
   - Voice model backups
   - Configuration backups

3. Monitoring:
   - System resources
   - Application logs
   - Error rates

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review application logs
3. Contact system administrator 