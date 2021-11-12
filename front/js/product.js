let params = (new URL(document.location)).searchParams;
let id = params.get('id');
const url = "http://localhost:3000/api/products/" + id;
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
        let colorHTML = `<option value="">--SVP, choisissez une couleur --</option>`;
        for (let i = 0; i < product.colors.length; i++) {
            colorHTML += `<option value="${product.colors[i]}">${product.colors[i]}</option>`;
        }
        document.getElementById("colors").innerHTML = colorHTML;
        // ajoutez au panier
        document.getElementById("addToCart").addEventListener('click', function() {
                let colorChoice = document.getElementById("colors").value;
                let numberChoice = +document.getElementById("quantity").value;
                if (colorChoice !== "" && numberChoice >= 1) {
                    addToCart(product._id, colorChoice, numberChoice);
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

            })
            //fin ajouter au panier
    })
    .catch(function(err) {
        // Une erreur est survenue
    });