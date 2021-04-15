window.onload = function onload() {
  fetchProductsByAPI('computador');
};

const addEventClickInButtonAddCart = (element) => {
  getProductById(element.path[1].firstChild.innerText);
}

const objFetch = {
  method: 'GET',
  headers: { 'Accept': 'application/json' }
};

const getProductById = (idProduct) => {
  //"https://api.mercadolibre.com/items/$ItemID"
  fetchAPI(`https://api.mercadolibre.com/items/${idProduct}`);
};

const fetchAPI = (url, addCartFunction) => {
  return fetch(url, objFetch)
  .then((response) => response.json())
  .then((responseJock) => {
    console.log(responseJock);
    const cartItems = document.getElementsByClassName('cart__items')[0];
    cartItems.appendChild(createCartItemElement(responseJock));
  })
  .catch((error) => console.log(error));
};

const fetchProductsByAPI = (product) => {
  const itemsSection = document.getElementsByClassName('items')[0];
  const API_URL = `https://api.mercadolibre.com/sites/MLB/search?q=${product}`;
  fetch(API_URL, objFetch)
  .then((response) => response.json())
  .then((responseJock) => {
    console.log(responseJock.results);
    responseJock.results.forEach((result) => {
      const itemShowcase = createProductItemElement(result)
      itemsSection.appendChild(itemShowcase);
    });
    
  });
}  

// Requisito 2:

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
}

function createCartItemElement({ id:sku, title:name, price:salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
