import { getCart, findProductIndexInCart, saveCart } from './commonCart.js';

//fonction pour verifier l'id de l'url est manquant
function idCheckInUrl(id) {
    if (id === null) {
        alert("Identitifant manquant");
        document.location.href = "index.html";
    }
}
//fonction ajoutant au panier
function addToCart(itemId, colorChoice, quantity, price) {
    //recuperation du panier existant
    let listCart = getCart();
    //verification si produit identique deja dans le panier
    const itemIndex = findProductIndexInCart(itemId, colorChoice);
    //si deja dans le panier
    if (itemIndex !== -1) {
        //on ajoute la quantité et le prix
        listCart[itemIndex].quantity += quantity;
        listCart[itemIndex].price = price;
    } else {
        //si non présent, on crée le produit dans le tableau
        listCart.push({ itemId, quantity, colorChoice, price });
    }
    //on sauvegarde le panier
    saveCart(listCart);
}

//code generale de la page
//on recupere le parametre dans l'url et on le stocke dans la variable id
let params = (new URL(document.location)).searchParams;
let id = params.get("id");
//on se sert de l'id recupéré pour interroger l'API pour l'id concerné
const url = "http://localhost:3000/api/products/" + id;
//check si l'id existe ou n'est pas erroné
idCheckInUrl(id);
//requete sur l'url de l'api + id
fetch(url)
    .then(function(res) {
        if (res.ok) {
            return res.json();
        }
    })
    .then(function(product) {
        //integration des elements de chaque produits
        document.querySelector(".item__img").innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}"></img>`;
        document.getElementById("price").innerHTML = `${product.price} `;
        document.getElementById("description").innerHTML = `${product.description}`;
        let colorHTML = "<option value=\"\">--SVP, choisissez une couleur --</option>";
        //ajout des couleurs
        for (let i in product.colors) {
            colorHTML += `<option value="${product.colors[i]}">${product.colors[i]}</option>`;
        }
        document.getElementById("colors").innerHTML = colorHTML;
        // ajoutez au panier
        //ecoute du click sur le bouton ajouter au panier
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