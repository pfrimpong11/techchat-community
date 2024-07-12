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
    const phoneNumber = document.getElementById('phone').value;
    const highSchool = document.getElementById('high-school').value;

    if(password !== confirmPassword) {
        alert("Passwords do not match");
    }

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, firstName, surname, email, password, phoneNumber, highSchool })
    });
  
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
      window.location.href = '/comment-section.html';
      console.log("Sign up successful");
    } else {
      alert('Registration failed');
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





