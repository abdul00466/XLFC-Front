import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator, createUserWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCjG4zCetIbppB0g4jF2tm4KO0SSkz8t_4",
  authDomain: "xlfc-e8f8f.firebaseapp.com",
  projectId: "xlfc-e8f8f",
  storageBucket: "xlfc-e8f8f.appspot.com",
  messagingSenderId: "873926025846",
  appId: "1:873926025846:ios:aae1ebb2d3f88a96223557",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and connect to the emulator
const auth = getAuth(app);
if (process.env.NODE_ENV === "development") {
  connectAuthEmulator(auth, "http://localhost:9099");
}

export { auth };
