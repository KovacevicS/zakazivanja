import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import "./VrsteUsluga.css";
import Button from "@mui/material/Button";
import { db } from "../firebase/firebaseconfig";
import Modal from "react-bootstrap/Modal";
import "../RegistrovaniKorisnik/ErrorModal.css";
import { collection, getDocs, deleteDoc, doc, query} from "firebase/firestore";

const VrsteUsluga = ({ isLoggedIn }) => {
  const history = useHistory();
  const location = useLocation();
  const frizer = location.state;
  console.log(frizer)
  const [fbUsluge, setFbUsluge] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [usluge, setUsluge] = useState({});

  useEffect(() => {
    async function fetchData() {
      const q = query(collection(db, "usluge"));

      const querySnapshot = await getDocs(q);
      let uslugesafirenbase = [];
      querySnapshot.forEach((doc) => {
        let obj = { ...doc.data(), id: doc.id };
        uslugesafirenbase.push(obj);
        console.log(obj);
      });

      setFbUsluge(uslugesafirenbase);
    }
    fetchData();
  }, [frizer]);

  const isButtonDisabled = () => {
    return Object.values(usluge).every((item) => item === undefined);
  };

  const slanjeuslugebaziHandler = async (event) => {
    history.push("/Zakazitermin", { usluge, frizer });
    event.preventDefault();
    if (!Object.values(usluge).some((item) => item !== undefined)) {
      return;
    }
  };

  const handleEdit = (selectedUsluga) => {
    history.push("/Editusluge", selectedUsluga);
  };

  const handleDeleting = async () => {
    if (eventToDelete) {
      await deleteDoc(doc(db, "usluge", eventToDelete.id));
      const updatedEvents = fbUsluge.filter((ev) => ev.id !== eventToDelete.id);
      setFbUsluge(updatedEvents);
    }
    setShowModal(false);
    setEventToDelete(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEventToDelete(null);
  };

  const handleConfirmDelete = () => {
    handleDeleting();
  };

  const rejectEvent = (item) => {
    console.log(item);
    setEventToDelete(item);
    setShowModal(true);
  };

  const izabraneUslugeHandler = (event) => {
    const { name, checked, value } = event.target;

    if (checked) {
      setUsluge((prevUsluge) => ({
        ...prevUsluge,
        [name]: value,
      }));
    } else {
      setUsluge((prevUsluge) => ({
        ...prevUsluge,
        [name]: undefined,
      }));
    }
  };

  return (
    <div>
      <div className="uslugecentar">
        <div className="usluge">Usluge:</div>
      </div>
      <div className="pazljivocentar">
        <div className="pazljivo">
          Pažljivo pročitajte opis usluga pre odabira i prelaska na naredni
          korak. Možete izabrati jednu ili više usluga.
        </div>
      </div>
      {isLoggedIn && (
        <Button variant="contained" onClick={() => history.push("/Novausluga")}>
          dodaj uslugu
        </Button>
      )}
      <div className="centriranje">
        
      {fbUsluge
      .filter((item) => item.frizer === frizer) 
      .map((item) => {
       

          return (
            <div className="service-card" key={item.id}>
              <div className="card-text">
                <h3>{item.name}</h3>
                <p>{item.cena} rsd</p>
                <p>{item.opis}</p>
                <p>{item.vrsteUsluga}</p>
                <p>{item.trajanje} min</p>
                <label className="oznaci">
                  Oznaci{" "}
                  <input
                    type="checkbox"
                    name={item.ime}
                    id={item.id}
                    value={item.trajanje}
                    onChange={izabraneUslugeHandler}
                    checked={usluge[item.vrsteUsluga]}
                  />
                </label>
              </div>
              <img src={item.slika} alt="slika5  " className="slika1" />
              {isLoggedIn && (
                <Button onClick={() => handleEdit(item)} variant="contained"
                className="logged-in-button">
                  Edit
                </Button>
              )}
              {isLoggedIn && (
                <Button onClick={() => rejectEvent(item)} variant="contained"
                className="logged-in-button">
                  Delete
                </Button>
              )}
            </div>
          );
        })}
      </div>
      <div className="kraj">
        <button
          className="zakazitermin"
          onClick={slanjeuslugebaziHandler}
          disabled={isButtonDisabled()}
        >
          Zakazi termin
        </button>
      </div>
      <Modal show={showModal} onHide={handleCloseModal} className="modal">
        <Modal.Header closeButton>
          <Modal.Title>Upozorenje</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-question">
          Da li ste sigurni da želite da obrišete projekat?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleCloseModal}
            className="modal-button modal-button-cancel"
          >
            Otkaži
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirmDelete}
            className="modal-button modal-button-delete"
          >
            Obriši
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default VrsteUsluga;