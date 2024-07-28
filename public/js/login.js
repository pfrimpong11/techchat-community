// Variables
const togglePassword = document.querySelector('#toggle-password');

document.getElementById('login-form').addEventListener('submit', loginUser);

    async function loginUser(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = ''; // Clear any previous error message

    if (email.trim() === "") {
        errorMessage.innerText = 'Please provide your email';
        return;
    }

    if (password.trim() === "") {
        errorMessage.innerText = 'Please enter your password';
        return;
    }

    try {
        const response = await fetch('/api/auth/login', {  // here
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
            });

        if (response.ok) {
            const data = await response.json();
            window.location.href = '/forum.html';
            sessionStorage.setItem('token', data.token); // here 
            sessionStorage.setItem('username', data.username);  // here
        } else {
            const data = await response.json();
            errorMessage.textContent = data.message || 'Login failed';
        }
    } catch (error) {
        errorMessage.textContent = 'An error occurred during Login';
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
