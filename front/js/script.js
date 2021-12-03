//FONCTIONS
/**
 * créer une carte pour un produit en affichant les détails
 * @param {Object} data 
 */
const productDisplay = (data) => {
    let section = document.getElementById("items");//Sélection de la section produits
    const newElt = document.createElement("a");// Création de l'élément qui va contenir le produit
    newElt.setAttribute("href", `./product.html?id=${data.id}`);// Ajout de l'attribut 'href' pour le liens vers le produit
    section.appendChild(newElt);// Ajout de l'élément dans la section
    // Ajout du contenu de la carte
    newElt.innerHTML = `
    <article>
        <img src='${data.imageUrl}' alt='${data.alt}'>
        <h3 class='produtName'>${data.name}</h3>
        <p class='productDescription'>${data.description}</p>
    </article>
    `;
}

// CONNEXION AVEC L'API (Requête fetch)
fetch("http://localhost:3000/api/products")
    .then(response => response.json())
    .then(data => {
        for (let product of data) {
            productDisplay(product);
        }
    });