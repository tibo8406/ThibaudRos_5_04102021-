//fonction commune à cart.js et product.js
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