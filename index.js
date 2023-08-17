
// variables et constantes
let works = null;
let categories = null;
const categoriesDiv = document.querySelector('.categories');
const galleryDiv = document.querySelector('.gallery');

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
 
  // Création des boutons de catégories
  createCategoryButtons();

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

// Fonction pour créer les boutons de catégories
function createCategoryButtons() 
{
  if (categories)
   {
    categories.unshift({ id: 0, name: "Tous" });

    categories.forEach(category => 
      {
      const buttonCategories = document.createElement('button');
      buttonCategories.textContent = category.name;
      categoriesDiv.appendChild(buttonCategories);

      buttonCategories.addEventListener('click', () => {
        if (category.name === "Tous")
        {
          createElementGallery();
        } else {
          filterGalleryByCategory(category.name);
        }
      });
    });
  }
}



