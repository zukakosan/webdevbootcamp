const form = document.querySelector('form');
const ul = document.querySelector('ul');
// この下にコードを書いてください
form.addEventListener('submit', function(e){
    e.preventDefault();
    const name = form.elements.product.value;
    const qty = form.elements.qty.value;
    const li = document.createElement('li');
    // li.append(name);
    // ul.appendChild(li);
    li.textContent = `${name} - ${qty}`;
    ul.appendChild(li);
    form.elements.product.value = '';
    form.elements.qty.value = '';

});