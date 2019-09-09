import { Storage } from './storage.js';

// const productsDOM = document.querySelector('.products-center');
// const cartTotal = document.querySelector('.cart-total');
// const cartItems = document.querySelector('.cart-items');
// const cartContent = document.querySelector('.cart-content');
// const cartBtn = document.querySelector('.cart-btn');
// const navIconBar = document.querySelector('.nav-icon-bar');
// const clearCartBtn = document.querySelector('.clear-cart');
// const cartOverlay = document.querySelector('.cart-overlay');
// const asideOverlay = document.querySelector('aside');
// const navAside = document.querySelector('.navbar-aside');
// const cartDOM = document.querySelector('.cart');
// const closeCartBtn = document.querySelector('.close-cart');
// const closeAside = document.querySelector('.close-aside');

// let buttonsDom = [];
// let cart= [];

export class UI{

    constructor(){
        this.productsDOM = document.querySelector('.products-center');
        this.cartTotal = document.querySelector('.cart-total');
        this.cartItems = document.querySelector('.cart-items');
        this.cartContent = document.querySelector('.cart-content');
        this.cartBtn = document.querySelector('.cart-btn');
        this.navIconBar = document.querySelector('.nav-icon-bar');
        this.clearCartBtn = document.querySelector('.clear-cart');
        this.cartOverlay = document.querySelector('.cart-overlay');
        this.asideOverlay = document.querySelector('aside');
        this.navAside = document.querySelector('.navbar-aside');
        this.cartDOM = document.querySelector('.cart');
        this.closeCartBtn = document.querySelector('.close-cart');
        this.closeAside = document.querySelector('.close-aside');

        this.buttonsDom = [];
        this.cart= [];
    }

    setupApp(){
        this.cart = Storage.getCart();
        this.setCartValues(this.cart);
        this.populateCart(this.cart);
        this.cartBtn.addEventListener('click', this.showCart);
        this.closeCartBtn.addEventListener('click', this.hidenCart);
        this.cartOverlay.addEventListener('click', this.hidenCart);
        this.navIconBar.addEventListener('click', this.showAside);
        this.closeAside.addEventListener('click', this.hidenAside);
        this.asideOverlay.addEventListener('click', this.hidenAside);
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
        this.productsDOM.innerHTML = result;
    }

    getBagButtons(){
        const buttons = [...document.querySelectorAll('.bag-btn')];
        this.buttonsDom = buttons;

        buttons.forEach(button =>{
            let id = button.dataset.id;
            let inCart = this.cart.find(item => item.id === id);
            if(inCart){
                button.textContent = "Dans le panier";
                button.disabled = true;
            }

            button.addEventListener('click', e =>{

                e.target.textContent = "Dans le panier";
                e.target.disabled = true;
                

                let cartItem = {...Storage.getProduct(id), amount:1};

                this.cart = [...this.cart, cartItem];
                Storage.saveCart(this.cart);
                //set cart values
                this.setCartValues(this.cart);
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

        this.cartTotal.textContent = parseFloat(tempTotal.toFixed(2));
        this.cartItems.textContent = itemsTotal;
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

        this.cartContent.appendChild(div);
    }

    showCart(){
        const cartOverlay = document.querySelector('.cart-overlay');
        const cartDOM = document.querySelector('.cart');

        cartOverlay.classList.add('transparentBcg');
        cartDOM.classList.add('showCart');       
    }

    showAside(){

        const asideOverlay = document.querySelector('aside');
        const navAside = document.querySelector('.navbar-aside');

        asideOverlay.classList.add('transparentBcg');
        navAside.classList.add('showAside');
    }

    hidenCart(){

        const cartOverlay = document.querySelector('.cart-overlay');
        const cartDOM = document.querySelector('.cart');

        cartOverlay.classList.remove('transparentBcg');
        cartDOM.classList.remove('showCart');
    }

    hidenAside(){

        const asideOverlay = document.querySelector('aside');
        const navAside = document.querySelector('.navbar-aside');

        asideOverlay.classList.remove('transparentBcg');
        navAside.classList.remove('showAside');
    }

    populateCart(){
        this.cart.forEach(item =>{
          this.addCartItem(item);
        });
    }

    cartLogic(){
        //clear cart button
        this.clearCartBtn.addEventListener('click', ()=>{
            this.clearCart();
        });

        this.cartContent.addEventListener('click', e=>{

            if(e.target.classList.contains('remove-item')){

                let removeItem = e.target;
                let id = removeItem.dataset.id;

                this.cartContent.removeChild(removeItem.parentElement.parentElement);
                this.removeItem(id);

            }else if(e.target.classList.contains('fa-chevron-up')){

                let addAmount = e.target;
                let id= addAmount.dataset.id;
                let tempItem = this.cart.find(item => item.id === id);
                tempItem.amount = tempItem.amount + 1;

                Storage.saveCart(this.cart);
                this.setCartValues(this.cart);
                addAmount.nextElementSibling.textContent = tempItem.amount;

            }else if(e.target.classList.contains('fa-chevron-down')){

                let lowerAmount = e.target;
                let id = lowerAmount.dataset.id;
                let tempItem = this.cart.find(item => item.id === id);
                tempItem.amount = tempItem.amount - 1;

                if(tempItem.amount > 0){
                    Storage.saveCart(this.cart);
                    this.setCartValues(this.cart);
                    lowerAmount.previousElementSibling.textContent = tempItem.amount;

                }else{
                    this.cartContent.removeChild(lowerAmount.parentElement.parentElement);
                    this.removeItem(id);
                }
            }
        })
    }

    clearCart(){
        let cartItems = this.cart.map(item => item.id);
        cartItems.forEach(id => this.removeItem(id));
        while(this.cartContent.children.length > 0){
            this.cartContent.removeChild(this.cartContent.children[0])
        }
        this.hidenCart();
    }

    removeItem(id){
        this.cart = this.cart.filter(item => item.id !== id);
        this.setCartValues(this.cart);
        Storage.saveCart(this.cart);
        let button = this.getSingleButton(id);
        button.disabled = false;
        button.innerHTML = `<i class="fas fa-shopping-cart"></i>add to a cart`
    }

    getSingleButton(id){
        return this.buttonsDom.find(button => button.dataset.id  === id);
    }
  
}