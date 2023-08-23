const form = document.querySelector('form');

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const response = await fetch('http://localhost:5678/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  if (response.ok) {
    // Connexion réussie
    const data = await response.json();
    const token = data.token;

    localStorage.setItem('token', token);
    localStorage.setItem('loggedIn', 'true');

    // Redirection vers la page d'accueil
    window.location.href = 'index.html';
  } else {
    // Connexion échouée
    const errorDiv = document.querySelector(".error");
    errorDiv.style.visibility = "visible";
    console.log('Informations d\'identification incorrectes');
  }
});
