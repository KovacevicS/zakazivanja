import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyDk7MunqMYkv4jpextJY32b45VgB1kBWEc",
    authDomain: "zakazivanje-e992f.firebaseapp.com",
    databaseURL:
      "https://zakazivanje-e992f-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "zakazivanje-e992f",
    storageBucket: "zakazivanje-e992f.appspot.com",
    messagingSenderId: "235527631755",
    appId: "1:235527631755:web:cfbebee33c5c18f911358e",
    measurementId: "G-0NNXQ1DCV5",
  };
  const app = initializeApp(firebaseConfig);
  
  // Initialize Firestore and get a reference to the service
  const db = getFirestore(app);


  export { db };