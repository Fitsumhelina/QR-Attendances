// script.js

// Elements from HTML
const loginForm = document.getElementById('loginForm');
const attendanceForm = document.getElementById('attendanceForm');
const qrInput = document.getElementById('qrInput');
const submitAttendanceBtn = document.getElementById('submitAttendanceBtn');
const messageContainer = document.getElementById('messageContainer');

// Event listener for the login form
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    const result = await response.json();
    if (result.success) {
        // Hide login form and show attendance form
        loginForm.style.display = 'none';
        attendanceForm.style.display = 'block';
    } else {
        messageContainer.textContent = result.message;
    }
});

// Event listener for the attendance form
attendanceForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const qrCode = qrInput.value;

    const response = await fetch('/attendance', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ qrCode }),
    });

    const result = await response.json();
    if (result.success) {
        messageContainer.textContent = 'Attendance recorded successfully!';
        qrInput.value = ''; // Clear input field
    } else {
        messageContainer.textContent = result.message;
    }
});
