//FONCTIONS
// Fonction qui va créer une carte pour un produit en affichant les détails indiqué en paramètre
const productInfo = (data ) => {
    //Création de l'élément img du produit
    const img = document.createElement('img');
    img.setAttribute('src', data.imageUrl);
    img.setAttribute('alt', data.altTxt);
    document.querySelector('.item__img').appendChild(img);// Ajout de l'élément dans la div prévu à cet effet
    document.getElementById('title').innerHTML = data.name; //Ajout du nom du produit dans l'élément h1 prévu
    document.getElementById('price').innerHTML = data.price;// Ajout du prix dnas l'élément span prévu
    document.getElementById('description').innerHTML = data.description;// Ajout de la description dans l'élément p prévu
    for (let color in data.colors) {// Pour chaque couleur du produit, une option est créée
        const optionColor = document.createElement('option');
        optionColor.setAttribute('value', data.colors[color])
        optionColor.innerHTML = data.colors[color]
        document.getElementById('colors').appendChild(optionColor)
    }
}

// Function qui va stocker les infos sur le produit dans le LocalStorage
const saveToCart = () => {
    // Rédcupération des informations fournies par l'utilisateur
    let select = document.getElementById("colors")
    let color = select.options[select.selectedIndex].text
    let quantity = parseInt(document.getElementById("quantity").value, 10);
    let myArray = {id: id, color: color, quantity: quantity};// Stockage des infos utilisateur dans un array
    let key = id + '-' + color;// identifiant du produit 

    for (product of Object.keys(localStorage)) { //Gestion du cas où le produit avec la même couleur est déjà présent dans le panier
        let productArray = JSON.parse(localStorage.getItem(product));
        if (productArray.id + '-' + productArray.color == myArray.id + '-' + myArray.color) {
            myArray.quantity = parseInt(myArray.quantity, 10) + parseInt(productArray.quantity, 10);
            key = myArray.id + '-' + myArray.color;
        }
    }
    localStorage.setItem(key, JSON.stringify(myArray));
}

// RECUPERATION DE L'ID (en utilisant URLSearchParams)
let str = window.location.href;
let url = new URL (str);
let id = url.searchParams.get("id");

// CONNEXION AVEC le produit correspondant L'API (Requête fetch)
fetch(`http://localhost:3000/api/products/${id}`)
    .then(response => response.json())
    .then(data => {
         productInfo(data)
    });

//BOUTON 'Ajouter au panier'
let addToCart = document.getElementById('addToCart');
addToCart.onclick = () => {
    saveToCart();
    location.href = "cart.html";
}