import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';



const Navbar = ({ isLoggedIn, handleLogout }) => {
  const handleLogoutClick = () => {
    handleLogout();
  };

  

  return (
    <>
         
        <nav className='navbar-target'>
<div className="navbar-left">
<Link to={'/PocetnaStrana'}><img src='barber.logo.png' alt='(logo)' className='logo'/></Link>
</div>
<div className="navbar-right">
<Link to={'/PocetnaStrana'} className='navbar-link'>Pocetna</Link>
<Link to={"/Onama"} className='navbar-link'>O nama</Link>
<Link to={"/Odabrirfrizera"} className='navbar-link'>Usluge</Link>
{isLoggedIn && (
  <Link to={'/loginovan'} className="navbar-link">Informacije o terminima</Link>
)}
{isLoggedIn && (
  <Link to={'/pauza'} className="navbar-link">Pauza</Link>
)}
{isLoggedIn && (
  <Link to={'/Statistika'} className="navbar-link">
    Statistika
  </Link>
)}
{isLoggedIn && (
  <Link to={'/Radnovreme'} className="navbar-link">
    Radno vreme
  </Link>
)}

{isLoggedIn && (
  <Link to={'/Odjava'} className="navbar-link" onClick={handleLogoutClick}>
    Izloguj se
  </Link>
)}


</div>
</nav>

    
</>
)
}
export default Navbar