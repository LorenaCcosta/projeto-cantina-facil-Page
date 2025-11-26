import { db, auth } from "../firebase/firebase-config.js";
import {
  collection,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const spanTotalProdutos = document.getElementById("total-produtos");
const spanTotalPedidos = document.getElementById("total-pedidos");
const spanPendentes = document.getElementById("pedidos-pendentes");
const spanEmPreparo = document.getElementById("pedidos-em-preparo");
const spanProntos = document.getElementById("pedidos-prontos");
const spanEntregues = document.getElementById("pedidos-entregues");

// Protege a página: se não estiver logado, volta pro login
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
  }
});

// Função global para sair (usada no onclick do menu)
window.logout = () => {
  signOut(auth).then(() => {
    window.location.href = "login.html";
  });
};

// ---- PRODUTOS ----
const colProdutos = collection(db, "produtos");
onSnapshot(colProdutos, (snapshot) => {
  spanTotalProdutos.textContent = snapshot.size;
});

// ---- PEDIDOS ----
const colPedidos = collection(db, "pedidos");
onSnapshot(colPedidos, (snapshot) => {
  let total = snapshot.size;
  let pendentes = 0;
  let emPreparo = 0;
  let prontos = 0;
  let entregues = 0;

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const status = (data.status || "").toLowerCase();

    if (status === "pendente") pendentes++;
    else if (status === "em_preparo") emPreparo++;
    else if (status === "pronto") prontos++;
    else if (status === "entregue") entregues++;
  });

  spanTotalPedidos.textContent = total;
  spanPendentes.textContent = pendentes;
  spanEmPreparo.textContent = emPreparo;
  spanProntos.textContent = prontos;
  spanEntregues.textContent = entregues;
});
