import React, { useState,  useEffect } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import NavBar from './Navigacija/NavBar';
import Pocetna from './Strane/Pocetna';
import Onama from './Strane/Onama';
import Termini from './Strane/Termini';
import VrsteUsluga from './Strane/VrsteUsluga';
import Podacikorisnika from './Strane/Podacikorisnika';
import Login from './RegistrovaniKorisnik/Login';
import Registrovanikorisnik from './RegistrovaniKorisnik/Registrovanikorisnik';
import Pauza from './RegistrovaniKorisnik/Pauze';
import Detaljitermina from './Strane/Detaljitermina';
import  Novausluga from './Strane/Novausluga';
import Editusluga from './Strane/Editusluge';
import OdabriFrizera from './Strane/OdabirFrizera';
import Editfrizera from './Strane/Editfrizera'
import Novifrizer from './Strane/NoviFrizer';
import Statistika from './RegistrovaniKorisnik/Statistika';



function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
  const storedUserLoggedInInformation = localStorage.getItem("isLoggedIn");

  if (storedUserLoggedInInformation === "1") {
    setIsLoggedIn(true);
  }
}, []);

  const handleLogin = () => {
    localStorage.setItem("isLoggedIn", "1");
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
  };

  return (
    <>
      <div>
        <NavBar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
        <Switch>
          {!isLoggedIn && (
            <Route path="/login">
              <Login handleLogin={handleLogin} />
            </Route>
          )}
     <Route path="/loginovan">
  {isLoggedIn && <Registrovanikorisnik/>}
</Route>
<Route path='/pauza'>
  {isLoggedIn &&<Pauza/>}
</Route>
<Route path='/Novausluga'>
  {isLoggedIn && < Novausluga/>}
</Route>
<Route path="/Editusluge">
  {isLoggedIn && <Editusluga/>}
</Route>
<Route path='/Novifrizer'>
  {isLoggedIn && <Novifrizer/>}
</Route>
 <Route path="/Editfrizera">
  {isLoggedIn && <Editfrizera/>}
          </Route> 
     
          <Route path="/Statistika">
            <Statistika/>
          </Route>
          
          <Route path="/PocetnaStrana" exact>
            <Pocetna />
          </Route>
          <Route path="/Onama" exact>
            <Onama />
          </Route>
          <Route path='/Odabrirfrizera' >
            <OdabriFrizera isLoggedIn={isLoggedIn}/>
          </Route>
          <Route path="/VrsteUsluga">
            <VrsteUsluga isLoggedIn={isLoggedIn} />
          </Route>
          <Route path="/Zakazitermin" exact>
            <Termini />
          </Route>
          <Route path="/Podacikorisnika">
            <Podacikorisnika />
          </Route>
          <Route path='/Detaljitermina'>
            <Detaljitermina/>
          </Route>
          <Route path="/">
            <Redirect to="/PocetnaStrana" />
          </Route>
          
        </Switch>
      </div>
    </>
  );
}

export default App;