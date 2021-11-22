// declaration variable
let lastNameRegexOk = false;
let firstNameRegexOk = false;
let mailRegexOk = false;
let cartHTML = "";
let totalPrice = 0;
let totalQuantity = 0;
const productList = [];

//fonction pour recuperer le panier si existant, sinon création tableau vide
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

//fonction calcul du montant en euro et des quantités
function calculateSum() {
    let listCart = getCart;
    for (const item in listCart) {
        totalPrice += item.price * item.quantity;
        totalQuantity += item.quantity;
    }
    document.getElementById("totalQuantity").innerHTML = `${totalQuantity}`;
    document.getElementById("totalPrice").innerHTML = `${totalPrice}`;
}


//fonction test ecoute bouton sppirtmer
function removeOfCart() {
    document.querySelectorAll(".deleteItem").forEach(element => {
        element.addEventListener("click", (event) => {
            event.preventDefault();
            //Selection de l'element à modifier en fonction de son id ET sa couleur
            /*let listCart = getCart();
            const idmodif = element.dataset.id;
            const colormodif = element.dataset.color;
            const index = findProductIndexInCart(idmodif, colormodif);
            listCart[index].quantity = element.valueAsNumber;
            saveCart(listCart);
            // refresh
            location.reload();*/
            let listCart = getCart();
            const idToRemove = element.dataset.id;
            const colorToRemove = element.dataset.color;
            const index = findProductIndexInCart(idToRemove, colorToRemove);
            listCart.splice(index, 1);
            //Alerte produit supprimé et refresh
            saveCart(listCart);
            alert("Le référence produit " + idToRemove + " " + colorToRemove + " a été supprimée du panier");
            location.reload();
        });
    });
}
// pour modifier la quantité sur la page panier
function modifyQuantity() {
    document.querySelectorAll(".itemQuantity").forEach(element => {
        element.addEventListener("change", (event) => {
            event.preventDefault();
            //Selection de l'element à modifier en fonction de son id ET sa couleur
            let listCart = getCart();
            const idmodif = element.dataset.id;
            const colormodif = element.dataset.color;
            const index = findProductIndexInCart(idmodif, colormodif);
            listCart[index].quantity = element.valueAsNumber;
            saveCart(listCart);
            // refresh
            location.reload();
        });
    });
}
//fonction du formulaire de commande avec analyse et validation par regex
function recupForm() {
    const form = document.querySelector(".cart__order__form");
    //ecoute de la modif du mail
    form.email.addEventListener("change", function() {
        validateMail(this);
    });

    //fonction validation email
    function validateMail(inputMail) {
        const mailRegex = new RegExp("[A-Za-z0-9._-]+@[A-Za-z0-9._-]+\\.[a-zA-Z][a-zA-Z]+$");
        const emailErrorMsg = inputMail.nextElementSibling;
        if (mailRegex.test(inputMail.value)) {
            emailErrorMsg.innerHTML = "<font color=green>Ok</font>";
            return mailRegexOk = true;
        } else {
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
            firstNameErrorMsg.innerHTML = "Nom non valide";
            return firstNameRegexOk = false;
        }

    }
}




//code general de la page

//interrogation de l'api pour l'affichage des produits
async function loadProducts() {
    let listCart = getCart();
    for (const item of listCart) {
        const response = await fetch("http://localhost:3000/api/products/" + item.itemId);
        const product = await response.json();
        productList.push(product);
        cartHTML += `
        <article class="cart__item" data-id="${item.itemId}">
          <div class="cart__item__img">
            <img src="${product.imageUrl}" alt="${product.altTxt}">
          </div>
          <div class="cart__item__content">
            <div class="cart__item__content__titlePrice">
              <h2>${product.name} - ${item.colorChoice}</h2>
              <p>${product.price} €</p>
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
        totalPrice += product.price * item.quantity;
        totalQuantity += item.quantity;
        document.getElementById("cart__items").innerHTML = cartHTML;
    }
    calculateSum();
}
loadProducts().then(() => {
    removeOfCart();
    modifyQuantity();
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
        //Créatino du tableau de produit commandé

        const orderedProducts = getCart().map(item => item.itemId);


        //recharger list cart
        /* listCart = getCart();
        for (let p = 0; p < listCart.length; p++) {
            orderedProducts.push(listCart[p].itemId)
        }
        console.log(orderedProducts);
*/
        if (!orderedProducts.length) {
            alert("votre panier est vide");
            return;
        }
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
                //localStorage.clear();
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