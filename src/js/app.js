import {UI} from './ui.js';
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
        fetch('../../kitchenProducts.json')
        .then(response =>{
            response.json();
        })
        .then(data =>{
            let kitchenProducts = data.items;
            
            kitchenProducts.map(item=>{
                const {title, price} = item.fields;
                const {id} = item.sys;
                const image = item.fields.image.fields.file.url;
                return{title, price, id,image};
            })
        })
    }
}

function exploreJSON(data){
    let products = data.items;
    
    products = products.map(item=>{
        const {title, price} = item.fields;
        const {id} = item.sys;
        const image = item.fields.image.fields.file.url;
        return{title, price, id, image};
    })
}

document.addEventListener("DOMContentLoaded", () =>{

    const products = new Products();
    const ui = new UI();
    //setup app
    ui.setupApp();
    //get all products
    products.getProducts();
});