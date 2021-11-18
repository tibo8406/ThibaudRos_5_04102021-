//copie des fonctions utilisé dans cart.js
//fonction pour recuperer le panier si existant
function getCart() {
    let listCart = localStorage.getItem("listCart");
    if (listCart === null || listCart === "undefined") {
        return [];
    }
    return JSON.parse(listCart);
}
//fonction pour sauvegarder le panier
function saveCart(listCart) {
    localStorage.setItem("listCart", JSON.stringify(listCart));
}
// cherche dans le panier si un produit de meme couleur existe deja
function findProductIndexInCart(id, color) {
    let listCart = getCart();
    return listCart.findIndex(item => item.itemId === id && item.colorChoice === color);
}
//fin des focntion utlisés dans cart.js
//fonction pour verifier l'id de l'url est manquant
function idCheck(id) {
    if (id === null) {
        alert("Identitifant manquant");
        document.location.href = "index.html";
    }
}
//fonction ajoutant au panier
function addToCart(itemId, colorChoice, quantity, price) {
    let listCart = getCart();
    const itemIndex = findProductIndexInCart(itemId, colorChoice);
    if (itemIndex !== -1) {
        listCart[itemIndex].quantity += quantity;
        listCart[itemIndex].price = price;
    } else {
        listCart.push({ itemId, quantity, colorChoice, price });
    }
    saveCart(listCart);
}
let params = (new URL(document.location)).searchParams;
let id = params.get("id");
const url = "http://localhost:3000/api/products/" + id;
idCheck(id);
fetch(url)
    .then(function(res) {
        if (res.ok) {
            return res.json();
        }
    })
    .then(function(product) {
        document.querySelector(".item__img").innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}"></img>`;
        document.getElementById("price").innerHTML = `${product.price} `;
        document.getElementById("description").innerHTML = `${product.description}`;
        let colorHTML = "<option value=\"\">--SVP, choisissez une couleur --</option>";
        for (let i = 0; i < product.colors.length; i++) {
            colorHTML += `<option value="${product.colors[i]}">${product.colors[i]}</option>`;
        }
        document.getElementById("colors").innerHTML = colorHTML;
        // ajoutez au panier
        document.getElementById("addToCart").addEventListener("click", function() {
            let colorChoice = document.getElementById("colors").value;
            let numberChoice = +document.getElementById("quantity").value;
            if (colorChoice !== "" && numberChoice >= 1) {
                addToCart(product._id, colorChoice, numberChoice, product.price);
                alert("Article ajouté au panier");
            } else {
                if (colorChoice == "" && numberChoice >= 1) {
                    alert("Veuillez choisir une couleur");
                }
                if (colorChoice !== "" && numberChoice < 1) {
                    alert("Veuillez choisir une quantité");
                }
                if (colorChoice == "" && numberChoice < 1) {
                    alert("Veuillez choisir une couleur et une quantité");
                }
            }
        });
    })
    .catch(function() {
        alert("Cet identifiant produit n'existe pas");
        document.location.href = "index.html";
        // Une erreur est survenue
    });