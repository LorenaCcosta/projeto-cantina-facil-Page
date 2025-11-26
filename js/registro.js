import { auth, db } from "../firebase/firebase-config.js";
import {
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  setDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const form = document.getElementById("form-registro");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();
  const confirmar = document.getElementById("confirmar").value.trim();

  if (senha !== confirmar) {
    alert("As senhas não coincidem!");
    return;
  }

  try {
    const res = await createUserWithEmailAndPassword(auth, email, senha);
    const user = res.user;

    // cria o doc na coleção admins
    await setDoc(doc(db, "admins", user.uid), {
      nome: nome,
      email: email
    });

    alert("Conta criada com sucesso! Você já pode fazer login.");
    window.location.href = "login.html";

  } catch (error) {
    console.error(error);
    alert("Erro ao registrar usuário.");
  }
});
