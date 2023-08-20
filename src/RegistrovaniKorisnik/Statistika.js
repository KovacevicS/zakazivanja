import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebaseconfig";
import { Link } from "react-router-dom";
import "./Statistika.css";
import { Select } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";

const Statistika = () => {
  const [myEvents, setMyEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [frizeriList, setFrizeriList] = useState([]);
  const [odabraniFrizer, setOdabraniFrizer] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        let q = collection(db, "zakazivanje");

        if (odabraniFrizer) {
          q = query(q, where("izabraneUsluge.frizer", "==", odabraniFrizer));
        }

        const querySnapshot = await getDocs(q);
        const noviNiz = querySnapshot.docs.map((doc) => {
          let pom = doc.data().izabraneUsluge.usluge;
          let uslugeString = "";
          let ukupnoMinuta = 0;
          Object.keys(pom).forEach((usluga) => {
            if (pom[usluga] !== false) {
              uslugeString = uslugeString + " " + usluga;
              ukupnoMinuta = ukupnoMinuta + Number(pom[usluga]);
            }
          });

          let vreme = doc.data().izabraneUsluge.pocetakTermina.value.split(":");
          let sat = Number(vreme[0]);
          let min = Number(vreme[1]);
          const pocetniDatum = doc.data().izabraneUsluge.datum.toDate();
          pocetniDatum.setHours(sat, min);
          const krajnjiDatum = new Date(pocetniDatum);
          krajnjiDatum.setMinutes(pocetniDatum.getMinutes() + ukupnoMinuta);
          return {
            title: `Korisnik: ${doc.data().imeKorisnika}, telefon: ${
              doc.data().brojKorisnika
            }, narucene usluge ${uslugeString}, frizer ${
              doc.data().izabraneUsluge.frizer
            } `,
            start: pocetniDatum,
            end: krajnjiDatum,
            minuti: ukupnoMinuta,
            id: doc.id,
            imeKorisnika: doc.data().imeKorisnika,
            brojKorisnika: doc.data().brojKorisnika,
            frizer: doc.data().izabraneUsluge.frizer,
            usluge: uslugeString,
          };
        });
        setMyEvents(noviNiz);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      const frizeriQuerySnapshot = await getDocs(collection(db, "frizeri"));
      const frizeriData = frizeriQuerySnapshot.docs.map(
        (doc) => doc.data().frizer.ime
      );
      console.log(frizeriData);
      setFrizeriList(frizeriData);
    }

    fetchData();
  }, [odabraniFrizer]);

  const totalItems = myEvents.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = myEvents.slice(indexOfFirstItem, indexOfLastItem);

  const renderPaginationButtons = () => {
    const pageButtons = [];

    for (let i = 1; i <= totalPages; i++) {
      pageButtons.push(
        <li
          key={i}
          className={`page-item ${currentPage === i ? "active" : ""}`}
        >
          <button className="page-link" onClick={() => setCurrentPage(i)}>
            {i}
          </button>
        </li>
      );
    }

    return pageButtons;
  };

  return (
    <>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={odabraniFrizer}
        label="Frizer"
        onChange={(event) => setOdabraniFrizer(event.target.value)}
      >
        <MenuItem key="all" value="">
          Svi frizeri
        </MenuItem>
        {frizeriList.map((frizerItem) => (
          <MenuItem key={frizerItem} value={frizerItem}>
            {frizerItem}
          </MenuItem>
        ))}
      </Select>

      <div className="calendar">
        <table className="event-table">
          <thead>
            <tr>
              <th>Ime korisnika</th>
              <th>Broj korisnika</th>
              <th>Naručene usluge</th>
              <th>Datum</th>
              <th>Frizer</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => {
              return (
                <tr key={index}>
                  <td>{item.imeKorisnika}</td>
                  <td>{item.brojKorisnika}</td>
                  <td>{item.usluge}</td>
                  <td>{item.start.toLocaleDateString()} {item.start.toLocaleTimeString()}</td>
                  <td>{item.frizer}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <nav>
          <ul className="pagination">{renderPaginationButtons()}</ul>
        </nav>

        <Link to={"/"} className="calendar-link">
          Nazad
        </Link>
      </div>
    </>
  );
};

export default Statistika;