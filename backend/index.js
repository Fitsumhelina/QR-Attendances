// server.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { GoogleSpreadsheet } = require('google-spreadsheet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('frontend'));

// Sample user for authentication (in production, use a database)
const users = [{ email: 'test@example.com', password: 'password123' }]; // Replace with your registered email and password

// Google Sheet Setup
const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);

async function authenticate() {
    await doc.useServiceAccountAuth(require('./credentials.json'));
}

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find((u) => u.email === email && u.password === password);
    if (user) {
        res.json({ success: true });
    } else {
        res.json({ success: false, message: 'Invalid email or password' });
    }
});

app.post('/attendance', async (req, res) => {
    const { qrCode } = req.body; // Assume qrCode is the student ID

    try {
        await authenticate();
        await doc.loadInfo(); // Loads document properties and worksheets

        const sheet = doc.sheetsByIndex[0]; // Use the first sheet
        await sheet.addRow({ StudentID: qrCode, Timestamp: new Date() }); // Log attendance

        res.json({ success: true });
    } catch (error) {
        console.error('Error writing to sheet:', error);
        res.json({ success: false, message: 'Failed to log attendance' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
