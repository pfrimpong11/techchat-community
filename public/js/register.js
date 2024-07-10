document.getElementById('register-form').addEventListener('submit', registerUser);
// document.getElementById('login-form').addEventListener('submit', loginUser);


async function registerUser(event) {
  event.preventDefault();
  
  const username = document.getElementById('username').value;
  const firstName = document.getElementById('firstName').value;
  const surname = document.getElementById('surname').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, firstName, surname, email, password })
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





// async function loginUser(event) {
//   event.preventDefault();

//   const email = document.getElementById('email').value;
//   const password = document.getElementById('password').value;

//   const response = await fetch('/api/auth/login', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({ email, password })
//   });

//   if (response.ok) {
//     const data = await response.json();
//     localStorage.setItem('token', data.token);
//     localStorage.setItem('username', data.username);
//     window.location.href = '/comment-section.html';
//     console.log("login successful");
//   } else {
//     alert('Login failed');
//   }
// }
