const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const { exec } = require('child_process');
const chatRoutes = require('./routes/chat');
const axios = require('axios');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Validate API key on startup
if (!process.env.OPENAI_API_KEY) {
    console.error('ERROR: OpenAI API key is not set in .env file');
}

// Test route
app.get('/api/test', (req, res) => {
    if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ error: 'OpenAI API key is not configured' });
    }
    res.json({ status: 'ok', apiKeyConfigured: true });
});


// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/focusplus';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

mongoose.connection.on('error', err => console.error('MongoDB connection error:', err));
mongoose.connection.on('disconnected', () => console.log('MongoDB disconnected'));

// Import routes
const authRoutes = require('./routes/auth');
const groupRoutes = require('./routes/groups');
const studySessionRoutes = require('./routes/studySessions');
const blockedSitesRoutes = require('./routes/blockedSites');

app.use('/api/auth', authRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/study-sessions', studySessionRoutes);
app.use('/api/blocked-sites', blockedSitesRoutes);

// Blocked Apps Feature
const BLOCKED_APPS_FILE = 'blockedApps.json';

const getBlockedApps = () => {
  try {
    return JSON.parse(fs.readFileSync(BLOCKED_APPS_FILE, 'utf8'));
  } catch (error) {
    return [];
  }
};
const blockedAppsRoutes = require('./routes/blockedApps');
app.use('/api/blocked-apps', blockedAppsRoutes);

const saveBlockedApps = (apps) => {
  fs.writeFileSync(BLOCKED_APPS_FILE, JSON.stringify(apps, null, 2));
};

// API to get blocked apps
app.get('/api/blocked-apps', (req, res) => {
  res.json(getBlockedApps());
});

// API to add a blocked app
app.post('/api/block-app', (req, res) => {
  const { app } = req.body;
  let apps = getBlockedApps();

  if (!apps.includes(app)) {
    apps.push(app);
    saveBlockedApps(apps);
  }

  res.json({ message: 'App added', apps });
});

// Node.js script to block apps
setInterval(() => {
  const blockedApps = getBlockedApps();

  exec('tasklist', (err, stdout, stderr) => {
    if (err) return;
    
    blockedApps.forEach(app => {
      if (stdout.toLowerCase().includes(app.toLowerCase())) {
        exec(`taskkill /IM ${app} /F`, (killErr) => {
          if (!killErr) console.log(`Blocked: ${app}`);
        });
      }
    });
  });
}, 5000);

// Routes
app.use('/api/chat', chatRoutes);

// Chat endpoint
app.post('/api/chat', async (req, res) => {
    if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ 
            message: 'Failed to get AI response',
            error: 'OpenAI API key is not configured in the server'
        });
    }

    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ 
            message: 'Failed to get AI response',
            error: 'No message provided'
        });
    }

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful study assistant. Provide concise, practical advice about studying, time management, and maintaining focus.'
                    },
                    { role: 'user', content: message }
                ],
                max_tokens: 150,
                temperature: 0.7
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (!response.data.choices || !response.data.choices[0]) {
            throw new Error('Invalid response from OpenAI');
        }

        res.json({ reply: response.data.choices[0].message.content });
        
    } catch (error) {
        console.error('OpenAI API Error:', error.response?.data || error.message);
        
        let errorMessage = 'Failed to get AI response';
        if (error.response?.data?.error) {
            errorMessage = error.response.data.error.message || error.response.data.error;
        }

        res.status(500).json({ 
            message: 'Failed to get AI response',
            error: errorMessage
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Try multiple ports if the default is busy
const ports = [5000, 5001, 5002, 3001];

const startServer = async () => {
    for (const port of ports) {
        try {
            await new Promise((resolve, reject) => {
                const server = app.listen(port)
                    .once('listening', () => {
                        console.log(`Server running on port ${port}`);
                        console.log('OpenAI API Key configured:', !!process.env.OPENAI_API_KEY);
                        resolve();
                    })
                    .once('error', (err) => {
                        if (err.code === 'EADDRINUSE') {
                            console.log(`Port ${port} is busy, trying next port...`);
                            reject(err);
                        } else {
                            reject(err);
                        }
                    });
            });
            // If we get here, the server started successfully
            return;
        } catch (err) {
            if (port === ports[ports.length - 1]) {
                throw new Error('All ports are in use');
            }
            // Continue to next port
            continue;
        }
    }
};

startServer().catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
});
