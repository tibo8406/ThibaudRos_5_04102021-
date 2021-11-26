//fonction commune à cart.js et product.js
//fonction pour recuperer le panier si existant
export function getCart() {
    // récupération de listCart dans le localStorage
    let listCart = localStorage.getItem("listCart");
    //si listcartr est null ou non defini, on renvoie un tableau vide
    if (listCart === null || listCart === "undefined") {
        return [];
    }
    //sinon on renvoie le tableau existant converti en valeur javascript
    return JSON.parse(listCart);
}
//fonction pour sauvegarder le panier
export function saveCart(listCart) {
    //sauevagrde de listcart de local storage converti en chaine JSON
    localStorage.setItem("listCart", JSON.stringify(listCart));
}
// cherche dans le panier si un produit de meme couleur existe deja
export function findProductIndexInCart(id, color) {
    //recuperation du panier
    let listCart = getCart();
    //on renvoie l'index correspondant si on trouve le meme id et la meme couleur
    return listCart.findIndex(item => item.itemId === id && item.colorChoice === color);
}