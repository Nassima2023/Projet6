// Variables et constantes
let works = null;
let categories = null;
const categoriesDiv = document.querySelector('.categories');
const galleryDiv = document.querySelector('.gallery');

// Récupérer la fenêtre modale et le bouton de fermeture
const modal = document.getElementById('myModal');
const btn = document.querySelectorAll('.icon-modification');
const span = document.querySelector('.close');

// Variable pour suivre si la modale a déjà été ouverte
let modalOpened = false;

// Fonction pour récupérer les données du backend
async function getDataFromBackend(dataToGet) {
  try {
    const response = await fetch('http://localhost:5678/api/' + dataToGet);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des données du backend:', error);
  }
}

// Charger la page après que tout soit prêt
window.onload = async () => {
  await loadPage();
};

// Fonction pour filtrer les images par catégorie
function filterGalleryByCategory(categoryName) {
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
function createElementGallery(targetDiv) {
  targetDiv.innerHTML = ''; // Vide la galerie actuelle

  works.forEach(element => {
    const figureElement = document.createElement('figure');
    const imgElement = document.createElement('img');
    const figcaptionElement = document.createElement('figcaption');

    imgElement.setAttribute('src', element.imageUrl);
    imgElement.setAttribute('alt', element.title);
    figcaptionElement.textContent = element.title;

    figureElement.appendChild(imgElement);
    figureElement.appendChild(figcaptionElement);
    targetDiv.appendChild(figureElement);
  });
}

// Fonction pour charger la page
async function loadPage() {
  // Récupération des données du backend
  works = await getDataFromBackend("works");
  categories = await getDataFromBackend("categories");

  // Vérification de l'état de connexion
  const loggedIn = localStorage.getItem('loggedIn');

  // Si connecté, afficher les éléments appropriés
  if (loggedIn === 'true') {
    const modePage = document.querySelector('.mode-page');
    const modificationIcons = document.querySelectorAll('.icon-modification'); 
    const loginLink = document.querySelector('.login');
    const logoutLink = document.querySelector('.logout');

    // je parcours la liste des éléments et défini la propriété visibility sur chacun d'eux
    modificationIcons.forEach(icon => {
      icon.style.visibility = 'visible';

      // Ouvrir la fenêtre modale lorsque l'utilisateur clique sur l'icône d'édition
      icon.addEventListener('click', function() {
        modal.style.display = 'block';

        // Vérifier si la modale a déjà été ouverte
        if (!modalOpened) {
          // récuperer la div de la galerie dans la modale
          const modalGalleryDiv = modal.querySelector('.gallery');

          // Effacer le contenu actuel de la galerie modale
          modalGalleryDiv.innerHTML = '';

          // Ajouter un titre à la modale
          const modalContent = modal.querySelector('.modal-content')

          // Créer le titre "Galerie Photo"
          const title = document.createElement('h2');
          title.textContent = 'Galerie Photo';

          // Créer la titleDiv et ajouter le titre à l'intérieur
          const titleDiv = document.createElement('div');
          titleDiv.className = 'titleDiv';
          titleDiv.appendChild(title);

          // Ajouter la titleDiv à la modalContent
          modalContent.appendChild(titleDiv);

          titleDiv.style.display = 'flex';
          titleDiv.style.justifyContent = 'center';
          titleDiv.style.margin ="40px 0px 40px 0px"

          // Ajouter les œuvres et créer les éléments dans la galerie modale
          works.forEach((element, index) => {
            const figureElement = document.createElement('figure');
            const imgElement = document.createElement('img');
            const figcaptionElement = document.createElement('figcaption');
            const trashIcon = document.createElement('i'); // Créez l'icône de poubelle
            
            imgElement.setAttribute('src', element.imageUrl);
            imgElement.setAttribute('alt', element.title);
            figcaptionElement.textContent = 'éditer';

            // j'ajoute la classe de l'icône de poubelle 
            trashIcon.classList.add('fa', 'fa-trash-can');
            
            // Placement de l'icône de poubelle en haut à droite de la figureElement
            figureElement.style.position = 'relative'; 
            trashIcon.style.position = 'absolute';
            trashIcon.style.top = '10px'; 
            trashIcon.style.right = '10px'; 


            // Écouter le clic sur l'icône de poubelle
            trashIcon.addEventListener('click', async () => {
              // ID de l'œuvre actuelle
              const workId = element.id;
              const token = localStorage.getItem('token')
              
              try {
                
                // on effectue la requête de suppression en utilisant le token
                const deleteResponse = await fetch(`http://localhost:5678/api/works/${workId}`, {
                  method: 'DELETE',
                  headers: {
                    'Authorization': `Bearer ${token}` // Utilisation du token
                    },
                  });
                  
                  if (deleteResponse.ok) {
                  // Si la suppression réussit, on supprime l'élément de la galerie
                  modalGalleryDiv.removeChild(figureElement);
                } else {
                  console.error('Erreur lors de la suppression de l\'œuvre.');
                }
              } catch (error) {
                console.error('Erreur lors de la suppression de l\'œuvre:', error);
              }

             
            });

          
            figureElement.appendChild(imgElement);
            figureElement.appendChild(figcaptionElement);
            figureElement.appendChild(trashIcon);

            if (index === 0) {
              // Si c'est le premier élément, on ajoute l'icône flèche
              const customIcon = document.createElement('i');
              customIcon.classList.add('fa-solid', 'fa-arrows-up-down-left-right');
              customIcon.style.position = 'absolute';

            figureElement.appendChild(customIcon);
          }

          modalGalleryDiv.appendChild(figureElement);
          modalContent.insertBefore(titleDiv, modalGalleryDiv);
});


        // Créer la div pour le bouton "Ajouter une photo"
          const divBtnAddPicture = document.createElement('div');

          // Créer le bouton "Ajouter une photo"
          const btnAddPicture = document.createElement('button');
          btnAddPicture.textContent = 'Ajouter une photo';

          // Ajouter le bouton à la div divBtnAddPicture
          divBtnAddPicture.appendChild(btnAddPicture);

          // Ajouter la div divBtnAddPicture à la modalContent
          modalContent.appendChild(divBtnAddPicture);

          divBtnAddPicture.style.display ='flex';
          divBtnAddPicture.style.justifyContent = 'center';
          divBtnAddPicture.style.marginTop = '70px';
          divBtnAddPicture.style.marginBottom = '40px'
          
          btnAddPicture.style.backgroundColor = '#1D6154'; 
          btnAddPicture.style.border = 'none'; 
          btnAddPicture.style.borderRadius = '30px'; 
          btnAddPicture.style.color = 'white'; 
          btnAddPicture.style.padding = '10px 40px';
          btnAddPicture.style.whiteSpace = 'nowrap'


          const suppressionSetence = document.createElement('div')
          const sentence = document.createElement('p')
          sentence.textContent = 'Supprimer la galerie'
          suppressionSetence.className = 'suppression-sentence'

          suppressionSetence.appendChild(sentence)
          modalContent.appendChild(suppressionSetence)

        // Marquer la modale comme ouverte
        modalOpened = true;
      }
      });
      
      
      // Fermer la fenêtre modale lorsque l'utilisateur clique sur le bouton de fermeture
      span.addEventListener('click', function() {
        modal.style.display = 'none';
      });

      // Fermer la fenêtre modale si l'utilisateur clique en dehors du contenu de la fenêtre
      window.addEventListener('click', function(event) {
        if (event.target === modal) {
          modal.style.display = 'none';
        }
      });
    });

    if (modePage) modePage.style.visibility = 'visible';
    if (loginLink) loginLink.style.display = 'none';
    if (logoutLink) logoutLink.style.display = 'block';
    if (categoriesDiv) categoriesDiv.style.display = 'none'; // Masquer les boutons de catégories
    createElementGallery(galleryDiv);

  } else {
    // Sinon, afficher les boutons de catégories
    createCategoryButtons();
    createElementGallery(galleryDiv);
  }
}

// Fonction pour créer les boutons de catégories
function createCategoryButtons() {
  if (categoriesDiv) {
    categoriesDiv.innerHTML = ''; // Vide les boutons de catégories actuels

    if (categories) {
      categories.unshift({ id: 0, name: "Tous" });

      categories.forEach(category => {
        const buttonCategories = document.createElement('button');
        buttonCategories.textContent = category.name;
        categoriesDiv.appendChild(buttonCategories);

        buttonCategories.addEventListener('click', () => {
          if (category.name === "Tous") {
            createElementGallery(galleryDiv);
          } else {
            filterGalleryByCategory(category.name);
          }
        });
      });
    }
  }
}


// Événement pour le lien de déconnexion
const logoutLink = document.querySelector('.logout');
if (logoutLink) {
  logoutLink.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedIn');
    window.location.href = 'index.html';
  });
}