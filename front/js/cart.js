console.log(localStorage);

// FONCTIONS

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

// Fonction qui va calculer la somme totale des articles et leur prix
const total = () => {
    let spanQuantity = document.getElementById('totalQuantity');
    let spanPrice = document.getElementById('totalPrice');
    // En cas de panier vide
    if (Object.keys(cart).length === 0) {
        spanQuantity.innerText = 0;
        spanPrice.innerText = 0
        return
    }
    let totalArticles = 0;
    let totalQuantity = 0;
    for (product of Object.keys(cart)) {
        console.log(cart[product].price);
        totalArticles += cart[product].quantity * cart[product].price;
        totalQuantity += cart[product].quantity
        spanQuantity.innerText = totalQuantity;
        spanPrice.innerText = totalArticles;
    }
}

//Fonction de création d'élément
const createElt = (type, setAttr = true, myArray, parentElement) => {
    let element = document.createElement(type);
    if (setAttr) {
        for (item in myArray) {
            element.setAttribute(myArray[item][0], myArray[item][1])
        }
    } else {
        element.innerText = myArray;
    }
    parentElement.appendChild(element);
    return element
}

// Fonction de création d'élément <article> pour chaque produit du panier
const cartDisplay = (productId, productColor, imageUrl, altTxt, name, price, quantity) => {
    // Construction d'une key
    let key = productId + '-' + productColor;
    // Ajout du prix des produits dans l'objet cart
    cart[key].price = price;

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

    const cartItemImg = createElt('div', true, [["class", "cart__item__img"]], article);
    const img = createElt('img', true, [["src", imageUrl], ["alt", altTxt]], cartItemImg);
    const cartItemContent = createElt('div', true, [['class', "cart__item__content__description"]], article);
    const cartItemContentDescription = createElt('div', true, [['class', 'cart__item__content__description']], cartItemContent);
    const h2 = createElt('h2', false, name, cartItemContentDescription);
    const pColor = createElt('p', false, productColor, cartItemContentDescription);
    const pPrice = createElt('p', false, price + ',00 €', cartItemContentDescription);
    const cartItemContentSettings = createElt('div', true, [['class', 'cart__item__content__settings']], cartItemContent);
    const cartItemContentSettingsQuantity = createElt('div', true, [['class', 'cart__item__content__settings__quantity']], cartItemContentSettings);
    const pQuantity = createElt('p', false, 'Qté : ' + quantity, cartItemContentSettingsQuantity);
    const input = createElt('input', true, [["type", "number"], ["class", "itemQuantity"], ["name", "itemQuantity"], ["value", quantity]], cartItemContentSettingsQuantity);

    // Modification des quantités des produits du panier
    input.addEventListener('change', (e) => {
        console.log(e.target.value)
        pQuantity.innerText = 'Qté : ' + e.target.value;
        cart[key].quantity = parseInt(e.target.value);
        localStorage.setItem(key, JSON.stringify(cart[key]));
        total();
    });

    const cartItemContentSettingsDelete = createElt('div', true, [['class', 'cart__item__content__settings__delete']], cartItemContentSettings);

    const pDelete = createElt('p', true, [['class', 'deleteItem']], cartItemContentSettingsDelete);
    pDelete.innerText = 'Supprimer';

    // Action de suppression du produit du panier au click du bouton "Supprimer"
    pDelete.addEventListener('click', () => {
        section.removeChild(article);
        delete cart[key];
        localStorage.removeItem(key);
        total();
    })
    total();
}

// Fonction qui va retrouver les infos complémentaires du produit et lancer la fonction "cartDisplay" pour chaque produit
const infoProduct = (cart) => {
    for (produit of Object.keys(cart)) {
        let item = produit;
        fetch(`http://localhost:3000/api/products/${cart[produit].id}`)
            .then(response => response.json())
            .then(data => {
                cartDisplay(cart[item].id, cart[item].color, data.imageUrl, data.altTxt, data.name, parseFloat(data.price*1.00), cart[item].quantity);
            }) 
    }
}

let cart = objCart();
console.log('cart', cart);

infoProduct(cart);

