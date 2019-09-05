import {UI} from './ui.js';
import {KitchenUI} from './kitchenUI.js';
import { Storage } from './storage.js';

class Products{
    getProducts(){
       try{
            fetch('../../allProducts.json')
            .then(response =>{
                return response.json();
            })
            .then(data =>{

                let products = data.items;
                products = products.map(item=>{
                    const {title, price} = item.fields;
                    const {id} = item.sys;
                    const image = item.fields.image.fields.file.url;
                    return{title, price, id, image};
                })

                const ui = new UI;
                ui.displayProducts(products);
                Storage.saveProducts(products);
                ui.getBagButtons();
                ui.cartLogic();
            })
       }catch(error){
           console.error(error)
       }
    }
}

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

                const kitchenUi = new KitchenUI;
                kitchenUi.displayKitchenProducts(kitchenProducts);
            })
        }catch(error){
            console.error(error);
        }
        
    }
}

document.addEventListener("DOMContentLoaded", () =>{

    const products = new Products();
    const ui = new UI();
    const kitchenUI = new Kitchen();
    //setup app
    ui.setupApp();
    //get all products
    products.getProducts();

    //get products kitchen
    // kitchenUI.getKitchenProducts();
});