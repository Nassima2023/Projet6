// variables et constantes 

let works = null;
let categories = null 

// Fonctions 
window.onload = async (event) =>
{
  // Appel de la fonction pour créer les éléments HTML de la galerie
  works = await getDataFromBackend("works");
  createElementGallery();

  // Appel à l'API pour récupérer les catégories 
  categories = await getDataFromBackend("categories")
  console.log(categories);

};
  
async function getDataFromBackend(dataToGet) 
{
  try 
  {
    const response = await fetch('http://localhost:5678/api/' + dataToGet);
    const data = await response.json();
    return data;
  } catch (error) 
  {
    console.error('Erreur lors de la récupération des données du backend:', error);
  }
}

  
// Fonction pour créer les éléments HTML dynamiquement
async function createElementGallery() 
{
  const galleryDiv = document.querySelector('.gallery');

  for (const element of works) 
  {
    const figureElement = document.createElement('figure');
    const imgElement = document.createElement('img');
    const figcaptionElement = document.createElement('figcaption');

    imgElement.setAttribute('src', element.imageUrl);
    imgElement.setAttribute('alt', element.title);
    figcaptionElement.textContent = element.title;

    figureElement.appendChild(imgElement);
    figureElement.appendChild(figcaptionElement);
    galleryDiv.appendChild(figureElement);
  }
  console.log(works);
}




// créer les boutons class catégories et leur donner leur style : 

// ajouter event listeners sur l'evenement click sur les boutons : 



