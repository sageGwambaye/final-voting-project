# Voice Verification System Setup Guide

This guide will help you set up the voice verification system for the voting application.

## Prerequisites

1. Python 3.8 or higher
2. Redis Server
3. Java 17 or higher
4. Node.js 16 or higher

## Setup Steps

### 1. Python Environment Setup

```bash
# Create a virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Redis Setup

#### Windows:
1. Download Redis for Windows from https://github.com/microsoftarchive/redis/releases
2. Install and start Redis server
3. Default port: 6379

#### Linux:
```bash
sudo apt-get install redis-server
sudo systemctl start redis-server
```

### 3. Backend Configuration

1. Ensure the voice model files are in the correct location:
   - `voice_model.pkl`
   - `predict.py`
   - `requirements.txt`

2. Add Redis configuration to `application.properties`:
```properties
spring.redis.host=localhost
spring.redis.port=6379
```

3. Add the following dependencies to `pom.xml`:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

### 4. Testing the Setup

1. Test the voice model:
```bash
python predict.py test_audio.wav
```

2. Test the API endpoint:
```bash
curl -X POST -F "audio=@test_audio.wav" http://localhost:8080/api/verify-voice
```

## Troubleshooting

### Common Issues:

1. **Python Dependencies**
   - If librosa installation fails, install system dependencies first:
     ```bash
     # Ubuntu/Debian
     sudo apt-get install libsndfile1
     ```

2. **Redis Connection**
   - Check if Redis is running:
     ```bash
     redis-cli ping
     ```
   - Should return "PONG"

3. **Audio Recording**
   - Ensure microphone permissions are granted in the browser
   - Test microphone in browser settings

4. **Model Loading**
   - Verify model file path is correct
   - Check model file permissions

## Security Notes

1. The system implements rate limiting (3 attempts per 24 hours)
2. Audio files are automatically cleaned up after processing
3. File size is limited to 10MB
4. All API endpoints require authentication

## Maintenance

1. Regularly update Python dependencies:
   ```bash
   pip install -r requirements.txt --upgrade
   ```

2. Monitor Redis memory usage:
   ```bash
   redis-cli info memory
   ```

3. Check application logs for any errors

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review application logs
3. Contact system administrator 