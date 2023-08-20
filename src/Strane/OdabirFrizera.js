import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Button from '@mui/material/Button';
import './Odabirfrizera.css';
import { db } from "../firebase/firebaseconfig";
import { collection, getDocs, deleteDoc, doc, query} from "firebase/firestore";
import Modal from "react-bootstrap/Modal";

const OdabriFrizera = ({ isLoggedIn }) => {
  const history = useHistory();
  const [frizer, setFrizer] = useState(null); // Change 'false' to 'null'
  const [fbFrizer, setFbFrizer] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

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

  const izabranFrizerHandler = (event) => {
    setFrizer(event.target.checked ? event.target.name : null); // Change 'false' to 'null'
  };

  const daljeHandler = () => {
    history.push('/VrsteUsluga', frizer);
  }

  const handleEdit = (frizer) => {
    history.push("/Editfrizera", frizer);
  };

  const handleDeleting = async () => {
    if (eventToDelete) {
      await deleteDoc(doc(db, "frizeri", eventToDelete.id));
      const updatedEvents = fbFrizer.filter((ev) => ev.id !== eventToDelete.id);
      setFbFrizer(updatedEvents);
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

  return (
    <>
      {isLoggedIn && <Button variant="contained" onClick={() => { history.push("/Novifrizer"); }}>dodaj frizera</Button>}
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
              {isLoggedIn && <Button onClick={() => handleEdit(item)} variant="contained">Edit</Button>}
              {isLoggedIn && <Button onClick={() => rejectEvent(item)} variant="contained">Delete</Button>}
            </div>
          </div>
        );
      })}

      <Button variant="contained" onClick={daljeHandler}>
        Dalje
      </Button>
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
    </>
  );
};

export default OdabriFrizera;
