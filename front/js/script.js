async function loadConfig() {
    let result = await fetch("../../front/config.json");
    return result.json();
}
loadConfig().then(data => {
    const config = data;
    fetch(config.host + "/api/products").then(data => data.json())
        .then(jsonListProducts => {
            class Product {
                constructor(jsonProduct) {
                    jsonProduct && Object.assign(this, jsonProduct);
                }
            }
            let productsHTML = "";
            for (let jsonProduct of jsonListProducts) {
                const product = new Product(jsonProduct);
                productsHTML += `<a href="./product.html?id=${product._id}">
                <article>
                  <img src="${product.imageUrl}" alt="${product.altTxt}, ${product.name}">
                  <h3 class="productName">${product.name}</h3>
                  <p class="productDescription">${product.description}</p>
                </article>
              </a>`;
            }
            document.querySelector(".items").innerHTML = productsHTML;
        });
});