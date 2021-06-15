class Product{
    // title;
    // imageURL;
    // price;
    // description;   if we use these fields in constructor only then no need to declare these
                    //but if need to use outside the class then need to declare  
    constructor(title, desc, imgUrl, price){
        this.title = title;
        this.imageURL = imgUrl;
        this.description = desc;
        this.price = price;   
    }
}

class ElementAttribute {
    constructor(attrName, attrValue){
        this.name = attrName;
        this.value = attrValue;
    }
}

class Component {
    constructor(renderHookId, shouldRender = true){
        this.hookId = renderHookId;
        if(shouldRender){
            this.render();
        }
    }

    render(){}

    creatrRootElement(tag, cssClasses, attributes){
        const rootElement = document.createElement(tag);
        if(cssClasses){
            rootElement.className = cssClasses;
        }
        if(attributes && attributes.length>0){
            for(const attr of attributes){
                rootElement.setAttribute(attr.name, attr.value);
            }
        }
        document.getElementById(this.hookId).append(rootElement);
        return rootElement;
    }
}

class ShoppingItem extends Component {
    items = [];

    get totalAmount(){
        const sum = this.items.reduce((prevValue, curItem) => {
            return prevValue + curItem.price;
        }, 0);
        return sum;
    }

    constructor(renderHookId){
        super(renderHookId, false);
        this.orderProducts = () => {
            console.log('Ordering...');
            const orderedItems = [];
            for(const item of this.items){
                orderedItems.push(item.title);
            }
            console.log(orderedItems);
            this.items = [];
            this.totalOutput.innerHTML = `<h2>Total : \$0</h2>`;
        };
        this.render();
    }

    addProduct(product){
        this.items.push(product);
        this.totalOutput.innerHTML = `<h2>Total : \$${this.totalAmount.toFixed(2)}</h2>`;
    }

    render(){
        const cartElement = this.creatrRootElement('section','cart');
        cartElement.innerHTML = `
            <h2>Total : \$${0}</h2>
            <button>Order Now !</button>
        `;
        this.totalOutput = cartElement.querySelector('h2');
        const orderBtn = cartElement.querySelector('button');
        orderBtn.addEventListener('click', this.orderProducts);
    }
}

class ProductItem extends Component {
    constructor(product, renderHookId){
        super(renderHookId, false);
        this.product = product;  //reason of not declaring product (this.product) explained above
        this.render();
    }

    addToCart(){
        App.addProductToCart(this.product);
    }

    render(){
        const prodElement = this.creatrRootElement('li','product-item');
        prodElement.innerHTML = `
            <div>
                <img src="${this.product.imageURL}" alt="${this.product.title}">
                <div class="product-item__content">
                    <h2>${this.product.title}</h2>
                    <h3>\$${this.product.price}</h3>
                    <p>${this.product.description}</p>
                    <button>Add to cart</button>
                </div>
            </div>
        `;
        const addCartBtn = prodElement.querySelector('button');
        addCartBtn.addEventListener('click',this.addToCart.bind(this));
    }
}

class ProductList extends Component {
    products = [];
    
    constructor(renderHookId){
        super(renderHookId);
        this.fetchProducts();
    } 
    
    fetchProducts() {
        this.products = [
            new Product(
                'A pillow',
                'A soft pillow',
                'https://image.shutterstock.com/image-photo/blue-pillow-isolated-on-white-260nw-259753253.jpg',
                19.99
            ),
            new Product(
                'A carpet',
                'A carpet you may love to buy',
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9g4N3eXmFOKvE8Z9-bWRpnNAVCBhgjgT89A&usqp=CAU',
                199.99
            )
        ];
        this.renderProducts();
    }

    renderProducts(){
        for(const prod of this.products){
            const productItem = new ProductItem(prod,'prod-list');
        }
    }

    render(){
        const prodList = this.creatrRootElement('ul','product-list',[new ElementAttribute('id','prod-list')]);
        if(this.products && this.products.length>0){
            this.renderProducts();
        }
    }
}

class Shop extends Component {
    constructor(){
        super();
    }
    
    render(){
        this.cart = new ShoppingItem('app');
        new ProductList('app');
    }
}

class App {
    static cart;

    static init(){
        const shop = new Shop();
        this.cart = shop.cart;
    }

    static addProductToCart(product){
        this.cart.addProduct(product);
    }
}

App.init();
