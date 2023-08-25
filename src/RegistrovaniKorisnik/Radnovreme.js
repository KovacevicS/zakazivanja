import React, { useState, useEffect } from "react";
import { Select, MenuItem, Button } from "@mui/material";
import { db } from "../firebase/firebaseconfig";
import { getDocs, collection, query, where, doc ,updateDoc } from "firebase/firestore";

const RadnoVreme = () => {
    const [frizer, setFrizer] = useState("");
    const [pocetak, setPocetak] = useState("");
    const [kraj, setKraj] = useState("");
    const [frizeriList, setFrizeriList] = useState([]);

    const generateTimeOptions = (startHour, endHour, step) => {
      const options = [];
      for (let hour = startHour; hour <= endHour; hour++) {
        for (let minute = 0; minute < 60; minute += step) {
          options.push(`${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`);
        }
      }
      return options;
    };
  
    const timeOptionsPocetak = generateTimeOptions(9, 17, 15);
    const timeOptionsKraj = generateTimeOptions(12, 18, 15);

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

 


  const handleSpremiRadnoVreme = async () => {
    try {
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
        "frizer.pocetakRadnogVremena": pocetak,
        "frizer.krajRadnogVremena": kraj,
      });

      console.log("Radno vreme uspješno ažurirano");

      // Resetiranje polja nakon ažuriranja
      setPocetak("");
      setKraj("");
    } catch (error) {
      console.error("Greška prilikom ažuriranja radnog vremena:", error);
    }
  };
  const pocetakHandler = (event) => {
    setPocetak(event.target.value);
  };
  const krajHandler = (event) => {
    setKraj(event.target.value);
  };
  const handleFrizerChange = (event) => {
    setFrizer(event.target.value);
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
          value={pocetak}
          onChange={pocetakHandler}
          label="Pocetak radnog vremena"
          variant="outlined"
          className="novi-frizer-input"
        >
          {timeOptionsPocetak.map((time) => (
            <MenuItem key={time} value={time}
            label="Pocetak radnog vremena">
              {time}
            </MenuItem>
          ))}
        </Select>
        <Select
          value={kraj}
          onChange={krajHandler}
          label="Kraj radnog vremena"
          variant="outlined"
          className="novi-frizer-input"
        >
          {timeOptionsKraj.map((time) => (
            <MenuItem key={time} value={time}
            label="Kraj radnog vremena">
              {time}
            </MenuItem>
          ))}
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
