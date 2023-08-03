
async function fetchDataFromBackend() {
    try {
      const response = await fetch('http://localhost:5678/api/works');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des données du backend:', error);
    }
  }


  