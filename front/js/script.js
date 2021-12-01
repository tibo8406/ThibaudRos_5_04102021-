import { Product } from './class.js';

async function loadConfig() {
    let result = await fetch("./../config.json");
    return result.json();
}
//chargement de la config (url api)
loadConfig().then(data => {
    const config = data;
    //requete et redcuperation de produits dans l'api
    fetch(config.host + "/api/products").then(data => data.json())
        .then(jsonListProducts => {
            /*class Product {
                constructor(jsonProduct) {
                    jsonProduct && Object.assign(this, jsonProduct);
                }
            }*/
            let productsHTML = "";
            //integration html des elements pour chaque produits
            for (let jsonProduct of jsonListProducts) {
                const kanap = new Product(jsonProduct);
                console.log(kanap);
                productsHTML += `<a href="./product.html?id=${kanap._id}">
                <article>
                  <img src="${kanap.imageUrl}" alt="${kanap.altTxt}, ${kanap.name}">
                  <h3 class="productName">${kanap.name}</h3>
                  <p class="productDescription">${kanap.description}</p>
                </article>
              </a>`;
            }
            document.querySelector(".items").innerHTML = productsHTML;
        });
});