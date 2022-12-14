import React from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom';

import Header from './components/Header.js';
import Hero from './components/Hero.js';
import Browse from './components/Browse.js';
import Arrived from './components/Arrived.js';
import Clients from './components/Clients.js';
import AsideMenu from './components/AsideMenu.js';
import Footer from './components/Footer.js';
import Offline from './components/Offline.js';
import Splash from './pages/Splash.js';
import Profile from './pages/Profile.js';
import Details from './pages/Details.js';
import Cart from './pages/Cart.js';

function App() {
  const [items, setItems] = React.useState([]);
  const [offlineStatus, setOfflineStatus] = React.useState(!navigator.onLine);
  const[isLoading, setIsLoading] = React.useState(true);
  

  function handleOfflineStatus(){
    setOfflineStatus(!navigator.onLine);
  }

  React.useEffect(function() {
    (async function() {
      const response = await fetch('https://prod-qore-app.qorebase.io/8ySrll0jkMkSJVk/allItems/rows?limit=7&offset=0&$order=asc', {
        headers: {
          "Content-Type": "application/json",
          "accept": "application/json",
          "x-api-key": process.env.REACT_APP_APIKEY
        }
      });
      const{ nodes } = await response.json();
      setItems(nodes);

      const script = document.createElement("script");
      script.src = "/carousel.js";
      script.async = false;
      document.body.appendChild(script);
    })();

    handleOfflineStatus();
    window.addEventListener('online', handleOfflineStatus);
    window.addEventListener('offline', handleOfflineStatus);

    setTimeout(function(){
      setIsLoading(false);
    }, 1500);

    return function() {
      window.removeEventListener('online', handleOfflineStatus);
      window.removeEventListener('offline', handleOfflineStatus);
    }
  }, [offlineStatus]);
  return (
    <>
    {isLoading == true ? <Splash /> :
    (
      <>
      {offlineStatus && <Offline />}
    <Header mode="light"/>
    <Hero />
    <Browse />
    <Arrived items={items} />
    <Clients />
    <AsideMenu />
    <Footer />
    </>)}
    </>
    );
}

export default function Routes() {
  const [cart, setcart] = React.useState([]);
  function handleAddToCart(item){
    const currentIndex = cart.length;
    const newCart = [...cart, {id: currentIndex + 1, item}];
    setCart(newCart);
  }
  return (
    <Router>
      <Route path="/" exact component={App} />
      <Route path="/profile" exact component={Profile} />
      <Route path="/details/:id" >
        <Details handleAddToCart={handleAddToCart} cart={cart}/>
        </Route>
      <Route path="/cart">
        <Cart cart={cart}/>
        </Route>
    </Router>
  )
}
