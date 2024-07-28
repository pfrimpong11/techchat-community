const togglePassword = document.querySelector('#toggle-password');


document.getElementById('register-form').addEventListener('submit', registerUser);


async function registerUser(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const firstName = document.getElementById('first-name').value;
    const surname = document.getElementById('last-name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    // const phoneNumber = document.getElementById('phone').value;
    const highSchool = document.getElementById('high-school').value;

    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = ''; // Clear any previous error message

    if (password !== confirmPassword) {
      errorMessage.textContent = 'Passwords do not match';
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, firstName, surname, email, password, highSchool })
      });

      if (response.ok) {
        const data = await response.json();
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('username', data.username);
        window.location.href = '/login.html';
      } else {
        const data = await response.json();
        errorMessage.textContent = data.message || 'Registration failed';
      }
    } catch (error) {
      errorMessage.textContent = 'An error occurred during registration';
    }
  }





// Function to make password hidden or visible
togglePassword.addEventListener('click', (event) => {
    const inputType = password.getAttribute('type') === 'password' ? 'text' : 'password';

    password.setAttribute('type', inputType);
    togglePassword.classList.toggle('bxs-hide');
})

function validateForm() {
    var checkbox = document.getElementById("checkbox");
    
    // Check if the checkbox is checked
    if (!checkbox.checked) {
        alert("Please read the 'User Consent Statement' and check the checkbox.");
      return false; // Prevent form submission
    }
    
    // Form is valid, allow submission
    return true;
}





