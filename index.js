// Variables et constantes
let works = null;
let categories = null;
const categoriesDiv = document.querySelector('.categories');
const galleryDiv = document.querySelector('.gallery');

// Récupérer la fenêtre modale et le bouton de fermeture
const modal = document.getElementById('myModal');
const btn = document.querySelectorAll('.icon-modification');
const span = document.querySelector('.close');
const addPictureModal = document.getElementById('addPictureModal');
const closeAddPictureModal = document.querySelector('#addPictureModal .close');
const imagePreview = document.getElementById("imagePreview");
const photoInput = document.getElementById("photoInput");



// Variable pour suivre si la modale a déjà été ouverte
let modalOpened = false;

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


// Charger la page après que tout soit prêt
window.onload = async () => 
{
  await loadPage();
};


// Fonction pour filtrer les images par catégorie
function filterGalleryByCategory(categoryName) 
{
  // Vide la galerie actuelle
  galleryDiv.innerHTML = '';
  // Filtrer les images par catégorie
  const filteredWorks = works.filter(work => work.category.name === categoryName);
  // Créer les éléments HTML pour chaque image filtrée
  filteredWorks.forEach(element => 
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
  });
}

// Fonction pour créer les éléments HTML de la galerie
// Appeler cette focntion dans les fonctions de suppression et d'ajout 
function createElementGallery(targetDiv) 
{
  targetDiv.innerHTML = ''; // Vide la galerie actuelle
  works.forEach(element => {
    const figureElement = document.createElement('figure');
    const imgElement = document.createElement('img');
    const figcaptionElement = document.createElement('figcaption');

    figureElement.id = `galleryElement_${element.id}`;
    imgElement.setAttribute('src', element.imageUrl);
    imgElement.setAttribute('alt', element.title);

    figcaptionElement.textContent = element.title;

    figureElement.appendChild(imgElement);
    figureElement.appendChild(figcaptionElement);
    targetDiv.appendChild(figureElement);
  });
}

// Fonction pour charger la page
async function loadPage() 
{
  // alert("loadPage")
  // Récupération des données du backend
  works = await getDataFromBackend("works");
  categories = await getDataFromBackend("categories");


  // Vérification de l'état de connexion
  const loggedIn = sessionStorage.getItem('loggedIn');
  // Si connecté, afficher les éléments appropriés
  if (loggedIn === 'true') 
  {
    const modePage = document.querySelector('.mode-page');
    const modificationIcons = document.querySelectorAll('.icon-modification'); 
    const loginLink = document.querySelector('.login');
    const logoutLink = document.querySelector('.logout');
    
    // je parcours la liste des éléments et défini la propriété visibility sur chacun d'eux
    modificationIcons.forEach(icon => {
      icon.style.visibility = 'visible';
      // Ouvrir la fenêtre modale lorsque l'utilisateur clique sur l'icône d'édition
      icon.addEventListener('click', function() 
      {
        modal.style.display = 'block';
        
        
        // Vérifier si la modale a déjà été ouverte
        if (!modalOpened) 
        {
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
          works.forEach((element, index) => 
          {

            const figureElement = document.createElement('figure');
            const imgElement = document.createElement('img');
            const figcaptionElement = document.createElement('figcaption');
            const trashIcon = document.createElement('i'); 
            
            imgElement.setAttribute('src', element.imageUrl);
            imgElement.setAttribute('alt', element.title);
            figcaptionElement.textContent = 'éditer';

            // j'ajoute la classe de l'icône de poubelle 
            trashIcon.classList.add('fa', 'fa-trash-can');
            
            // Placement de l'icône de poubelle en haut à droite de la figureElement
            figureElement.style.position = 'relative'; 
            trashIcon.style.position = 'absolute';
            trashIcon.style.top = '10px'; 
            trashIcon.style.right = '5%'; 

            // Écouter le clic sur l'icône de poubelle
            trashIcon.addEventListener('click', async () => 
            {
              // ID de l'œuvre actuelle
              const workId = element.id;
              
              try {
                const token = sessionStorage.getItem('token')

                // on effectue la requête de suppression en utilisant le token
                const deleteResponse = await fetch(`http://localhost:5678/api/works/${workId}`, 
                {
                  method: 'DELETE',
                  headers:
                  {
                    'Authorization': `Bearer ${token}` // Utilisation du token
                  },
                });
                
                if (deleteResponse.ok) 
                {
                  // Retirer l'élément dans works
                  const indexToRemove = works.findIndex(work => work.id === workId);
                  if (indexToRemove !== -1) {
                    works.splice(indexToRemove, 1); // Supprimer l'élément du tableau
                  }
                  // Si la suppression réussit, on supprime l'élément de la galerie dans la modale
                  modalGalleryDiv.removeChild(figureElement);
                  createElementGallery(galleryDiv);
                  
                  // Vérifier s'il existe également une image correspondante dans la galerie principale (page)
                  const galleryElement = document.getElementById(`galleryElement_${workId}`);
                  if (galleryElement) 
                  {
                    // Supprimer l'élément correspondant de la galerie principale (page)
                    galleryElement.parentElement.removeChild(galleryElement);
                    
                  }
                 
                } 
                  else 
                  {
                    console.error('Erreur lors de la suppression de l\'œuvre.');
                  }
                } catch (error) 
                {
                  console.error('Erreur lors de la suppression de l\'œuvre:', error);
                }
             
            });
          
            figureElement.appendChild(imgElement);
            figureElement.appendChild(figcaptionElement);
            figureElement.appendChild(trashIcon);

            if (index === 0)
            {
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
          btnAddPicture.id = 'btnAddPicture'; 

          // Ajouter le bouton à la div divBtnAddPicture
          divBtnAddPicture.appendChild(btnAddPicture);
          
          // Ajouter la div divBtnAddPicture à la modalContent
          modalContent.appendChild(divBtnAddPicture);
          divBtnAddPicture.style.display ='flex';
          divBtnAddPicture.style.justifyContent = 'center';
          divBtnAddPicture.style.marginTop = '40px';
          divBtnAddPicture.style.marginBottom = '40px'
          
          btnAddPicture.style.backgroundColor = '#1D6154'; 
          btnAddPicture.style.border = 'none'; 
          btnAddPicture.style.borderRadius = '30px'; 
          btnAddPicture.style.color = 'white'; 
          btnAddPicture.style.padding = '10px 40px';
          btnAddPicture.style.whiteSpace = 'nowrap'

          // Ajouter un event listener pour écouter les clics sur le bouton
          modalContent.addEventListener('click', function (event) {
            if (event.target.id === 'btnAddPicture')
            {
            
              modal.style.display = 'none';
              addPictureModal.style.display = 'block';
            }
});
        
          const suppressionSetence = document.createElement('div')
          const sentence = document.createElement('p')
          sentence.textContent = 'Supprimer la galerie'
          suppressionSetence.className = 'suppression-sentence'
          suppressionSetence.appendChild(sentence)
          modalContent.appendChild(suppressionSetence)
          
          document.getElementById("imageForm").addEventListener("submit", function (event) 
        {
            event.preventDefault(); // Empêche la soumission normale du formulaire
        
            // Accéder au fichier image téléchargé
            const imageFile = document.getElementById("photoInput").files[0];
        
            // Vérifier si un fichier a été sélectionné
            if (!imageFile) {
                alert("Veuillez sélectionner une image.");
                console.log("Aucune image sélectionnée."); 
                return; // Arrêter la soumission du formulaire
            }
        
            // Vérifier la taille du fichier (4 Mo maximum)
            const maxSize = 4 * 1024 * 1024; 
            if (imageFile.size > maxSize) {
                alert("La taille du fichier est supérieure à 4 Mo. Veuillez choisir un fichier plus petit.");
                console.log("Fichier trop volumineux."); 
                return; 
            }
        
            // Si le fichier est valide, on peut maintenant soumettre le formulaire
            this.submit();
        });


          // Affichage des catégories récupérées depuis l'API dans AddPictureModale
          const categorySelect = document.getElementById('category');

          //  je crée une option vide par défaut, pour que rien ne s'affiche 
          const defaultOption = document.createElement('option');
          defaultOption.textContent = ''; 
  
        // Ajouter l'option vide en haut de la liste déroulante
        categorySelect.appendChild(defaultOption);
  
        // Parcourir les catégories récupérées depuis l'API
        categories.forEach(category => 
        {
          const option = document.createElement('option');
          option.value = category.id; 
          option.textContent = category.name; 
          categorySelect.appendChild(option); // Ajouter l'option à la liste déroulante
        });
  
        const btnValidate = document.querySelector(".btnValidate");
        btnValidate.addEventListener("click", async function (event) 
        {
            event.preventDefault(); 
            console.log("ajout d'image")
        
            // Récupérer le token d'authentification depuis le sessionStorage
            const authToken = sessionStorage.getItem("token");
            console.log("token : " + authToken);
        
            // Récupérer le titre et la catégorie depuis les champs du formulaire
            const image = document.getElementById("photoInput").files[0]; 
            const title = document.getElementById("title").value;
            const categoryId = document.getElementById("category").value; 
            console.log("title : " + title);
            console.log("categoryId : " + categoryId);

             // Vérifier si les champs obligatoires sont renseignés
            if (!image || !title || !categoryId) 
            {
              // Afficher un message d'erreur
              alert("Veuillez renseigner tous les champs du formulaire.");
              return; // Arrêter l'exécution de la fonction
            }
            
            if (categoryId) 
            { 
              
              // Créer un objet FormData pour gérer le téléchargement de l'image
              const formData = new FormData();
              formData.append("image", image); 
              formData.append("title", title); 
              formData.append("category", categoryId); 

              // Ajouter le token d'authentification dans les en-têtes de la requête
              const headers = new Headers({
                  "Authorization": `Bearer ${authToken}`
              });
              console.log("data : " + data);
              // Envoi de la requête à l'API
              try {
                  const response = await fetch("http://localhost:5678/api/works/",
                  {
                      method: "POST",
                      headers: headers,
                      body: formData // Utiliser le FormData comme corps de la requête
                  });

                  console.log("response.status : " + response.status);

                  // Vérification de la réponse de l'API
                  if (response.status === 201) {
                      // La requête a réussi
                      const responseData = await response.json();
                      console.log("Image ajoutée avec succès :", responseData);

                      // Mettre à jour la galerie d'œuvres avec la nouvelle image
                      works.push(responseData);
                      console.log(works);
                      console.log(responseData);

                      // Appeler la fonction pour mettre à jour la galerie existante
                      createElementGallery(galleryDiv);


                      // Ajouter la nouvelle images dans la modale "MyModal"
                      const modalGalleryDiv = modal.querySelector('.gallery');
                      const newFigureElement = document.createElement('figure');
                      const newImgElement = document.createElement('img');
                      const newFigcaptionElement = document.createElement('figcaption');

                      newImgElement.setAttribute('src', responseData.imageUrl);
                      newImgElement.setAttribute('alt', responseData.title);
                      newFigcaptionElement.textContent = "éditer";

                      newFigureElement.appendChild(newImgElement);
                      newFigureElement.appendChild(newFigcaptionElement);

                      // Ajouter l'élément à la galerie modale
                      modalGalleryDiv.appendChild(newFigureElement);

                      const trashIcon = document.createElement('i');
                      trashIcon.classList.add('fa', 'fa-trash-can');
            
                      // Placement de l'icône de poubelle en haut à droite de la figureElement
                      newFigureElement.style.position = 'relative'; 
                      trashIcon.style.position = 'absolute';
                      trashIcon.style.top = '10px'; 
                      trashIcon.style.right = '5%'; 

                      newFigureElement.appendChild(trashIcon)

                // Écouter le clic sur l'icône de la corbeille lorsque on a rajouter l'image dynamiquement
                trashIcon.addEventListener('click', async () => {

                  const workId = responseData.id;
              
                  try {
                    const token = sessionStorage.getItem('token')
                    // on effectue la requête de suppression en utilisant le token
                    const deleteResponse = await fetch(`http://localhost:5678/api/works/${workId}`, 
                    {
                      method: 'DELETE',
                      headers: {
                        'Authorization': `Bearer ${token}` // Utilisation du token
                      },
                    });
                    
                    if (deleteResponse.ok) 
                    {
                      // Si la suppression réussit, on supprime l'élément de la galerie dans la modale
                      modalGalleryDiv.removeChild(newFigureElement);

                      // Retirer également l'élément dans works
                      const indexToRemove = works.findIndex(work => work.id === workId);
                      if (indexToRemove !== -1) {
                        works.splice(indexToRemove, 1); 
                      }
                      
                      // on supprime également l'élément correspondant dans la galerie principale (page)
                      const galleryElement = document.getElementById(`galleryElement_${workId}`);
                      if (galleryElement) {
                        galleryElement.parentElement.removeChild(galleryElement);
                      }
                    }
                     else 
                    {
                      console.error('Erreur lors de la suppression de l\'œuvre.');
                    }
                  } catch (error) 
                  {
                    console.error('Erreur lors de la suppression de l\'œuvre:', error);
                  }
              });
                    // Fermer la modale "Ajouter une photo" et supprimer tous les éléments à l'intérieur
                      addPictureModal.style.display = 'none';
                      document.getElementById("title").value = "";
                      document.getElementById("category").value = "";
                      document.getElementById("photoInput").value = "";
                      imagePreview.src = '#';
                      imagePreview.classList.add("hide-label");

                  } 
                  else 
                  {
                      // La requête a échoué
                      console.error("Échec de l'ajout de l'image.");
                  }
              } catch (error) {
                  console.error("Erreur lors de la requête à l'API :", error);
              }
            }
        });
                                
        photoInput.addEventListener("change", function() 
        {
            const selectedImage = photoInput.files[0];
        
            if (selectedImage) 
            {
                const reader = new FileReader();
        
                reader.onload = function(e) {
                    // Mettre à jour la source de l'image avec les données de l'image sélectionnée
                    imagePreview.src = e.target.result;
                    // Supprimer la classe qui masque le texte "Image Preview"
                    imagePreview.classList.remove("hide-label");
                };
        
                // Lire le fichier image en tant qu'URL de données
                reader.readAsDataURL(selectedImage);
            } 
            else 
            {
                // Si aucun fichier n'est sélectionné, effacez la source de l'image
                imagePreview.src = "#";
                // Ajoutez à nouveau la classe pour masquer le texte
                imagePreview.classList.add("hide-label");
            }
        });
        
        
    
        // Marquer la modale comme ouverte
        modalOpened = true;
        }
      });
      
      // passage de la seconde modale à la première en cliquant sur la flèche
        const goBackToMyModal = document.getElementById('goBackToMyModal');

        // Ajouter un gestionnaire d'événements de clic
        goBackToMyModal.addEventListener('click', function (event) 
        {
          event.preventDefault(); // Empêche le comportement de lien par défaut

          // masquer la modal "AddPictureModale"
          addPictureModal.style.display = 'none';

          // Pour afficher la modal "myModal"
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
        if (event.target === modal) 
        {
          modal.style.display = 'none';
        }
      });

      // fermer la modale AddPictureModal
        closeAddPictureModal.addEventListener('click', function() 
      {
        addPictureModal.style.display = 'none'; 
        document.getElementById("title").value = "";
        document.getElementById("category").value = "";
        document.getElementById("photoInput").value = "";
        imagePreview.src = '#';
        imagePreview.classList.add("hide-label");
        
      });
      window.addEventListener('click', function(event) {
        if (event.target === addPictureModal) {
          addPictureModal.style.display = 'none';
        }
      })
    });
      
 
    if (modePage) modePage.style.visibility = 'visible';
    if (loginLink) loginLink.style.display = 'none';
    if (logoutLink) logoutLink.style.display = 'block';
    if (categoriesDiv) categoriesDiv.style.display = 'none'; // Masquer les boutons de catégories
    createElementGallery(galleryDiv);

  } 
  else 
  {
    // Sinon, afficher les boutons de catégories
    createCategoryButtons();
    createElementGallery(galleryDiv);
  }
}
// Fonction pour créer les boutons de catégories
function createCategoryButtons() 
{
  if (categoriesDiv) 
  {
    categoriesDiv.innerHTML = ''; // Vide les boutons de catégories actuels
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
            createElementGallery(galleryDiv);
          } 
          else
          {
            filterGalleryByCategory(category.name);
          }
        });
      });
    }
  }
}
// Événement pour le lien de déconnexion
const logoutLink = document.querySelector('.logout');
if (logoutLink) 
{
  logoutLink.addEventListener('click', () => 
  {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('loggedIn');
    window.location.href = 'index.html';
  });
}