import { UI } from './ui.js';
import { Storage } from './storage.js';

class LivingRoom{
    getLivingRoomProducts(){
        try{
            fetch('../../livingRoom.json')
            .then(response =>{
                return response.json();
            })
            .then(data=>{
                let livingRoomProducts = data.items;

                livingRoomProducts = livingRoomProducts.map(item=>{
                    const {title, price} = item.fields;
                    const {id, amount} = item.sys;
                    const image = item.fields.image.fields.file.url;
                    return {title, price, id, amount, image};
                })

                const livingRoomUI = new LivingRoomUI();
                livingRoomUI.displayLivingRoomProducts(livingRoomProducts);
                Storage.saveProducts(livingRoomProducts);
                livingRoomUI.getBagButtons();
                livingRoomUI.cartLogic();
            })
        }catch(error){
            console.log(error)
        }
    }
}

class LivingRoomUI extends UI{

    displayLivingRoomProducts(products){
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

    const livingRoom = new LivingRoom();
    const livingRoomUI = new LivingRoomUI();

    //get livingRoom products
    livingRoom.getLivingRoomProducts();

    //setup livingRoom
    livingRoomUI.setupApp();

});
