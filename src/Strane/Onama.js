import React from "react";
import "./Onama.css";
// import video from "../images/bickejivideo2.mp4";

const Onama = () => {
  return (
    <>
    {/* <div className='klasazavideo'>
      <video autoPlay loop muted>
        <source src={video} type="video/mp4" />
      </video>
      </div> */}
      <div className="veliki-kontejner">
        <div className="mali-kontejner">
          <img src="https://images.unsplash.com/photo-1517832606299-7ae9b720a186?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=686&q=80" alt="slikaa" className="onamaslika1"/>
        </div>
        <h1>O Nama</h1>
        <p>Kontakt: 0612345678910</p>
        <p>Adresa: Novi Sad Bulevar Oslobodjenja 25</p>

        <p>
          Berbernica Luka Bickeji se vec 5 godina bavi sisanjem modernih
          kvalitenih frizura. Bla bla bla bla
        </p>
        <iframe
          title="Google Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11236.312083255802!2d19.82353086357276!3d45.246215044738555!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x475b103e6963ada7%3A0xd59d8d510f58d4d5!2z0JPRgNCx0LDQstC40YbQsCwg0J3QvtCy0Lgg0KHQsNC0!5e0!3m2!1ssr!2srs!4v1687861127630!5m2!1ssr!2srs"
          className="map"
        /> 
      </div>
    </>
  );
};

export default Onama;