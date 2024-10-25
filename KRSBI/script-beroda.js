// JavaScript for sending commands to the server
function sendCommand(command) {
    fetch('command.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'command=' + encodeURIComponent(command)
    })
    .then(response => response.text())
    .then(data => showNotification('success', 'Command executed successfully!'))
    .catch((error) => showNotification('error', 'Failed to execute command.'));
}

// Function to handle logout
function logout() {
    // Redirect to the login page
    window.location.href = 'login.html';
}

// Set status for robot (active/inactive)
function setStatus(robot, status) {
    const activeButton = document.getElementById(`btn-${robot}-active`);
    const inactiveButton = document.getElementById(`btn-${robot}-inactive`);

    // Reset buttons
    [activeButton, inactiveButton].forEach(btn => {
        btn.classList.remove('active', 'inactive');
        btn.style.backgroundColor = '#ccc';
    });

    // Set active/inactive button
    const selectedButton = status === 'active' ? activeButton : inactiveButton;
    selectedButton.classList.add(status);
    selectedButton.style.backgroundColor = status === 'active' ? '#28a745' : '#dc3545';
}

// Show notifications
function showNotification(type, message) {
    const notification = document.getElementById('notification');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.display = 'block';
    setTimeout(() => notification.style.display = 'none', 2000);
}

// Show only the selected content (menu)
function showMenu(menu) {
    document.querySelectorAll('main section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(menu).style.display = 'block';
}

// Toggle theater mode for the map
function toggleTheaterMode() {
    const mapContainer = document.querySelector('.map-container');
    mapContainer.classList.toggle('theater-mode');
    const button = document.querySelector('.theater-button');
    button.textContent = mapContainer.classList.contains('theater-mode') ? 'Exit Theater Mode' : 'Enter Theater Mode';
}

// Initialize when the page loads
window.onload = () => {
    showMenu('map');
    document.querySelector('.theater-button')?.addEventListener('click', toggleTheaterMode);
};

// Start color detection
async function startColorDetection() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const colorOutput = document.getElementById('colorOutput');
    const colorPicker = document.getElementById('colorPicker');
    let selectedColor = colorPicker.value;

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;

        // Start detecting color
        setInterval(() => {
            // Draw video frame on canvas
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Get pixel data
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const pixels = imageData.data;

            // Convert selected color to RGB
            const selectedColorRGB = hexToRgb(selectedColor);

            let detected = false;

            // Loop through pixels to detect color
            for (let i = 0; i < pixels.length; i += 4) {
                const r = pixels[i];
                const g = pixels[i + 1];
                const b = pixels[i + 2];

                if (colorMatch(r, g, b, selectedColorRGB)) {
                    detected = true;
                    break;
                }
            }

            // Update result
            colorOutput.textContent = detected ? 'Color detected!' : 'No color detected yet.';

        }, 100); // Check every 100ms
    } catch (error) {
        console.error("Error accessing the camera: ", error);
    }
}

// Helper function to convert hex to RGB
function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
}

// Helper function to check if colors match (within tolerance)
function colorMatch(r, g, b, selectedColorRGB, tolerance = 50) {
    return Math.abs(r - selectedColorRGB.r) < tolerance &&
           Math.abs(g - selectedColorRGB.g) < tolerance &&
           Math.abs(b - selectedColorRGB.b) < tolerance;
}