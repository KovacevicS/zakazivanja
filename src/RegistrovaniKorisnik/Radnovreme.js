import React, { useState, useEffect } from "react";
import { Select, MenuItem, Button } from "@mui/material";
import { db } from "../firebase/firebaseconfig";
import { getDocs, collection, query, where, doc ,updateDoc } from "firebase/firestore";

const RadnoVreme = () => {
    const [frizer, setFrizer] = useState("");
    const [pocetakRadnogVremena, setPocetakRadnogVremena] = useState("");
    const [krajRadnogVremena, setKrajRadnogVremena] = useState("");
    const [frizeriList, setFrizeriList] = useState([]);

  useEffect(() => {
    async function fetchFrizeri() {
      try {
        const frizeriQuerySnapshot = await getDocs(collection(db, "frizeri"));
        const frizeriData = frizeriQuerySnapshot.docs.map((doc) => doc.data().frizer.ime);
        setFrizeriList(frizeriData);
      } catch (error) {
        console.error("Greška prilikom dohvaćanja frizera:", error);
      }
    }
  
    fetchFrizeri();
  }, []);

  const handleFrizerChange = (event) => {
    setFrizer(event.target.value);
    // Resetirajte vremena kad se promijeni frizer
    setPocetakRadnogVremena("");
    setKrajRadnogVremena("");
  };

  const handlePocetakRadnogVremenaChange = (event) => {
    setPocetakRadnogVremena(event.target.value);
  };

  const handleKrajRadnogVremenaChange = (event) => {
    setKrajRadnogVremena(event.target.value);
  };

  const handleSpremiRadnoVreme = async () => {
    try {
      if (!frizer || !pocetakRadnogVremena || !krajRadnogVremena) {
        console.log("Molimo popunite sve podatke");
        return;
      }

      // Ovdje dobavljate dokument frizera iz baze prema odabranom imenu frizera
      const frizerQuerySnapshot = await getDocs(
        query(collection(db, "frizeri"), where("frizer.ime", "==", frizer))
      );
      if (frizerQuerySnapshot.docs.length === 0) {
        console.log("Frizer nije pronađen u bazi");
        return;
      }

      const frizerDoc = frizerQuerySnapshot.docs[0];
      const frizerId = frizerDoc.id;

      // Ovdje ažurirate dokument frizera s novim vremenima radnog vremena
      await updateDoc(doc(db, "frizeri", frizerId), {
        "frizer.pocetakRadnogVremena": pocetakRadnogVremena,
        "frizer.krajRadnogVremena": krajRadnogVremena,
      });

      console.log("Radno vreme uspješno ažurirano");

      // Resetiranje polja nakon ažuriranja
      setPocetakRadnogVremena("");
      setKrajRadnogVremena("");
    } catch (error) {
      console.error("Greška prilikom ažuriranja radnog vremena:", error);
    }
  };

  return (
    <div>
      <h2>Radno Vreme</h2>
      <Select
  labelId="frizer-label"
  id="frizer-select"
  value={frizer}
  label="Frizer"
  onChange={handleFrizerChange}
>
 
  {frizeriList.map((frizerItem) => (
    <MenuItem key={frizerItem} value={frizerItem}>
      {frizerItem}
    </MenuItem>
  ))}
</Select>
      {frizer ? (
        <div>
          <Select
            labelId="pocetak-label"
            id="pocetak-select"
            value={pocetakRadnogVremena}
            label="Početak radnog vremena"
            onChange={handlePocetakRadnogVremenaChange}
          >
            {/* Ovdje mapirate opcije za početak radnog vremena */}
          </Select>
          <Select
            labelId="kraj-label"
            id="kraj-select"
            value={krajRadnogVremena}
            label="Kraj radnog vremena"
            onChange={handleKrajRadnogVremenaChange}
          >
            {/* Ovdje mapirate opcije za kraj radnog vremena */}
          </Select>
          <Button variant="contained" onClick={handleSpremiRadnoVreme}>
            Spremi radno vreme
          </Button>
        </div>
      ) : (
        <Button variant="contained">Napravi radno vreme</Button>
      )}
    </div>
  );
};

export default RadnoVreme;
