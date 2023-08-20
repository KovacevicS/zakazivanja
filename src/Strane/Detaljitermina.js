import React from "react";
import Button from "@mui/material/Button";
import { useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { db } from "../firebase/firebaseconfig";
import { collection, addDoc } from "firebase/firestore";

const Detaljitermina = () => {
 
  const history = useHistory();
  const location = useLocation();
  const podaci = location.state;
const { izabraneUsluge, imeKorisnika, brojKorisnika } = podaci;
  console.log(podaci)

  const handleZakazi = async (event) => {
    history.push('/PocetnaStrana')
    try
    { const docRef = await addDoc
      (collection
        (db, "zakazivanje"), 
      {
        izabraneUsluge, imeKorisnika, brojKorisnika
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};
    
   
    
 

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Frizer</th>
            <th>Usluge</th>
            <th>Početak termina</th>
            <th>Datum</th>
          </tr>
        </thead>
      {/*   <tbody>
          <tr>
            <td>{frizer}</td>
            <td>{JSON.stringify(usluge)}</td>
            <td>{pocetakTermina}</td>
            <td>{datum}</td>
          </tr>
        </tbody> */}
      </table>
      <Button variant="contained" onClick={handleZakazi}>
       Kraj
      </Button>
    </div>
  );
};

export default Detaljitermina;