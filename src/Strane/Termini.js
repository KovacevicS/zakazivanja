import { useState, useEffect } from "react";
import "react-calendar/dist/Calendar.css";
import { useLocation, useHistory } from "react-router-dom";
import "./Termini.css";
import { cloneDeep } from "lodash";
import { collection, query, where, getDocs } from "firebase/firestore";
import { pocetneOpcije, pocetneOpcijeSubtom } from "./Pocetneopcije"; 
import MyCalendar from "./Kalendar";
import { db } from "../firebase/firebaseconfig";

const Termini = () => {
  const history = useHistory();
  const location = useLocation();
  const uslugeifrizer = location.state;
  const { usluge, frizer } = uslugeifrizer;

  const [pocetakTermina, setPocetkaTermina] = useState(null);
  const [datum, setDatum] = useState(new Date());
  const [naseOpcije, setNaseOpcije] = useState([]);

  useEffect(() => {
    async function fetchData() {}
    fetchData();
  }, []);

  const slanjeterminabazi = async (event) => {
    history.push("./Podacikorisnika", { pocetakTermina, datum, usluge, frizer });
  };

  async function postaviDatum(event) {
    setDatum(event);
    let lokalneOpcije = cloneDeep(event.getDay() === 6 ? pocetneOpcijeSubtom : pocetneOpcije);

    //datum koji nam je dao kalendar
    let date = new Date(
      event.getYear() + 1900,
      event.getMonth(),
      event.getDate()
    );
    //upit ka firestoru da nam da usluge za izabrani datum
    const q = query(
      collection(db, "zakazivanje"),
      where("izabraneUsluge.datum", "==", date),  
      where("izabraneUsluge.frizer", "==", frizer)
    );

    //u querysnapshot ce se naci izabrane usluge za taj datum
    const querySnapshot = await getDocs(q);
    // Resetiranje svih opcija na dostupne
    
    lokalneOpcije.forEach((opcija) => {
      opcija.slobodan = true;
      
    });
    //BLOKIRANJE TERMINA SPRAM VEC ZAKAZANIH TERMINA KOJI SU SNIMLJENI U FIRESTORE-u
    querySnapshot.forEach((doc) => {
      let nasObjekat = doc.data();

      // doc.data() is never undefined for query doc snapshots
      //pom je npr {brijanjeGlave:false, decije:30,...}
      let pom = nasObjekat.izabraneUsluge.usluge;
      console.log(pom)
      let ukupnoMinuta = 0;
      //prolazimo kroz pom objekat i racunamo koliko nam minuta traju ukupno sve usluge
      Object.keys(pom).forEach((item) => {
        if (pom[item] !== false) {
          ukupnoMinuta = ukupnoMinuta + Number(pom[item]);
        console.log( ukupnoMinuta = ukupnoMinuta + Number(pom[item]))
        }
        console.log(pom)
      });
      
      //u pocetak termina se nalazi inforamcija o satnici u obliku "09:15"
      let pocetakTermina = nasObjekat.izabraneUsluge.pocetakTermina.value;

      //string se deli na niz  i ovaj satMinut=["09" , "15"]
      let satMinut = pocetakTermina.split(":");
      let sat = +satMinut[0];
      let minuti = +satMinut[1];
      let pocetniDatum = new Date(0, 0, 0, sat, minuti);
      let krajnjiDatum = new Date(0, 0, 0, sat, minuti + ukupnoMinuta);

      // od lokalnih opcija ostavimo samo one koje manje od pocetnnog datuma ili vece ili jedanke od krajnjeg datuma
      let pomNiz = lokalneOpcije.map((item) => {
        if (item.vreme >= pocetniDatum && item.vreme < krajnjiDatum) {
          item.slobodan = false;
        }
        return item;
      });
    

      lokalneOpcije = cloneDeep(pomNiz);
    });
    
    //BLOKIRANJE TERMINA SPRAM TRENUTNO SELEKTOVANE USLUGE OD STRANE KORISNIKA

    let trajanjeMojeUsluge = 0;
    Object.keys(usluge).forEach((item) => {
      if (usluge[item] !== false) {
        trajanjeMojeUsluge = trajanjeMojeUsluge + Number(usluge[item]);
      }
    });
    console.log(trajanjeMojeUsluge)
    let brojKoraka = Math.ceil(trajanjeMojeUsluge / 15);
  
    let nasNiz = cloneDeep(lokalneOpcije);
    nasNiz.forEach((opcija, indeks) => {
      let ostaje = true;
      for (let i = indeks; i < indeks + brojKoraka; i++) {
        if (nasNiz[i] === undefined || nasNiz[i].slobodan === false) {
          ostaje = false;
        }
      }
      opcija.slobodan = ostaje;
    });
    console.log(lokalneOpcije);
    setNaseOpcije(nasNiz.filter((opcija) => opcija.slobodan === true));
  }

console.log(pocetakTermina)
console.log(datum)
return (
  <>
    <div className="big-container">
      <div className="small-container">
        <p className="terminitekst">Termini:</p>
        <MyCalendar onPostavi={postaviDatum} mojDatum={datum} className="calendar" locale="en-EN" />
        <button
          className="link"
          to="/Podacikorisnika"
          onClick={slanjeterminabazi}
          disabled={pocetakTermina === null}
        >
          Dalje
        </button>
      </div>
      <div className="small-container">
        <div className="buttons-container">
          {naseOpcije.length === 0 && <p>Nema slobodnih termina</p>}
          {naseOpcije.map((item, index) => (
            <div className="flex-item" key={index}>
              <hr className="linija"></hr>
              <button className="button-option" onClick={() => setPocetkaTermina(item)}>
                {item.label}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  </>
);
};

export default Termini;