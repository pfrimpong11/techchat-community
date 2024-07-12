// Variables
const togglePassword = document.querySelector('#toggle-password');

document.getElementById('login-form').addEventListener('submit', loginUser);

    async function loginUser(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
    });

    if (response.ok) {
    const data = await response.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('username', data.username);
    window.location.href = '/comment-section.html';
    console.log("login successful");
    } else {
    alert('Login failed');
    }
}

// Event listener to toggle password visibility
togglePassword.addEventListener('click', () => {
    const inputType = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', inputType);
    togglePassword.classList.toggle('bxs-hide');
});

// Function to validate the form
function validateForm() {
    const checkbox = document.getElementById("checkbox");
    
    // Check if the checkbox is checked
    if (!checkbox.checked) {
        alert("Please read the 'User Consent Statement' and check the checkbox.");
        return false; // Prevent form submission
    }
    
    // Form is valid, allow submission
    return true;
}
