/**
 * Handle voter login
 */
function handleLogin(event) {
  // Prevent reloading the page
  event.preventDefault();

  // Send a POST request to the server
  fetch('/api/voters/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      studentId: event.target.loginStudentId.value,
      password: event.target.loginPassword.value,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        toast.error(data.error);
      } else {
        sessionStorage.setItem('voter', JSON.stringify(data));
        window.location = '/voting.html';
      }
    })
    .catch((ex) => {
      toast.error(ex.message);
    })
    .finally(() => {
      event.target.reset();
    });
}

/**
 * Handle voter registration
 */
function handleRegister(event) {
  // Prevent reloading the page
  event.preventDefault();

  // Make a POST request with the form data
  fetch('/api/voters', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      studentId: event.target.studentId.value,
      firstName: event.target.firstName.value,
      lastName: event.target.lastName.value,
      email: event.target.email.value,
      password: event.target.password.value,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        toast.error(data.error);
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Voter registered',
          text: 'Please wait for your approval',
        });
      }
    })
    .catch((ex) => {
      toast.error(ex.message);
    })
    .finally(() => {
      event.target.reset();
    });
}
