import React, { useState } from "react";
import { TextField } from '@mui/material';
import { useLocation, useHistory } from "react-router-dom";
import Button from '@mui/material/Button';
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebaseconfig";
import './Editfrizera.css'

const Editfrizera = ({ selectedFrizer }) => {
  const history = useHistory();
  const location = useLocation();
  const podaci = location.state;
  console.log(podaci);

  const initialFrizer = {
    id: podaci.id,
    novoIme: podaci.frizer.ime,
  };

  const [frizer, setFrizer] = useState(initialFrizer);

  const slanjeFrizeraBazi = async () => {
    try {
      if (!frizer.id) {
        console.error("Document ID not found.");
        return;
      }

      const updatedFrizer = {
        frizer: {
          ime: frizer.novoIme,
        },
      };

      await updateDoc(doc(db, "frizeri", frizer.id), updatedFrizer);
      console.log("Dokument uspešno ažuriran.");
    } catch (e) {
      console.error("Greška pri ažuriranju dokumenta: ", e);
    }
    history.push('./Odabrirfrizera')
  };

  const handleFrizerChange = (event) => {
    const { name, value } = event.target;
    setFrizer((prevFrizer) => ({
      ...prevFrizer,
      [name]: value
    }));
  };

  return (
    <>
      <h1 className="frizer-naslov">Edit frizera</h1>
      <div className="frizer-kontejner">
      <TextField
        value={frizer.novoIme || ""}
        name="novoIme"
        onChange={handleFrizerChange}
        label="Ime"
        variant="outlined"
        className="frizer-polje"
      />

      <Button variant="contained" onClick={slanjeFrizeraBazi}>
        Sačuvaj promene
      </Button>
      </div>
    </>
  );
};

export default Editfrizera;