import { Calendar as MyCalendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, query, where } from "firebase/firestore";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import MenuItem from "@mui/material/MenuItem";
import { Select } from "@mui/material";
import { db } from "../firebase/firebaseconfig";
import "./Registrovanikorisnik.css";

const localizer = momentLocalizer(moment);

const Registrovanikorisnik = () => {
  const [myEvents, setMyEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [frizeriList, setFrizeriList] = useState([]);
  const [frizer, setFrizer] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const frizeriQuerySnapshot = await getDocs(collection(db, "frizeri"));
        const frizeriData = frizeriQuerySnapshot.docs.map((doc) => doc.data().frizer.ime);
        console.log(frizeriData)
        setFrizeriList(frizeriData);

        const currentDate = new Date();
        const nextPeriod = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          currentDate.getDate()
        );

        let q = collection(db, "zakazivanje");
        if (frizer.length > 0) {
          q = query(q, where("izabraneUsluge.frizer", "==", frizer));
        }

        q = query(q, where("izabraneUsluge.datum", ">=", currentDate), 
        where("izabraneUsluge.datum", "<", nextPeriod));

        const querySnapshot = await getDocs(q);
        const pocetniNiz = [];
        querySnapshot.forEach((doc) => {
          let obj = { ...doc.data(), id: doc.id };
          pocetniNiz.push(obj);
        });
        const noviNiz = pocetniNiz.map((item) => {
          //usluge
          let pom = item.izabraneUsluge.usluge;
          let uslugeString = "";
          let ukupnoMinuta = 0;
          Object.keys(pom).forEach((item) => {
            if (pom[item] !== false) {
              uslugeString = uslugeString + " " + item;
              ukupnoMinuta = ukupnoMinuta + Number(pom[item]);
            }
          });
          let vreme = item.izabraneUsluge.pocetakTermina.value.split(":");
          let sat = Number(vreme[0]);
          let min = Number(vreme[1]);
          const pocetniDatum = item.izabraneUsluge.datum.toDate();
          pocetniDatum.setHours(sat, min);
          const krajnjiDatum = new Date(pocetniDatum);
          krajnjiDatum.setMinutes(pocetniDatum.getMinutes() + ukupnoMinuta);
          let obj = {
            title: `Korisnik: ${item.imeKorisnika}, telefon: ${item.brojKorisnika}, narucene usluge ${uslugeString}, frizer ${item.izabraneUsluge.frizer} `,
            start: pocetniDatum,
            end: krajnjiDatum,
            minuti: ukupnoMinuta,
            id: item.id,
          };
          //datum
          return obj;
        });
        setMyEvents(noviNiz);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [frizer]);

  const handleSelect = ({ start, end }) => {
    setShowModal(true);
  };

  const handleDeleting = async () => {
    if (eventToDelete) {
      await deleteDoc(doc(db, "zakazivanje", eventToDelete.id));
      const updatedEvents = myEvents.filter((ev) => ev.id !== eventToDelete.id);
      setMyEvents(updatedEvents);
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

  const rejectEvent = (event) => {
    console.log(event);
    setEventToDelete(event);
    setShowModal(true);
  };

  const EventComponent = ({ event }) => {
    return (
      <div>
        <strong>{event.title}</strong>
        <button className="calendar-button" onClick={() => rejectEvent(event)}>
          Obriši
        </button>
      </div>
    );
  };

  return (
    <div className="bigcalendar">
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={frizer}
        label="Frizer"
        onChange={(event) => setFrizer(event.target.value)}
      >
        <MenuItem key="all" value="">Svi frizeri</MenuItem>
        {frizeriList.map((frizerItem) => (
          <MenuItem key={frizerItem} value={frizerItem}>
            {frizerItem}
          </MenuItem>
        ))}
      </Select>

      <MyCalendar
      localizer={localizer}
      defaultDate={new Date()}
      events={myEvents}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 500 }}
      //onSelectEvent={rejectEvent}
      onSelectSlot={handleSelect}
      components={{
        event: EventComponent,
      }}
    />

      <Modal show={showModal} onHide={handleCloseModal} className="modal">
        <Modal.Header closeButton>
          <Modal.Title>Upozorenje</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-question">Da li ste sigurni da želite da obrišete zakazan termin?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal} className="modal-button modal-button-cancel">
            Otkaži
          </Button>
          <Button variant="primary" onClick={handleConfirmDelete} className="modal-button modal-button-delete">
            Obriši
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Registrovanikorisnik;