import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseconfig";
import './Novausluga.css'
import { Select, MenuItem } from "@mui/material";

const  Novausluga = ()=>{
  const history = useHistory()
    const [uslugaList, setUslugaList]= useState([])
    const [name, setName]=useState()
    const [cena, setCena]=useState()
    const [opis, setOpis]=useState()
    const [trajanje, setTrajanje]=useState()
    const [vrtsaUsluge, setVrstaUsluge] = useState("")
    const [frizeriList, setFrizeriList] = useState([]);
  const [frizer, setFrizer] = useState([]);
    const [slika, setSlika]=useState()

    useEffect(() => {
      async function fetchData() {
        try {
          const frizeriQuerySnapshot = await getDocs(collection(db, "frizeri"));
          const frizeriData = frizeriQuerySnapshot.docs.map((doc) => doc.data().frizer.ime);
          console.log(frizeriData)
          setFrizeriList(frizeriData);
          const uslugeQuerySnapshot = await getDocs(collection(db, "usluge"));
          const uslugaData = uslugeQuerySnapshot.docs.map((doc) => doc.data().vrstaUsluge);
          
          // Remove duplicates from the uslugaData array
          const uniqueUslugaData = [...new Set(uslugaData)];
          
          console.log(uniqueUslugaData);
          setUslugaList(uniqueUslugaData);
  
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
  
      fetchData();
    }, [frizer]);

    const slanjeUslugeBazi = async (event) => {
        try {
          const docRef = await addDoc(collection(db, "usluge"), {
            name,
            cena,
            opis,
            trajanje,
            vrtsaUsluge,
            slika, 
            frizer

          });
          console.log("Document written with ID: ", docRef.id);
        } catch (e) {
          console.error("Error adding document: ", e);
        }
        history.push('/VrsteUsluga')

      };
      
    

    const nameHandler = (event) => {
        setName(event.target.value)
    }
    const cenaHandler =(event) => {
        setCena(event.target.value)
    }
    const opisHandler = (event) => {
        setOpis(event.target.value)
    }
    const trajanjeHandler = (event) => {
        setTrajanje(event.target.value)
    }
    const vrstaUslugeHandler = (event) =>{
      setVrstaUsluge(event.target.value)
    }
    
    const slikaHandler = (event) => {
        setSlika(event.target.value)
    }

    return (
        <>  
        <h1 className="naslov-novausluga">Nova usluga</h1>
        <div className="input-kontejner">
        <TextField value={name} onChange={nameHandler} label="Ime usluge" variant="outlined" className="input-polja"/>    
        <TextField value={cena} onChange={cenaHandler} label="Cena usluge" variant="outlined" className="input-polja"/> 
        <TextField value={trajanje} onChange={trajanjeHandler} label="Trajanje usluge" variant="outlined" className="input-polja"/> 
        <TextField value={opis} onChange={opisHandler} label="Opis usluge" variant="outlined" className="input-polja"/> 
        <TextField value={slika} onChange={slikaHandler} label="Slika usluge" variant="outlined" className="input-polja"/> 
        <TextField value={vrtsaUsluge} onChange={vrstaUslugeHandler} label="Vrsta usluge" variant="outlined" className="input-polja"/>
        <Select
  labelId="demo-simple-select-label"
  id="demo-simple-select-vrsta"
  value={vrtsaUsluge}
  label="Vrsta usluge"
  onChange={(event) => setVrstaUsluge(event.target.value)}
>
        {uslugaList.map((uslugeItem) => (
          <MenuItem key={uslugeItem} value={uslugeItem}>
            {uslugeItem}
          </MenuItem>
        ))}
      </Select>
        <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={frizer}
        label="Frizer"
        onChange={(event) => setFrizer(event.target.value)}
      >
      {frizeriList.map((frizerItem) => (
        <MenuItem key={frizerItem} value={frizerItem}>
          {frizerItem}
        </MenuItem>
      ))}
    </Select>
        <Button variant="contained" onClick={slanjeUslugeBazi}>Dodaj</Button>
        </div>
        
        </>
)
}

export default Novausluga