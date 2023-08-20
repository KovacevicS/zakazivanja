import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Calendar from "react-calendar";
import Slider from "@mui/material/Slider";
import styles from "./Pauza.module.css";

import { pocetneOpcije } from "../Strane/Pocetneopcije";
import { db } from "../firebase/firebaseconfig";
import { collection, getDocs, query, addDoc } from "firebase/firestore";




const Pauza = (onPostavi, mojDatum) => {
  const history = useHistory()
  const [datum, setDatum] = useState([]);
  const [pocetakTermina, setpocetakTermina] = useState("");
  const [sliderValue, setSliderValue] = useState(30);
  const [pauzaCitavDan, setPauzaCitavDan] = useState(false);
  const [frizer, setFrizer] = useState(null); // Change 'false' to 'null'
  const [fbFrizer, setFbFrizer] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const q = query(
        collection(db, "frizeri"),
      );
      const querySnapshot = await getDocs(q)
      let frizerisafirebasesa = [];
      querySnapshot.forEach((doc) => {
        let obj = { ...doc.data(), id: doc.id };
        frizerisafirebasesa.push(obj);
        console.log(obj);
      })

      setFbFrizer(frizerisafirebasesa);
    }
    fetchData();
  }, [])
  
  const slanjePauzeBazi = async (event) => {
    try {
      const docRef = await addDoc(collection(db, "zakazivanje"), {
        imeKorisnika: "pauza",
        brojKorisnika: "01234567",
        izabraneUsluge: {'datum':datum,'frizer':frizer ,pocetakTermina , usluge: { 'pauza': sliderValue }},
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    history.push('/loginovan')
  };

  const izabranFrizerHandler = (event) => {
    setFrizer(event.target.checked ? event.target.name : null); // Change 'false' to 'null'
  };
  
 
  const handlePauzaCitavDan = () => {
    setPauzaCitavDan(!pauzaCitavDan)
    setSliderValue(615)
    setpocetakTermina({
      value: "09:00",
      label: "09:00",
      vreme: new Date(0, 0, 0, 9, 0),
      slobodan: true,
    })
  };

  const handleDateChange = (date) => {
    setDatum(date);
    console.log("Izabrani dan/dani:", date);
    setSliderValue(30)
    setPauzaCitavDan(false)
  };

  const handleHourChange = (event) => {
    setpocetakTermina(event.target.value);
   
  };
  

  const handleSliderChange = (event, value) => {
    setSliderValue(value);
  };
  const renderSelectedDates = () => {
    if (datum.length === 0) {
      return <p>Nije izabran nijedan datum.</p>;
    }

    return (
      <p>
        Izabrani datumi:
        {datum.toLocaleDateString()}
      </p>
    );
  };

  return (
    <>
    {fbFrizer.map((item) => {
       

      return (
        <div className="kartica-container" key={item.id}>
          <div className="kartica">
            <p>{item.frizer.ime}</p>
            <input
              type="checkbox"
              checked={frizer === item.frizer.ime} // Change 'item.ime' to 'item.frizer.ime'
              name={item.frizer.ime} // Change 'item.ime' to 'item.frizer.ime'
              onChange={izabranFrizerHandler}
            />
            
          </div>
        </div>
      );
    })}
    
    <div className={styles["pauza-container"]}>
     
        <div>
          <Calendar
            selectRange={false}
            value={datum[0]}
            onChange={handleDateChange}
          />
        </div>
      

      {renderSelectedDates()}

      
        <div className={styles["slider-container"]}>
          <Slider
            aria-label="Temperature"
            defaultValue={sliderValue}
            value={sliderValue}
            onChange={handleSliderChange}
            step={15}
            marks
            min={15}
            max={615}
          />
          <p className={styles["slider-value"]}>{sliderValue}</p>
        </div>
        <div className={styles["pauza-checkboxes"]}>
        <div>
          <label>
            <input
              type="checkbox"
              checked={pauzaCitavDan}
              onChange={handlePauzaCitavDan}
            />
            Pauza ceo dan
          </label>
        </div>
      </div>
     

      <div className={styles["pauza-time-inputs"]}>
        <div>
          <label htmlFor="hour">Hour:</label>
          <div id="hour" onChange={handleHourChange} value={pocetakTermina} type="number">
            <Select
              value={pocetakTermina}
              onChange={setpocetakTermina}
              options={pocetneOpcije}
              className={styles["Select__control"]} // Dodavanje klase za stilizaciju Select komponente
              classNamePrefix="Select"
            />
          </div>
        </div>
      </div>

      <button className={styles["button"]} onClick={slanjePauzeBazi}>
        Zakaži pauzu
      </button>
    </div>
    </>
  );
};

export default Pauza;