# Windows Server Setup Script for VoteVerse

# Check if running as administrator
if (-NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Warning "Please run this script as Administrator!"
    Break
}

Write-Host "Starting VoteVerse Server Setup..." -ForegroundColor Green

# Install Chocolatey (Windows package manager)
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))

# Install Java 17
Write-Host "Installing Java 17..." -ForegroundColor Green
choco install openjdk17 -y

# Install Node.js 16
Write-Host "Installing Node.js 16..." -ForegroundColor Green
choco install nodejs-lts -y

# Install Redis
Write-Host "Installing Redis..." -ForegroundColor Green
choco install redis-64 -y

# Start Redis service
Write-Host "Starting Redis service..." -ForegroundColor Green
Start-Service Redis
Set-Service -Name Redis -StartupType Automatic

# Install Python
Write-Host "Installing Python..." -ForegroundColor Green
choco install python -y

# Create application directories
Write-Host "Creating application directories..." -ForegroundColor Green
$appDir = "C:\VoteVerse"
New-Item -ItemType Directory -Force -Path @(
    "$appDir",
    "$appDir\logs",
    "$appDir\data",
    "$appDir\voice-model"
)

# Create Python virtual environment
Write-Host "Setting up Python virtual environment..." -ForegroundColor Green
python -m venv "$appDir\venv"
& "$appDir\venv\Scripts\Activate.ps1"

# Install Python dependencies
Write-Host "Installing Python dependencies..." -ForegroundColor Green
pip install -r voice_model/requirements.txt

# Copy voice model files
Write-Host "Copying voice model files..." -ForegroundColor Green
Copy-Item -Path "voice_model\*" -Destination "$appDir\voice-model" -Recurse

# Create Windows Services
Write-Host "Creating Windows Services..." -ForegroundColor Green

# Backend Service
$backendService = @"
[Unit]
Description=VoteVerse Backend Service
After=network.target redis.service

[Service]
Type=simple
WorkingDirectory=$appDir
ExecStart=C:\Program Files\Java\jdk-17\bin\java.exe -jar vote-verse-api.jar
Restart=always
Environment=SPRING_PROFILES_ACTIVE=prod
Environment=ADMIN_PASSWORD=changeme

[Install]
WantedBy=multi-user.target
"@

# Frontend Service
$frontendService = @"
[Unit]
Description=VoteVerse Frontend Service
After=network.target

[Service]
Type=simple
WorkingDirectory=$appDir\frontend
ExecStart=C:\Program Files\nodejs\npm.cmd start
Restart=always
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
"@

# Create service files
$backendService | Out-File -FilePath "$appDir\voteverse-backend.service" -Encoding UTF8
$frontendService | Out-File -FilePath "$appDir\voteverse-frontend.service" -Encoding UTF8

# Create environment file
$envContent = @"
SPRING_PROFILES_ACTIVE=prod
ADMIN_PASSWORD=changeme
NODE_ENV=production
"@
$envContent | Out-File -FilePath "$appDir\.env" -Encoding UTF8

Write-Host "`nServer setup completed!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Configure your environment variables in $appDir\.env"
Write-Host "2. Start the services using Windows Services (services.msc)"
Write-Host "3. Set services to start automatically"
Write-Host "`nNote: You may need to restart your computer for all changes to take effect." 