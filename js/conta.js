import { auth, db } from "../firebase/firebase-config.js";
import {
  onAuthStateChanged,
  sendPasswordResetEmail,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const nomeAdmin = document.getElementById("nome-admin");
const emailAdmin = document.getElementById("email-admin");
const fotoAdmin = document.getElementById("foto-admin");
const btnSenha = document.getElementById("btn-trocar-senha");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  emailAdmin.textContent = user.email;

  // Buscar dados no Firestore
  const ref = doc(db, "admins", user.uid);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    const data = snap.data();
    nomeAdmin.textContent = data.nome || "Administrador";

    if (data.fotoUrl) {
      fotoAdmin.src = data.fotoUrl;
    }
  }
});

// Trocar senha
btnSenha.addEventListener("click", async () => {
  try {
    await sendPasswordResetEmail(auth, auth.currentUser.email);
    alert("Enviamos um email para redefinir sua senha!");
  } catch (e) {
    console.error(e);
    alert("Erro ao solicitar troca de senha.");
  }
});

// Logout
window.logout = () => {
  signOut(auth).then(() => {
    window.location.href = "login.html";
  });
};
