import React, { useState } from "react";
import { TextField } from "@mui/material";
import Button from "@mui/material/Button";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseconfig";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import "./NoviFrizer.css";

const Novifrizer = () => {
  const history = useHistory();
  const [ime, setIme] = useState(""); // Initialize the state with an empty string

  const slanjeFrizeraBazi = async (event) => {
    try {
      const docRef = await addDoc(collection(db, "frizeri"), {
        frizer: {
          ime: ime,
        },
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    history.push("/Odabrirfrizera");
  };

  const imeHandler = (event) => {
    setIme(event.target.value);
  };

  return (
    <>
      <h1 className="novifrizer-naslov">Novi Frizer</h1>
      <div className="dodajfrizera-kontejner">
      <TextField
        value={ime}
        onChange={imeHandler}
        label="Ime"
        variant="outlined"
        className="novi-frizer-input"
      />
      <Button variant="contained" onClick={slanjeFrizeraBazi}>
        Dodaj
      </Button>
      </div>
    </>
  );
};

export default Novifrizer;
