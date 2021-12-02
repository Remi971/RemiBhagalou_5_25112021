//FONCTIONS
// Fonction qui va créer une carte pour un produit en affichant les détails indiqués en paramètre
const productDisplay = (id,imgUrl, alt, name, description ) => {
    let section = document.getElementById("items");//Sélection de la section produits
    const newElt = document.createElement("a");// Création de l'élément qui va contenir le produit
    newElt.setAttribute("href", `./product.html?id=${id}`);// Ajout de l'attribut 'href' pour le liens vers le produit
    section.appendChild(newElt);// Ajout de l'élément dans la section
    // Ajout du contenu de la carte
    newElt.innerHTML = `
    <article>
        <img src='${imgUrl}' alt='${alt}'>
        <h3 class='produtName'>${name}</h3>
        <p class='productDescription'>${description}</p>
    </article>
    `;
}

// CONNEXION AVEC L'API (Requête fetch)
fetch("http://localhost:3000/api/products")
    .then(response => response.json())
    .then(data => {
        for (let product of data) {
            productDisplay(product._id, product.imageUrl, product.altTxt, product.name, product.description)
        }
    });