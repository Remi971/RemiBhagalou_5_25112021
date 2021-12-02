// FONCTIONS

/**
 * Crée un objet javascript en listant les infos du localStorage (id, couleur, quantité)
 * @returns {Object}
 */
const objCart = () => {
    let myObj = {};
    for (product of Object.keys(localStorage)) {// La création de cet objet s'appuie des informations stockées dans le localStorage
        if (product !== 'contact' && product !== 'products')
        myObj[product] = JSON.parse(localStorage.getItem(product));
    };
    return myObj;
}
/**
 * Calcul la somme totale des articles et leur prix et l'affiche dans les HTMLElement correspondants
 */
const total = () => {
    let spanQuantity = document.getElementById('totalQuantity');
    let spanPrice = document.getElementById('totalPrice');
    if (Object.keys(cart).length === 0) { // En cas de panier vide
        spanQuantity.innerText = 0;
        spanPrice.innerText = 0
        return
    }
    let totalArticles = 0;
    let totalQuantity = 0;
    for (product of Object.keys(cart)) {
        totalArticles += cart[product].quantity * cart[product].price;
        totalQuantity += cart[product].quantity
        spanQuantity.innerText = totalQuantity;
        spanPrice.innerText = totalArticles;
    }
}
/**
 * Crée un élément en y ajoutant des attributs si setAttr = True, sinon en ajoutant du contenu avec innerText
 * @param {String} type de l'élément à créer
 * @param {Boolean} setAttr 
 * @param {Array} myArray Liste comprenant des listes de couples [["nomAttribut", "valeurAttribut"], ["nomAttribut2", "valeurAttribut2"], ...]
 * @param {HTMLElement} parentElement 
 * @returns {HTMLElement}
 */
const createElt = (type, setAttr = true, myArray, parentElement) => {
    let element = document.createElement(type);
    if (setAttr) {// si setAttr alors .setAttribute, sinon .innerTxt
        for (item in myArray) {
            element.setAttribute(myArray[item][0], myArray[item][1])
        }
    } else {
        element.innerText = myArray;
    }
    parentElement.appendChild(element);// Ajout de l'élément à l'élément parent
    return element
}


/**
 * Fonction de création d'élément <article> pour un produit
 * @param {String} productId 
 * @param {String} productColor 
 * @param {String} imageUrl 
 * @param {String} altTxt 
 * @param {String} name 
 * @param {Integer} price 
 * @param {Integer} quantity 
 */
const cartDisplay = (productId, productColor, imageUrl, altTxt, name, price, quantity) => {
    let key = productId + '-' + productColor;// Construction d'une key pour faire appelle aux infos du cart et du localStorage plus facilement
    cart[key].price = price;// Ajout du prix des produits dans l'objet cart
    
    let section = document.getElementById("cart__items");//Sélection de la section produits
    const article = document.createElement("article");// Création de l'élément <article> qui va contenir le produit
    section.appendChild(article);// Ajout de l'élément <article> dans la section
    // Ajout des l'attribut data-id et data-color
    article.setAttribute("data-id", productId);
    article.setAttribute("data-color", productColor);
    article.setAttribute("class", "cart__item");

    //Création des différents éléments grâce à la fonction "createElt" qui vont être contenu dans l'élément article en affichant toutes les infos du produit
    const cartItemImg = createElt('div', true, [["class", "cart__item__img"]], article);
    const img = createElt('img', true, [["src", imageUrl], ["alt", altTxt]], cartItemImg);
    const cartItemContent = createElt('div', true, [['class', "cart__item__content"]], article);
    const cartItemContentDescription = createElt('div', true, [['class', 'cart__item__content__description']], cartItemContent);
    const h2 = createElt('h2', false, name, cartItemContentDescription);
    const pColor = createElt('p', false, productColor, cartItemContentDescription);
    const pPrice = createElt('p', false, price + ',00 €', cartItemContentDescription);
    const cartItemContentSettings = createElt('div', true, [['class', 'cart__item__content__settings']], cartItemContent);
    const cartItemContentSettingsQuantity = createElt('div', true, [['class', 'cart__item__content__settings__quantity']], cartItemContentSettings);
    const pQuantity = createElt('p', false, 'Qté : ' + quantity, cartItemContentSettingsQuantity);
    const input = createElt('input', true, [["type", "number"], ["class", "itemQuantity"], ["name", "itemQuantity"], ["value", quantity]], cartItemContentSettingsQuantity);
    const cartItemContentSettingsDelete = createElt('div', true, [['class', 'cart__item__content__settings__delete']], cartItemContentSettings);
    const pDelete = createElt('p', true, [['class', 'deleteItem']], cartItemContentSettingsDelete);
    pDelete.innerText = 'Supprimer';

    // Modification de la quantité d'un produits du panier
    input.addEventListener('change', (e) => {
        pQuantity.innerText = 'Qté : ' + e.target.value;// Mise à jour du DOM
        cart[key].quantity = parseInt(e.target.value);// Mise à jour de l'objet cart
        localStorage.setItem(key, JSON.stringify(cart[key]));// Mise à jour du localStorage
        total();// Mise à jour du total du panier
    });

    // Action de suppression du produit du panier au click du bouton "Supprimer"
    pDelete.addEventListener('click', () => {
        section.removeChild(article);// Mise à jour du DOM
        delete cart[key];// Mise à jour de l'objet cart
        localStorage.removeItem(key);// Mise à jour du localStorage
        total();// Mise à jour du total du panier
    })

    total();// Mise à jour du total du panier
}


/**
 * Retrouve les informations complémentaires du produit et lance la fonction "cartDisplay" pour chaque produit du panier
 * @returns 
 */
const infoProduct = () => {
    cart = objCart();
    console.log('cart', cart)
    for (produit of Object.keys(cart)) {
        let item = produit;
        fetch(`http://localhost:3000/api/products/${cart[produit].id}`)
            .then(response => response.json())
            .then(data => {
                cartDisplay(cart[item].id, cart[item].color, data.imageUrl, data.altTxt, data.name, parseFloat(data.price*1.00), cart[item].quantity);
            }) 
    }
}

// Formulaire de contact
let firstName = document.getElementById('firstName');
let lastName = document.getElementById('lastName');
let address = document.getElementById('address');
let city = document.getElementById('city');
let email = document.getElementById('email');

/**
 * Génère un message d'erreur si toggle = false ou l'enlève si toggle = true
 * @param {String} type 
 * @param {Boolean} toggle 
 */
const errorMsg = (type, toggle=false) => {
    let alertMsg = { // Objet qui va stocker les message d'erreur à afficher et les nom de class
        firstName : {
            msg: 'Votre prénom est mal renseigné !', 
            className: 'firstNameErrorMsg'
        },
        lastName : {
            msg: 'Votre nom est mal renseigné !', 
            className: 'lastNameErrorMsg'
        },
        city : {
            msg: 'Le nom de votre ville est mal renseigné !', 
            className: 'cityErrorMsg'
        },
        address: {
            msg: 'Votre adresse est mal renseignée !',
            className: 'addressErrorMsg'
        },
        email: {
            msg: 'Votre adresse email est mal renseignée !',
            className: 'emailErrorMsg'
        }
    }
    if (toggle) { 
        document
        .getElementById(alertMsg[type].className)
        .innerText = ''
    } else {
        document
        .getElementById(alertMsg[type].className)
        .innerText = alertMsg[type].msg
    }
    
}

/**
 * Vérification des informations renseignées par l'utilisateur dans le formulaire
 * @returns {Object} un objet contenant les informations contact de l'utilisateur
 */
const check = () => { 
    let contact = {
        firstName : firstName.value,
        lastName : lastName.value,
        address : address.value,
        city : city.value,
        email : email.value,
    };
    let error = false
    for (item of Object.keys(contact)) {
        if (item === 'email') {
            if (!contact[item].match(/@/)){
                errorMsg(item);
                error = true;
            } else {
                errorMsg(item, true)
            }
        }
        else if (item === 'adresse') {
            if (contact[item] === null || contact[item] === ' ') {
                errorMsg(item);
                error = true;
            } else {
                errorMsg(item, true)
            }
        }
        else {
            if (!contact[item].match(/[a-z]+/i)) {
                errorMsg(item);
                error = true;
            } else {
                errorMsg(item, true)
            }
        }
    }
    if (error) {
        return false;
    }
    return contact;
}

let str = window.location.href;
let url = new URL (str);

let cart = {};

// Sur la page Panier
if (/cart/.test(url)) {
    let postContact = {};
    let postProducts = [];
    console.log(localStorage);
    infoProduct(cart);
    // Gestion du click sur 'Commander !'
    document.getElementById('order').addEventListener('click', (e) => {
        e.preventDefault();
        postContact = check();
        if (Object.keys(postContact).length > 0) {
            for (product of Object.keys(cart)) {
                postProducts.push(cart[product].id)
            };
            localStorage.setItem('contact', JSON.stringify(postContact));
            localStorage.setItem('products', JSON.stringify(postProducts));
            location.href = "confirmation.html";
        }
    })
}
// Sur la page confirmation
if (/confirmation/.test(url)) {
    let contact = JSON.parse(localStorage.getItem('contact'));
    let products = JSON.parse(localStorage.getItem('products'));
    console.log(contact);
    console.log(products);
    fetch('http://localhost:3000/api/products/order',{
            method: 'POST',
            headers: {
                // 'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({contact, products})
        })
        .then(res => {
            if (res.ok) {
                return res.json()
            }else {
                console.log('Not successful !')
            }
        }).then(data => {
            let orderId = document.getElementById("orderId");
            orderId.innerHTML = `<br/><strong>${data.orderId}</strong>`;
        })
}