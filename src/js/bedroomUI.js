import { UI } from './ui.js';
import { Storage } from './storage.js';

class Bedroom{
    getBedroomProducts(){
        try{
            fetch("../src/json/bedroomProducts.json")
            .then(response =>{
                return response.json();
            })
            .then(data =>{
                let bedroomProducts = data.items;

                bedroomProducts = bedroomProducts.map(item=>{
                    const {title, price} = item.fields;
                    const {id, amount} = item.sys;
                    const image = item.fields.image.fields.file.url;
                    return {title, price, id, amount, image};
                })

                const bedroomUI = new BedroomUI();
                bedroomUI.displayBedroomProducts(bedroomProducts);
                Storage.saveProducts(bedroomProducts);
                bedroomUI.getBagButtons();
                bedroomUI.cartLogic();
            })
        }catch(error){
            console.log(error)
        }
    }
}

export class BedroomUI extends UI{

    displayBedroomProducts(products){
        let result = ' ';

        products.map(product =>{
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

document.addEventListener("DOMContentLoaded", ()=>{

    const bedroom = new Bedroom();
    const bedroomUI = new BedroomUI();

    //get bedroom products
    bedroom.getBedroomProducts();

    //setup bedroom
    bedroomUI.setupApp();

});

