// backend/utils/googleSheets.js
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const credentialsPath = path.join(__dirname, '../credentials.json');

let auth;

// Authenticate Google Sheets
const authenticateGoogle = async () => {
  const content = fs.readFileSync(credentialsPath);
  const { client_secret, client_id, redirect_uris } = JSON.parse(content).installed;

  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  // Token file for storing Google API access tokens
  const tokenPath = path.join(__dirname, '../token.json');
  if (fs.existsSync(tokenPath)) {
    const token = fs.readFileSync(tokenPath);
    oAuth2Client.setCredentials(JSON.parse(token));
  } else {
    // Generate a new token (For the first run)
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    console.log('Authorize this app by visiting this URL:', authUrl);
    // After the user authorizes, get the token and save it
  }

  auth = oAuth2Client;
};

// Save student data to Google Sheets
const saveToGoogleSheets = async (student) => {
  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheetId = process.env.SPREADSHEET_ID;
  const sheetName = 'ApprovedStudents';

  const values = [
    [
      student.fullName,
      student.studentId,
      student.sex,
      student.age,
      student.department,
      student.email,
      student.phone,
      student.approvedDate.toISOString().split('T')[0],
    ],
  ];

  const resource = { values };

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A:H`,
    valueInputOption: 'RAW',
    resource,
  });

  console.log('Student data saved to Google Sheets');
};

module.exports = { authenticateGoogle, saveToGoogleSheets };
