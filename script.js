window.onload = function onload() {
  fetchProductsByAPI('computador');
};

const objFetch = {
  method: 'GET',
  headers: { 'Accept': 'application/json' }
};

const fetchProductsByAPI = (product) => {
  const itemsSection = document.getElementsByClassName('items')[0];
  const API_URL = `https://api.mercadolibre.com/sites/MLB/search?q=${product}`;
  fetch(API_URL, objFetch)
  .then((response) => response.json())
  .then((responseJock) => {
    console.log(responseJock.results);
    responseJock.results.forEach((result) => {
      itemsSection.appendChild(createProductItemElement(result));
    });
    
  });
}  

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
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
