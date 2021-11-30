// RECUPERATION DE L'ID (en utilisant URLSearchParams)
let str = window.location.href;
let url = new URL (str);
let id = url.searchParams.get("id");

//FONCTIONS
// Fonction qui va créer une carte pour un produit en affichant les détails indiqué en paramètre
const productInfo = (imgUrl, altTxt, name, price, description, colors ) => {
    //Création de l'élément img du produit
    const img = document.createElement('img');
    img.setAttribute('src', imgUrl);
    img.setAttribute('alt', altTxt);
    // Ajout de l'élément dans la div prévu à cet effet
    document.querySelector('.item__img').appendChild(img);
    //Ajout du nom du produit dans l'élément h1 prévu
    document.getElementById('title').innerHTML = name;
    // Ajout du prix dnas l'élément span prévu
    document.getElementById('price').innerHTML = price;
    // Ajout de la description dans l'élément p prévu
    document.getElementById('description').innerHTML = description;
    // Pour chaque couleur du produit, une 
    for (let color in colors) {
        const optionColor = document.createElement('option');
        optionColor.setAttribute('value', colors[color])
        optionColor.innerHTML = colors[color]
        document.getElementById('colors').appendChild(optionColor)
    }
}

// CONNEXION AVEC le produit correspondant L'API (Requête fetch)
fetch(`http://localhost:3000/api/products/${id}`)
    .then(response => response.json())
    .then(data => {
         productInfo(data.imageUrl, data.altTxt, data.name, data.price, data.description, data.colors)
    });

// Function qui va stocker les infos sur le produit dans le LocalStorage
const saveToCart = () => {
    // Rédcupération des informations fournies par l'utilisateur
    let select = document.getElementById("colors")
    let color = select.options[select.selectedIndex].text
    let quantity = parseInt(document.getElementById("quantity").value, 10);
    // Stockage des infos utilisateur dans un array
    let myArray = {id: id, color: color, quantity: quantity};
    // Nom du produit 
    let key = id + '-' + color;

    for (product of Object.keys(localStorage)) {
        let productArray = JSON.parse(localStorage.getItem(product));
        if (productArray.id + '-' + productArray.color == myArray.id + '-' + myArray.color) {
            myArray.quantity = parseInt(myArray.quantity, 10) + parseInt(productArray.quantity, 10);
            key = myArray.id + '-' + myArray.color;
        }
    }
    localStorage.setItem(key, JSON.stringify(myArray));
}

//BOUTON 'Ajouter au panier'
let addToCart = document.getElementById('addToCart');
addToCart.onclick = () => {
    saveToCart();
    location.href = "cart.html";
}