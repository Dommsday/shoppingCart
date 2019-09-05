const productsDOM = document.querySelector('.products-center');
const linkKitchen = document.querySelector('.link-kitchen');

export class KitchenUI{

    displayKitchenProducts(products){
        let result = ' ';
        products.map(product => {
            result +=`
            <article class="product">
                <div class="img-container">
                    <img src=${product.image} alt="product" class="product-img">
                    <button class="bag-btn" data-id=${product.id}><i class="fas fa-shopping-cart"></i>add to cart</button>
                </div>
                <h3>${product.title}</h3>
                <h4>${product.price}€</h4>
            </article> 
            `
        });
        productsDOM.innerHTML = result;

    }

    selectProductsKitchen(){
        linkKitchen.addEventListener('click', this.displayKitchenProducts);
    }
}