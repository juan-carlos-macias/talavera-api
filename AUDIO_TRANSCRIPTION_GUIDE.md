# Audio Transcription & Summarization Guide

## Overview

This API provides an intelligent audio transcription and summarization service using OpenAI's Whisper API and GPT-4o-mini. The agent-based system:

1. **Transcribes** audio files using OpenAI Whisper
2. **Analyzes** the transcript to extract key information
3. **Generates** a descriptive title
4. **Extracts** relevant keywords and topics
5. **Creates** a comprehensive summary
6. **Stores** all data in the database for future retrieval

## Features

- ✅ **Automatic Transcription**: Uses OpenAI Whisper for accurate speech-to-text
- ✅ **Intelligent Analysis**: GPT-4o-mini agent analyzes content and extracts insights
- ✅ **Multi-language Support**: Primarily optimized for Spanish (configurable)
- ✅ **Secure Storage**: All summaries are stored with user authentication
- ✅ **CRUD Operations**: Create, read, and delete audio summaries

## API Endpoints

### 1. Analyze Audio (POST /api/audio/analyze)

Transcribes an audio file and generates a comprehensive analysis.

#### Authentication Required
Yes - Bearer token required in Authorization header

#### Request Details

**Endpoint**: `POST http://localhost:3000/api/audio/analyze`

**Headers**:
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: multipart/form-data
```

**Body** (form-data):
- `audio` (File) - Your audio file (.mp3, .wav, .m4a, etc.)

#### Supported Audio Formats
- MP3 (.mp3)
- WAV (.wav)
- M4A (.m4a)
- OGG (.ogg)
- WEBM (.webm)
- And other formats supported by Whisper API

#### Response Example

```json
{
  "statusCode": 201,
  "message": "Audio analyzed successfully",
  "data": {
    "audioSummary": {
      "id": "abc123-def456-ghi789",
      "ownerId": "user-id-123",
      "title": "Discussion about Project Planning and Timeline",
      "keywords": [
        "project management",
        "timeline",
        "resources",
        "budget",
        "deliverables",
        "team collaboration"
      ],
      "transcript": "Welcome everyone to today's meeting. We're here to discuss the upcoming project timeline and allocate resources accordingly. First, let's review the budget constraints...",
      "summary": "The meeting focused on establishing a clear project timeline and resource allocation. Key discussion points included budget constraints, team responsibilities, and critical deliverables. The team agreed on a phased approach with weekly check-ins to ensure progress tracking and timely completion.",
      "createdAt": "2025-01-06T18:00:00.000Z",
      "updatedAt": "2025-01-06T18:00:00.000Z"
    }
  }
}
```

### 2. Get All Audio Summaries (GET /api/audio)

Retrieve all audio summaries for the authenticated user.

**Endpoint**: `GET http://localhost:3000/api/audio`

**Headers**:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response**:
```json
{
  "statusCode": 200,
  "message": "Audio summaries retrieved successfully",
  "data": {
    "summaries": [
      {
        "id": "abc123",
        "ownerId": "user-id-123",
        "title": "Meeting Summary",
        "keywords": ["project", "planning"],
        "transcript": "Full transcript...",
        "summary": "Summary text...",
        "createdAt": "2025-01-06T18:00:00.000Z",
        "updatedAt": "2025-01-06T18:00:00.000Z"
      }
    ]
  }
}
```

### 3. Get Specific Summary (GET /api/audio/:id)

Retrieve a specific audio summary by ID.

**Endpoint**: `GET http://localhost:3000/api/audio/{id}`

**Headers**:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

### 4. Delete Summary (DELETE /api/audio/:id)

Delete a specific audio summary.

**Endpoint**: `DELETE http://localhost:3000/api/audio/{id}`

**Headers**:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response**: `204 No Content`

## Testing with Postman

### Step 1: Authentication

First, you need to authenticate and get a JWT token:

1. **Sign up** (if you don't have an account):
   - Method: `POST`
   - URL: `http://localhost:3000/api/auth/signup`
   - Body (JSON):
     ```json
     {
       "email": "your.email@example.com",
       "password": "yourSecurePassword123"
     }
     ```

2. **Login** (if you already have an account):
   - Method: `POST`
   - URL: `http://localhost:3000/api/auth/login`
   - Body (JSON):
     ```json
     {
       "email": "your.email@example.com",
       "password": "yourSecurePassword123"
     }
     ```

3. **Copy the token** from the response:
   ```json
   {
     "data": {
       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
     }
   }
   ```

### Step 2: Upload and Analyze Audio

1. Create a new request in Postman
2. Set method to `POST`
3. Enter URL: `http://localhost:3000/api/audio/analyze`
4. Go to **Headers** tab:
   - Add: `Authorization` = `Bearer YOUR_JWT_TOKEN`
5. Go to **Body** tab:
   - Select `form-data`
   - Add a key named `audio`
   - Change the type from "Text" to **"File"** (use dropdown next to key name)
   - Click "Select Files" and choose your audio file
6. Click **Send**

### Step 3: View Results

After sending the request, you should receive:
- Status: `201 Created`
- A JSON response with the complete analysis including:
  - Transcription of the audio
  - Generated title
  - Extracted keywords
  - Comprehensive summary

## How It Works

### Architecture

```
User uploads audio (Postman)
    ↓
Express API receives file
    ↓
Audio Agent Service
    ↓
├─→ Whisper API (transcription)
    ↓
└─→ GPT-4o-mini Agent (analysis)
    ↓
Database (Prisma/PostgreSQL)
    ↓
Response to user
```

### Agent Workflow

1. **Receives audio buffer** from the API endpoint
2. **Saves temporarily** to disk for Whisper API processing
3. **Calls Whisper API** to transcribe the audio
4. **Cleans up** temporary file
5. **Uses GPT-4o-mini** to analyze the transcript and:
   - Generate a descriptive title
   - Extract 5-10 keywords
   - Create a comprehensive summary
6. **Validates** all required fields are present
7. **Returns** structured analysis result
8. **Stores** in database for future access

## Requirements

### Environment Variables

Ensure your `.env` file contains:

```env
# OpenAI Configuration
OPENAI_API_KEY=sk-proj-your-openai-api-key-here

# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# JWT Configuration
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=3000
NODE_ENV=development
```

### Database

Make sure PostgreSQL is running and migrations are applied:

```bash
npm run db:migrate
```

### Server

Start the development server:

```bash
npm run dev
```

Server should be running on `http://localhost:3000`

## Troubleshooting

### Common Issues

1. **"No audio file provided"**
   - Make sure you selected "File" type in form-data
   - Verify the key name is exactly `audio`

2. **"Invalid authorization format"**
   - Check that you're using `Bearer` prefix: `Bearer YOUR_TOKEN`
   - Ensure token is copied correctly without extra spaces

3. **"Can't reach database server"**
   - Start PostgreSQL: `brew services start postgresql` (macOS)
   - Verify DATABASE_URL in `.env`

4. **"Failed to transcribe audio"**
   - Verify OPENAI_API_KEY is valid
   - Check audio file format is supported
   - Ensure OpenAI API has sufficient credits

5. **Agent timeout or errors**
   - Check OpenAI API status
   - Verify API key has access to Whisper and GPT-4o-mini
   - For very long audio files, processing may take longer

## Performance Notes

- **Transcription time** depends on audio length (typically 1-2 minutes for a 10-minute audio)
- **Analysis time** is usually 5-15 seconds after transcription
- **File size limits** are configured in `upload.ts` middleware
- **Language** is set to Spanish by default but can be changed in the agent service

## Example Use Cases

1. **Meeting Transcription**: Upload meeting recordings to get automatic transcripts and summaries
2. **Lecture Notes**: Convert educational audio into searchable text with key topics
3. **Interview Analysis**: Transcribe interviews and extract main themes
4. **Podcast Summaries**: Generate episode summaries with keywords for SEO
5. **Voice Memos**: Convert voice notes into organized, searchable text

## Security

- ✅ All endpoints require authentication
- ✅ Users can only access their own audio summaries
- ✅ JWT tokens expire after 7 days (configurable)
- ✅ Temporary audio files are cleaned up after processing
- ✅ Database queries are parameterized to prevent SQL injection

## Support

For issues or questions:
- Check the API logs in the terminal
- Verify all environment variables are set correctly
- Ensure PostgreSQL and the API server are running
- Test authentication endpoints first before audio endpoints
