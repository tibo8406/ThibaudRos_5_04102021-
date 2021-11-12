/*function calculateSum(price, quantity) {
    let listCart = getCart;
    if (totalPrice == 'undefined') {
        //let totalQuantity = 0;
        let totalPrice = 0;
        for (item in listCart) {
            totalPrice += price * quantity;
            //totalQuantity += quantity;
        }
    } else {
        totalPrice += price * quantity;
        //totalQuantity += quantity;
    }
}*/

// cherche dans le panier si un produits de meme couleur existe deja
function findInCart(id, color) {
    let listCart = getCart();
    const item = listCart.find(item => item.itemId === id && item.colorChoice === color);
    if (item != null) {
        return listCart.indexOf(item);
    } else {
        return false;
    }
}

//fonction ajoutant au panier
function addToCart(itemId, colorChoice, quantity) {
    let listCart = getCart();
    itemFind = findInCart(itemId, colorChoice);
    if (itemFind !== false) {

        listCart[itemFind].quantity += quantity;
    } else {
        listCart.push({ itemId, quantity, colorChoice });
    }
    saveCart(listCart);
}


//fonction pour recuperer le panier si existant
function getCart() {
    let listCart = localStorage.getItem("listCart");
    if (listCart == null || listCart == 'undefined') {
        return [];
    } else {
        return JSON.parse(listCart);
    }
}

//fonction pour supprimer un produit du panier
function removeOfCart(idToRemove, colorToRemove) {
    let listCart = getCart();
    //const index = listCart.findIndex(item => item.itemId === idToRemove && item.colorChoice === colorToRemove);*/
    index = findInCart(idToRemove, colorToRemove);
    listCart.splice(index, 1);

    //Alerte produit supprimé et refresh
    saveCart(listCart);
    alert("Ce produit a bien été supprimé du panier");
    location.reload();
}

//fonction pour sauvegarder le panier
function saveCart(listCart) {
    localStorage.setItem("listCart", JSON.stringify(listCart));
}


// pour modifier la quantité sur l apage panier
function modifyQuantity() {
    document.querySelectorAll(".itemQuantity").forEach(element => {
        element.addEventListener("change", (event) => {
            event.preventDefault();

            //Selection de l'element à modifier en fonction de son id ET sa couleur
            listCart = getCart();
            idmodif = element.dataset.id;
            colormodif = element.dataset.color;
            index = findInCart(idmodif, colormodif);
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
    })

    //fonction validation email
    function validateMail(inputMail) {
        const mailRegex = new RegExp('[A-Za-z0-9._-]+@[A-Za-z0-9._-]+\\.[a-zA-Z][a-zA-Z]+$');
        const emailErrorMsg = inputMail.nextElementSibling;

        if (mailRegex.test(inputMail.value)) {
            emailErrorMsg.innerHTML = '<font color=green>Ok</font>';
            return mailOk = true;
        } else {
            emailErrorMsg.innerHTML = 'Email non valide';
            return mailOk = false;
        }

    };

    //ecoute de la modif du nom
    form.lastName.addEventListener("change", function() {
        validateLettersLastName(this);
    })

    //fonction validation du nom
    function validateLettersLastName(inputLastName) {
        let lettersRegex = new RegExp('^[a-zA-Z\-]+$');

        let lastNameErrorMsg = inputLastName.nextElementSibling;

        if (lettersRegex.test(inputLastName.value)) {
            lastNameErrorMsg.innerHTML = '<font color=green>Ok</font>';
            return lastNameOk = true;
        } else {
            lastNameErrorMsg.innerHTML = 'Nom non valide';
            return lastNameOk = false;
        }

    };

    //ecoute de la modif du prénom
    form.firstName.addEventListener("change", function() {
        validateLettersFirstName(this);
    })

    //fonction validation du prénom
    function validateLettersFirstName(inputFirstName) {
        let lettersRegex = new RegExp('^[a-zA-Z\-]+$');

        let firstNameErrorMsg = inputFirstName.nextElementSibling;

        if (lettersRegex.test(inputFirstName.value)) {
            firstNameErrorMsg.innerHTML = '<font color=green>Ok</font>';
            return firstNameOk = true;
        } else {
            firstNameErrorMsg.innerHTML = 'Nom non valide';
            return firstNameOk = false;
        }

    };
}

//Envoi du formulaire   sortir de la foncion
function sendForm() {

    //Ecouter le bouton commander
    document.getElementById("order").addEventListener("click", (event) => {
        if (firstNameOk == true && lastNameOk == true && mailOk == true) {
            //Récupération dess ifnormations du formulaire
            let inputFirstName = document.getElementById('firstName');
            let inputLastName = document.getElementById('lastName');
            let inputAddress = document.getElementById('address');
            let inputCity = document.getElementById('city');
            let inputMail = document.getElementById('email');
            //Créatino du tableau de produit commandé

            let orderedProducts = [];


            //recharger list cart
            listCart = getCart();
            for (let p = 0; p < listCart.length; p++) { //foreach a faire (ou map)
                orderedProducts.push(listCart[p].itemId)
            }
            console.log(orderedProducts);

            const orderInfo = {
                    contact: {
                        firstName: inputFirstName.value,
                        lastName: inputLastName.value,
                        address: inputAddress.value,
                        city: inputCity.value,
                        email: inputMail.value,
                    },
                    products: orderedProducts,
                }
                /*const settings = {
                    method: "POST",
                    body: JSON.stringify(orderInfo),
                    headers: {
                        'Accept': 'application/json',
                        "Content-Type": "application/json"
                    },
                };*/
                //fetch("http://localhost:3000/api/products/order", settings)
            fetch("http://localhost:3000/api/products/order", {
                    method: "POST",
                    body: JSON.stringify(orderInfo),
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
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
    })

}


//code general de la page
let lastNameOk = false;
let firstNameOk = false;
let mailOk = false;
let cartHTML = "";
let totalPrice = 0;
let totalQuantity = 0;

//interrogation de l'api pour l'affichage des produits
async function loadProducts() {
    let listCart = getCart();
    for (item of listCart) {
        const response = await fetch("http://localhost:3000/api/products/" + item.itemId)
        const product = await response.json()
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
                <button class="deleteItem"  onclick="removeOfCart('${item.itemId}','${item.colorChoice}')">Supprimer</p>
              </div>
            </div>
          </div>
        </article>
        `;
        totalPrice += product.price * item.quantity;
        totalQuantity += item.quantity;
        document.getElementById("cart__items").innerHTML = cartHTML;
        document.getElementById("totalQuantity").innerHTML = `${totalQuantity}`;
        document.getElementById("totalPrice").innerHTML = `${totalPrice}`;
    }


}
loadProducts().then(() => {
    modifyQuantity();
    recupForm();
    sendForm();
})