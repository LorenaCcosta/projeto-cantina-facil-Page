import { auth, db } from "../firebase/firebase-config.js";
import {
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const form = document.getElementById("form-login");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();

  try {
    const res = await signInWithEmailAndPassword(auth, email, senha);
    const user = res.user;

    const docRef = doc(db, "admins", user.uid);
    const snap = await getDoc(docRef);

    if (!snap.exists()) {
      alert("Seu usuário não é administrador!");
      return;
    }

    // 🔴 aqui estava "index.html", mas sua home é "adm.html"
    window.location.href = "adm.html";
  } catch (error) {
    alert("Email ou senha inválidos.");
    console.error(error);
  }
});
