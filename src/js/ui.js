import { Storage } from './storage.js';

const productsDOM = document.querySelector('.products-center');
const cartTotal = document.querySelector('.cart-total');
const cartItems = document.querySelector('.cart-items');
const cartContent = document.querySelector('.cart-content');
const cartBtn = document.querySelector('.cart-btn');
const navIconBar = document.querySelector('.nav-icon-bar');
const clearCartBtn = document.querySelector('.clear-cart');
const cartOverlay = document.querySelector('.cart-overlay');
const asideOverlay = document.querySelector('aside');
const navAside = document.querySelector('.navbar-aside');
const cartDOM = document.querySelector('.cart');
const closeCartBtn = document.querySelector('.close-cart');
const closeAside = document.querySelector('.close-aside');

let buttonsDom = [];
let cart= [];

export class UI{

    setupApp(){
        cart = Storage.getCart();
        this.setCartValues(cart);
        this.populateCart(cart);
        cartBtn.addEventListener('click', this.showCart);
        closeCartBtn.addEventListener('click', this.hidenCart);
        cartOverlay.addEventListener('click', this.hidenCart);
        navIconBar.addEventListener('click', this.showAside);
        closeAside.addEventListener('click', this.hidenAside);
        asideOverlay.addEventListener('click', this.hidenAside);
    }

    displayProducts(products){
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

    getBagButtons(){
        const buttons = [...document.querySelectorAll('.bag-btn')];
        buttonsDom = buttons;

        buttons.forEach(button =>{
            let id = button.dataset.id;
            let inCart = cart.find(item => item.id === id);
            if(inCart){
                button.textContent = "Dans le panier";
                button.disabled = true;
            }

            button.addEventListener('click', e =>{

                e.target.textContent = "Dans le panier";
                e.target.disabled = true;
                

                let cartItem = {...Storage.getProduct(id), amount:1};

                cart = [...cart, cartItem];
                Storage.saveCart(cart);
                //set cart values
                this.setCartValues(cart);
                //display cart item
                this.addCartItem(cartItem);
                //show the cart
                this.showCart();
            });
        })
    }

    setCartValues(cart){
        let tempTotal = 0;
        let itemsTotal = 0;

        cart.map(item=>{
            tempTotal += item.price * item.amount;
            itemsTotal += item.amount;
        })

        cartTotal.textContent = parseFloat(tempTotal.toFixed(2));
        cartItems.textContent = itemsTotal;
    }

    addCartItem(item){
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `
            <img src=${item.image} alt="product">
            <div>
                <h4>${item.title}</h4>
                <h5>${item.price}€</h5>
                <span class="remove-item" data-id=${item.id}>remove</span>
            </div>
            <div>
                <i class="fas fa-chevron-up" data-id=${item.id}></i>
                <p class="item-amout">${item.amount}</p>
                <i class="fas fa-chevron-down" data-id=${item.id}></i>
            </div>
        `

        cartContent.appendChild(div);
    }

    showCart(){
        cartOverlay.classList.add('transparentBcg');
        cartDOM.classList.add('showCart');       
    }

    showAside(){
        asideOverlay.classList.add('transparentBcg');
        navAside.classList.add('showAside');
    }

    hidenCart(){
        cartOverlay.classList.remove('transparentBcg');
        cartDOM.classList.remove('showCart');
    }

    hidenAside(){
        asideOverlay.classList.remove('transparentBcg');
        navAside.classList.remove('showAside');
    }

    populateCart(){
        cart.forEach(item =>{
          this.addCartItem(item);
        });
    }

    cartLogic(){
        //clear cart button
        clearCartBtn.addEventListener('click', ()=>{
            this.clearCart();
        });

        cartContent.addEventListener('click', e=>{

            if(e.target.classList.contains('remove-item')){

                let removeItem = e.target;
                let id = removeItem.dataset.id;

                cartContent.removeChild(removeItem.parentElement.parentElement);
                this.removeItem(id);

            }else if(e.target.classList.contains('fa-chevron-up')){

                let addAmount = e.target;
                let id= addAmount.dataset.id;
                let tempItem = cart.find(item => item.id === id);
                tempItem.amount = tempItem.amount + 1;

                Storage.saveCart(cart);
                this.setCartValues(cart);
                addAmount.nextElementSibling.textContent = tempItem.amount;

            }else if(e.target.classList.contains('fa-chevron-down')){

                let lowerAmount = e.target;
                let id = lowerAmount.dataset.id;
                let tempItem = cart.find(item => item.id === id);
                tempItem.amount = tempItem.amount - 1;

                if(tempItem.amount > 0){
                    Storage.saveCart(cart);
                    this.setCartValues(cart);
                    lowerAmount.previousElementSibling.textContent = tempItem.amount;

                }else{
                    cartContent.removeChild(lowerAmount.parentElement.parentElement);
                    this.removeItem(id);
                }
            }
        })
    }

    clearCart(){
        let cartItems = cart.map(item => item.id);
        cartItems.forEach(id => this.removeItem(id));
        while(cartContent.children.length > 0){
            cartContent.removeChild(cartContent.children[0])
        }
        this.hidenCart();
    }

    removeItem(id){
        cart = cart.filter(item => item.id !== id);
        this.setCartValues(cart);
        Storage.saveCart(cart);
        let button = this.getSingleButton(id);
        button.disabled = false;
        button.innerHTML = `<i class="fas fa-shopping-cart"></i>add to a cart`
    }

    getSingleButton(id){
        return buttonsDom.find(button => button.dataset.id  === id);
    }
  
}