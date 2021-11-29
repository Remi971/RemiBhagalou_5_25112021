console.log(localStorage);
// Fonction qui va créer un objet javascript, un listant les info fournies par l'utilisateur (id, couleur et quantité) 
const objCart = () => {
    // Info renseigné par l'utilisateur
    let myObj = {};
    // La création de cet objet s'appuie des informations stockées dans le localStorage
    for (product of Object.keys(localStorage)) {
        myObj[product] = JSON.parse(localStorage.getItem(product));
    };
    return myObj;
}

let cart = objCart();
console.log('cart', cart);

// Fonction qui va calculer la somme totale des articles en euros
let totalArticles = 0;
let totalQuantity = 0;

const total = (quantity, price) => {
    totalArticles += (quantity * price);
    totalQuantity += quantity;
    let spanQuantity = document.getElementById('totalQuantity');
    spanQuantity.innerText = totalQuantity;
    let spanPrice = document.getElementById('totalPrice');
    spanPrice.innerText = totalArticles;
}

// Fonction de création d'élément <article> pour chaque produit du panier
const cartDisplay = (productId, productColor, imageUrl, altTxt, name, price, quantity) => {
    //Sélection de la section produits
    let section = document.getElementById("cart__items");

    // Création de l'élément <article> qui va contenir le produit
    const article = document.createElement("article");
    // Ajout de l'élément <article> dans la section
    section.appendChild(article);
    // Ajout des l'attribut data-id et data-color
    article.setAttribute("data-id", productId);
    article.setAttribute("data-color", productColor);
    article.setAttribute("class", "cart__item");
    
    // Remplissage du contenu de l'article avec les élements correspondant dans les balises prévues
    article.innerHTML = `<div class="cart__item__img"><img src=${imageUrl} alt="${altTxt}"></div><div class="cart__item__content"><div class="cart__item__content__description"><h2>${name}</h2><p>${productColor}</p><p>${price} €</p></div><div class="cart__item__content__settings"><div class="cart__item__content__settings__quantity"><p>Qté : ${quantity}</p><input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${quantity}"></div><div class="cart__item__content__settings__delete"><p class="deleteItem">Supprimer</p></div></div>`

    total(quantity, price);
}

// Fonction qui va mettre à jour la quantité et le prix si l'utilisateur modifie la quantité d'un produit
const quantityModif = () => {
    let inputs = document.querySelectorAll("input.itemQuantity");
    inputs.forEach(item => {
        let article = item.closest("article");
        let id = article.getAttribute("data-id");
        let color = article.getAttribute("data-color");
        item.addEventListener('change', (e) => {
            console.log(e.target.value)

        })
        console.log(article.getAttribute("data-id"));
    })
};

// Fonction qui va retrouver les infos complémentaires du produit et lancer la fonction cartDisplay pour chaque produit
const infoProduct = (cart) => {
    for (produit of Object.keys(cart)) {
        let item = produit;
        fetch(`http://localhost:3000/api/products/${cart[produit].id}`)
            .then(response => response.json())
            .then(data => {
                cartDisplay(cart[item].id, cart[item].color, data.imageUrl, data.altTxt, data.name, data.price, cart[item].quantity)
            })
        }
    
}

infoProduct(cart);

