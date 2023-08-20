import { useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import "./Podacikorisnika.css";
import Button from '@mui/material/Button';

const Podacikorisnika = () => {
  const history = useHistory();
  const location = useLocation();
  const izabraneUsluge = location.state;

  const [imeKorisnika, setImeKorisnika] = useState("");
  const [brojKorisnika, setBrojKorisnika] = useState("");

  const slanjekorisnika = () => {
    // Nema potrebe za 'onClick' atributom u 'Link' komponenti, koristite 'to' prop za rutiranje
    history.push('/Detaljitermina', { izabraneUsluge, imeKorisnika, brojKorisnika });
  };

  const imeKorisnikaHandler = (event) => {
    setImeKorisnika(event.target.value);
  };

  const brojKorisnikaHandler = (event) => {
    setBrojKorisnika(event.target.value);
  };

  return (
    <>
      <div className="conteiner3">
        <p className="tekst3">Ostavite nam Vaše kontakt podatke kako bismo potvrdili rezervaciju.</p>
      </div>
      <div className="conteiner1">
        <div className="text-input-container">
          <p className="text1">Ime:</p>
          <input
            className="input1"
            type="text"
            value={imeKorisnika}
            onChange={imeKorisnikaHandler}
          />
        </div>
        <div className="text-input-container">
          <p className="text2">Broj telefona:</p>
          <input
            className="input2"
            type="number"
            value={brojKorisnika}
            onChange={brojKorisnikaHandler}
          />
        </div>
      </div>

      {imeKorisnika !== "" && brojKorisnika !== "" && (
        <Button className="zavrsite" onClick={slanjekorisnika} >Dalje</Button>
      )}
    </>
  );
};

export default Podacikorisnika;