import React, { useState,  } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import classes from './Login.module.css';

const firebaseConfig = {
  apiKey: "AIzaSyDk7MunqMYkv4jpextJY32b45VgB1kBWEc",
  authDomain: "zakazivanje-e992f.firebaseapp.com",
  databaseURL: "https://zakazivanje-e992f-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "zakazivanje-e992f",
  storageBucket: "zakazivanje-e992f.appspot.com",
  messagingSenderId: "235527631755",
  appId: "1:235527631755:web:cfbebee33c5c18f911358e",
  measurementId: "G-0NNXQ1DCV5"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const Login = ({ handleLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); // Dodali smo promenljivu za praćenje greške

  const onLogin = (e) => {
    e.preventDefault();
    setError(null); // Resetujemo prethodnu grešku prilikom novog pokušaja prijave

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('Ulogovan korisnik:', user);
        handleLogin();
        // Čuvanje informacija o prijavljenom korisniku u lokalno skladište
        localStorage.setItem('user', JSON.stringify(user));
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log('Greška pri prijavi:', errorCode, errorMessage);
        setError(errorMessage); // Postavljamo grešku za prikaz u ErrorModal-u
      });
  };

  return (
    <>
      <main>
        <section className={classes.login}>
          <div>
            <p>Uloguj se</p>
            <form>
              <div>
                <label htmlFor="email-address">Email adresa</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  required
                  placeholder="Email adresa"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="password">Lozinka</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Lozinka"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div>
                <button onClick={onLogin}>Prijavi se</button>
              </div>
            </form>
          </div>
        </section>
      </main>

      {/* Prikaz ErrorModal-a ako postoji greška */}
      {error && (
        <div className="modal">
          <div className="modal-content">
            <p className="modal-question">
              {error.includes('password')
                ? 'Greška u šifri.'
                : 'Pogrešna email adresa ili šifra.'}
            </p>
            <button className="modal-button modal-button-delete" onClick={() => setError(null)}>
              Zatvori
            </button>
          </div>
        </div>
      )}
    </>
  );
};
export default Login