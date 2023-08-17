
// variables et constantes
let works = null;
let categories = null;
const categoriesDiv = document.querySelector('.categories');
const galleryDiv = document.querySelector('.gallery');

// Récupérer la fenêtre modale et le bouton de fermeture
const modal = document.getElementById('myModal');
const btn = document.querySelector('.icon-modification');
const span = document.querySelector('.close');


// Fonction pour récupérer les données du backend
async function getDataFromBackend(dataToGet) 
{
  try {
    const response = await fetch('http://localhost:5678/api/' + dataToGet);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des données du backend:', error);
  }
}

// Chargement initial de la page
window.onload = async () => 
{
  // Récupération des données du backend
  works = await getDataFromBackend("works");
  categories = await getDataFromBackend("categories");
  console.log(works);
  console.log(categories);
 
  // Affichage initial de la galerie
  createElementGallery();
};


// Fonction pour filtrer les images par catégorie
function filterGalleryByCategory(categoryName) 
{
  // Vide la galerie actuelle
  galleryDiv.innerHTML = '';

  // Filtrer les images par catégorie
  const filteredWorks = works.filter(work => work.category.name === categoryName);

  // Créer les éléments HTML pour chaque image filtrée
  filteredWorks.forEach(element => {
    const figureElement = document.createElement('figure');
    const imgElement = document.createElement('img');
    const figcaptionElement = document.createElement('figcaption');

    imgElement.setAttribute('src', element.imageUrl);
    imgElement.setAttribute('alt', element.title);
    figcaptionElement.textContent = element.title;

    figureElement.appendChild(imgElement);
    figureElement.appendChild(figcaptionElement);
    galleryDiv.appendChild(figureElement);
  });
}

// Fonction pour créer les éléments HTML de la galerie
function createElementGallery() 
{
  works.forEach(element => {
    const figureElement = document.createElement('figure');
    const imgElement = document.createElement('img');
    const figcaptionElement = document.createElement('figcaption');

    imgElement.setAttribute('src', element.imageUrl);
    imgElement.setAttribute('alt', element.title);
    figcaptionElement.textContent = element.title;

    figureElement.appendChild(imgElement);
    figureElement.appendChild(figcaptionElement);
    galleryDiv.appendChild(figureElement);
  });
}


// Ouvrir la fenêtre modale lorsque l'utilisateur clique sur l'icône
btn.addEventListener('click', function() 
{
  modal.style.display = 'block';
});

// Fermer la fenêtre modale lorsque l'utilisateur clique sur le bouton de fermeture
span.addEventListener('click', function() 
{
  modal.style.display = 'none';
});

// Fermer la fenêtre modale si l'utilisateur clique en dehors du contenu de la fenêtre
window.addEventListener('click', function(event) 
{
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});

