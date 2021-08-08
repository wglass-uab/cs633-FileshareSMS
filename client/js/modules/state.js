/**
  The global application state object. Used to cache inventory and track user cart.
*/

let listeners = [];

const App = {
  state: {
    page:"",
    inventory:[],
    cart:[]
  },
  setState(newState) {
    this.state = newState;
    listeners.forEach((c) => c(this.state));
  },
  listen(cb){
    listeners.push(cb);
    return () => {
      listeners = listeners.filter((c) => c !== cb);
    }
  }
}

export { App };