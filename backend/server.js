// backend/server.js
const app = require('./app');

// Set the port
const PORT = process.env.PORT || 5000;
// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
