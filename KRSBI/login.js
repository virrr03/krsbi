document.getElementById('loginButton').addEventListener('click', function() {
    const selectedRobotType = document.getElementById('robotType').value;
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = ''; // Clear any previous error messages

    if (selectedRobotType) {
        // Redirect to the corresponding control dashboard
        if (selectedRobotType === "humanoid") {
            window.location.href = 'index-humanoid.html';
        } else if (selectedRobotType === "beroda") {
            window.location.href = 'index-beroda.html';
        }
    } else {
        errorMessage.textContent = 'Please select a robot type.';
    }
});