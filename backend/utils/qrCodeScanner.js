// backend/utils/qrCodeScanner.js
const QRCode = require('qrcode');

const generateQRCode = async (studentId) => {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(studentId);
    return qrCodeDataURL;
  } catch (err) {
    console.error('Error generating QR code:', err);
  }
};

module.exports = { generateQRCode };
