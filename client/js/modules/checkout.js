import { App } from './state.js';

const staticCheckoutHtml = 
  `<div class="d-flex justify-content-center">
    <table cellpadding=15>
      <thead>
        <tr>
          <th>Product Name</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Subtotal</th>
        </tr>
      </thead>
      <tbody id="tableBody">
      </tbody>
      <tfoot class="fw-bold border-top">
        <tr>
          <td>Total</td>
          <td></td>
          <td></td>
          <td id="tableTotal"></td>
        </tr>
        <tr>
          <td></td>
          <td><button class="btn btn-danger emptyCartBtn">Empty Cart</button></td>
          <td><button class="btn btn-secondary keepShoppingBtn">Keep Shopping</button></td>
          <td><button class="btn btn-success orderBtn">Order</button></td>
        </tr>
      </tfoot>
    </table>
  </div>`;

function checkoutPage({page, inventory, cart}) {
  if (page === 'checkout') {
    // Clean main element of content
    const mainEl = document.querySelector('main');
    Array.prototype.slice.call(mainEl.childNodes).forEach((child) => mainEl.removeChild(child));
    
    // Add static and dynamic table content
    mainEl.innerHTML = staticCheckoutHtml;
    setCartItems(cart);
    addFooterButtonHandlers();
  }
}

function setCartItems(cart) {
  let total = 0;
  const tbodyEl = document.getElementById("tableBody"),
        tableTotalEl = document.getElementById("tableTotal");
        
  //Create a table row per item, accumulate the subtotals, and append to DOM
  tbodyEl.innerHTML = Array.from(cart).map(item => {
    const subtotal = item.price * item.qty,
          itemHtml = 
          `<tr>
            <td>${item.name}</td>
            <td>$${Number(item.price).toFixed(2)}</td>
            <td>${item.qty}</td>
            <td>$${subtotal.toFixed(2)}</td>
          </tr>`;
    total += subtotal;
    return itemHtml;       
  }).join('');
  tableTotalEl.innerHTML = '$' + total.toFixed(2);
}

function addFooterButtonHandlers(){
  document.querySelector("button.emptyCartBtn")
    .addEventListener("click", function() {
      if (window.confirm("Empty your cart?")) {
        App.setState({...App.state, "page":"inventory", "cart":[]})
      }
    });
    
  document.querySelector("button.keepShoppingBtn")
    .addEventListener("click", function() {
      App.setState({...App.state, "page":"inventory"})
    });
    
  document.querySelector("button.orderBtn")
    .addEventListener("click", function() {
      if (window.confirm("Submit Inventory Request?")) {
        //send order email using cart
        const xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() { 
          if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            App.setState({...App.state, "page":"inventory", "cart":[]})
          }
        };
        xmlHttp.open("POST", "/api/order", true); // true for asynchronous 
        xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xmlHttp.send(JSON.stringify(App.state.cart));
      }
    }); 
}


App.listen(checkoutPage);