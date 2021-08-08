import { App } from './state.js';
//import { autocompletesearch } from './search.js';

const staticInventoryHtml = 
`<form>
  <div class="d-flex flex-column justify-content-center">
    <div class="d-flex flex-row align-items-center justify-content-center p-4">
      <div id="autocomplete" class="search input-group rounded">
        <input id="autoInput" type="search" class="form-control" placeholder="Search">
        <span id="searchSpan" class="btn btn-warning input-group-text rounded">
          <img src="/img/search.png" width=15 height=15 />
        </span>
      </div>
    </div>
    <ul class="d-flex flex-row flex-wrap justify-content-evenly results">
    </ul>
  </div>
</form>
<a class="checkout btn btn-success rounded checkout-link" href="#">Checkout</a>`;

// Builds the base inventory page, with the full inventory
function inventoryPage({page, inventory, cart}) {

  if (page === 'inventory'){
    //Remove all Children from <main> 
 	  const mainEl = document.querySelector('main');
    Array.prototype.slice.call(mainEl.childNodes).forEach((child) => mainEl.removeChild(child));
        
    //Add the static component of the html, then add click handlers
    mainEl.innerHTML = staticInventoryHtml;
    
    document.querySelector(".checkout").addEventListener("click", () => App.setState({...App.state, "page":"checkout"}))
    
    document.getElementById("autoInput").addEventListener("search", (input) => {
      $("#autoInput").val(input.value);
      document.getElementById("searchSpan").click();
    });
    
    const searchSpan = document.getElementById("searchSpan");
    searchSpan.addEventListener("click", () => search(inventory));
    
    //initialize autocomplete and inventory
    $("#autoInput").autocomplete({
      source:Array.from(inventory).map(product => product.name),
      select:(e,ui) => {
        document.getElementById("autoInput").value = ui.item.value;
        searchSpan.click();
      }
    });
    
    setInventoryItems(inventory)
  }
};

// Performs a search using the search input
function search(inventory) {
  const inputText = document.getElementById("autoInput").value,
        filteredInventory = Array.from(inventory). filter(product => product.name.startsWith(inputText));
        
  setInventoryItems(filteredInventory);
}

/* 
Adds a styled inventory item to the results ul per object in the list 
Per item HTML:
<li>
  <img/>
  <p>name</p>
  <p>summary</p>
  <p>price</p>
  <div>
    <div>
      <input/>
      <span>+</span>
    </div>
  </div>
</li>
*/
function setInventoryItems(inventory = []) {
  
  //Remove all Children from <ul class="results">
  const resultsUl = document.querySelector('ul.results');
  Array.prototype.slice.call(resultsUl.childNodes).forEach((child) => resultsUl.removeChild(child));
  
	Array.from(inventory).forEach(item => {
    //create elements with styles and attributes
    const li = document.createElement('li');
    li.classList.add('d-flex','flex-column','item','p-2');
    
    const imgSpan = document.createElement('span');
    imgSpan.classList.add("image-container")
    
      // child of imgSpan
      const img = document.createElement('img');
      img.src=item.src;
    
    const name = document.createElement('p');
    name.classList.add("product-name");
    name.textContent=item.name;
    
    const summary = document.createElement('p');
    const sumList = item.summary.split(",");
    summary.classList.add("product-summary");
    for (let i =0; i < sumList.length; i++){
      const specs = document.createElement('li');
      specs.textContent = sumList[i].replaceAll('"','').trim(); 
      summary.appendChild(specs); 
    }
    
    const price = document.createElement('p');
    price.classList.add("price");
    price.textContent='$'+Number(item.price).toFixed(2);
    
    
    const qtyDivWrap = document.createElement('div');
    qtyDivWrap.classList.add('d-flex','flex-row','justify-content-end');
    
      // child of qtyDivWrap
      const qtyDiv = document.createElement('div');
      qtyDiv.classList.add('qty','input-group','rounded');
      
        // child of qtyDiv
        const qtyIn = document.createElement('input');
        qtyIn.classList.add('form-control');
        qtyIn.type="number";
        qtyIn.placeholder="Qty.";
        
        // child of qtyDiv        
        const qtyBtn = document.createElement('span');
        qtyBtn.classList.add('btn','btn-primary','input-group-text');
        qtyBtn.textContent="+";    
    
    
    //Assemble Children from innermost out
    qtyDiv.appendChild(qtyIn);
    qtyDiv.appendChild(qtyBtn);
    
    qtyDivWrap.appendChild(qtyDiv);
    
    imgSpan.appendChild(img);
    
    li.appendChild(imgSpan);
    li.appendChild(name);
    li.appendChild(summary);
    li.appendChild(price);
    li.appendChild(qtyDivWrap);
    
    
    //Add Event Handler to btn
    qtyBtn.addEventListener("click", (e) => {    
      if (qtyIn.value && qtyIn.value > 0) {
        const appcart = App.state.cart;
        appcart.push({ 
          "id": item.id, 
          "qty": qtyIn.value, 
          "price": item.price, 
          "name": item.name 
        });
        App.setState({
          ...App.state,
          "cart": appcart
        });
      }
    })
      
    //append item to list
	  resultsUl.appendChild(li);
  });
};

App.listen(inventoryPage);

export { setInventoryItems };
