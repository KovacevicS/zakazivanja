import React from "react";
import { Link } from "react-router-dom";
import classes from "./Pocetna.module.css";
import video from "../images/bickejivideo2.mp4";

const Pocetna = () => {
  return (
    <>
    <div className={classes.kontejner}>
    <video autoPlay loop muted disablePictureInPicture>
        <source src={video} type="video/mp4" />
      </video>
      </div>
      <div className={classes.container}>
        <div className={classes.info}>
          <h1>Dobro došli na sajt!</h1>
          <h2>Luka Bickeji</h2>

          <div className={classes.service}>
            <h3>Usluge friziranja</h3>
            <p>Pružamo širok spektar usluga friziranja za sve vaše potrebe.</p>
          </div>
          <div>
            <h3>Usluge bojanja kose</h3>
            <p>
              Nudimo profesionalno bojanje kose u različitim bojama i stilovima.
            </p>
          </div>
          <Link to={"/Odabrirfrizera"} className={classes.button}>
            Zakaži termin
          </Link>
        </div>
      </div>
    </>
  );
};

export default Pocetna;