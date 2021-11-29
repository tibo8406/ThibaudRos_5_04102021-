import { getCart, findProductIndexInCart, saveCart } from "./commonCart.js";

// declaration variable
let lastNameRegexOk = false;
let firstNameRegexOk = false;
let mailRegexOk = false;
let cartHTML = "";
let totalPrice = 0;
let totalQuantity = 0;
const productList = [];

//fonction calcul du montant en euro et des quantités
function calculateSum() {
    //recuperation du panier
    let listCart = getCart();
    // boucle pour chaque item du panier
    for (const item of listCart) {
        //on ajoute à totalPrice, le produit du prix par la quantité
        totalPrice += item.price * item.quantity;
        //on ajoute à totalQuantity, le quantité de produit
        totalQuantity += item.quantity;
    }
    //on rajoute dans le code HTML les 2 variables totalQuantity et totalPrice
    document.getElementById("totalQuantity").innerHTML = `${totalQuantity}`;
    document.getElementById("totalPrice").innerHTML = `${totalPrice}`;
}


//fonction ecoute bouton supprimer
function removeOfCart() {
    //pour chaque element deleteItem
    document.querySelectorAll(".deleteItem").forEach(element => {
        //on ecoute le click
        element.addEventListener("click", (event) => {
            //on annule le comportement par defaut du bouton
            event.preventDefault();
            //on recupere le panier
            let listCart = getCart();
            // on identifie le produit en question grace à data id et data color
            const idToRemove = element.dataset.id;
            const colorToRemove = element.dataset.color;
            //on trouve l'index correspondant au produit
            const index = findProductIndexInCart(idToRemove, colorToRemove);
            //on supprime la ligne correspondant à l'index
            listCart.splice(index, 1);
            //on sauvegarde le panier
            saveCart(listCart);
            // message de confirmation de la suppression du produit
            alert("Le référence produit " + idToRemove + " " + colorToRemove + " a été supprimée du panier");
            //on recharge la page
            location.reload();
        });
    });
}
// pour modifier la quantité sur la page panier
function modifyQuantity() {
    //pour chaque element itemQuantity
    document.querySelectorAll(".itemQuantity").forEach(element => {
        //on ecoute un changement
        element.addEventListener("change", (event) => {
            //on annule comportement par defaut
            event.preventDefault();
            //on recupere le panier
            let listCart = getCart();
            // on identifie le produit en question grace à data id et data color
            const idmodif = element.dataset.id;
            const colormodif = element.dataset.color;
            //on trouve l'index correspondant au produit
            const index = findProductIndexInCart(idmodif, colormodif);
            //on modifie la quantité de l'index correspodant par la valeur de l'element
            listCart[index].quantity = element.valueAsNumber;
            //on suvegarde le panier
            saveCart(listCart);
            // on recharge la page
            location.reload();
        });
    });
}
//fonction du formulaire de commande avec analyse et validation par regex
function recupForm() {
    //recupere l'ensemble du formulaire
    const form = document.querySelector(".cart__order__form");
    //ecoute de la modif du mail
    form.email.addEventListener("change", function() {
        //on valide ou non grace à la fonction, le contenu du champ email
        validateMail(this);
    });

    //fonction validation email
    function validateMail(inputMail) {
        //création d'une regex
        const mailRegex = new RegExp("[A-Za-z0-9._-]+@[A-Za-z0-9._-]+\\.[a-zA-Z][a-zA-Z]+$");
        //création du message à afficher
        const emailErrorMsg = inputMail.nextElementSibling;
        //on test la regex
        if (mailRegex.test(inputMail.value)) {
            //si correspond à la regex, on rempli en vert avec message ok
            emailErrorMsg.innerHTML = "<font color=green>Ok</font>";
            return mailRegexOk = true;
        } else {
            //si ne correspond pas à la regex, on rempli en rouge avec message non valide
            emailErrorMsg.innerHTML = "Email non valide";
            return mailRegexOk = false;
        }

    }

    //ecoute de la modif du nom
    form.lastName.addEventListener("change", function() {
        validateLettersLastName(this);
    });

    //fonction validation du nom
    function validateLettersLastName(inputLastName) {
        let lettersRegex = new RegExp("^[a-zA-Z\-]+$");
        let lastNameErrorMsg = inputLastName.nextElementSibling;
        if (lettersRegex.test(inputLastName.value)) {
            lastNameErrorMsg.innerHTML = "<font color=green>Ok</font>";
            return lastNameRegexOk = true;
        } else {
            lastNameErrorMsg.innerHTML = "Nom non valide";
            return lastNameRegexOk = false;
        }

    }

    //ecoute de la modif du prénom
    form.firstName.addEventListener("change", function() {
        validateLettersFirstName(this);
    });

    //fonction validation du prénom
    function validateLettersFirstName(inputFirstName) {
        let lettersRegex = new RegExp("^[a-zA-Z\-]+$");

        let firstNameErrorMsg = inputFirstName.nextElementSibling;

        if (lettersRegex.test(inputFirstName.value)) {
            firstNameErrorMsg.innerHTML = "<font color=green>Ok</font>";
            return firstNameRegexOk = true;
        } else {
            firstNameErrorMsg.innerHTML = "Prénom non valide";
            return firstNameRegexOk = false;
        }

    }
}
//code general de la page

//interrogation de l'api pour l'affichage des produits
async function loadProducts() {
    //recuperation de listCart
    let listCart = getCart();
    //pour chaque item de listCart
    for (const item of listCart) {
        //on interroge l'API
        const response = await fetch("http://localhost:3000/api/products/" + item.itemId);
        //on recupere la reponse et on la poussse dans productList
        const product = await response.json();
        productList.push(product);
        //calcul du sous total pour la ligne produit
        const subTotalPrice = item.price * item.quantity;
        //on ajoute le code html suivant pour chaque item de listCart
        cartHTML += `
        <article class="cart__item" data-id="${item.itemId}">
          <div class="cart__item__img">
            <img src="${product.imageUrl}" alt="${product.altTxt}">
          </div>
          <div class="cart__item__content">
            <div class="cart__item__content__titlePrice">
              <h2>${product.name} - ${item.colorChoice} - ${product.price} €</h2>
              <p>Sous-total : ${subTotalPrice} €</p>
            </div>
            <div class="cart__item__content__settings">
              <div class="cart__item__content__settings__quantity">
                <p>Qté : </p>
                <input type="number" class="itemQuantity" name="itemQuantity" data-id="${item.itemId}" data-color="${item.colorChoice}" min="1" max="100" value="${item.quantity}">
              </div>
              <div class="cart__item__content__settings__delete">
                <button class="deleteItem"  data-id="${item.itemId}" data-color="${item.colorChoice}">Supprimer</p>
              </div>
            </div>
          </div>
        </article>
        `;
        document.getElementById("cart__items").innerHTML = cartHTML;
    }
    //on calcule quantité et prix total
    calculateSum();
}
// apres avoir charger tous les produits
loadProducts().then(() => {
    //fonction suppression
    removeOfCart();
    //fonction modifier la quantité
    modifyQuantity();
    //fonction validation du formulaire
    recupForm();
});
//Envoi du formulaire   sortir de la foncion

//Ecouter le bouton commander
document.getElementById("order").addEventListener("click", (event) => {
    event.preventDefault();
    if (firstNameRegexOk && lastNameRegexOk && mailRegexOk) {
        //Récupération dess ifnormations du formulaire
        const inputFirstName = document.getElementById("firstName");
        const inputLastName = document.getElementById("lastName");
        const inputAddress = document.getElementById("address");
        const inputCity = document.getElementById("city");
        const inputMail = document.getElementById("email");
        //Création du tableau de produit commandé
        const orderedProducts = getCart().map(item => item.itemId);
        if (!orderedProducts.length) {
            alert("votre panier est vide");
            return;
        }
        //création de la comamlnde sur forme d'objet
        const orderInfo = {
            contact: {
                firstName: inputFirstName.value,
                lastName: inputLastName.value,
                address: inputAddress.value,
                city: inputCity.value,
                email: inputMail.value,
            },
            products: orderedProducts,
        };
        //requete  post de l'object à l'api
        fetch("http://localhost:3000/api/products/order", {
                method: "POST",
                body: JSON.stringify(orderInfo),
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
            })
            .then(function(res) {
                return res.json();
            })
            .then(function(elt) {
                console.log(elt);
                localStorage.setItem("orderId", elt.orderId);

                document.location.href = "confirmation.html";
            })
            .catch(function(err) {
                alert("Problème avec fetch : " + err.message);
            });
    } else {
        alert("Veuillez verifier les informations remplies dans le formulaire");
    }
});