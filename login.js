
const form = document.querySelector('form');

window.onload = () => {
    // Rien à faire ici pour le moment
}

// Quand on submit
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Envoi des informations d'identification au serveur
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

        // Stocker le token dans le stockage local
        localStorage.setItem('token', token);

        // Rediriger vers la page d'accueil
        window.location.href = 'connexionOk.html';
    } else {
        // Connexion échouée
        const errorDiv = document.querySelector(".error");
        errorDiv.style.visibility = "visible"
        console.log('Informations d\'identification incorrectes');
    
    }

  
    
});
