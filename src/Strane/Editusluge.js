import React, { useState } from "react";
import { TextField } from "@mui/material";
import { useHistory,useLocation,} from "react-router-dom/cjs/react-router-dom.min";
import Button from "@mui/material/Button";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebaseconfig";
import './Editusluge.css'
;

const Editusluge = ({ selectedUsluga }) => {
  const location = useLocation();
  const podaci = location.state;
  const history = useHistory();
  console.log(podaci);
  

  const initialUsluga = {
    id: podaci.id,
    novoIme: podaci.name,
    novaCena: podaci.cena,
    noviOpis: podaci.opis,
    novaVrstaUsluge: podaci.vrstaUsluge,
    novoTrajanje: podaci.trajanje,
    novaSlika: podaci.slika,
    noviFrizer: podaci.frizer
  };

  const [usluga, setUsluga] = useState(initialUsluga);

  const slanjeUslugeBazi = async () => {
    try {
      if (!usluga.id) {
        console.error("Document ID not found.");
        return;
      }

      const updatedUsluga = {
        name: usluga.novoIme,
        cena: usluga.novaCena,
        opis: usluga.noviOpis,
        vrstaUsluge: usluga.novaVrstaUsluge,
        trajanje: usluga.novoTrajanje,
        frizer: usluga.noviFrizer,
        slika: usluga.novaSlika,
      };

      await updateDoc(doc(db, "usluge", usluga.id), updatedUsluga);
      console.log("Dokument uspešno ažuriran.");
    } catch (e) {
      console.error("Greška pri ažuriranju dokumenta: ", e);
    }
    history.push("./VrsteUsluga");
  };

  const handleUslugaChange = (event) => {
    const { name, value } = event.target;
    setUsluga((prevUsluga) => ({
      ...prevUsluga,
      [name]: value,
    }));
  };

return(
    <>
      <h1 className="naslov-editusluga">Edit usluge</h1>
      <div className="edit-kontejner">
      <TextField
        value={usluga.novoIme || ""}
        name="novoIme"
        onChange={handleUslugaChange}
        label="Ime"
        variant="outlined"
        className="edit-polja"
      />
      <TextField
        value={usluga.novaCena || ""}
        name="novaCena"
        onChange={handleUslugaChange}
        label="Cena"
        variant="outlined"
        className="edit-polja"
      />
      <TextField
        value={usluga.noviOpis || ""}
        name="noviOpis"
        onChange={handleUslugaChange}
        label="Opis"
        variant="outlined"
        className="edit-polja"
      />
      <TextField
        value={usluga.novoTrajanje || ""}
        name="novoTrajanje"
        onChange={handleUslugaChange}
        label="Trajanje"
        variant="outlined"
        className="edit-polja"
      />
      <TextField
        value={usluga.novaSlika || ""}
        name="novaSlika"
        onChange={handleUslugaChange}
        label="Slika"
        variant="outlined"
        className="edit-polja"
      />
      <Button   variant="contained" onClick={slanjeUslugeBazi}>
        Sačuvaj promene
      </Button>
      </div>
    </>
  );
};

export default Editusluge;