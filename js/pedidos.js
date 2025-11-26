// web/js/pedidos.js
import { db } from "../firebase/firebase-config.js";
import {
  collection,
  doc,
  onSnapshot,
  updateDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const colPedidos = collection(db, "pedidos");
const tbody = document.getElementById("lista-pedidos");

async function buscarNomeUsuario(uid) {
  try {
    const ref = doc(db, "usuarios", uid);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      return snap.data().nome || "Cliente";
    } else {
      return "Cliente";
    }

  } catch (e) {
    console.error("Erro ao buscar usuário:", e);
    return "Cliente";
  }
}


// escuta em tempo real
onSnapshot(colPedidos, (snapshot) => {
  tbody.innerHTML = "";
  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const tr = document.createElement("tr");

    const tdCliente = document.createElement("td");
    // primeiro deixa vazio
    tdCliente.textContent = "...";

    // busca o nome e atualiza quando chegar
    if (data.userId) {
      buscarNomeUsuario(data.userId).then((nome) => {
        tdCliente.textContent = nome;
      });
    } else {
      tdCliente.textContent = "Cliente";
    }


    const tdItens = document.createElement("td");
    if (Array.isArray(data.items || data.itens || data.items)) {
      const itensArr = data.items || data.itens;
      tdItens.textContent = itensArr
        .map((it) => `${it.nome} x${it.quantidade || it.qtd || 1}`)
        .join(", ");
    } else {
      tdItens.textContent = "-";
    }

    const tdTotal = document.createElement("td");
    tdTotal.textContent = Number(data.total || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    const tdMetodo = document.createElement("td");
    tdMetodo.textContent = data.metodoPagamento || data.metodo_pagamento || "-";

    const tdStatus = document.createElement("td");
    tdStatus.textContent = data.status || "-";

    const tdAcoes = document.createElement("td");

    const btnPendente = criarBotaoStatus("Pendente", "pendente", docSnap.id);
    const btnEmPreparo = criarBotaoStatus("Em preparo", "em_preparo", docSnap.id);
    const btnPronto = criarBotaoStatus("Pronto", "pronto", docSnap.id);
    const btnEntregue = criarBotaoStatus("Entregue", "entregue", docSnap.id);

    tdAcoes.appendChild(btnPendente);
    tdAcoes.appendChild(btnEmPreparo);
    tdAcoes.appendChild(btnPronto);
    tdAcoes.appendChild(btnEntregue);

    tr.appendChild(tdCliente);
    tr.appendChild(tdItens);
    tr.appendChild(tdTotal);
    tr.appendChild(tdMetodo);
    tr.appendChild(tdStatus);
    tr.appendChild(tdAcoes);

    tbody.appendChild(tr);
  });
});

function criarBotaoStatus(texto, valorStatus, pedidoId) {
  const btn = document.createElement("button");
  btn.textContent = texto;
  btn.style.margin = "2px";
  btn.onclick = () => atualizarStatus(pedidoId, valorStatus);
  return btn;
}

async function atualizarStatus(id, status) {
  try {
    const ref = doc(db, "pedidos", id);
    await updateDoc(ref, { status });
    alert(`Status atualizado para: ${status}`);
  } catch (error) {
    console.error("Erro ao atualizar status:", error);
    alert("Erro ao atualizar status do pedido.");
  }
}
