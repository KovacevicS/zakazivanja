import React, { useState } from "react";
import { Select, MenuItem, Button } from "@mui/material";
import { TextField } from "@mui/material";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseconfig";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import "./NoviFrizer.css";

const Novifrizer = () => {
  const history = useHistory();
  const [ime, setIme] = useState("");
  const [pocetak, setPocetak] = useState("");
  const [kraj, setKraj] = useState("");

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

  const slanjeFrizeraBazi = async (event) => {
    try {
      const docRef = await addDoc(collection(db, "frizeri"), {
        frizer: {
          'ime': ime,
          'pocetak radnog vremena':pocetak,
          'kraj radnog vremena':kraj,
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
  const pocetakHandler = (event) => {
    setPocetak(event.target.value);
  };
  const krajHandler = (event) => {
    setKraj(event.target.value);
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
        <Button variant="contained" onClick={slanjeFrizeraBazi}>
          Dodaj
        </Button>
      </div>
    </>
  );
};

export default Novifrizer;