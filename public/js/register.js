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
    const checkbox = document.getElementById('checkbox').value;

    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = ''; // Clear any previous error message

    if (!validateEmail(email)) {
      errorMessage.innerText = 'Please enter a valid email'; 
      return;
  }


    if (password !== confirmPassword) {
      errorMessage.textContent = 'Passwords do not match';
      return;
    }

    if (firstName.trim() === "" || surname.trim() === "" || email.trim() === "" || highSchool.trim() === "") {
      errorMessage.textContent = 'Please fill in all fields';
      return;
    }

    if (password.length < 6) {
      errorMessage.textContent = 'Password must be at least 6 characters long';
      return;
    }

    if (!checkbox.checked) {
      errorMessage.textContent = 'Please read and check User Consent Statement';
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


function validateEmail(email) {
  var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}
