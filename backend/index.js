require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { google } = require('googleapis');
const fs = require('fs');

// Initialize Express
const app = express();
app.use(bodyParser.json());
app.use(express.static('frontend'));

// Load Google Sheets credentials
const credentials = JSON.parse(fs.readFileSync('credentials.json'));
const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: SCOPES,
});

const preRegisteredEmail = process.env.PRE_REGISTERED_EMAIL;
const preRegisteredPassword = process.env.PRE_REGISTERED_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;

// Helper function to mark attendance in Google Sheets
async function markAttendance(studentId) {
    const sheets = google.sheets({ version: 'v4', auth: await auth.getClient() });
    const date = new Date().toLocaleDateString();

    const request = {
        spreadsheetId: SHEET_ID,
        range: 'Sheet1!A2:B', // Adjust as needed
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        resource: {
            values: [[studentId, date]],
        },
    };

    try {
        await sheets.spreadsheets.values.append(request);
        console.log(`Attendance marked for ${studentId} on ${date}`);
        return { success: true };
    } catch (err) {
        console.error('Error writing to Google Sheets:', err);
        return { success: false };
    }
}

// Login endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (email === preRegisteredEmail && await bcrypt.compare(password, preRegisteredPassword)) {
        const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({ token });
    }
    return res.status(401).json({ error: 'Invalid credentials' });
});

// Protected route for marking attendance
app.post('/mark-attendance', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(403).json({ error: 'Unauthorized' });

    try {
        jwt.verify(token, JWT_SECRET);
        const { studentId } = req.body;
        if (!studentId) return res.status(400).json({ error: 'Student ID is required' });

        markAttendance(studentId).then(result => {
            if (result.success) {
                res.status(200).json({ message: 'Attendance marked successfully!' });
            } else {
                res.status(500).json({ error: 'Failed to mark attendance' });
            }
        });
    } catch (err) {
        res.status(403).json({ error: 'Unauthorized' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
