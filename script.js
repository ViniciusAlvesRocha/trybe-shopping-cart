
window.onload = function onload() {
  console.log('Local Storage Carrinho:');
  console.log(JSON.stringify(localStorage.getItem('infoCartMercadoLivre')));
  fetchProductsByAPI('computador');
  getInfoCartLocalStorage();

  const emptyCartButton = document.getElementsByClassName('empty-cart')[0];
  emptyCartButton.addEventListener('click', emptyCart);
  
 
};
  
const emptyCart = () => {
  localStorage.clear();
  const cartContainer = document.getElementsByClassName('cart__items')[0];
  cartContainer.innerHTML = '';
  const totalPrice = document.getElementsByClassName('total-price')[0];
  totalPrice.innerHTML = '';
};

const addEventClickInButtonAddCart = (element) => {
  getProductById(element.path[1].firstChild.innerText);
}

const objFetch = {
  method: 'GET',
  headers: { 'Accept': 'application/json' }
};

const getProductById = async (idProduct) => {
  //"https://api.mercadolibre.com/items/$ItemID"
  await fetchAPI(`https://api.mercadolibre.com/items/${idProduct}`);
  const totalPrice = document.getElementsByClassName('total-price')[0];
  totalPrice.innerHTML = '';
  totalPrice.innerText = parseFloat(getTotalCart().toFixed(2));
};

const getTotalCart = () => {
  let products = JSON.parse(localStorage.getItem('infoCartMercadoLivre'));
  return products.reduce((accumulator, product) => {
    console.log(accumulator, product.price);
    return accumulator + product.price
  }, 0);
};

const fetchAPI = (url) => {
  return fetch(url, objFetch)
  .then((response) => response.json())
  .then((responseJock) => {
    const cartItems = document.getElementsByClassName('cart__items')[0];
    //Adicionando item no carrinho:
    const itemCart = createCartItemElement(responseJock);
    cartItems.appendChild(itemCart);
    console.log('Item do carrinho:');
    console.log(responseJock);
    addProductInLocalStorage(responseJock);
  })
  .catch((error) => console.log(error));
};

const getInfoCartLocalStorage = () => {
  const infoCart = JSON.parse(localStorage.getItem('infoCartMercadoLivre'));
  if (infoCart === null) {
    console.log('não há informações no carrinho');
  } else {
    const cartItems = document.getElementsByClassName('cart__items')[0];
    //pegando item do local Storage e Adicionando item no carrinho:
    infoCart.forEach((item) => {
      const itemCart = createCartItemElement(item);
      cartItems.appendChild(itemCart);
    });
  }
};

const fetchProductsByAPI = (product) => {
  const itemsSection = document.getElementsByClassName('items')[0];
  const API_URL = `https://api.mercadolibre.com/sites/MLB/search?q=${product}`;
  const containerLoading = document.getElementsByClassName('loading')[0];
  containerLoading.innerText = 'loading';
  fetch(API_URL, objFetch)
  .then((response) => response.json())
  .then((responseJock) => {
    containerLoading.innerText = '';
    console.log(responseJock.results);
    responseJock.results.forEach((result) => {
      const itemShowcase = createProductItemElement(result)
      itemsSection.appendChild(itemShowcase);
    });
    
  });
}

const addProductInLocalStorage = (productCartLocalStorage) => {
    const varLocalStorage = [];
    let itemsCartLoalStorage = localStorage.getItem('infoCartMercadoLivre')
    ? JSON.parse(localStorage.getItem('infoCartMercadoLivre'))
    : []; 
    varLocalStorage.push(...itemsCartLoalStorage);
    varLocalStorage.push(productCartLocalStorage)
    localStorage.setItem('infoCartMercadoLivre',JSON.stringify(varLocalStorage));
    getTotalCart();
    console.log('Item adicionado no Local Storage');
} ;

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (element === 'button') {
    e.addEventListener('click', addEventClickInButtonAddCart)
  }
  return e;
}

function createProductItemElement({ id:sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // 3 - removendo item do cerrinho
  console.log('elemento que será removido do carrinho de compras:');
  // this refere-se ao proprio objeto HTML em si
  this.remove();
  removeItemCartFromLocalStorage(this);
}

const removeItemCartFromLocalStorage = (itemList) => {
  const idItemCart = itemList.innerText.substring(5, 18);
  const itemsCartLoalStorage = JSON.parse(localStorage.getItem('infoCartMercadoLivre'));
  const itemCart = itemsCartLoalStorage.find((item) => item.id === idItemCart);
  console.log(itemCart);
  const positionRemove = itemsCartLoalStorage.indexOf(itemCart);
  console.log(positionRemove);

  let initProductsList = itemsCartLoalStorage.slice(0, positionRemove);
  let endProductsList = itemsCartLoalStorage.slice(positionRemove + 1, itemsCartLoalStorage.length);
  // localStorage.getItem('infoCartMercadoLivre')
  const listProducts = [...initProductsList, ...endProductsList];

  localStorage.setItem('infoCartMercadoLivre', JSON.stringify(listProducts));

  const totalPrice = document.getElementsByClassName('total-price')[0];
  totalPrice.innerHTML = '';
  totalPrice.innerText = parseFloat(getTotalCart().toFixed(2));
}

//Função que adiciona item no carrinho:
function createCartItemElement({ id:sku, title:name, price:salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

