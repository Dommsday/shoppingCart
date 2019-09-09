import { UI } from './ui.js';

class Kitchen{
    getKitchenProducts(){
        try{
            fetch('../../kitchenProducts.json')
            .then(response =>{
                return response.json();
                
            })
            .then(data =>{
                let kitchenProducts = data.items;
            
                kitchenProducts = kitchenProducts.map(item=>{
                    const {title, price} = item.fields;
                    const {id} = item.sys;
                    const image = item.fields.image.fields.file.url;
                    return{title, price, id,image};
                })

                const kitchenUI = new KitchenUI();
                kitchenUI.displayKitchenProducts(kitchenProducts);
            })   
        }catch(error){
            console.error(error);
        }
        
    }
}

export class KitchenUI extends UI{

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

        const productsDOM = document.querySelector('.products-center');
        productsDOM.innerHTML = result;

    }

}

document.addEventListener("DOMContentLoaded", () =>{

    const kitchen = new Kitchen()

    //setup app
    kitchen.getKitchenProducts();
});