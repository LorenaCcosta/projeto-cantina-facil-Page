import { db, storage } from "../firebase/firebase-config.js";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// ... (resto do arquivo igual ao seu)


const colRef = collection(db, "produtos");

const form = document.getElementById("form-produto");
const lista = document.getElementById("lista-produtos");
const inputId = document.getElementById("produto-id");
const inputNome = document.getElementById("nome");
const inputCategoria = document.getElementById("categoria");
const inputPreco = document.getElementById("preco");
const inputDescricao = document.getElementById("descricao");
const inputImagem = document.getElementById("imagem");
const inputDisponivel = document.getElementById("disponivel");
const btnCancelarEdicao = document.getElementById("btn-cancelar-edicao");

// LISTAR EM TEMPO REAL
onSnapshot(colRef, (snapshot) => {
  lista.innerHTML = "";
  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const tr = document.createElement("tr");

    const tdNome = document.createElement("td");
    tdNome.textContent = data.nome || "";
    const tdCategoria = document.createElement("td");
    tdCategoria.textContent = data.categoria || "";
    const tdPreco = document.createElement("td");
    tdPreco.textContent = Number(data.preco || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    const tdDisp = document.createElement("td");
    tdDisp.textContent = data.disponivel ? "Sim" : "Não";

    const tdAcoes = document.createElement("td");
    const btnEditar = document.createElement("button");
    btnEditar.textContent = "Editar";
    btnEditar.onclick = () => preencherFormParaEdicao(docSnap.id, data);

    const btnExcluir = document.createElement("button");
    btnExcluir.textContent = "Excluir";
    btnExcluir.style.marginLeft = "4px";
    btnExcluir.onclick = () => excluirProduto(docSnap.id);

    tdAcoes.appendChild(btnEditar);
    tdAcoes.appendChild(btnExcluir);

    tr.appendChild(tdNome);
    tr.appendChild(tdCategoria);
    tr.appendChild(tdPreco);
    tr.appendChild(tdDisp);
    tr.appendChild(tdAcoes);

    lista.appendChild(tr);
  });
});

// SALVAR (CRIAR OU ATUALIZAR)
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = inputId.value;
  const nome = inputNome.value.trim();
  const categoria = inputCategoria.value.trim();
  const preco = parseFloat(inputPreco.value);
  const descricao = inputDescricao.value.trim();
  const disponivel = inputDisponivel.checked;

  if (!nome || !categoria || isNaN(preco)) {
    alert("Preencha nome, categoria e preço corretamente.");
    return;
  }

  let imagemUrl = null;

  // Se usuário selecionou imagem, faz upload
  if (inputImagem.files[0]) {
    const file = inputImagem.files[0];
    const storageRef = ref(storage, `produtos/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    imagemUrl = await getDownloadURL(storageRef);
  }

  const dados = {
    nome,
    categoria,
    preco,
    descricao,
    disponivel,
  };

  if (imagemUrl) {
    dados.imagemUrl = imagemUrl;
  }

  try {
    if (id) {
      // UPDATE
      const docRef = doc(db, "produtos", id);
      await updateDoc(docRef, dados);
      alert("Produto atualizado com sucesso!");
    } else {
      // CREATE
      await addDoc(colRef, dados);
      alert("Produto cadastrado com sucesso!");
    }
    limparForm();
  } catch (error) {
    console.error("Erro ao salvar produto:", error);
    alert("Erro ao salvar produto.");
  }
});

function preencherFormParaEdicao(id, data) {
  inputId.value = id;
  inputNome.value = data.nome || "";
  inputCategoria.value = data.categoria || "";
  inputPreco.value = data.preco || "";
  inputDescricao.value = data.descricao || "";
  inputDisponivel.checked = !!data.disponivel;

  btnCancelarEdicao.style.display = "inline-block";
}

btnCancelarEdicao.addEventListener("click", () => {
  limparForm();
});

async function excluirProduto(id) {
  if (!confirm("Tem certeza que deseja excluir este produto?")) return;
  try {
    await deleteDoc(doc(db, "produtos", id));
    alert("Produto excluído.");
  } catch (error) {
    console.error("Erro ao excluir:", error);
    alert("Erro ao excluir produto.");
  }
}

function limparForm() {
  inputId.value = "";
  inputNome.value = "";
  inputCategoria.value = "";
  inputPreco.value = "";
  inputDescricao.value = "";
  inputImagem.value = "";
  inputDisponivel.checked = true;
  btnCancelarEdicao.style.display = "none";
}
