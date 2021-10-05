function handleLogin(event) {
  event.preventDefault();

  const username = event.target.username.value;
  const password = event.target.password.value;

  if (username === 'admin' && password === '123') {
    window.location = '/admin/index.html';
  } else {
    alert('Incorrect credentials');
  }
}
